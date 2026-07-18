import { describe, expect, it } from "vitest";
import { parseGameCommand } from "@/lib/game/commands";
import { executeCommand } from "@/lib/game/engine";
import { projectGameState } from "@/lib/game/projections";
import { resumeFromCheckpoint, createInitialState } from "@/lib/game/state";
import type { GameState } from "@/lib/game/types";

const now = "2026-07-17T23:00:00.000Z";

function startRun() {
  const initial = createInitialState("session-1", now);
  const entry = executeCommand(
    initial,
    {
      type: "ENTER_PORTAL",
      requestId: "enter-1",
      expectedVersion: 0,
      portalId: "floodplain-memory",
    },
    now,
  );
  if (!entry.accepted) throw new Error("Entry should be accepted.");
  const transform = executeCommand(
    entry.state,
    {
      type: "CONFIRM_TRANSFORMATION",
      requestId: "transform-1",
      expectedVersion: 1,
      portalRunId: entry.state.portalRun!.runId,
    },
    now,
  );
  if (!transform.accepted)
    throw new Error("Transformation should be accepted.");
  return { initial, entry, transform };
}

function completeBodyActions(state: GameState): GameState {
  let current = state;
  for (const actionId of ["move", "forage", "sense_ground"] as const) {
    const result = executeCommand(
      current,
      {
        type: "PERFORM_BODY_ACTION",
        requestId: `body-${actionId}`,
        expectedVersion: current.version,
        portalRunId: current.portalRun!.runId,
        actionId,
      },
      now,
    );
    if (!result.accepted)
      throw new Error(`Expected ${actionId} to be accepted.`);
    current = result.state;
  }
  return current;
}

describe("deterministic portal engine", () => {
  it("runs the golden visitor -> Stegosaurus -> visitor playthrough", () => {
    const { transform } = startRun();
    const bodyLearned = completeBodyActions(transform.state);
    const completed = executeCommand(
      bodyLearned,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "learn-1",
        expectedVersion: 5,
        portalRunId: bodyLearned.portalRun!.runId,
        miniGameId: "learn-the-body",
      },
      now,
    );
    expect(completed.accepted).toBe(true);
    if (!completed.accepted) return;

    const exit = executeCommand(
      completed.state,
      {
        type: "EXIT_PORTAL",
        requestId: "exit-1",
        expectedVersion: 6,
        portalRunId: completed.state.portalRun!.runId,
      },
      now,
    );
    expect(exit).toMatchObject({ accepted: true, idempotent: false });
    if (!exit.accepted) return;
    expect(projectGameState(exit.state)).toEqual({
      worldMode: "museum",
      playerForm: "visitor",
      checkpointId: "museum_return",
      activePortalId: undefined,
      portalRunId: undefined,
      recoveredMemoryFragmentIds: ["body-memory"],
    });
  });

  it("makes a duplicate entry request idempotent", () => {
    const initial = createInitialState("session-1", now);
    const first = executeCommand(
      initial,
      {
        type: "ENTER_PORTAL",
        requestId: "enter-1",
        expectedVersion: 0,
        portalId: "floodplain-memory",
      },
      now,
    );
    if (!first.accepted) throw new Error("Entry should be accepted.");
    const duplicate = executeCommand(
      first.state,
      {
        type: "ENTER_PORTAL",
        requestId: "enter-1",
        expectedVersion: 0,
        portalId: "floodplain-memory",
      },
      now,
    );
    expect(duplicate).toMatchObject({ accepted: true, idempotent: true });
    if (duplicate.accepted) {
      expect(duplicate.state.version).toBe(1);
      expect(duplicate.events).toEqual([
        { type: "PORTAL_OPENED", portalId: "floodplain-memory" },
      ]);
    }
  });

  it("rejects stale writes and invalid state transitions without mutation", () => {
    const initial = createInitialState("session-1", now);
    const stale = executeCommand(
      initial,
      {
        type: "ENTER_PORTAL",
        requestId: "stale",
        expectedVersion: 9,
        portalId: "floodplain-memory",
      },
      now,
    );
    expect(stale).toMatchObject({
      accepted: false,
      rejection: "STALE_VERSION",
      state: initial,
    });

    const badExit = executeCommand(
      initial,
      {
        type: "EXIT_PORTAL",
        requestId: "exit",
        expectedVersion: 0,
        portalRunId: "missing",
      },
      now,
    );
    expect(badExit).toMatchObject({
      accepted: false,
      rejection: "INVALID_WORLD",
      state: initial,
    });

    const { transform } = startRun();
    const badRun = executeCommand(
      transform.state,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "bad-run",
        expectedVersion: 2,
        portalRunId: "not-the-run",
        miniGameId: "learn-the-body",
      },
      now,
    );
    expect(badRun).toMatchObject({
      accepted: false,
      rejection: "UNKNOWN_PORTAL_RUN",
    });
  });

  it("awards the mini-game fragment exactly once", () => {
    const { transform } = startRun();
    const bodyLearned = completeBodyActions(transform.state);
    const completed = executeCommand(
      bodyLearned,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "learn-1",
        expectedVersion: 5,
        portalRunId: bodyLearned.portalRun!.runId,
        miniGameId: "learn-the-body",
      },
      now,
    );
    if (!completed.accepted) throw new Error("Completion should be accepted.");

    const duplicate = executeCommand(
      completed.state,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "learn-1",
        expectedVersion: 5,
        portalRunId: bodyLearned.portalRun!.runId,
        miniGameId: "learn-the-body",
      },
      now,
    );
    expect(duplicate).toMatchObject({ accepted: true, idempotent: true });
    if (duplicate.accepted)
      expect(duplicate.state.recoveredMemoryFragmentIds).toEqual([
        "body-memory",
      ]);

    const retry = executeCommand(
      completed.state,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "learn-2",
        expectedVersion: 6,
        portalRunId: bodyLearned.portalRun!.runId,
        miniGameId: "learn-the-body",
      },
      now,
    );
    expect(retry).toMatchObject({
      accepted: false,
      rejection: "MINIGAME_ALREADY_COMPLETED",
    });
  });

  it("resumes from the semantic checkpoint after an interrupted entry transition", () => {
    const initial = createInitialState("session-1", now);
    const entry = executeCommand(
      initial,
      {
        type: "ENTER_PORTAL",
        requestId: "enter-1",
        expectedVersion: 0,
        portalId: "floodplain-memory",
      },
      now,
    );
    if (!entry.accepted) throw new Error("Entry should be accepted.");

    const recovered = executeCommand(
      resumeFromCheckpoint(entry.state),
      {
        type: "INTERRUPT_TRANSITION",
        requestId: "recover-1",
        expectedVersion: 1,
      },
      now,
    );
    expect(recovered).toMatchObject({
      accepted: true,
      state: {
        worldMode: "portal",
        playerForm: "young_stegosaurus",
        checkpointId: "fern_edge_ready",
      },
    });
  });

  it("does not award the fragment before all three body actions are confirmed", () => {
    const { transform } = startRun();
    const earlyCompletion = executeCommand(
      transform.state,
      {
        type: "COMPLETE_MINIGAME",
        requestId: "too-early",
        expectedVersion: 2,
        portalRunId: transform.state.portalRun!.runId,
        miniGameId: "learn-the-body",
      },
      now,
    );
    expect(earlyCompletion).toMatchObject({
      accepted: false,
      rejection: "MINIGAME_INCOMPLETE",
    });
  });

  it("rejects malformed commands at the domain boundary", () => {
    expect(() =>
      parseGameCommand({
        type: "ENTER_PORTAL",
        requestId: "",
        expectedVersion: 0,
        portalId: "floodplain-memory",
      }),
    ).toThrow();
    expect(() =>
      parseGameCommand({
        type: "ENTER_PORTAL",
        requestId: "valid",
        expectedVersion: 0,
        portalId: "other-portal",
      }),
    ).toThrow();
  });
});

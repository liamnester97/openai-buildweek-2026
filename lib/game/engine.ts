import type {
  CommandResult,
  GameCommand,
  GameEvent,
  GameState,
  RejectionCode,
  StoredRequest,
} from "./types";

function rejection(state: GameState, code: RejectionCode): CommandResult {
  return { accepted: false, state, rejection: code };
}

function record(
  state: GameState,
  command: GameCommand,
  events: GameEvent[],
  now: string,
): CommandResult {
  const stored: StoredRequest = {
    accepted: true,
    events: structuredClone(events),
  };
  const nextState: GameState = {
    ...state,
    version: state.version + 1,
    updatedAt: now,
    processedRequests: {
      ...state.processedRequests,
      [command.requestId]: stored,
    },
  };

  return { accepted: true, idempotent: false, state: nextState, events };
}

function replay(state: GameState, command: GameCommand): CommandResult {
  const stored = state.processedRequests[command.requestId];
  if (!stored || !stored.accepted) {
    throw new Error("Only accepted requests can be replayed.");
  }

  return {
    accepted: true,
    idempotent: true,
    state,
    events: structuredClone(stored.events),
  };
}

function validRun(state: GameState, runId: string) {
  return state.portalRun?.runId === runId;
}

export function executeCommand(
  state: GameState,
  command: GameCommand,
  now: string,
): CommandResult {
  if (state.processedRequests[command.requestId]?.accepted) {
    return replay(state, command);
  }

  if (command.expectedVersion !== state.version) {
    return rejection(state, "STALE_VERSION");
  }

  switch (command.type) {
    case "ENTER_PORTAL": {
      if (state.worldMode !== "museum")
        return rejection(state, "INVALID_WORLD");
      if (state.playerForm !== "visitor")
        return rejection(state, "INVALID_FORM");

      const runId = `${state.sessionId}:floodplain-memory:${state.version + 1}`;
      const result = record(
        state,
        command,
        [{ type: "PORTAL_OPENED", portalId: command.portalId }],
        now,
      );
      if (!result.accepted) return result;

      return {
        ...result,
        state: {
          ...result.state,
          worldMode: "transitioning_in",
          activePortalId: command.portalId,
          portalRun: {
            runId,
            zoneId: "fern_edge",
            checkpointId: "portal_entry",
            completedMiniGameIds: [],
            completedBodyActionIds: [],
            returnAvailable: false,
          },
          checkpointId: "portal_entry",
        },
      };
    }
    case "CONFIRM_TRANSFORMATION": {
      if (state.worldMode !== "transitioning_in")
        return rejection(state, "INVALID_WORLD");
      if (state.playerForm !== "visitor")
        return rejection(state, "INVALID_FORM");
      if (!validRun(state, command.portalRunId))
        return rejection(state, "UNKNOWN_PORTAL_RUN");

      const result = record(
        state,
        command,
        [
          {
            type: "PLAYER_FORM_CHANGED",
            from: "visitor",
            to: "young_stegosaurus",
          },
          { type: "PORTAL_ZONE_ENTERED", zoneId: "fern_edge" },
        ],
        now,
      );
      if (!result.accepted || !result.state.portalRun) return result;

      return {
        ...result,
        state: {
          ...result.state,
          worldMode: "portal",
          playerForm: "young_stegosaurus",
          checkpointId: "fern_edge_ready",
          portalRun: {
            ...result.state.portalRun,
            checkpointId: "fern_edge_ready",
          },
        },
      };
    }
    case "PERFORM_BODY_ACTION": {
      if (state.worldMode !== "portal")
        return rejection(state, "INVALID_WORLD");
      if (state.playerForm !== "young_stegosaurus")
        return rejection(state, "INVALID_FORM");
      if (!validRun(state, command.portalRunId))
        return rejection(state, "UNKNOWN_PORTAL_RUN");
      if (state.portalRun?.completedBodyActionIds.includes(command.actionId)) {
        return rejection(state, "BODY_ACTION_ALREADY_CONFIRMED");
      }

      const result = record(
        state,
        command,
        [{ type: "BODY_ACTION_CONFIRMED", actionId: command.actionId }],
        now,
      );
      if (!result.accepted || !result.state.portalRun) return result;

      return {
        ...result,
        state: {
          ...result.state,
          portalRun: {
            ...result.state.portalRun,
            completedBodyActionIds: [
              ...result.state.portalRun.completedBodyActionIds,
              command.actionId,
            ],
          },
        },
      };
    }
    case "COMPLETE_MINIGAME": {
      if (state.worldMode !== "portal")
        return rejection(state, "INVALID_WORLD");
      if (state.playerForm !== "young_stegosaurus")
        return rejection(state, "INVALID_FORM");
      if (!validRun(state, command.portalRunId))
        return rejection(state, "UNKNOWN_PORTAL_RUN");
      if (state.portalRun?.completedMiniGameIds.includes(command.miniGameId)) {
        return rejection(state, "MINIGAME_ALREADY_COMPLETED");
      }
      if (state.portalRun?.completedBodyActionIds.length !== 3) {
        return rejection(state, "MINIGAME_INCOMPLETE");
      }

      const result = record(
        state,
        command,
        [
          { type: "MINIGAME_COMPLETED", miniGameId: command.miniGameId },
          { type: "MEMORY_FRAGMENT_RECOVERED", fragmentId: "body-memory" },
        ],
        now,
      );
      if (!result.accepted || !result.state.portalRun) return result;

      return {
        ...result,
        state: {
          ...result.state,
          checkpointId: "body_learned",
          recoveredMemoryFragmentIds: [
            ...result.state.recoveredMemoryFragmentIds,
            "body-memory",
          ],
          portalRun: {
            ...result.state.portalRun,
            checkpointId: "body_learned",
            completedMiniGameIds: [
              ...result.state.portalRun.completedMiniGameIds,
              command.miniGameId,
            ],
            returnAvailable: true,
          },
        },
      };
    }
    case "EXIT_PORTAL": {
      if (state.worldMode !== "portal")
        return rejection(state, "INVALID_WORLD");
      if (state.playerForm !== "young_stegosaurus")
        return rejection(state, "INVALID_FORM");
      if (!validRun(state, command.portalRunId))
        return rejection(state, "UNKNOWN_PORTAL_RUN");
      if (!state.portalRun?.returnAvailable)
        return rejection(state, "RETURN_NOT_AVAILABLE");

      const result = record(
        state,
        command,
        [
          {
            type: "PLAYER_FORM_CHANGED",
            from: "young_stegosaurus",
            to: "visitor",
          },
          { type: "PORTAL_EXITED", portalId: "floodplain-memory" },
        ],
        now,
      );
      if (!result.accepted) return result;

      return {
        ...result,
        state: {
          ...result.state,
          worldMode: "museum",
          playerForm: "visitor",
          activePortalId: undefined,
          portalRun: undefined,
          checkpointId: "museum_return",
        },
      };
    }
    case "INTERRUPT_TRANSITION": {
      if (
        state.worldMode !== "transitioning_in" &&
        state.worldMode !== "transitioning_out"
      ) {
        return rejection(state, "INVALID_WORLD");
      }

      const checkpointId =
        state.worldMode === "transitioning_in"
          ? "fern_edge_ready"
          : (state.portalRun?.checkpointId ?? "museum_ready");
      const result = record(
        state,
        command,
        [{ type: "TRANSITION_RECOVERED", checkpointId }],
        now,
      );
      if (!result.accepted) return result;

      if (state.worldMode === "transitioning_in" && result.state.portalRun) {
        return {
          ...result,
          state: {
            ...result.state,
            worldMode: "portal",
            playerForm: "young_stegosaurus",
            checkpointId,
            portalRun: { ...result.state.portalRun, checkpointId },
          },
        };
      }

      return {
        ...result,
        state: {
          ...result.state,
          worldMode: "museum",
          playerForm: "visitor",
          activePortalId: undefined,
          portalRun: undefined,
          checkpointId: "museum_return",
        },
      };
    }
  }
}

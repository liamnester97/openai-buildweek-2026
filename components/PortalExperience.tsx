"use client";

import { useRef, useState } from "react";
import { HabitatCanvas } from "@/components/portal/HabitatCanvas";
import { executeCommand } from "@/lib/game/engine";
import { createInitialState } from "@/lib/game/state";
import type { BodyActionId, GameCommand, GameState } from "@/lib/game/types";

type CommandInput<T> = T extends unknown
  ? Omit<T, "requestId" | "expectedVersion">
  : never;

const bodyActions: Array<{ id: BodyActionId; label: string; detail: string }> =
  [
    {
      id: "move",
      label: "Move",
      detail: "Find a steady route through the ferns.",
    },
    {
      id: "forage",
      label: "Forage",
      detail: "Choose a low, safe patch of green.",
    },
    {
      id: "sense_ground",
      label: "Sense ground",
      detail: "Feel distant movement through your feet.",
    },
  ];

function now() {
  return new Date().toISOString();
}

export function PortalExperience() {
  const [state, setState] = useState<GameState>(() =>
    createInitialState("local-demo", now()),
  );
  const [announcement, setAnnouncement] = useState(
    "The exhibit is ready to inspect.",
  );
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simplifiedControls, setSimplifiedControls] = useState(false);
  const requestSequence = useRef(0);
  const stateRef = useRef(state);

  function dispatch(command: CommandInput<GameCommand>) {
    requestSequence.current += 1;
    const currentState = stateRef.current;
    const result = executeCommand(
      currentState,
      {
        ...command,
        requestId: `local-${requestSequence.current}`,
        expectedVersion: currentState.version,
      } as GameCommand,
      now(),
    );
    if (!result.accepted) {
      setAnnouncement(
        `That action is not available yet: ${result.rejection.replaceAll("_", " ").toLowerCase()}.`,
      );
      return;
    }
    stateRef.current = result.state;
    setState(result.state);
    setAnnouncement(
      result.events
        .map((event) => event.type.replaceAll("_", " ").toLowerCase())
        .join(". ") || "Action confirmed.",
    );
  }

  const run = state.portalRun;
  const inPortal = state.worldMode === "portal" && run;

  return (
    <section className="play-surface" aria-labelledby="play-title">
      <div className="play-topline">
        <div>
          <p className="eyebrow">Playable vertical slice</p>
          <h2 id="play-title">The Floodplain Memory</h2>
        </div>
        <div className="settings" aria-label="Experience settings">
          <label>
            <input
              checked={reducedMotion}
              onChange={(event) => setReducedMotion(event.target.checked)}
              type="checkbox"
            />{" "}
            Reduced motion
          </label>
          <label>
            <input
              checked={simplifiedControls}
              onChange={(event) => setSimplifiedControls(event.target.checked)}
              type="checkbox"
            />{" "}
            Simplified controls
          </label>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {state.worldMode === "museum" &&
      !state.recoveredMemoryFragmentIds.length ? (
        <div className="museum-hub">
          <div className="museum-copy">
            <p className="eyebrow">Gallery 03 · after midnight</p>
            <h3>A display with a missing cause</h3>
            <p>
              The label tells a convenient story: predator meets prey. The
              reconstructed floodplain is waiting to show what the label cannot
              prove.
            </p>
            <button
              className="primary-action"
              onClick={() =>
                dispatch({
                  type: "ENTER_PORTAL",
                  portalId: "floodplain-memory",
                })
              }
            >
              Enter the exhibit <span aria-hidden="true">→</span>
            </button>
          </div>
          <div
            className="portal-plaque"
            aria-label="Floodplain Memory portal exhibit"
          >
            <span>Exhibit 01</span>
            <strong>
              Floodplain
              <br />
              Memory
            </strong>
            <small>Touch to enter</small>
          </div>
        </div>
      ) : null}

      {state.worldMode === "transitioning_in" && run ? (
        <div className={`transition-panel ${reducedMotion ? "reduced" : ""}`}>
          <p className="eyebrow">Threshold crossed</p>
          <h3>
            {reducedMotion
              ? "The gallery fades. Your perspective changes."
              : "The gallery dissolves into heat, fern scent, and heavy ground."}
          </h3>
          <button
            className="primary-action"
            onClick={() =>
              dispatch({
                type: "CONFIRM_TRANSFORMATION",
                portalRunId: run.runId,
              })
            }
          >
            Awaken as a young Stegosaurus
          </button>
        </div>
      ) : null}

      {inPortal ? (
        <div className="portal-play">
          <div className="portal-visual">
            <HabitatCanvas reducedMotion={reducedMotion} />
          </div>
          <aside
            className="habitat-hud"
            aria-label="Habitat controls and objective"
          >
            <p className="eyebrow">Objective</p>
            <h3>Learn the body</h3>
            <p>
              Complete each sensory action. The canvas is a view of the habitat;
              these controls verify progress.
            </p>
            <div
              className={`action-controls ${simplifiedControls ? "simplified" : ""}`}
            >
              {bodyActions.map((action) => {
                const complete = run.completedBodyActionIds.includes(action.id);
                return (
                  <button
                    key={action.id}
                    className={complete ? "completed" : ""}
                    disabled={complete || paused}
                    onClick={() =>
                      dispatch({
                        type: "PERFORM_BODY_ACTION",
                        portalRunId: run.runId,
                        actionId: action.id,
                      })
                    }
                  >
                    <span>{complete ? "Done" : action.label}</span>
                    <small>{action.detail}</small>
                  </button>
                );
              })}
            </div>
            <div className="hud-actions">
              <button
                disabled={paused || run.completedBodyActionIds.length !== 3}
                onClick={() =>
                  dispatch({
                    type: "COMPLETE_MINIGAME",
                    portalRunId: run.runId,
                    miniGameId: "learn-the-body",
                  })
                }
              >
                Record body memory
              </button>
              <button
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                disabled={!run.returnAvailable}
                onClick={() =>
                  dispatch({ type: "EXIT_PORTAL", portalRunId: run.runId })
                }
              >
                Return to museum
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      {state.worldMode === "museum" &&
      state.recoveredMemoryFragmentIds.length ? (
        <div className="notebook-panel">
          <div>
            <p className="eyebrow">Notebook updated</p>
            <h3>You carried back a body memory.</h3>
            <p>
              Movement, feeding, and ground sensation are now recorded as portal
              evidence. Later chapters will compare this lived observation with
              museum clues.
            </p>
          </div>
          <button
            className="primary-action"
            onClick={() => {
              const reset = createInitialState("local-demo", now());
              stateRef.current = reset;
              setState(reset);
              setAnnouncement("The exhibit has reset for another playthrough.");
            }}
          >
            Replay the memory
          </button>
        </div>
      ) : null}
    </section>
  );
}

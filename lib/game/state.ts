import type { GameState } from "./types";

export function createInitialState(sessionId: string, now: string): GameState {
  return {
    sessionId,
    version: 0,
    worldMode: "museum",
    playerForm: "visitor",
    recoveredMemoryFragmentIds: [],
    processedRequests: {},
    checkpointId: "museum_ready",
    createdAt: now,
    updatedAt: now,
  };
}

export function resumeFromCheckpoint(state: GameState): GameState {
  return structuredClone(state);
}

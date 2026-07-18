import type { GameState } from "./types";

export type GameProjection = {
  worldMode: GameState["worldMode"];
  playerForm: GameState["playerForm"];
  checkpointId: GameState["checkpointId"];
  activePortalId?: GameState["activePortalId"];
  portalRunId?: string;
  recoveredMemoryFragmentIds: string[];
};

export function projectGameState(state: GameState): GameProjection {
  return {
    worldMode: state.worldMode,
    playerForm: state.playerForm,
    checkpointId: state.checkpointId,
    activePortalId: state.activePortalId,
    portalRunId: state.portalRun?.runId,
    recoveredMemoryFragmentIds: [...state.recoveredMemoryFragmentIds],
  };
}

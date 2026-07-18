export type WorldMode =
  "museum" | "transitioning_in" | "portal" | "transitioning_out";
export type PlayerForm = "visitor" | "young_stegosaurus";
export type PortalZoneId = "museum_gallery" | "fern_edge";
export type CheckpointId =
  | "museum_ready"
  | "portal_entry"
  | "fern_edge_ready"
  | "body_learned"
  | "museum_return";

export type BodyActionId = "move" | "forage" | "sense_ground";

export type PortalRun = {
  runId: string;
  zoneId: "fern_edge";
  checkpointId: CheckpointId;
  completedMiniGameIds: string[];
  completedBodyActionIds: BodyActionId[];
  returnAvailable: boolean;
};

export type StoredRequest = {
  accepted: boolean;
  events: GameEvent[];
  rejection?: RejectionCode;
};

export type GameState = {
  sessionId: string;
  version: number;
  worldMode: WorldMode;
  playerForm: PlayerForm;
  activePortalId?: "floodplain-memory";
  portalRun?: PortalRun;
  recoveredMemoryFragmentIds: string[];
  processedRequests: Record<string, StoredRequest>;
  checkpointId: CheckpointId;
  createdAt: string;
  updatedAt: string;
};

export type GameCommand =
  | {
      type: "ENTER_PORTAL";
      requestId: string;
      expectedVersion: number;
      portalId: "floodplain-memory";
    }
  | {
      type: "CONFIRM_TRANSFORMATION";
      requestId: string;
      expectedVersion: number;
      portalRunId: string;
    }
  | {
      type: "PERFORM_BODY_ACTION";
      requestId: string;
      expectedVersion: number;
      portalRunId: string;
      actionId: BodyActionId;
    }
  | {
      type: "COMPLETE_MINIGAME";
      requestId: string;
      expectedVersion: number;
      portalRunId: string;
      miniGameId: "learn-the-body";
    }
  | {
      type: "EXIT_PORTAL";
      requestId: string;
      expectedVersion: number;
      portalRunId: string;
    }
  | {
      type: "INTERRUPT_TRANSITION";
      requestId: string;
      expectedVersion: number;
    };

export type GameEvent =
  | { type: "PORTAL_OPENED"; portalId: "floodplain-memory" }
  | { type: "PLAYER_FORM_CHANGED"; from: PlayerForm; to: PlayerForm }
  | { type: "PORTAL_ZONE_ENTERED"; zoneId: "fern_edge" }
  | { type: "BODY_ACTION_CONFIRMED"; actionId: BodyActionId }
  | { type: "MINIGAME_COMPLETED"; miniGameId: "learn-the-body" }
  | { type: "MEMORY_FRAGMENT_RECOVERED"; fragmentId: "body-memory" }
  | { type: "PORTAL_EXITED"; portalId: "floodplain-memory" }
  | { type: "TRANSITION_RECOVERED"; checkpointId: CheckpointId };

export type RejectionCode =
  | "STALE_VERSION"
  | "INVALID_WORLD"
  | "INVALID_FORM"
  | "UNKNOWN_PORTAL_RUN"
  | "MINIGAME_ALREADY_COMPLETED"
  | "BODY_ACTION_ALREADY_CONFIRMED"
  | "MINIGAME_INCOMPLETE"
  | "RETURN_NOT_AVAILABLE";

export type CommandResult =
  | {
      accepted: true;
      idempotent: boolean;
      state: GameState;
      events: GameEvent[];
    }
  | { accepted: false; state: GameState; rejection: RejectionCode };

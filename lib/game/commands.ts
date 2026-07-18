import { z } from "zod";
import type { GameCommand } from "./types";

const commandBase = z.object({
  requestId: z.string().min(1),
  expectedVersion: z.number().int().nonnegative(),
});

export const gameCommandSchema = z.discriminatedUnion("type", [
  commandBase.extend({
    type: z.literal("ENTER_PORTAL"),
    portalId: z.literal("floodplain-memory"),
  }),
  commandBase.extend({
    type: z.literal("CONFIRM_TRANSFORMATION"),
    portalRunId: z.string().min(1),
  }),
  commandBase.extend({
    type: z.literal("PERFORM_BODY_ACTION"),
    portalRunId: z.string().min(1),
    actionId: z.enum(["move", "forage", "sense_ground"]),
  }),
  commandBase.extend({
    type: z.literal("COMPLETE_MINIGAME"),
    portalRunId: z.string().min(1),
    miniGameId: z.literal("learn-the-body"),
  }),
  commandBase.extend({
    type: z.literal("EXIT_PORTAL"),
    portalRunId: z.string().min(1),
  }),
  commandBase.extend({ type: z.literal("INTERRUPT_TRANSITION") }),
]);

export function parseGameCommand(input: unknown): GameCommand {
  return gameCommandSchema.parse(input);
}

import { z } from "zod";
import mvpContentData from "./mvp.json";

export const mvpContentSchema = z.object({
  portal: z.literal("floodplain-memory"),
  playableForm: z.literal("young-stegosaurus"),
  fictionalEvent: z.literal(true),
  evidence: z.tuple([
    z.literal("smaller-prey-trail"),
    z.literal("protected-area-observation"),
    z.literal("rising-water"),
    z.literal("converging-routes"),
  ]),
});

export const mvpContent = mvpContentSchema.parse(mvpContentData);

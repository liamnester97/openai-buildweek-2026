import { describe, expect, it } from "vitest";
import { mvpContent, mvpContentSchema } from "@/content/mvp";

describe("MVP content", () => {
  it("keeps the Stage 0 product freeze intact", () => {
    expect(mvpContentSchema.parse(mvpContent)).toEqual(mvpContent);
  });
});

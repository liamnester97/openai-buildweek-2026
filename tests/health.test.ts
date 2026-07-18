import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("health endpoint", () => {
  it("reports the application as healthy", async () => {
    await expect(GET().json()).resolves.toEqual({
      ok: true,
      service: "ai-night-at-the-museum",
    });
  });
});

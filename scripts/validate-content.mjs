import { readFile } from "node:fs/promises";

const contentPath = new URL("../content/mvp.json", import.meta.url);
const content = JSON.parse(await readFile(contentPath, "utf8"));
const expectedEvidence = [
  "smaller-prey-trail",
  "protected-area-observation",
  "rising-water",
  "converging-routes",
];

if (
  content.portal !== "floodplain-memory" ||
  content.playableForm !== "young-stegosaurus" ||
  content.fictionalEvent !== true ||
  JSON.stringify(content.evidence) !== JSON.stringify(expectedEvidence)
) {
  throw new Error(
    "MVP content must retain the approved portal, form, fictional framing, and four evidence concepts.",
  );
}

console.log(
  "Content validation passed: one fictional portal, one form, four evidence concepts.",
);

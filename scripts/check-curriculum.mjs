import { readFileSync, writeFileSync } from "node:fs";
import { lessons, production } from "./lesson-registry.mjs";
const curriculum = JSON.parse(
  readFileSync("src/data/curriculum/curriculum.json"),
);
const registry = JSON.parse(
  readFileSync("src/data/curriculum/module_registry.json"),
);
const all = lessons();
for (const meta of all) {
  const module = registry.modules.find((item) => item.key === meta.module);
  if (
    !module ||
    !new RegExp(module.slugPattern).test(meta.lessonId) ||
    !curriculum.chapters.some((chapter) =>
      chapter.lessons.some((lesson) => lesson.slug === meta.lessonId),
    )
  )
    throw new Error(
      `Lesson ${meta.lessonId} does not match the curriculum registry`,
    );
}
writeFileSync(
  "src/data/web-lessons.json",
  JSON.stringify(
    all.filter((lesson) => !production || lesson.webStatus === "published"),
    null,
    2,
  ) + "\n",
);

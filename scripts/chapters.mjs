import { readFileSync } from "node:fs";
import { lessons } from "./lesson-registry.mjs";
// Every curriculum chapter that has at least one web lesson, with its module,
// its course-page route and whether that page is public (some lesson published).
export function chapterRoutes() {
  const curriculum = JSON.parse(
    readFileSync("src/data/curriculum/curriculum.json", "utf8"),
  );
  const chapterOf = new Map();
  for (const chapter of curriculum.chapters)
    for (const lesson of chapter.lessons) chapterOf.set(lesson.slug, chapter);
  const found = new Map();
  for (const meta of lessons()) {
    const chapter = chapterOf.get(meta.lessonId);
    if (!chapter) continue;
    const entry = found.get(chapter.id) ?? {
      id: chapter.id,
      module: meta.module,
      published: false,
    };
    // One course page per chapter needs one module. Fail loudly rather than
    // silently showing only one module's lessons.
    if (entry.module !== meta.module)
      throw new Error(
        `Chapter ${chapter.id} has lessons in more than one module ` +
          `(${entry.module}, ${meta.module}). Split it before adding a course page.`,
      );
    entry.published ||= meta.webStatus === "published";
    found.set(chapter.id, entry);
  }
  return [...found.values()].map((entry) => ({
    ...entry,
    path: `app/course/chapter-${String(entry.id).toLowerCase()}/page.tsx`,
    url: `/course/chapter-${String(entry.id).toLowerCase()}`,
  }));
}

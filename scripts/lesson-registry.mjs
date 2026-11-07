import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
export function lessons() {
  const root = "src/lessons";
  const result = [];
  for (const module of readdirSync(root, { withFileTypes: true }).filter((x) =>
    x.isDirectory(),
  )) {
    for (const folder of readdirSync(join(root, module.name), {
      withFileTypes: true,
    }).filter((x) => x.isDirectory())) {
      const path = join(root, module.name, folder.name);
      const meta = JSON.parse(readFileSync(join(path, "meta.json"), "utf8"));
      if (
        meta.module !== module.name ||
        meta.lessonId !== folder.name ||
        !["draft", "published"].includes(meta.webStatus)
      )
        throw new Error(`Invalid metadata in ${path}`);
      if (
        !Array.isArray(meta.sections) ||
        meta.sections.length === 0 ||
        new Set(meta.sections.map((section) => section.id)).size !==
          meta.sections.length ||
        meta.sections.some((section) => !section.id || !section.title)
      )
        throw new Error(`Invalid sections in ${path}`);
      result.push(meta);
    }
  }
  return result.sort((a, b) =>
    `${a.module}/${a.lessonId}`.localeCompare(`${b.module}/${b.lessonId}`),
  );
}
export const production =
  process.env.VERCEL_ENV === "production" ||
  process.env.APP_ENV === "production";

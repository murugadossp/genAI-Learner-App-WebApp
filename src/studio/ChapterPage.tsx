import ChapterCourse, { type ChapterCopy } from "./ChapterCourse";
import curriculum from "../data/curriculum/curriculum.json";
import webLessons from "../data/web-lessons.json";
import { chapterCopy } from "./chapterCopy";

const moduleLabels: Record<string, string> = {
  "genai-basics": "GenAI Basics",
  "python-for-ai": "Python for AI",
};
const moduleLabel = (key: string) =>
  moduleLabels[key] ??
  key
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

// One course page for any chapter. Copy comes from chapterCopy.ts when a
// chapter has hand-written text, otherwise from the curriculum itself.
export default function ChapterPage({
  chapterId,
  module,
}: {
  chapterId: number | string;
  module: string;
}) {
  const chapter: {
    title: string;
    purpose?: string;
    lessons: { slug: string; title: string; learner_summary?: string }[];
  } = curriculum.chapters.find((item) => item.id === chapterId)!;
  const available = chapter.lessons.filter((lesson) =>
    webLessons.some(
      (item) => item.module === module && item.lessonId === lesson.slug,
    ),
  );
  // The start link must go to a published lesson, even when drafts are listed
  // in non-production builds.
  const firstPublished = available.find((lesson) =>
    webLessons.some(
      (item) =>
        item.module === module &&
        item.lessonId === lesson.slug &&
        item.webStatus === "published",
    ),
  );
  const override = chapterCopy[String(chapterId)] ?? {};
  const copy: ChapterCopy = {
    chapterId,
    module,
    icon: override.icon,
    eyebrow: `${moduleLabel(module)} / Chapter ${chapterId}`,
    subtitle: override.subtitle ?? chapter.purpose ?? chapter.title,
    callout: override.callout ?? chapter.purpose ?? chapter.title,
    asideTitle: override.asideTitle ?? chapter.title,
    outcomes:
      override.outcomes ??
      available
        .slice(0, 4)
        .map((lesson) => lesson.learner_summary ?? lesson.title),
    startHref: firstPublished ? `/learn/${module}/${firstPublished.slug}` : "/",
  };
  return <ChapterCourse copy={copy} />;
}

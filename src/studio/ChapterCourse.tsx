import Link from "next/link";
import webLessons from "../data/web-lessons.json";
import Shell from "./Shell";
import curriculum from "../data/curriculum/curriculum.json";
const availableLessons: { module: string; lessonId: string }[] = webLessons;
export type ChapterCopy = {
  chapterId: number;
  eyebrow: string;
  subtitle: string;
  callout: string;
  asideTitle: string;
  outcomes: string[];
  startHref: string;
};
export default function ChapterCourse({ copy }: { copy: ChapterCopy }) {
  const chapter = curriculum.chapters.find(
    (chapter) => chapter.id === copy.chapterId,
  )!;
  return (
    <Shell>
      <div className="container">
        <div className="page-heading">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h1>{chapter.title}</h1>
          <p className="muted">{copy.subtitle}</p>
        </div>
        <div className="course-layout">
          <div>
            <div className="callout">{copy.callout}</div>
            <div className="section-head course-section-head">
              <h2 className="course-section-title">Your learning path</h2>
              <span className="micro">Chapter preview</span>
            </div>
            <details className="chapter" open>
              <summary>{`${String(copy.chapterId).padStart(2, "0")} \u00a0 ${chapter.title}`}</summary>
              {chapter.lessons.map((lesson) =>
                availableLessons.some(
                  (item) =>
                    item.module === "genai-basics" &&
                    item.lessonId === lesson.slug,
                ) ? (
                  <Link
                    className="lesson-row selected"
                    href={`/learn/genai-basics/${lesson.slug}`}
                    key={lesson.slug}
                  >
                    <span>◉</span>
                    <span>{lesson.title}</span>
                    <span className="duration">Open lesson →</span>
                  </Link>
                ) : (
                  <div className="lesson-row" key={lesson.slug}>
                    <span>○</span>
                    <span>{lesson.title}</span>
                    <span className="duration">Not yet available on web</span>
                  </div>
                ),
              )}
            </details>
            <p className="micro">
              Chapter and lesson titles come from the shared curriculum. Web
              lessons are authored independently of mobile.
            </p>
          </div>
          <aside className="card aside-card">
            <span className="course-icon" aria-hidden="true">
              ▥
            </span>
            <h3 className="aside-title">{copy.asideTitle}</h3>
            <p>By the end, you should be able to:</p>
            <ul>
              {copy.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
            <Link className="button" href={copy.startHref}>
              Start lesson →
            </Link>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

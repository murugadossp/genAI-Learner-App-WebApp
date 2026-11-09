import Link from "next/link";
import webLessons from "../data/web-lessons.json";
import Shell from "./Shell";
import curriculum from "../data/curriculum/curriculum.json";
const availableLessons: { module: string; lessonId: string }[] = webLessons;
export default async function Course({
  searchParams,
}: {
  searchParams?: Promise<{ chapter?: string }> | { chapter?: string };
} = {}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const isP1 =
    resolvedParams?.chapter === "P1" ||
    resolvedParams?.chapter === "python-for-ai";
  const chapter = curriculum.chapters.find((chapter) =>
    isP1 ? chapter.id === "P1" : chapter.id === 2,
  )!;
  const moduleKey = isP1 ? "python-for-ai" : "genai-basics";

  return (
    <Shell>
      <div className="container">
        <div className="page-heading">
          <div className="eyebrow">
            {isP1 ? "Python for AI / Chapter P1" : "GenAI Basics / Chapter 2"}
          </div>
          <h1>{chapter.title}</h1>
          <p className="muted">
            {isP1
              ? "From primitive types to working with data and AI APIs."
              : "From a sequence of tokens to a system you can reason about."}
          </p>
        </div>
        <div className="course-layout">
          <div>
            <div className="callout">
              {isP1
                ? "Code is how ideas become systems. This chapter builds the practical Python foundations needed to configure models, process data, and parse AI responses."
                : "Learn the mechanism, then explore its limits. This chapter connects visual intuition to the decisions you make as an engineer."}
            </div>
            <div className="section-head course-section-head">
              <h2 className="course-section-title">Your learning path</h2>
              <span className="micro">Chapter preview</span>
            </div>
            <details className="chapter" open>
              <summary>
                {isP1 ? "P1" : "02"} &nbsp; {chapter.title}
              </summary>
              {chapter.lessons.map((lesson) =>
                availableLessons.some(
                  (item) =>
                    item.module === moduleKey && item.lessonId === lesson.slug,
                ) ? (
                  <Link
                    className="lesson-row selected"
                    href={`/learn/${moduleKey}/${lesson.slug}`}
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
              {isP1 ? "{ }" : "▥"}
            </span>
            <h3 className="aside-title">
              {isP1
                ? "Practical foundations for AI"
                : "A peek inside the model"}
            </h3>
            <p>By the end, you should be able to:</p>
            {isP1 ? (
              <ul>
                <li>Store, inspect, and convert core Python data types.</li>
                <li>Format prompts and model parameters safely.</li>
                <li>Catch parsing errors when handling structured outputs.</li>
              </ul>
            ) : (
              <ul>
                <li>Explain how text becomes tokens and token IDs.</li>
                <li>Describe next-token prediction and its limits.</li>
                <li>
                  Explain context windows and what information a model can see.
                </li>
              </ul>
            )}
            <Link
              className="button"
              href={
                isP1
                  ? "/learn/python-for-ai/p1-01"
                  : "/learn/genai-basics/c2-01"
              }
            >
              Start lesson →
            </Link>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

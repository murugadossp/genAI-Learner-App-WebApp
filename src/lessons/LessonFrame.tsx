import Link from "next/link";
import Shell from "../studio/Shell";
import { LessonNav } from "./LessonNav";
export function LessonFrame({
  number,
  title,
  lead,
  children,
  embedded = false,
  toolbar,
  footer = true,
  chapter = { label: "How GenAI works", href: "/course" },
  chapterLabel,
  courseHref,
  courseLabel,
}: {
  number: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  embedded?: boolean;
  toolbar?: React.ReactNode;
  footer?: boolean;
  chapter?: { label: string; href: string };
  chapterLabel?: string;
  courseHref?: string;
  courseLabel?: string;
}) {
  const activeChapter = {
    label: chapterLabel ?? chapter.label,
    href: courseHref ?? chapter.href,
  };
  const backLabel =
    courseLabel && courseLabel !== "Learning path"
      ? courseLabel
      : activeChapter.label || "the learning path";
  const body = (
    <div className="lesson-shell">
      <div className="lesson-toolbar">
        <Link className="text-link" href={activeChapter.href}>
          ← {courseLabel ?? "Learning path"}
        </Link>
        {toolbar ?? (
          <Link className="text-link" href={activeChapter.href}>
            Chapter contents
          </Link>
        )}
      </div>
      <article className="article">
        <div className="eyebrow">
          {activeChapter.label} / Lesson {number}
        </div>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <div className="lesson-meta">
          <span>Concept + interactive lab</span>
          <span>Beginner friendly</span>
          <span>Web preview</span>
        </div>
        {children}
        {footer && (
          <LessonNav
            chapterHref={activeChapter.href}
            chapterLabel={backLabel}
          />
        )}
      </article>
    </div>
  );
  return embedded ? body : <Shell>{body}</Shell>;
}

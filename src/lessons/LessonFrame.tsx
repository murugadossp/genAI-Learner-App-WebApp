import Link from "next/link";
import Shell from "../studio/Shell";
export function LessonFrame({
  number,
  title,
  lead,
  children,
  embedded = false,
  toolbar,
  footer = true,
  chapterLabel = "How GenAI works",
  courseHref = "/course",
  courseLabel = "Learning path",
}: {
  number: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  embedded?: boolean;
  toolbar?: React.ReactNode;
  footer?: boolean;
  chapterLabel?: string;
  courseHref?: string;
  courseLabel?: string;
}) {
  const body = (
    <div className="lesson-shell">
      <div className="lesson-toolbar">
        <Link className="text-link" href={courseHref}>
          ← {courseLabel}
        </Link>
        {toolbar ?? (
          <Link className="text-link" href={courseHref}>
            Chapter contents
          </Link>
        )}
      </div>
      <article className="article">
        <div className="eyebrow">
          {chapterLabel} / Lesson {number}
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
          <div className="end-lesson">
            <Link className="text-link" href={courseHref}>
              ← Back to{" "}
              {courseLabel === "Learning path"
                ? "the learning path"
                : courseLabel}
            </Link>
          </div>
        )}
      </article>
    </div>
  );
  return embedded ? body : <Shell>{body}</Shell>;
}

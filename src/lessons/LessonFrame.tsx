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
  chapter = { label: "How GenAI works", href: "/course" },
}: {
  number: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  embedded?: boolean;
  toolbar?: React.ReactNode;
  footer?: boolean;
  chapter?: { label: string; href: string };
}) {
  const body = (
    <div className="lesson-shell">
      <div className="lesson-toolbar">
        <Link className="text-link" href={chapter.href}>
          ← Learning path
        </Link>
        {toolbar ?? (
          <Link className="text-link" href={chapter.href}>
            Chapter contents
          </Link>
        )}
      </div>
      <article className="article">
        <div className="eyebrow">
          {chapter.label} / Lesson {number}
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
            <Link className="text-link" href={chapter.href}>
              ← Back to the learning path
            </Link>
          </div>
        )}
      </article>
    </div>
  );
  return embedded ? body : <Shell>{body}</Shell>;
}

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
}: {
  number: string;
  title: string;
  lead: string;
  children: React.ReactNode;
  embedded?: boolean;
  toolbar?: React.ReactNode;
  footer?: boolean;
}) {
  const body = (
    <div className="lesson-shell">
      <div className="lesson-toolbar">
        <Link className="text-link" href="/course">
          ← Learning path
        </Link>
        {toolbar ?? (
          <Link className="text-link" href="/course">
            Chapter contents
          </Link>
        )}
      </div>
      <article className="article">
        <div className="eyebrow">How GenAI works / Lesson {number}</div>
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
            <Link className="text-link" href="/course">
              ← Back to the learning path
            </Link>
          </div>
        )}
      </article>
    </div>
  );
  return embedded ? body : <Shell>{body}</Shell>;
}

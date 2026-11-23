"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import lessonNav from "../data/lesson-nav.json";

type NavLink = {
  href: string;
  title: string;
};

type LessonNavEntry = {
  prev: NavLink | null;
  next: NavLink | null;
};

const navByPath: Record<string, LessonNavEntry> = lessonNav;

export function LessonNav({
  chapterHref,
  chapterLabel,
}: {
  chapterHref: string;
  chapterLabel: string;
}) {
  const pathname = (usePathname() ?? "").replace(/\/+$/, "");
  const entry = navByPath[pathname];
  const prev = entry?.prev ?? null;
  const next = entry?.next ?? null;

  return (
    <nav
      className="end-lesson lesson-footer-nav"
      aria-label="Lesson navigation"
    >
      {(prev || next) && (
        <div className="lesson-nav-links">
          {prev && (
            <Link className="lesson-nav-card lesson-nav-prev" href={prev.href}>
              <span className="lesson-nav-dir">← Previous</span>
              <span className="lesson-nav-title">{prev.title}</span>
            </Link>
          )}
          {next && (
            <Link className="lesson-nav-card lesson-nav-next" href={next.href}>
              <span className="lesson-nav-dir">Next →</span>
              <span className="lesson-nav-title">{next.title}</span>
            </Link>
          )}
        </div>
      )}
      <div className="lesson-nav-overview">
        <Link className="text-link" href={chapterHref}>
          ← Back to {chapterLabel}
        </Link>
      </div>
    </nav>
  );
}

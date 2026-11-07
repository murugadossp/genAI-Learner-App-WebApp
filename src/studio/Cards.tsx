import Link from "next/link";
import { courses } from "./data";
export function Card({ course }: { course: (typeof courses)[number] }) {
  const available = "href" in course && typeof course.href === "string";
  const content = (
    <>
      <div className="card-top">
        <span className="course-icon" aria-hidden="true">
          {course.icon}
        </span>
        <span className="pill">{available ? course.level : "Coming soon"}</span>
      </div>
      <h3>{course.title}</h3>
      <p>{course.body}</p>
      <div className="card-bottom">
        <span>{course.meta}</span>
        {available && <span aria-hidden="true">↗</span>}
      </div>
    </>
  );
  return available ? (
    <Link className="card" href={course.href}>
      {content}
    </Link>
  ) : (
    <article className="card coming-soon">{content}</article>
  );
}

import {courses} from './data';
export function Card({course}:{course:typeof courses[number]}){
 const available=course.title==='How language models work';
 const content=<><div className="card-top"><span className="course-icon" aria-hidden="true">{course.icon}</span><span className="pill">{available?course.level:'Coming soon'}</span></div><h3>{course.title}</h3><p>{course.body}</p><div className="card-bottom"><span>{course.meta}</span>{available&&<span aria-hidden="true">↗</span>}</div></>;
 return available?<a className="card" href="/course">{content}</a>:<article className="card coming-soon">{content}</article>;
}

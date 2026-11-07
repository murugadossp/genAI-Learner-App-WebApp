import { writeFileSync, mkdirSync } from 'node:fs';
const production = process.env.VERCEL_ENV === 'production' || process.env.APP_ENV === 'production';
const routes = [
 ['app/page.tsx','../src/studio/Landing'],
 ['app/studio/page.tsx','../../src/studio/Studio'],
 ['app/course/page.tsx','../../src/studio/Course'],
 ['app/learn/genai-basics/c2-01/page.tsx','../../../../src/lessons/genai-basics/c2-01/Lesson'],
 ['app/learn/genai-basics/c2-06/page.tsx','../../../../src/lessons/genai-basics/c2-06/Lesson'],
 ['app/learn/genai-basics/c2-02/page.tsx','../../../../src/lessons/genai-basics/c2-02/Lesson'],
];
for (const [path, target] of routes) {
 mkdirSync(path.slice(0,path.lastIndexOf('/')), {recursive:true});
 const safe = path==='app/page.tsx' ? 'export default function Home(){return <main><h1>GenAI Learner</h1><p>Our web learning experience is coming soon.</p></main>}\n' : 'import { notFound } from "next/navigation";\nexport default function Page(){notFound()}\n';
 writeFileSync(path,production?safe:`export { default } from "${target}";\n`);
}

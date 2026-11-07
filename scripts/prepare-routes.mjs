import { writeFileSync, mkdirSync } from 'node:fs';
const production = process.env.VERCEL_ENV === 'production' || process.env.APP_ENV === 'production';
const path = 'app/learn/genai-basics/c2-02';
mkdirSync(path, { recursive: true });
writeFileSync(`${path}/page.tsx`, production
  ? 'import { notFound } from "next/navigation";\nexport default function Page() { notFound(); }\n'
  : 'export { default } from "../../../../src/lessons/genai-basics/c2-02/Lesson";\n');

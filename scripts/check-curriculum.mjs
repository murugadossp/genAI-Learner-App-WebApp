import { readFileSync } from 'node:fs';
const curriculum = JSON.parse(readFileSync('src/data/curriculum/curriculum.json'));
const registry = JSON.parse(readFileSync('src/data/curriculum/module_registry.json'));
for (const id of ['c2-01', 'c2-02', 'c2-06']) {
 const metadata = JSON.parse(readFileSync(`src/lessons/genai-basics/${id}/meta.json`));
 const module = registry.modules.find(item => item.key === metadata.module);
 if (metadata.lessonId !== id || !module || !new RegExp(module.slugPattern).test(id) || !curriculum.chapters.some(chapter => chapter.lessons.some(lesson => lesson.slug === id))) throw new Error(`Lesson ${id} does not match the curriculum registry`);
}

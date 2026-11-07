import { readFileSync } from 'node:fs';
const curriculum = JSON.parse(readFileSync('src/data/curriculum/curriculum.json'));
const registry = JSON.parse(readFileSync('src/data/curriculum/module_registry.json'));
const metadata = JSON.parse(readFileSync('src/lessons/genai-basics/c2-02/meta.json'));
const module = registry.modules.find(item => item.key === metadata.module);
if (!module || !new RegExp(module.slugPattern).test(metadata.lessonId) || !curriculum.chapters.some(chapter => chapter.lessons.some(lesson => lesson.slug === metadata.lessonId))) throw new Error('Lesson does not match the curriculum registry');

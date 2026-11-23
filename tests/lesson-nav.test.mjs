import test from "node:test";
import assert from "node:assert/strict";
import { buildLessonNav } from "../scripts/lesson-nav.mjs";

const sampleCurriculum = {
  chapters: [
    {
      id: 1,
      title: "Chapter One",
      lessons: [
        { slug: "c1-01", title: "First lesson" },
        { slug: "c1-02", title: "Second lesson" },
        { slug: "c1-03", title: "Third lesson" },
        { slug: "c1-04", title: "Fourth lesson" },
      ],
    },
    {
      id: 2,
      title: "Chapter Two",
      lessons: [
        { slug: "c2-01", title: "Only built lesson" },
        { slug: "c2-02", title: "Not built yet" },
      ],
    },
  ],
};

const sampleLessons = [
  // Intentionally out of order to verify curriculum ordering.
  { module: "genai-basics", lessonId: "c1-03", webStatus: "published" },
  { module: "genai-basics", lessonId: "c1-01", webStatus: "published" },
  { module: "genai-basics", lessonId: "c1-02", webStatus: "draft" },
  { module: "genai-basics", lessonId: "c1-04", webStatus: "draft" },
  { module: "genai-basics", lessonId: "c2-01", webStatus: "published" },
];

test("buildLessonNav includes draft lessons in non-production builds", () => {
  const nav = buildLessonNav(sampleCurriculum, sampleLessons, {
    production: false,
  });

  assert.deepEqual(nav["/learn/genai-basics/c1-01"], {
    prev: null,
    next: { href: "/learn/genai-basics/c1-02", title: "Second lesson" },
  });
  assert.deepEqual(nav["/learn/genai-basics/c1-02"], {
    prev: { href: "/learn/genai-basics/c1-01", title: "First lesson" },
    next: { href: "/learn/genai-basics/c1-03", title: "Third lesson" },
  });
  assert.deepEqual(nav["/learn/genai-basics/c1-03"], {
    prev: { href: "/learn/genai-basics/c1-02", title: "Second lesson" },
    next: { href: "/learn/genai-basics/c1-04", title: "Fourth lesson" },
  });
  assert.deepEqual(nav["/learn/genai-basics/c1-04"], {
    prev: { href: "/learn/genai-basics/c1-03", title: "Third lesson" },
    next: null,
  });
  assert.deepEqual(nav["/learn/genai-basics/c2-01"], {
    prev: null,
    next: null,
  });
});

test("buildLessonNav skips draft lessons in production builds", () => {
  const nav = buildLessonNav(sampleCurriculum, sampleLessons, {
    production: true,
  });

  assert.deepEqual(nav["/learn/genai-basics/c1-01"], {
    prev: null,
    next: { href: "/learn/genai-basics/c1-03", title: "Third lesson" },
  });
  assert.deepEqual(nav["/learn/genai-basics/c1-03"], {
    prev: { href: "/learn/genai-basics/c1-01", title: "First lesson" },
    next: null,
  });
  assert.equal(nav["/learn/genai-basics/c1-02"], undefined);
  assert.equal(nav["/learn/genai-basics/c1-04"], undefined);
  assert.deepEqual(nav["/learn/genai-basics/c2-01"], {
    prev: null,
    next: null,
  });
});

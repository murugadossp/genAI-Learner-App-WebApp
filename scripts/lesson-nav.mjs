// Compute previous/next lesson navigation within each curriculum chapter.
// In production, draft lessons are excluded so links never point to 404 pages.
export function buildLessonNav(
  curriculum,
  allLessons,
  { production = false } = {},
) {
  const visible = allLessons.filter(
    (lesson) => !production || lesson.webStatus === "published",
  );
  const bySlug = new Map(visible.map((lesson) => [lesson.lessonId, lesson]));
  const nav = {};
  for (const chapter of curriculum.chapters) {
    const ordered = [];
    for (const item of chapter.lessons) {
      const meta = bySlug.get(item.slug);
      if (!meta) continue;
      ordered.push({
        href: `/learn/${meta.module}/${meta.lessonId}`,
        title: item.title,
      });
    }
    for (let i = 0; i < ordered.length; i++) {
      nav[ordered[i].href] = {
        prev: i > 0 ? ordered[i - 1] : null,
        next: i < ordered.length - 1 ? ordered[i + 1] : null,
      };
    }
  }
  return nav;
}

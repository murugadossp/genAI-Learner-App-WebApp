---
description: QA a web lesson and produce or update its lesson report
argument-hint: <module> <lessonId>
---

Review the existing web lesson: $ARGUMENTS

Read `AGENTS.md` and `skills/write-web-lesson/SKILL.md`. Do not rewrite the lesson. Check it against the "Review before delivery" list in `skills/write-web-lesson/references/lesson-template.md`, run the commands in `AGENTS.md`, and inspect the rendered lesson at 390, 768 and 1440px in light and dark themes. Fill in `docs/lesson-reports/<module>/<lessonId>.md` from `skills/write-web-lesson/references/report-template.md`, marking anything not tested. List validated problems by severity. Do not change `webStatus`, merge or publish.

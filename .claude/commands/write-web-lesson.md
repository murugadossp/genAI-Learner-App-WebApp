---
description: Author an interactive web lesson in its own worktree and open a draft PR
argument-hint: <module> <lessonId> [notes]
---

Use the skill in `skills/write-web-lesson/SKILL.md` to write a web lesson for: $ARGUMENTS

Follow `AGENTS.md` and the skill's workflow: create a worktree and branch `lessons/<lessonId>` from `origin/main`, build the lesson as `draft`, verify it with the commands in `AGENTS.md`, write the report to `docs/lesson-reports/<module>/<lessonId>.md`, then push and open a draft PR using the report as its description. Do not merge, mark the PR ready, publish or deploy; stop after summarising with the PR link and ask what to do next. If the module or lesson ID is missing or not in the curriculum snapshot, ask instead of guessing.

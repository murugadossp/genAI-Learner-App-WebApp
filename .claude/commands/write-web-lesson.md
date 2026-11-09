---
description: Author an interactive web lesson in its own worktree and open a draft PR
argument-hint: <module> <lessonId> [notes]
---

Use the skill in `skills/write-web-lesson/SKILL.md` to write a web lesson for: $ARGUMENTS

Follow `AGENTS.md` and the skill's workflow: create a worktree and branch `lessons/<lessonId>` from `origin/main` (or from the parent branch when the skill says to stack), build the lesson (new lessons are `draft`; leave an existing lesson's `webStatus` unchanged unless told otherwise), verify it with the commands in `AGENTS.md`, write the report to `docs/lesson-reports/<module>/<lessonId>.md`, then push and open a draft PR (base `main`, or the parent branch when stacked) using the report as its description. Do not merge, mark the PR ready, publish or deploy; stop after summarising with the PR link and ask what to do next. If the module or lesson ID is missing or not in the curriculum snapshot, do not guess. Read `src/data/curriculum/curriculum.json` and `module_registry.json`, find the lessons that have no folder under `src/lessons/<module>/` yet (skip any with an open `lessons/<lessonId>` branch or worktree), and ask the user to pick with AskUserQuestion: up to four of the next missing lessons in curriculum order, each labelled with its ID and title, plus the free-text "Other" option. If AskUserQuestion is unavailable, list them in plain text and ask. Wait for the answer before creating a worktree.

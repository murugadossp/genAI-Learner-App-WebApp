---
description: Read-only review of a web lesson (by lesson or PR), returned as findings; posts nothing unless asked
argument-hint: <module> <lessonId> | <PR number> [--post]
---

Review the web lesson: $ARGUMENTS

Read `AGENTS.md` and `skills/write-web-lesson/SKILL.md` first.

**Find the lesson, read-only**

1. Resolve the module, lesson ID and PR (from the arguments, or from `lessons/<lessonId>`). If none were given, do not guess: collect candidates from open PRs on `lessons/*` branches (`gh pr list --state open`, or the REST API if GraphQL is blocked), existing worktrees (`git worktree list`) and lessons under `src/lessons/`, then ask the user to pick with AskUserQuestion (up to four, newest PR first, labelled with lesson ID, title and PR number, plus "Other"). If AskUserQuestion is unavailable, list them in plain text and ask. Wait for the answer before doing anything else.
2. For a PR, first resolve its head SHA (`gh api repos/<owner>/<repo>/pulls/<n> --jq .head.sha`) and fetch it (`git fetch origin pull/<n>/head`). Review exactly that SHA.
3. Reuse an existing `lessons/<lessonId>` worktree only if `git status --porcelain` is empty and its `HEAD` equals the PR head SHA. If it is stale, ahead or dirty, do not review it as the PR: create a separate detached worktree at the exact SHA (`git worktree add --detach ../genai-learner-review-<lessonId> <sha>`) and review there. Remove only a worktree you created, when done.
4. If there is no PR (a local lesson only), review the worktree as it is and state clearly that the findings are about local, possibly uncommitted work, with its `HEAD` SHA and any uncommitted changes listed. Never describe local changes as a PR review.

**Rules**

- Do not edit, commit or push lesson files. Do not change `webStatus`, merge, mark ready, publish or deploy. Running the checks in `AGENTS.md` and a build is fine because it only creates ignored output.
- Do not write or overwrite the lesson report file. Use the report already in the PR as evidence.
- Do not post anything to GitHub (comments, reviews, approvals) unless the arguments include `--post` or the user explicitly asks in this session.

**Review**

Check the lesson against the "Review before delivery" list in `skills/write-web-lesson/references/lesson-template.md`, run the commands in `AGENTS.md`, and inspect the rendered lesson at 390, 768 and 1440px in light and dark themes. Compare the PR's report with what you actually verified.

**Return in chat**

Reviewed commit (full SHA, matching the PR head) and PR, CI status, validated findings (file and line, severity, priority P0 to P4, blocking or not), what you verified, what you could not test, and a recommended decision (comment, request changes, or approve if clean). Only with `--post` or an explicit request: post these as PR review comments and say exactly what was posted.

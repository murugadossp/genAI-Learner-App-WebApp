---
name: vercel-deploy
description: Autonomously ship the latest main to Vercel production for the GenAI Learner web app, optionally publishing named draft lessons first through a PR that is checked, merged and verified live. Use when the user asks to deploy, release or make the latest main live; not for preview deploys or rollbacks.
---

# Vercel deploy: latest `main` to production

Run the whole release without stopping to ask: sync, (optionally) publish lessons through a PR, merge it, deploy to production, verify live, and report. Invoking this skill (or `/vercel-deploy`) is the user's instruction to merge and deploy, so the `AGENTS.md` rule "do not merge, publish or deploy without the user's instruction" is satisfied for exactly what is described here and nothing more.

## Input

- No arguments: deploy the latest `main` as it is.
- `--publish <lessonId[,lessonId...]>` (or "publish c1-07 and p1-03" in plain words): also set those lessons to `webStatus: "published"` through a PR before deploying. Publish only lessons the user named. Never publish a lesson that was not named, even if it is a draft.

## Never do

- Force-push, rewrite history, delete branches, or merge with failing or pending CI.
- Edit generated route files (`app/**/page.tsx`), the curriculum snapshot, or the gating logic in `scripts/prepare-routes.mjs` and `scripts/lesson-registry.mjs` to make a check pass.
- Promote a preview build (`vercel promote`). Gating is decided at build time from `VERCEL_ENV`, so a preview build would expose drafts. Always rebuild with `vercel deploy --prod`.
- Add attribution lines to commits or PRs if the user's memory or `CLAUDE.md` says to omit them.

## Steps

1. **Preflight.** `.vercel/project.json` must exist, `vercel whoami` and `gh auth status` must succeed, and the working tree must be clean (`git status --porcelain`; ignore untracked `.claude/worktrees/`). If the tree is dirty, stop and say what is dirty. Do not stash or discard it.
2. **Sync.** `git fetch origin`, `git checkout main`, `git pull --ff-only`. Note the SHA. If `--ff-only` fails, stop and report.
3. **What is new.** Find when production was last deployed (`vercel ls --prod`, newest row, or `vercel inspect <url>` for the exact time) and list PRs merged to `main` since (`gh pr list --state merged --base main --search "merged:>=<ISO time>"`). If the time cannot be determined, say so instead of guessing. This list goes in the final report.
4. **Publish PR (only with `--publish`).**
   1. For each lesson ID, find `src/lessons/*/<lessonId>/meta.json`. If missing or the lesson is already published, say so and drop it. If none remain, skip to step 5.
   2. `git checkout -b publish/<ids-joined-by-dash>`. Set `"webStatus": "published"` in each `meta.json`.
   3. Read each lesson's report in `docs/lesson-reports/<module>/<lessonId>.md`. Collect any "Needed before publishing" items; they go in the PR body and the final report. They do not block, because the user named the lessons.
   4. Run `npm run format:check`, `npm run typecheck` and `npm run test:production`. If `format:check` fails on files you changed, run `npx prettier --write` on those files and retry once. Any other failure: stop, leave the branch unpushed, and report the output.
   5. If a lesson's publication needs a hard-coded link or card fixed (for example a course card with no `href`, which renders "Coming soon"), make that minimal change in the same PR and update the test that asserts the old state. Do not widen scope beyond that.
   6. Commit, `git push -u origin HEAD`, `gh pr create` with a body listing the lessons, the checks you ran and the open report items.
   7. `gh pr checks <n> --watch --fail-fast`. If CI fails, report the failing check and stop. Do not merge.
   8. `gh pr merge <n> --merge`, then `git checkout main && git pull --ff-only`.
5. **Deploy.** From `main` run `vercel deploy --prod --yes`. Capture the production URL and the alias line. A failed build: report the Vercel error and stop.
6. **Verify live.** Against the production alias (`https://gen-ai-learner-app-web-app.vercel.app`), `curl -s -o /dev/null -w '%{http_code}'` these paths: `/`, `/studio`, `/course`, `/course/chapter-1`, `/course/chapter-p1` (200 only if a python-for-ai lesson is published, else 404), and every lesson in `src/lessons/*/*/meta.json` (200 if `published`, 404 if `draft`). Also confirm `/` does not contain "coming soon". Any mismatch is a failure: report it, do not claim success.
7. **Final report.** In this shape, plain and short:
   - Result: live or failed, and at which step.
   - Production URL and the deployed `main` SHA (short) with the deployment ID.
   - PRs merged since the last production deploy (number and title), plus the publish PR if one was made.
   - Lessons now live (count) and drafts still unpublished (IDs).
   - Verification table (path, status, expected).
   - Open items: unresolved report items for lessons published in this run, anything skipped or that could not be checked.

## Notes

- `vercel ls` has no `--limit`; the newest deployment is the first data row.
- `vercel deploy --prod` uploads the local checkout, so deploy only from a clean, synced `main`.
- Production gating means `/studio`, lessons and `/course/chapter-p1` follow `webStatus`; verification is against `meta.json`, not memory.

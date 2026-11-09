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

- Force-push, rewrite history, delete remote branches or `main`, or merge with failing or pending CI. (Deleting your own unpushed local `publish/*` branch, as step 4.5 says, is allowed.)
- Continue to a later step after any step says to stop. A stop ends the whole run, including the deploy.
- Edit generated route files (`app/**/page.tsx`), the curriculum snapshot, or the gating logic in `scripts/prepare-routes.mjs` and `scripts/lesson-registry.mjs` to make a check pass.
- Promote a preview build (`vercel promote`). Gating is decided at build time from `VERCEL_ENV`, so a preview build would expose drafts. Always rebuild with `vercel deploy --prod`.
- Add attribution lines to commits or PRs if the user's memory or `CLAUDE.md` says to omit them.

## Steps

1. **Preflight.** `.vercel/project.json` must exist, `vercel whoami` and `gh auth status` must succeed, and the working tree must be clean (`git status --porcelain`). `.claude/worktrees/` is git-ignored and listed in `.vercelignore`, so it is neither reported nor uploaded. If the tree is dirty, stop and say what is dirty. Do not stash or discard it.
2. **Sync.** `git fetch origin`, `git checkout main`, `git pull --ff-only`, then require `test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"`. If either fails (including unpushed local commits on `main`), stop and report, because `vercel deploy --prod` uploads the local checkout and would ship commits nobody reviewed. Note the SHA.
3. **What is new.** Find when production was last deployed (`vercel ls -e production -n 1 --json`, which gives the creation time and, for git-triggered deploys, the commit SHA) and list PRs merged to `main` since (`gh pr list --state merged --base main --search "merged:>=<ISO time>"`). If the time cannot be determined, say so instead of guessing. This list goes in the final report.
4. **Publish PR (only with `--publish`).**
   1. For each lesson ID, find `src/lessons/*/<lessonId>/meta.json`. If any requested ID has no `meta.json`, report the unknown ID and stop (a typo must not turn into a plain deploy). If a lesson is already published, note it and drop it. If every requested lesson was already published, say there is nothing to publish and continue to step 5 to deploy `main` as it is.
   2. Name the branch `publish/<ids-joined-by-dash>-<YYYYMMDD-HHMM>` (the timestamp avoids colliding with a local or remote branch left by an aborted run, and force-push is forbidden), then `git checkout -b <that name>`. Set `"webStatus": "published"` in each `meta.json`.
   3. Read each lesson's report in `docs/lesson-reports/<module>/<lessonId>.md`. Collect any "Needed before publishing" items; they go in the PR body and the final report. They do not block, because the user named the lessons.
   4. Run `npm run format:check`, `npm run typecheck` and `npm run test:production`. If `format:check` fails on files you changed, run `npx prettier --write` on those files and retry once. Any other failure: stop, leave the branch unpushed, and report the output.
   5. The publish PR changes only `meta.json` files. If publishing needs an app or test change (for example a course card with no `href`, which renders "Coming soon"), do not make it here: delete the unpushed local branch (`git checkout main && git branch -D <branch>`), report what needs fixing, and stop. Such changes go through a normal reviewed PR first.
   6. Commit, `git push -u origin HEAD`, then `gh pr create --title "Publish <ids>" --body "<lessons, checks run, open report items>"` and note the PR number `<n>` it prints.
   7. Checks register a few seconds after the PR opens, and until then `gh pr checks` prints "no checks reported" and exits non-zero, which looks like a failure. Poll (every few seconds, up to about a minute) until `gh pr view <n> --json statusCheckRollup -q '.statusCheckRollup | length'` is above 0, then run `gh pr checks <n> --watch --fail-fast`. Exit 0 means all checks passed; exit 8 means still pending (keep watching); any other non-zero exit means a check failed. If no checks ever register, stop and report instead of merging. If CI fails, run `git checkout main`, report the failing check, and stop. Do not merge or deploy.
   8. `gh pr merge <n> --merge`, then `git checkout main && git pull --ff-only`.
5. **Deploy.** From `main` run `vercel deploy --prod --yes`. Capture the production URL and the alias line. A failed build: report the Vercel error and stop.
6. **Verify live.** Against the production alias (`https://gen-ai-learner-app-web-app.vercel.app`), `curl -s -o /dev/null -w '%{http_code}'` these paths: `/`, `/studio`, `/course`, `/course/chapter-1`, `/course/chapter-p1` (200 only if a python-for-ai lesson is published, else 404), and every lesson in `src/lessons/<module>/<lessonId>/meta.json` at `/learn/<module>/<lessonId>` (200 if `published`, 404 if `draft`). Check the `/` body separately (`! curl -s <alias>/ | grep -qi "coming soon"` must succeed; `grep -c` exits 1 when the count is 0), because the status check discards the body. Any mismatch is a failure: report it, do not claim success.
7. **Final report.** In this shape, plain and short:
   - Result: live or failed, and at which step.
   - Production URL and the deployed `main` SHA (short) with the deployment ID.
   - PRs merged since the last production deploy (number and title), plus the publish PR if one was made.
   - Lessons now live (count) and drafts still unpublished (IDs).
   - Verification table (path, status, expected).
   - Open items: unresolved report items for lessons published in this run, anything skipped or that could not be checked.

## Notes

- `vercel ls` takes `-e production`, `-n <limit>` and `--json`; use the JSON for timestamps, since the table only shows relative ages.
- `vercel deploy --prod` uploads the local checkout, so deploy only from a clean, synced `main`.
- Production gating means lessons and `/course/chapter-p1` follow `webStatus`; verification is against `meta.json`, not memory.

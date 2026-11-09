---
description: Ship the latest main to Vercel production end to end (optionally publishing named lessons via a PR), then report the result
argument-hint: [--publish <lessonId[,lessonId...]>]
---

Release the web app to production: $ARGUMENTS

Read `AGENTS.md` and `skills/vercel-deploy/SKILL.md` first, then follow the skill exactly and autonomously. Do not ask for confirmation between steps: running this command is the instruction to create the PR (when publishing lessons), merge it once CI is green, deploy to production and verify it live. Stop only on a failure the skill says to stop on. Finish with the final report in the skill's format.

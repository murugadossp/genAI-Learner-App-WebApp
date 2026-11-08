#!/usr/bin/env bash
set -euo pipefail

MODULE="${1:-}"
LESSON_ID="${2:-}"

if [ -z "$MODULE" ] || [ -z "$LESSON_ID" ]; then
  echo "Usage: $0 <module> <lessonId> [optional notes]"
  echo "Example: $0 genai-basics c2-04"
  exit 1
fi

shift 2
NOTES="$*"

PROMPT="Use the skill in skills/write-web-lesson/SKILL.md to write a web lesson for module '$MODULE' and lesson ID '$LESSON_ID'."
if [ -n "$NOTES" ]; then
  PROMPT="$PROMPT Additional notes: $NOTES"
fi
PROMPT="$PROMPT Follow AGENTS.md. Start the lesson as draft. Verify it with the commands in AGENTS.md, then write the report using skills/write-web-lesson/references/report-template.md to docs/lesson-reports/$MODULE/$LESSON_ID.md. Do not publish, merge or deploy; stop after summarising and ask what to do next."

exec agy -i "$PROMPT"

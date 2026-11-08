#!/usr/bin/env bash
set -euo pipefail

MODULE="${1:-}"
LESSON_ID="${2:-}"

if [ -z "$MODULE" ] || [ -z "$LESSON_ID" ]; then
  echo "Usage: $0 <module> <lessonId>"
  echo "Example: $0 genai-basics c2-04"
  exit 1
fi

PROMPT="Review the web lesson for module '$MODULE' and lesson ID '$LESSON_ID'. Verify it with npm run typecheck and npm test, inspect the interactive parts, and fill in or update docs/lesson-reports/$MODULE/$LESSON_ID.md using the template in skills/write-web-lesson/references/report-template.md. Do not publish or merge; stop after presenting the report."

exec agy -i "$PROMPT"

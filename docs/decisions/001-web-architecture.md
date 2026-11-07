# Web architecture decision

The merged learning studio mockup is the visual reference. Build a reusable web shell using Next.js App Router and TypeScript; author web lessons independently as JSX using shared controls and tokens. Curriculum IDs and ordering remain shared with mobile; web routes and publication readiness are independent. Use Vercel for previews and hosting, including a paid plan when appropriate. The scaffold pins Next.js 16.4.5.

## Open decisions

- Define how completion on web relates to mobile progress, XP and streaks before connecting submit-answer.
- Choose browser calls with CORS or a server route for submit-answer.
- Define the authority, release gates and preview workflow for web lesson publication.
- Confirm that the selected hosting plan permits the actual use of the project.

The first lesson is a preview-only sample until a publication mechanism exists. The production build must not expose it. Knowledge checks are local and ungraded. A lab must preserve state and focus when expanding, collapsing or closing with Escape.

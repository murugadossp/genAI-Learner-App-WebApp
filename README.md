# GenAI Learner — Web

An independent web learning experience for curious beginners and engineers. Curriculum topics and lesson identities are shared with `murugadossp/genAI-Learner-App`; web lessons, layout, assets, and publication readiness are authored independently. Mobile HTML is not the web lesson source.

## Preview the design

Open `mockups/index.html` directly, or serve this directory:

```sh
python3 -m http.server 8765
```

Visit http://localhost:8765/mockups/.

The prototype includes a landing page, learner home, course overview, and a new web sample of `c2-02`, “How a model predicts the next token.” Hash navigation supports back/forward. Try catalog search/filters, light/dark mode, the wide next-token simulation and its Expand workspace action, the knowledge check, and demo completion. The lesson uses compact navigation menus; on mobile, Contents, Sections, and Next section remain reachable in a sticky bottom bar. **Reset demo** clears preferences and progress stored by this prototype.

All catalog cards intentionally lead to the same sample course. Other course lessons are marked preview-only. Completion is local demo state, not actual learner progress or publication status. There is no authentication, backend connection, executable code runner, or real model call. The planned production web client will use the `submit-answer` and `lesson-review` Supabase functions maintained in the content repository. See `content/curriculum/module_registry.json` there for canonical module lesson path rules. Mobile app repositories: [iOS](https://github.com/murugadossp/genAI-Learner-App-IOS) and [Android](https://github.com/murugadossp/genAI-Learner-App-Android).

Install test dependencies with `npm install`, then run `npm test`. The preview itself needs no build, external fonts, or CDN. See the [design documentation](docs/design/README.md), [original design brief](docs/design-brief.md), and [validation](docs/mockup-validation.md).

## Future integration

Preserve canonical curriculum slugs from the content repository. Additional subject coverage includes LLM internals, LangGraph, and architecture from `llm-concepts`. Shared learner identity can be integrated later; the mockup makes no database changes. Do not infer web readiness from mobile publication status or route web lessons to mobile HTML.

## Web shell preview

Run `npm install` and `npm run dev`, then open http://localhost:3000. The draft sample lesson is available locally and in Vercel Preview builds. `APP_ENV=production npm run build` or Vercel Production builds generate a placeholder home page and a 404 for the draft lesson. The build script generates the route appropriate to the release environment; use the npm scripts rather than invoking Next.js directly.

For browser tests, install Chromium once with `npx playwright install chromium --only-shell`, run `npm run build && npm run start` in one terminal, then run `npm run test:web` in another.

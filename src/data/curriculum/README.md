# Curriculum snapshot

`curriculum.json` and `module_registry.json` are read-only copies from the content repository. `source.json` records the exact source commit and paths. Mobile publication fields do not determine web publication readiness.

To refresh after fetching the content repository:

```sh
git -C ~/projects/genAI-Learner-App fetch origin main
python3 scripts/sync-curriculum.py
```

Use `--repo /path/to/genAI-Learner-App` for a different checkout or `--ref <commit-or-ref>` to select a specific revision. The script reads committed Git objects, not uncommitted checkout files. Review and commit the resulting changes together.

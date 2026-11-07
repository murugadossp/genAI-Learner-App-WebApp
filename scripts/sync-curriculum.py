#!/usr/bin/env python3
"""Snapshot curriculum metadata from a local content repository's Git ref."""
import argparse
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PATHS = ("content/curriculum/curriculum.json", "content/curriculum/module_registry.json")


def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args], text=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.home() / "projects/genAI-Learner-App")
    parser.add_argument("--ref", default="origin/main", help="Git ref to snapshot (default: origin/main; fetch first)")
    args = parser.parse_args()
    sha = git(args.repo, "rev-parse", "--verify", f"{args.ref}^{{commit}}").strip()
    files = {Path(path).name: git(args.repo, "show", f"{sha}:{path}") for path in SOURCE_PATHS}
    for content in files.values():
        json.loads(content)
    destination = ROOT / "src/data/curriculum"
    destination.mkdir(parents=True, exist_ok=True)
    for name, content in files.items():
        (destination / name).write_text(content, encoding="utf-8")
    (destination / "source.json").write_text(json.dumps({
        "repository": "https://github.com/murugadossp/genAI-Learner-App",
        "commit": sha,
        "files": list(SOURCE_PATHS),
    }, indent=2) + "\n", encoding="utf-8")
    print(f"Synced curriculum from {sha}")


if __name__ == "__main__":
    main()

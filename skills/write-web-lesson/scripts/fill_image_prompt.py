#!/usr/bin/env python3
"""Fill the CLI-agnostic educational image prompt from a JSON file of values.

Usage:
    python fill_image_prompt.py values.json --out prompt.txt

The template is references/educational-image-prompt.md; only the text after its
"<!-- PROMPT START -->" marker is written. The script fails if any {{PLACEHOLDER}}
is left unfilled, if the values file has a key the template does not use, or if
a value itself contains a placeholder. Standard library only.
"""

import argparse
import json
import re
import sys
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parent.parent / "references" / "educational-image-prompt.md"
MARKER = "<!-- PROMPT START -->"
PLACEHOLDER = re.compile(r"\{\{([A-Z_]+)\}\}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("values", type=Path, help="JSON object mapping placeholder names to values")
    parser.add_argument("--out", type=Path, required=True, help="file to write the filled prompt to")
    parser.add_argument("--template", type=Path, default=TEMPLATE, help="template file")
    args = parser.parse_args()

    text = args.template.read_text(encoding="utf-8")
    if MARKER not in text:
        parser.error(f"template has no {MARKER} marker: {args.template}")
    body = text.split(MARKER, 1)[1].lstrip("\n")

    try:
        values = json.loads(args.values.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        parser.error(f"cannot read values file: {error}")
    if not isinstance(values, dict) or not all(isinstance(v, str) for v in values.values()):
        parser.error("values must be a JSON object whose values are strings")

    needed = set(PLACEHOLDER.findall(body))
    missing = sorted(needed - values.keys())
    unused = sorted(values.keys() - needed)
    if missing:
        parser.error("missing values: " + ", ".join(missing))
    if unused:
        parser.error("keys not used by the template: " + ", ".join(unused))
    for key, value in values.items():
        if PLACEHOLDER.search(value):
            parser.error(f"value for {key} contains a placeholder")
        if not value.strip():
            parser.error(f"value for {key} is empty")

    scratch_dir = args.out.resolve().parent

    def _is_within(path: Path, parent: Path) -> bool:
        try:
            path.resolve().relative_to(parent)
            return True
        except ValueError:
            return False

    output_path = values.get("OUTPUT_PATH", "")
    if "REPLACE_WITH_" in output_path or not Path(output_path).is_absolute():
        print(
            f"warning: OUTPUT_PATH should be an absolute scratch path (got: {output_path})",
            file=sys.stderr,
        )
    elif not _is_within(Path(output_path), scratch_dir):
        print(
            f"warning: OUTPUT_PATH is outside {scratch_dir} and may be unwritable inside a sandboxed CLI: {output_path}",
            file=sys.stderr,
        )

    ref_image = values.get("REFERENCE_IMAGE", "")
    if ref_image.strip().lower() != "none":
        if "REPLACE_WITH_" in ref_image or not Path(ref_image).is_absolute():
            print(
                f"warning: REFERENCE_IMAGE should be 'None' or an absolute scratch path (got: {ref_image})",
                file=sys.stderr,
            )
        else:
            ref_path = Path(ref_image)
            if not ref_path.exists():
                print(
                    f"warning: REFERENCE_IMAGE does not exist yet: {ref_image}",
                    file=sys.stderr,
                )
            if not _is_within(ref_path, scratch_dir):
                print(
                    f"warning: REFERENCE_IMAGE is outside {scratch_dir} and may be unreadable inside a sandboxed CLI: {ref_image}",
                    file=sys.stderr,
                )

    filled = PLACEHOLDER.sub(lambda match: values[match.group(1)], body)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(filled, encoding="utf-8")
    print(f"{args.out} ({len(filled)} characters)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

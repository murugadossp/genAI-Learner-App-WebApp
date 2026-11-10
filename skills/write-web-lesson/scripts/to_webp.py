#!/usr/bin/env python3
"""Convert a generated lesson image to WebP, scaled down to a maximum width.

Usage (run with a Python that has Pillow installed, see tooling.yaml):
    python to_webp.py <input> <output.webp> [--width 1200] [--quality 82]

The input is read by content, so a PNG saved with a .jpg name still converts.
The width is a maximum: smaller images are not enlarged, and aspect ratio is kept.
"""

import argparse
import sys
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("input", type=Path, help="generated image (PNG, JPEG or WebP)")
    parser.add_argument("output", type=Path, help="destination, must end in .webp")
    parser.add_argument("--width", type=int, default=1200, help="maximum width in pixels")
    parser.add_argument("--quality", type=int, default=82, help="WebP quality, 0-100")
    args = parser.parse_args()

    if args.output.suffix.lower() != ".webp":
        parser.error("output must end in .webp")
    if not args.input.is_file():
        parser.error(f"input not found: {args.input}")
    if args.width < 1 or not 0 <= args.quality <= 100:
        parser.error("--width must be at least 1 and --quality between 0 and 100")

    try:
        from PIL import Image
    except ImportError:
        print(
            "Pillow is required. Install it in a venv, for example:\n"
            "  python3 -m venv <scratch>/imgvenv && <scratch>/imgvenv/bin/pip install -q pillow\n"
            "then run this script with <scratch>/imgvenv/bin/python.",
            file=sys.stderr,
        )
        return 2

    with Image.open(args.input) as image:
        # Keep transparency when the input has it; otherwise store plain RGB.
        has_alpha = image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        )
        image = image.convert("RGBA" if has_alpha else "RGB")
        # Only shrink: thumbnail never enlarges, and the height bound is effectively unlimited.
        image.thumbnail((args.width, 100_000))
        args.output.parent.mkdir(parents=True, exist_ok=True)
        image.save(args.output, "WEBP", quality=args.quality, method=6)
        print(f"{args.output} {image.size[0]}x{image.size[1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-04/meta.json";

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) throw new Error(`Cannot parse color: ${color}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(c1: string, c2: string): number {
  const l1 = relativeLuminance(parseRgb(c1));
  const l2 = relativeLuminance(parseRgb(c2));
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-04 teaching through examples`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-04");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 04",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      // Section order matches meta.json.
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Images render with descriptive alt text (> 40 chars).
      for (const [section, alt] of [
        [
          "#why-examples",
          /Prompt examples show the pattern.*Same weights.*\[Equipment\] Start bread early/,
        ],
        [
          "#no-retraining",
          /Examples stay in context.*Model weights do not change.*Chat 1.*Chat 2/,
        ],
      ] as const) {
        const img = page.locator(`${section} figure img`);
        await img.scrollIntoViewIfNeeded();
        const altAttr = await img.getAttribute("alt");
        expect(altAttr).toBeTruthy();
        expect(altAttr!.length).toBeGreaterThan(40);
        await expect(img).toHaveAttribute("alt", alt);
        await expect
          .poll(() =>
            img.evaluate((el) => {
              const i = el as HTMLImageElement;
              return i.complete && i.naturalWidth > 0;
            }),
          )
          .toBeTruthy();
      }

      // Interactive lab: step through presets, verify hover contrast, theme persistence, and reset.
      const lab = page.getByTestId("examples-lab");
      await expect(lab.getByTestId("weights-badge")).toContainText(
        "Model weights: unchanged",
      );
      await expect(lab.getByTestId("no-examples-note")).toBeVisible();

      const btnOne = lab.getByRole("button", { name: "1 example" });
      await btnOne.click();
      await expect(btnOne).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("lab-reply")).toContainText("[Kitchen]");

      const btnFew = lab.getByRole("button", { name: "3 varied examples" });
      await btnFew.click();
      await expect(btnFew).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("lab-reply")).toContainText("[Equipment]");
      await expect(lab.getByTestId("weights-badge")).toContainText(
        "Model weights: unchanged",
      );

      // Hover active button and verify WCAG AA contrast (>= 4.5).
      await btnFew.hover();
      const colors = await btnFew.evaluate((el) => {
        const s = getComputedStyle(el);
        return { color: s.color, bg: s.backgroundColor };
      });
      expect(contrastRatio(colors.color, colors.bg)).toBeGreaterThanOrEqual(
        4.5,
      );

      // Theme toggle preserves lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(btnFew).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("lab-reply")).toContainText("[Equipment]");

      // Messy examples and New chat.
      await lab.getByRole("button", { name: "Messy examples" }).click();
      await expect(lab.getByTestId("lab-reply")).toContainText("Hey team!");

      await lab.getByRole("button", { name: "New chat (no examples)" }).click();
      await expect(lab.getByTestId("no-examples-note")).toBeVisible();
      await expect(lab.getByTestId("weights-badge")).toContainText(
        "Model weights: unchanged",
      );
      await expect(lab.getByRole("status")).toContainText(
        "Model weights remain unchanged",
      );

      // Reset returns to 0 examples.
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(
        lab.getByRole("button", { name: "0 examples" }),
      ).toHaveAttribute("aria-pressed", "true");

      // Knowledge check: wrong feedback, retry, correct answer.
      await page.getByLabel(/model forgot what it learned/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("never changed the model's weights");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/only guided the earlier chat/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      // No horizontal overflow.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

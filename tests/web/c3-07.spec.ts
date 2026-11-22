import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-07/meta.json";

function parseRgb(rgb: string): [number, number, number] {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Unexpected color format: ${rgb}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(parseRgb(fg));
  const l2 = relativeLuminance(parseRgb(bg));
  const [bright, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (bright + 0.05) / (dark + 0.05);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: improving an answer through iteration`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-07");

      // Section order matches meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));

      // Chapter context label and link
      await expect(page.locator("article .eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 07",
      );

      // All 3 conceptual diagrams load with descriptive alt text (>40 chars)
      for (const section of ["polish", "feedback", "compare"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        expect((await picture.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive lab: starts at Draft 1 (1 of 3 passing)
      const lab = page.getByTestId("revision-lab");
      await expect(lab.getByTestId("req-score")).toHaveText("1 of 3 passing");

      // Round 1: vague polish breaks plain words -> 0 of 3 passing
      const vaguePolishBtn = lab.getByRole("button", {
        name: /Vague polish/,
      });
      await vaguePolishBtn.click();
      await expect(vaguePolishBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("req-score")).toHaveText("0 of 3 passing");

      // Active button maintains high contrast on hover (guards against studio.css hover rule)
      await vaguePolishBtn.hover();
      const colors = await vaguePolishBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { fg: cs.color, bg: cs.backgroundColor };
      });
      expect(contrastRatio(colors.fg, colors.bg)).toBeGreaterThanOrEqual(4.5);

      // Round 1: switch to targeted facts -> 2 of 3 passing (drift to 4 sentences)
      const targetedFactsBtn = lab.getByRole("button", {
        name: /Targeted — add missing facts/,
      });
      await targetedFactsBtn.click();
      await expect(lab.getByTestId("req-score")).toHaveText("2 of 3 passing");
      await expect(lab.getByTestId("lab-status")).toContainText("4 sentences");

      // Round 2: vague tighten drops 2 p.m. -> still 2 of 3 passing
      await lab.getByRole("button", { name: /Vague tighten/ }).click();
      await expect(lab.getByTestId("req-score")).toHaveText("2 of 3 passing");
      await expect(lab.getByTestId("lab-status")).toContainText(
        "dropped 2 p.m.",
      );

      // Round 2: targeted change + keep -> 3 of 3 passing
      const targetedR2Btn = lab.getByRole("button", {
        name: /Targeted — what to change \+ what to keep/,
      });
      await targetedR2Btn.click();
      await expect(lab.getByTestId("req-score")).toHaveText("3 of 3 passing");
      await expect(lab.getByTestId("lab-status")).toContainText(
        "All three original requirements pass",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("req-score")).toHaveText("3 of 3 passing");
      await expect(targetedR2Btn).toHaveAttribute("aria-pressed", "true");

      // Reset returns to Draft 1
      await lab.getByRole("button", { name: "Reset to Draft 1" }).click();
      await expect(lab.getByTestId("req-score")).toHaveText("1 of 3 passing");

      // Knowledge check: wrong feedback, retry, keyboard selection, theme persistence
      const quiz = page.locator("#check");
      await quiz.getByLabel(/smoother writing means/).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz.getByRole("status")).toContainText(
        "polish, not full improvement",
      );
      await quiz.getByRole("button", { name: "Try again" }).click();

      const correctOption = quiz.getByLabel(/Give targeted feedback to cut it/);
      await correctOption.focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(quiz.getByRole("status")).toContainText("Correct");

      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(quiz.getByRole("status")).toContainText("Correct");
      await expect(correctOption).toBeChecked();

      // No horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

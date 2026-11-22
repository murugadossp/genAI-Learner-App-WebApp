import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-02/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/\d+/g);
  if (!match || match.length < 3) {
    throw new Error(`Could not parse RGB color: ${color}`);
  }
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(c1: string, c2: string): number {
  const l1 = relativeLuminance(parseRgb(c1));
  const l2 = relativeLuminance(parseRgb(c2));
  const [light, dark] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: providing context and constraints`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-02");

      // Section order matches meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));

      // Chapter context check
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI",
      );

      // Conceptual images load with descriptive alt text (>40 chars)
      for (const section of ["constraints", "leave-out"]) {
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

      // Interactive PromptBlockLab
      const lab = page.getByTestId("prompt-block-lab");
      await lab.scrollIntoViewIfNeeded();
      await expect(page.getByTestId("lab-status")).toContainText(
        "0 of 4 helpful blocks included",
      );
      await expect(
        lab.getByRole("button", { name: "Reset blocks" }),
      ).toBeDisabled();

      // Toggle the four helpful blocks
      const hoursBtn = lab.getByRole("button", {
        name: /Thanksgiving 2026 schedule/i,
      });
      await hoursBtn.click();
      await expect(hoursBtn).toHaveAttribute("aria-pressed", "true");

      // Active button maintains high contrast on hover against global studio.css hover rule
      await hoursBtn.hover();
      const colors = await hoursBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { color: cs.color, bg: cs.backgroundColor };
      });
      expect(contrastRatio(colors.color, colors.bg)).toBeGreaterThanOrEqual(
        4.5,
      );

      await lab
        .getByRole("button", { name: /Repair drop-off cutoff/i })
        .click();
      await lab
        .getByRole("button", { name: /Length, tone, and bullets/i })
        .click();
      await lab.getByRole("button", { name: /Do-not-add boundary/i }).click();

      await expect(page.getByTestId("lab-status")).toContainText(
        "Focused prompt ready",
      );
      await expect(page.getByTestId("simulated-reply")).toContainText(
        "Thu, Nov 26: Closed",
      );

      // Toggle distracting block -> warning and off-track reply
      const noiseBtn = lab.getByRole("button", {
        name: /Old sale & supplier note/i,
      });
      await noiseBtn.click();
      await expect(page.getByTestId("lab-status")).toContainText(
        "Distracting text included",
      );
      await expect(page.getByTestId("simulated-reply")).toContainText(
        "15% off helmet sale",
      );
      await noiseBtn.click();

      // Toggle sensitive block -> safety warning
      const sensitiveBtn = lab.getByRole("button", {
        name: /Customer contact & card note/i,
      });
      await sensitiveBtn.click();
      await expect(page.getByTestId("lab-status")).toContainText(
        "Safety check failed",
      );
      await sensitiveBtn.click();
      await expect(page.getByTestId("lab-status")).toContainText(
        "Focused prompt ready",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.getByTestId("lab-status")).toContainText(
        "Focused prompt ready",
      );

      // Reset blocks restores initial state
      await lab.getByRole("button", { name: "Reset blocks" }).click();
      await expect(page.getByTestId("lab-status")).toContainText(
        "0 of 4 helpful blocks included",
      );

      // Knowledge check: wrong feedback, retry, keyboard correct answer, theme persistence
      const quiz = page.locator("#check");
      await quiz.scrollIntoViewIfNeeded();
      await quiz.getByLabel(/Paste all four notes/).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz.getByRole("status")).toContainText(
        "private address and phone number",
      );

      await quiz.getByRole("button", { name: "Try again" }).click();
      await quiz.getByLabel(/Include notes A and B/).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(quiz.getByRole("status")).toContainText("Correct");
      await expect(quiz.getByLabel(/Include notes A and B/)).toBeChecked();

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

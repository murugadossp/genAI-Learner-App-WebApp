import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-06/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-06 breaking complex tasks into steps`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-06");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 06",
      );

      // No horizontal overflow at this viewport
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      // All three educational diagrams render with descriptive alt text (>40 chars)
      for (const section of ["split", "gate", "length"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        const alt = await picture.getAttribute("alt");
        expect(alt?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive Lab: Book Swap Stage Planner Lab
      const lab = page.locator(
        "#lab [role='region'][aria-label='Book Swap Stage Planner Lab']",
      );
      await expect(lab).toBeVisible();
      await expect(lab).toContainText("One-shot prompt");

      // Reveal buried mistakes in single-pass mode
      const revealBtn = lab.getByRole("button", {
        name: "Reveal buried mistakes",
      });
      await revealBtn.click();
      await expect(lab).toContainText("Rule 1 broken:");
      await expect(lab).toContainText("Rule 4 broken:");

      // Switch to 3-stage plan via keyboard and check active button hover contrast
      const stagedBtn = lab.getByRole("button", { name: "3-stage plan" });
      await stagedBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab).toContainText("Stage 1 prompt");

      await stagedBtn.hover();
      const ratio = await stagedBtn.evaluate((el) => {
        const rgb = (s: string) =>
          (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
        const lum = (c: number[]) => {
          const [r, g, b] = c.map((v) => {
            const x = v / 255;
            return x <= 0.03928
              ? x / 12.92
              : Math.pow((x + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const s = getComputedStyle(el);
        const a = lum(rgb(s.color));
        const b = lum(rgb(s.backgroundColor));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio).toBeGreaterThan(4.5);

      // Advance Stage 1 -> Stage 2 -> Skip check -> Stage 3 (error carry-over)
      await lab
        .getByRole("button", { name: /Verified against notes/i })
        .click();
      await expect(lab).toContainText("Stage 2 prompt");
      await lab.getByRole("button", { name: /Skip check/i }).click();
      await expect(lab).toContainText("Errors carried over from Stage 2");

      // Go back to Stage 2 and pass the stage gate cleanly
      await lab
        .getByRole("button", { name: "Go back to Stage 2 gate" })
        .click();
      await lab.getByRole("button", { name: /Check & fix slips/i }).click();
      await expect(lab).toContainText("Clean email");
      await expect(lab).toContainText("Ben — Morning heavy boxes");

      // Knowledge check: aria-describedby, wrong feedback, retry, correct answer
      const check = page.locator("#check");
      await expect(check.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await check
        .getByLabel(
          "Trust the schedule because a 400-word explanation shows the assistant thought carefully.",
          { exact: true },
        )
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText(
        "Length and fluent wording do not prove correctness",
      );
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByLabel(
          "Break the work into small stages and check each stage’s output against her notes and rules before moving on.",
          { exact: true },
        )
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("Correct");

      // Theme toggle preserves both lab state and quiz state
      const themeToggle = page.getByRole("button", {
        name: "Switch color theme",
      });
      await themeToggle.click();
      await expect(lab).toContainText("Clean email");
      await expect(check.getByRole("status")).toContainText("Correct");

      // Reset restores single big prompt view
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab).toContainText("One-shot prompt");
    });
  }
}

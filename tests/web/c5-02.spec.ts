import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-02 cleaning data and missing values`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-02");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 02",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["what-cleaning-is", "missing-values"]) {
        const illustration = page.locator(`#${section} figure img`);
        await illustration.scrollIntoViewIfNeeded();
        expect(
          (await illustration.getAttribute("alt"))?.length,
        ).toBeGreaterThan(40);
        await expect
          .poll(() =>
            illustration.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive lab
      const lab = page.getByTestId("cleaning-lab");
      const summary = lab.getByTestId("lab-summary");
      const flagBtn = lab.getByRole("button", {
        name: /Keep visible & flag missing/,
      });
      await expect(flagBtn).toHaveAttribute("aria-pressed", "true");

      // Active button hover contrast check (WCAG AA >= 4.5:1)
      await flagBtn.hover();
      const hoverContrast = await flagBtn.evaluate((el) => {
        const parseRgb = (str: string) => {
          const m = str.match(/\d+/g);
          return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
        };
        const relLum = ([r, g, b]: number[]) => {
          const lin = [r, g, b].map((c) => {
            const s = c / 255;
            return s <= 0.03928
              ? s / 12.92
              : Math.pow((s + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
        };
        const cs = getComputedStyle(el);
        const l1 = relLum(parseRgb(cs.backgroundColor));
        const l2 = relLum(parseRgb(cs.color));
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        return { bg: cs.backgroundColor, fg: cs.color, ratio };
      });
      expect(hoverContrast.ratio).toBeGreaterThanOrEqual(4.5);
      expect(hoverContrast.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverContrast.bg).not.toBe("rgb(44, 54, 46)");

      // Initial raw state
      await expect(summary).toContainText("17.3 min");
      await expect(summary).toContainText("3 labels");

      // Step 1: fix all formats & errors
      await lab
        .getByRole("button", { name: "Fix all formats & errors" })
        .click();
      await expect(summary).toContainText("26 min");
      await expect(summary).toContainText("2 labels");

      // Step 2: Drop incomplete rows -> 4 of 6, Hilltop share 25%
      await lab.getByRole("button", { name: /Drop incomplete rows/ }).click();
      await expect(summary).toContainText("4 of 6");
      await expect(summary).toContainText("Hilltop share: 25%");

      // Step 2: Fill with Hilltop average -> 32 min, Over 30-min target
      await lab
        .getByRole("button", { name: /Fill with Hilltop average/ })
        .click();
      await expect(summary).toContainText("32 min");
      await expect(summary).toContainText("Over 30-min target");

      // Step 2: Fill with 0 (pitfall) -> 17.3 min overall, 14.7 min Hilltop
      await lab
        .getByRole("button", { name: /Fill with 0 \(pitfall\)/ })
        .click();
      await expect(summary).toContainText("17.3 min");
      await expect(summary).toContainText("14.7 min");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(summary).toContainText("17.3 min");
      await expect(summary).toContainText("14.7 min");

      // Keyboard selection: Fill with overall average -> 26 min overall, 32 min Hilltop
      const overallBtn = lab.getByRole("button", {
        name: /Fill with overall average/,
      });
      await overallBtn.focus();
      await page.keyboard.press("Enter");
      await expect(overallBtn).toHaveAttribute("aria-pressed", "true");
      await expect(summary).toContainText("26 min");
      await expect(summary).toContainText("32 min");

      // Reset restores raw state
      await lab.getByRole("button", { name: "Reset table" }).click();
      await expect(flagBtn).toHaveAttribute("aria-pressed", "true");
      await expect(summary).toContainText("3 labels");

      // Knowledge check: wrong feedback, retry, correct answer
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/Dropping blank rows is a neutral step/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("not neutral");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Replacing the two blank cells with 0 is better/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("power outage as zero visitors");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/leaves two open Westside Fridays out of Westside's total/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

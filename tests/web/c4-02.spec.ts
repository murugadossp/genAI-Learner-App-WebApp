import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-02 regression predicting numbers`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-02");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 02",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["reading-the-line", "estimates-not-guarantees"]) {
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

      // Interactive Regression Lab
      const lab = page.getByTestId("regression-lab");
      await expect(lab.getByTestId("estimate-value")).toHaveText("18.0 min");
      await expect(lab.getByTestId("slope-value")).toHaveText("4.0 min/km");
      await expect(lab.getByTestId("gap-value")).toHaveText("1.3 min");

      // Active preset hover contrast check
      const defaultPreset = lab.getByRole("button", {
        name: "Sam’s 6 deliveries",
      });
      await expect(defaultPreset).toHaveAttribute("aria-pressed", "true");
      await defaultPreset.hover();
      const hoverColors = await defaultPreset.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Tight pattern preset lowers average gap
      await lab.getByRole("button", { name: "Tight pattern" }).click();
      await expect(lab.getByTestId("estimate-value")).toHaveText("18.0 min");
      await expect(lab.getByTestId("gap-value")).toHaveText("0.7 min");

      // Delay outlier preset tilts line and raises 3.5 km estimate
      await lab.getByRole("button", { name: "Delay outlier" }).click();
      await expect(lab.getByTestId("estimate-value")).toHaveText("21.0 min");
      await expect(lab.getByTestId("slope-value")).toHaveText("6.6 min/km");
      await expect(lab.getByTestId("gap-value")).toHaveText("4.0 min");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("estimate-value")).toHaveText("21.0 min");

      // Keyboard adjustment on selected point
      const plusBtn = lab.getByRole("button", { name: "+2 min" });
      await plusBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab.getByTestId("selected-point-readout")).toContainText(
        "6 km delivery = 47 min",
      );

      // Reset restores original dataset
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab.getByTestId("estimate-value")).toHaveText("18.0 min");
      await expect(lab.getByTestId("slope-value")).toHaveText("4.0 min/km");

      // Knowledge check: wrong feedback + retry + correct
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/The fitted line was calculated wrong/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "does not have to pass through every data point",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/reliably predict a 30 km delivery/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("extrapolation");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/A 3-minute gap does not mean/).check();
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

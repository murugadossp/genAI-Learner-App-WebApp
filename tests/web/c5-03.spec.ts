import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-03/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-03 probability and uncertainty`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-03");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 03",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of [
        "estimates-not-guarantees",
        "what-calibration-means",
      ]) {
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
      const lab = page.getByTestId("calibration-lab");
      const compareTab = lab.getByRole("button", {
        name: "1. Compare weather apps",
      });
      await expect(compareTab).toHaveAttribute("aria-pressed", "true");

      // Active button hover contrast check (must not fall back to --panel)
      await compareTab.hover();
      const hoverColors = await compareTab.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Default view: App A at 90% -> Well calibrated
      const panel = lab.getByTestId("reliability-panel");
      await expect(panel).toContainText("App A (Well calibrated)");
      await expect(panel).toContainText("90 of 100 days rained");
      await expect(panel).toContainText("0 percentage-point gap");

      // Switch to App B (Overconfident) -> 90% -> 60% observed (-30 gap)
      await lab.getByRole("button", { name: "App B (Overconfident)" }).click();
      await expect(panel).toContainText("60 of 100 days rained");
      await expect(panel).toContainText("-30 percentage-point gap");

      // Switch bucket to 20% via keyboard -> 35% observed (+15 gap, Overconfident)
      const bucket20 = lab.getByRole("button", { name: "20% forecast" });
      await bucket20.focus();
      await page.keyboard.press("Enter");
      await expect(bucket20).toHaveAttribute("aria-pressed", "true");
      await expect(panel).toContainText("35 of 100 days rained");
      await expect(panel).toContainText("+15 percentage-point gap");

      // Switch to App C (Underconfident) -> 20% -> 10% observed
      await lab.getByRole("button", { name: "App C (Underconfident)" }).click();
      await expect(panel).toContainText("10 of 100 days rained");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(panel).toContainText("App C (Underconfident)");
      await expect(panel).toContainText("10 of 100 days rained");

      // Mode 2: Judge the forecast
      await lab.getByRole("button", { name: "2. Judge the forecast" }).click();
      await expect(lab.getByTestId("judge-feedback")).toContainText(
        "Select one calibration label above",
      );

      // Parcel tracker: wrong then right
      await lab.getByRole("button", { name: /Overconfident/ }).click();
      await expect(lab.getByTestId("judge-feedback")).toContainText(
        "79 out of 100 closely matches",
      );
      await lab.getByRole("button", { name: /Well calibrated/ }).click();
      await expect(lab.getByTestId("judge-feedback")).toContainText(
        "Correct. 79% is right next to 80%",
      );

      // Loan-approval tool -> Overconfident
      await lab.getByRole("button", { name: "Loan-approval tool" }).click();
      await lab.getByRole("button", { name: /Overconfident/ }).click();
      await expect(lab.getByTestId("judge-feedback")).toContainText(
        "Correct. The model predicted a 90% chance",
      );

      // Reset returns to Mode 1 App A 90%
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(compareTab).toHaveAttribute("aria-pressed", "true");
      await expect(panel).toContainText("App A (Well calibrated)");
      await expect(panel).toContainText("90 of 100 days rained");

      // Knowledge check: wrong feedback, retry, correct answer
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/more than half of the 100 orders arrived the same day/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("not merely that it is above 50%");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/all 100 orders should have arrived the same day/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "A 90% probability is an estimate, not a guarantee",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/predicted a 90% chance when same-day delivery actually/)
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

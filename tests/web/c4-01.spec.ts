import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-01 supervised learning`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-01");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 01",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of [
        "what-it-is",
        "inputs-and-targets",
        "not-all-ml",
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
      const lab = page.getByTestId("supervised-lab");
      const spotTab = lab.getByRole("button", {
        name: "1. Spot inputs & target",
      });
      await expect(spotTab).toHaveAttribute("aria-pressed", "true");

      // Active button hover contrast check
      await spotTab.hover();
      const hoverColors = await spotTab.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Tab 1: wrong input choice, then correct target choice
      await lab.getByRole("button", { name: /Known sender\?/ }).click();
      await expect(lab.getByTestId("spot-feedback")).toContainText(
        "Known sender? is an input",
      );
      await lab.getByRole("button", { name: /Spam or Not spam/ }).click();
      await expect(lab.getByTestId("spot-feedback")).toContainText(
        "Correct. Spam or Not spam is the target",
      );

      // Switch to Parcel delivery check
      await lab.getByRole("button", { name: "Parcel delivery check" }).click();
      await lab.getByRole("button", { name: /Arrived late/ }).click();
      await expect(lab.getByTestId("spot-feedback")).toContainText(
        "Correct. Arrived late (yes or no) is the target",
      );

      // Tab 2: Trace a new email
      await lab.getByRole("button", { name: "2. Trace a new email" }).click();
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "Prediction: Not spam",
      );

      // Preset: Fake urgent invoice -> Spam
      await lab.getByRole("button", { name: "Fake urgent invoice" }).click();
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "Prediction: Spam",
      );

      // Preset: Club newsletter with unfamiliar link -> Not spam (2 vs 1)
      await lab
        .getByRole("button", { name: "Club newsletter with unfamiliar link" })
        .click();
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "Prediction: Not spam",
      );
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "2 Not spam vs 1 Spam",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "2 Not spam vs 1 Spam",
      );

      // Toggle Urgent payment via keyboard -> Yes/Yes/Yes -> Spam
      const urgentBtn = lab.getByRole("button", { name: /Urgent payment:/ });
      await urgentBtn.focus();
      await page.keyboard.press("Enter");
      await expect(urgentBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("trace-prediction")).toContainText(
        "Prediction: Spam",
      );

      // Reset returns to Tab 1 default
      await lab.getByRole("button", { name: "Reset walk-through" }).click();
      await expect(spotTab).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("spot-feedback")).toContainText(
        "Select one item above",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(
          /Text-message \(SMS\) reminder already sent at prediction time is the target/,
        )
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("supplied to the model");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/shows that all machine learning needs supplied labels/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("not all machine learning");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/though other ML methods work without supplied answers/)
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

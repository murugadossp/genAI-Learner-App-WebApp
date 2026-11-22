import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-05/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-05 self-supervised learning`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-05");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 05",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["no-hand-labels", "two-hiding-tasks"]) {
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
      const lab = page.getByTestId("hide-guess-lab");
      await expect(lab.getByTestId("pair-count")).toContainText(
        "8 single-word masks",
      );
      await expect(lab.getByTestId("model-input")).toContainText(
        "Simmer the soup until the",
      );
      await expect(lab.getByTestId("model-input")).toContainText("feel soft.");

      // Active button hover contrast check
      const activeMode = lab.getByRole("button", { name: "Fill in the blank" });
      await expect(activeMode).toHaveAttribute("aria-pressed", "true");
      await activeMode.hover();
      const hoverColors = await activeMode.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Plausible guess reveals exact self-supplied target
      await lab.getByRole("button", { name: "potatoes" }).click();
      await expect(lab.getByTestId("lab-status")).toContainText(
        "Self-supplied target: “carrots”",
      );
      await expect(lab.getByTestId("lab-status")).toContainText(
        "Fits context, different target",
      );

      // Switch to Predict next word mode
      await lab.getByRole("button", { name: "Predict next word" }).click();
      await expect(lab.getByTestId("pair-count")).toContainText(
        "7 next-word pairs (3 selectable here)",
      );
      await expect(lab.getByTestId("model-input")).toContainText(
        "Later words are hidden from the model",
      );
      await expect(lab.getByTestId("model-input")).not.toContainText("[____]");

      // Exact guess via keyboard
      const exactBtn = lab.getByRole("button", {
        name: "carrots",
        exact: true,
      });
      await exactBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab.getByTestId("lab-status")).toContainText("Exact match");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("pair-count")).toContainText(
        "7 next-word pairs",
      );
      await expect(lab.getByTestId("lab-status")).toContainText("Exact match");

      // Switch preset
      await lab.getByRole("button", { name: "Weather note" }).click();
      await expect(lab.getByTestId("model-input")).toContainText(
        "Pack a raincoat because heavy",
      );

      // Reset lab
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(lab.getByTestId("pair-count")).toContainText(
        "8 single-word masks",
      );
      await expect(lab.getByTestId("lab-status")).toContainText(
        "Waiting for your guess",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/Group similar forecast notes into clusters/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("clustering");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Ask meteorologists to tag each forecast note/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("supervised learning");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Mask one word in each forecast note and check/)
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

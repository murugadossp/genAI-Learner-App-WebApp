import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-09/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-09 choosing the right model for a task`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-09");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 09",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of [
        "leaderboard",
        "capability-speed-cost",
        "context-and-privacy",
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

      // Interactive Scenario Matcher lab
      const lab = page.locator("#matcher");
      const scenario = (n: number) => lab.getByTestId("scenario").nth(n);
      await expect(lab.getByTestId("score")).toContainText("Matched 0 of 6");

      // Task 1 (index 0): wrong choice first, then right choice (Quick-Lite)
      await scenario(0)
        .getByLabel(/Deep-Think/)
        .check();
      await expect(scenario(0).getByTestId("item-feedback")).toContainText(
        "Not a match",
      );
      await expect(scenario(0).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(lab.getByRole("status")).toContainText("under-1-second");
      await expect(lab.getByTestId("score")).toContainText("Matched 0 of 6");

      await scenario(0)
        .getByLabel(/Quick-Lite/)
        .check();
      await expect(scenario(0).getByTestId("item-feedback")).toContainText(
        "Match.",
      );
      await expect(lab.getByTestId("score")).toContainText("Matched 1 of 6");

      // Task 2 (index 1): Deep-Think
      await scenario(1)
        .getByLabel(/Deep-Think/)
        .check();
      await expect(lab.getByTestId("score")).toContainText("Matched 2 of 6");

      // Task 3 (index 2): Long-Read
      await scenario(2)
        .getByLabel(/Long-Read/)
        .check();
      await expect(lab.getByTestId("score")).toContainText("Matched 3 of 6");

      // Task 4 (index 3): Local-Safe
      await scenario(3)
        .getByLabel(/Local-Safe/)
        .check();
      await expect(lab.getByTestId("score")).toContainText("Matched 4 of 6");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("score")).toContainText("Matched 4 of 6");

      // Keyboard navigation within radio group
      await scenario(4)
        .getByLabel(/Quick-Lite/)
        .focus();
      await page.keyboard.press("ArrowDown");
      await expect(scenario(4).getByLabel(/Deep-Think/)).toBeChecked();

      // Reset clears all choices and score
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab.getByTestId("score")).toContainText("Matched 0 of 6");
      await expect(lab.getByTestId("item-feedback")).toHaveCount(0);

      // Knowledge check: wrong feedback, retry, correct answer
      await page.getByLabel(/Use the #1 leaderboard model anyway/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("not data privacy");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/Pick the cheapest cloud model instead/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("hard limits");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/Rule out the cloud-only model/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      // No horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

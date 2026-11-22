import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-10/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-10 deciding what to hand to AI`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-10");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 10",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["three-questions", "three-modes"]) {
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

      // Interactive task sorter lab.
      const lab = page.locator("#sort-lab");
      const task = (n: number) => lab.getByTestId("task").nth(n);

      await expect(lab.getByTestId("score")).toContainText(
        "0 of 6 sorted accurately",
      );

      // Task 1 (index 0): wrong choice first, then right choice.
      await task(0)
        .getByRole("radio", { name: /Do myself/ })
        .check();
      await expect(task(0).getByTestId("item-feedback")).toContainText(
        "Not quite",
      );
      await expect(task(0).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        "feedback-snacks",
      );
      await expect(lab.getByRole("status")).toContainText(
        "Task 1: Snack shopping list",
      );

      await task(0)
        .getByRole("radio", { name: /Hand over/ })
        .check();
      await expect(task(0).getByTestId("item-feedback")).toContainText("Right");
      await expect(lab.getByTestId("score")).toContainText(
        "1 of 6 sorted accurately",
      );

      // Task 2 (index 1): Work together.
      await task(1)
        .getByRole("radio", { name: /Work together/ })
        .check();
      await expect(lab.getByTestId("score")).toContainText(
        "2 of 6 sorted accurately",
      );

      // Task 6 (index 5): Do myself (allergy safety cue).
      await task(5)
        .getByRole("radio", { name: /Do myself/ })
        .check();
      await expect(task(5).getByTestId("item-feedback")).toContainText(
        "cross-contact",
      );
      await expect(lab.getByTestId("score")).toContainText(
        "3 of 6 sorted accurately",
      );

      // Theme switch preserves lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("score")).toContainText(
        "3 of 6 sorted accurately",
      );

      // Keyboard navigation within a task radio group.
      await task(2)
        .getByRole("radio", { name: /Hand over/ })
        .focus();
      await page.keyboard.press("ArrowRight");
      await expect(
        task(2).getByRole("radio", { name: /Work together/ }),
      ).toBeChecked();

      // Reset clears all choices and feedback.
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab.getByTestId("score")).toContainText(
        "0 of 6 sorted accurately",
      );
      await expect(lab.getByTestId("item-feedback")).toHaveCount(0);

      // Knowledge check.
      await page
        .getByLabel(/Hand both tasks to AI so she finishes faster/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("skips the Spanish practice");

      await page.getByRole("button", { name: "Try again" }).click();
      await page
        .getByLabel(/Write the Spanish paragraph herself to practice/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      // Bounded horizontal overflow.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

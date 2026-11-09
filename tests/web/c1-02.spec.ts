import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-02 everyday AI lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-02");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 02",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator("#five-tasks h3")).toHaveText([
        "Predict",
        "Classify",
        "Recommend",
        "Generate",
        "Plan",
      ]);

      // Sorter: wrong, right, change, theme persistence, keyboard, reset.
      const score = page.getByTestId("score");
      const item = (n: number) =>
        page.locator("#sorter li:has(fieldset)").nth(n);
      await expect(score).toContainText("0 of 6");
      await item(2).getByLabel("Generate").check();
      await expect(page.locator("#sorter").getByRole("status")).toContainText(
        "Nothing new is made",
      );
      await expect(item(2).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(item(2).getByTestId("item-feedback")).toContainText(
        "Not quite",
      );
      await item(2).getByLabel("Recommend").check();
      await expect(item(2).getByTestId("item-feedback")).toContainText("Right");
      await item(5).getByLabel("Classify").check();
      await expect(score).toContainText("2 of 6");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(score).toContainText("2 of 6");
      await expect(item(2).getByLabel("Recommend")).toBeChecked();
      await item(0).getByLabel("Predict").focus();
      await page.keyboard.press("ArrowRight");
      await expect(item(0).getByLabel("Classify")).toBeChecked();
      await page
        .locator("#sorter")
        .getByRole("button", { name: "Reset" })
        .click();
      await expect(score).toContainText("0 of 6");
      await expect(page.getByTestId("item-feedback")).toHaveCount(0);

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/It cannot be AI/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("Not quite");
      await expect(quiz).toContainText("only one interface");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/It is recommending/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

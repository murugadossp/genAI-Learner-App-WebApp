import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-01 AI rings lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-01");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 01",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const result = page.getByTestId("result");
      const members = page.getByTestId("membership");
      const status = page.locator(".lab").getByRole("status");

      // Default: classify with hand-written rules is AI only.
      await expect(result).toContainText("Classify with hand-written rules");
      await expect(members.nth(0)).toContainText("Inside");
      await expect(members.nth(1)).toContainText("Outside");
      await expect(page.locator('[data-current="true"]')).toHaveAttribute(
        "data-level",
        "0",
      );

      // A simple learned model is ML but not deep learning.
      await page.getByLabel(/A simple learned model/).check();
      await expect(members.nth(1)).toContainText("Inside");
      await expect(members.nth(2)).toContainText("Outside");
      await expect(result).toContainText("Innermost ring reached: Machine");
      await expect(status).toContainText("Innermost ring: Machine learning");

      // A deep network cannot generate; the generative one can.
      await page.getByLabel(/A deep neural network/).check();
      await page.getByLabel(/Generate/).check();
      await expect(result).toContainText("A poor fit");
      await expect(result).toContainText("next ring");
      await page.getByLabel(/A generative neural network/).check();
      await expect(result).toContainText("A natural fit");
      for (let i = 0; i < 4; i++)
        await expect(members.nth(i)).toContainText("Inside");

      // Theme switch keeps lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(
        page.getByLabel(/A generative neural network/),
      ).toBeChecked();
      await expect(result).toContainText("A natural fit");

      // Reset.
      await page.getByRole("button", { name: "Reset lab" }).click();
      await expect(result).toContainText("Classify with hand-written rules");
      await expect(status).toContainText("Lab reset.");

      // Keyboard: arrow keys move within the approach radio group.
      await page.getByLabel(/Hand-written rules/).focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.getByLabel(/A simple learned model/)).toBeChecked();

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/It is not AI, because nothing/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("Not quite");
      await expect(quiz).toContainText("classic AI");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/It is AI but not machine learning/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

test("chapter 1 course page lists c1-01 and links to it", async ({ page }) => {
  await page.goto("/course/chapter-1");
  await expect(
    page.getByRole("heading", { name: "AI Foundations", level: 1 }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /How AI, ML, deep learning and GenAI/ })
    .click();
  await expect(page).toHaveURL(/\/learn\/genai-basics\/c1-01$/);
  await page.goto("/course");
  await expect(page.locator(".eyebrow").first()).toContainText("Chapter 2");
});

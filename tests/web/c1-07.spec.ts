import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-07/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: responsible AI`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-07");
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      const practice = page.locator("#practice");
      await practice.getByLabel(/include the private attendee names/).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("not needed");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel(/public event name and schedule/).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("Correct");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(practice.getByRole("status")).toContainText("Correct");
      const quiz = page.locator("#check");
      await quiz.getByLabel(/assistant alone/).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz.getByRole("status")).toContainText(
        "still needs to check",
      );
      await quiz.getByRole("button", { name: "Try again" }).click();
      await quiz.getByLabel(/Maya: she checks/).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz.getByRole("status")).toContainText("Correct");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

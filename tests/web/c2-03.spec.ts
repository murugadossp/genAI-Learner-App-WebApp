import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-03/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-03 pretraining lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c2-03");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const rows = page.getByTestId("prob-row");
      await expect(rows.first()).toContainText("Sydney");
      await page.getByRole("button", { name: /Preset B/ }).click();
      await expect(page.getByText(/answer above is unchanged/)).toBeVisible();
      await expect(rows.first()).toContainText("Sydney");
      await page.getByRole("button", { name: /Train toy model/ }).click();
      await expect(rows.first()).toContainText("Canberra");
      await expect(page.getByText(/answer above is unchanged/)).toHaveCount(0);

      await page.getByRole("button", { name: "Clear" }).click();
      await page.getByRole("button", { name: /Train toy model/ }).click();
      await expect(page.getByText(/nothing to say/)).toBeVisible();

      await page.getByRole("button", { name: /Preset B/ }).click();
      await page.getByRole("button", { name: /Train toy model/ }).click();
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(rows.first()).toContainText("Canberra");

      await page.getByLabel(/It searches its training documents/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("does not search");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Its weights were set during training/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

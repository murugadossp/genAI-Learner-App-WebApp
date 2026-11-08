import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-05/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-05 parameters lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c2-05");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const slider = page.getByLabel(/Model size/);
      const trainErr = page.getByTestId("train-err");
      const testErr = page.getByTestId("test-err");
      const weights = page.getByTestId("weights").locator("li");
      const verdict = page.locator("[role=status]").filter({ hasText: /\./ });

      await expect(weights).toHaveCount(3);
      await slider.fill("1");
      await expect(weights).toHaveCount(1);
      await expect(verdict.first()).toContainText("Too small");
      const small = Number(await testErr.innerText());

      await slider.fill("12");
      await expect(weights).toHaveCount(12);
      await expect(trainErr).toHaveText("0.00");
      await expect(verdict.first()).toContainText("Too flexible");
      const big = Number(await testErr.innerText());
      expect(big).toBeGreaterThan(small);

      await slider.fill("4");
      await expect(verdict.first()).toContainText("Close to the best");

      // more data keeps state of the dial and makes size 12 near-harmless
      await page.getByRole("radio", { name: "40 examples" }).check();
      await expect(slider).toHaveValue("4");
      await slider.fill("12");
      await expect(verdict.first()).toContainText("Close to the best");

      // keyboard operation of the dial
      await slider.focus();
      await page.keyboard.press("ArrowLeft");
      await expect(slider).toHaveValue("11");

      // theme change keeps lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(slider).toHaveValue("11");
      await expect(
        page.getByRole("radio", { name: "40 examples" }),
      ).toBeChecked();

      await page.getByRole("button", { name: "Reset" }).click();
      await expect(slider).toHaveValue("3");
      await expect(
        page.getByRole("radio", { name: "12 examples" }),
      ).toBeChecked();

      await page.getByLabel(/Something must be broken/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("capacity, not quality");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Parameters are stored facts/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("not a list of stored facts");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/More parameters add capacity/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

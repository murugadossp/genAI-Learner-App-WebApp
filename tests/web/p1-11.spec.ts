import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-11/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: safe parsing`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-11");
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((section) => section.id));
      for (const section of ["parse", "handle", "validate"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        expect((await picture.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }
      const lab = page.locator("#lab");
      await lab.getByLabel("Sample text").selectOption("three");
      await expect(lab.getByRole("status")).toContainText(
        "range check is skipped",
      );
      await lab.getByLabel("Sample text").selectOption("0");
      await expect(lab.getByRole("status")).toContainText("accept it");
      await lab.getByLabel("Sample text").selectOption("7");
      await expect(lab.getByRole("status")).toContainText("reject it");
      await lab.getByRole("button", { name: "Reset sample" }).click();
      await expect(lab.getByLabel("Sample text")).toHaveValue("3");
      const check = page.locator("#check");
      await expect(check.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await check
        .getByLabel("Conversion raises ValueError, so the handler runs.")
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("can be converted");
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByLabel("Conversion returns 7, then the range check rejects it.")
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("Correct");
      await lab.getByLabel("Sample text").selectOption("0");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByLabel("Sample text")).toHaveValue("0");
      await expect(check.getByRole("status")).toContainText("Correct");
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        )
        .toBe(true);
    });
  }
}

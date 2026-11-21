import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-13/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-13 columns and tables lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-13");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 13",
      );

      // No horizontal overflow at this viewport
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      // All three educational diagrams render with descriptive alt text
      for (const section of ["inspect", "select", "derive"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        const alt = await picture.getAttribute("alt");
        expect(alt?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Quick check 1 in inspect section
      const q1 = page.locator("#inspect .knowledge-check");
      await expect(q1.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q1.getByLabel("(3, 5)", { exact: true }).check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText("reverses the order");
      await q1.getByRole("button", { name: "Try again" }).click();
      await q1.getByLabel("(5, 3)", { exact: true }).check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText("Correct");

      // Quick check 2 in select section
      const q2 = page.locator("#select .knowledge-check");
      await expect(q2.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q2.getByLabel('df["model", "out_tokens"]', { exact: true }).check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("KeyError");
      await q2.getByRole("button", { name: "Try again" }).click();
      await q2
        .getByLabel('df[["model", "out_tokens"]]', { exact: true })
        .check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("Correct");

      // Practice check: wrong feedback, retry, keyboard operation
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice.getByLabel("(5, 4)", { exact: true }).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("not subset");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel("(5, 2)", { exact: true }).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab: Column and Table Workbench
      const lab = page.locator(
        "#lab [role='region'][aria-label='Column and Table Workbench']",
      );
      await expect(lab).toBeVisible();
      await expect(lab).toContainText('df[["model", "in_tokens"]]');
      await expect(lab).toContainText("Result shape: (5, 2)");
      await expect(lab).toContainText("Original df.shape: (5, 3)");

      // Active toggle button hover contrast (WCAG AA >= 4.5:1)
      const inTokensBtn = lab.getByRole("button", {
        name: "in_tokens",
        exact: true,
      });
      await inTokensBtn.hover();
      const ratio = await inTokensBtn.evaluate((el) => {
        const rgb = (s: string) =>
          (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
        const lum = (c: number[]) => {
          const [r, g, b] = c.map((v) => {
            const x = v / 255;
            return x <= 0.03928
              ? x / 12.92
              : Math.pow((x + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const s = getComputedStyle(el);
        const a = lum(rgb(s.color));
        const b = lum(rgb(s.backgroundColor));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio).toBeGreaterThan(4.5);

      // Deselect model via keyboard -> single column Series
      const modelBtn = lab.getByRole("button", { name: "model", exact: true });
      await modelBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab).toContainText('df["in_tokens"]');
      await expect(lab).toContainText("Result: Series (1D)");
      await expect(lab).toContainText("Result shape: (5,)");

      // Toggle bracket style to 1-col DataFrame
      await lab
        .getByRole("button", { name: 'df[["in_tokens"]] (1-col DataFrame)' })
        .click();
      await expect(lab).toContainText('df[["in_tokens"]]');
      await expect(lab).toContainText("Result: DataFrame (2D)");
      await expect(lab).toContainText("Result shape: (5, 1)");

      // Add derived column -> updated df.shape grows to (5, 4)
      await lab
        .getByRole("button", { name: "Add total_tokens column" })
        .click();
      await expect(lab).toContainText("Updated table: df (DataFrame)");
      await expect(lab).toContainText("Updated df.shape: (5, 4)");
      await expect(lab).toContainText("400");

      // Final check: wrong feedback + retry + correct
      const check = page.locator("#check");
      await check
        .getByLabel(
          "It returns a 2D DataFrame with just model and in_tokens.",
          { exact: true },
        )
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("list inside");
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByLabel(
          "It raises a KeyError because pandas looks for a single column labeled ('model', 'in_tokens') instead of a list of two column names.",
          { exact: true },
        )
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("Correct");

      // Theme toggle preserves lab and quiz state
      const themeToggle = page.getByRole("button", {
        name: "Switch color theme",
      });
      await themeToggle.click();
      await expect(lab).toContainText("Updated df.shape: (5, 4)");
      await expect(check.getByRole("status")).toContainText("Correct");

      // Reset lab restores (5, 3) and default 2-column selection
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab).toContainText("Original df.shape: (5, 3)");
      await expect(lab).toContainText('df[["model", "in_tokens"]]');
    });
  }
}

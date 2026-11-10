import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-07/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-07 if-else lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-07");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 07",
      );

      // The three concept images render and have descriptive alt text
      for (const section of ["first", "order", "boundary"]) {
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

      // Boundary practice: wrong feedback, retry, keyboard
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice.getByLabel("Nothing is printed", { exact: true }).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("always");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel("send_summary", { exact: true }).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Completion check: the test that makes 200 or more use send_summary
      const complete = page.locator("#complete");
      await complete.getByLabel("tokens_left >= 200", { exact: true }).check();
      await complete.getByRole("button", { name: "Check answer" }).click();
      await expect(complete.getByRole("status")).toContainText("Correct");

      // Lab: slider and presets change the branch that runs
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();
      const action = lab.getByTestId("action-result");
      await expect(action).toHaveText("send_summary");
      await lab.getByRole("button", { name: "1000", exact: true }).click();
      await expect(action).toHaveText("send_full_history");
      await lab.getByRole("button", { name: "999", exact: true }).click();
      await expect(action).toHaveText("send_summary");
      await lab.getByRole("button", { name: "199", exact: true }).click();
      await expect(action).toHaveText("start_new_chat");

      // Active preset hover contrast (WCAG AA >= 4.5:1)
      const active = lab.getByRole("button", { name: "199", exact: true });
      await active.hover();
      const contrast = () =>
        active.evaluate((el) => {
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
      // Poll: the preset background transitions for 0.15s after the click.
      await expect.poll(contrast).toBeGreaterThan(4.5);

      // Slider moves the value and the highlighted branch
      await lab.getByLabel(/tokens_left \(invented value\)/).focus();
      await page.keyboard.press("End");
      await expect(action).toHaveText("send_full_history");

      // Final check: loosest-first chain on 1500
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel("start_new_chat", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("else branch");
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel("send_summary", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // Theme toggle keeps lab and quiz state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(action).toHaveText("send_full_history");
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // No horizontal overflow on the page
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

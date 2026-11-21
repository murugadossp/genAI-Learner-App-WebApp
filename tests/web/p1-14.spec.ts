import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-14/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-14 filtering rows lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-14");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 14",
      );

      // No horizontal overflow at this viewport
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      // Each of the three educational diagrams renders with descriptive alt text
      for (const section of ["mask", "filter", "combine"]) {
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

      // Quick check 1 in mask section
      const q1 = page.locator("#mask .knowledge-check");
      await expect(q1.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q1
        .getByLabel("A filtered DataFrame containing only rows 1, 3, and 4.", {
          exact: true,
        })
        .check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText("pass the mask");
      await q1.getByRole("button", { name: "Try again" }).click();
      await q1
        .getByLabel("A pandas Series of True and False values (one per row).", {
          exact: true,
        })
        .check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText("Correct");

      // Quick check 2 in filter section
      const q2 = page.locator("#filter .knowledge-check");
      await expect(q2.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q2
        .getByLabel("3 rows, because the False rows were deleted from df.", {
          exact: true,
        })
        .check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("does not delete");
      await q2.getByRole("button", { name: "Try again" }).click();
      await q2
        .getByLabel(
          "5 rows, because df[...] returns a new DataFrame and leaves df unchanged.",
          { exact: true },
        )
        .check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("Correct");

      // Practice check: wrong feedback, retry, keyboard navigation
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice
        .getByLabel("p2 and p5 (rows 1 and 4)", { exact: true })
        .check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("status is");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel("p5 only (row 4)", { exact: true }).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab: Row Filter Lab interactions
      const lab = page.locator(
        "#lab [role='region'][aria-label='Row Filter Lab']",
      );
      await expect(lab).toBeVisible();
      await expect(lab).toContainText('mask = df["tokens"] > 20');
      await expect(lab).toContainText("3 True, 2 False");

      // Switch to Apply df[mask] view via keyboard
      const applyBtn = lab.getByRole("button", { name: "Apply df[mask]" });
      await applyBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab).toContainText('filtered = df[df["tokens"] > 20]');
      await expect(lab).toContainText("3 rows kept (index 1, 3, 4)");
      await expect(lab).toContainText("Original df: still 5 rows");

      // Active button hover contrast (WCAG AA >= 4.5:1)
      await applyBtn.hover();
      const ratio = await applyBtn.evaluate((el) => {
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

      // Enable Combine with & -> tokens > 20 & status == "ok" -> 2 rows (1, 3)
      await lab.getByRole("button", { name: "Combine with &" }).click();
      await expect(lab).toContainText(
        'filtered = df[(df["tokens"] > 20) & (df["status"] == "ok")]',
      );
      await expect(lab).toContainText("2 rows kept (index 1, 3)");

      // Test 0-row empty DataFrame case: model == "gemini" & status == "timeout"
      await lab.getByRole("button", { name: 'model == "gemini"' }).click();
      await lab.getByRole("button", { name: 'status == "timeout"' }).click();
      await expect(lab).toContainText("0 rows matched (empty DataFrame)");
      await expect(lab).toContainText("Original df: still 5 rows");

      // Final check: wrong feedback + retry + correct
      const check = page.locator("#check");
      await check
        .getByLabel('df[df["tokens"] > 20 and df["status"] == "ok"]', {
          exact: true,
        })
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("ValueError");
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByLabel('df[(df["tokens"] > 20) & (df["status"] == "ok")]', {
          exact: true,
        })
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("Correct");

      // Theme toggle preserves both lab state and quiz state
      const themeToggle = page.getByRole("button", {
        name: "Switch color theme",
      });
      await themeToggle.click();
      await expect(lab).toContainText("0 rows matched (empty DataFrame)");
      await expect(check.getByRole("status")).toContainText("Correct");

      // Reset lab restores initial single-condition mask view
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab).toContainText('mask = df["tokens"] > 20');
      await expect(lab).toContainText("3 True, 2 False");
    });
  }
}

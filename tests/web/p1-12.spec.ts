import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-12/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-12 introduction to pandas lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-12");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 12",
      );

      // No horizontal overflow at this viewport
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      // Each of the three educational diagrams renders with descriptive alt text
      for (const section of ["table", "column", "summary"]) {
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

      // Quick check q1 in table section
      const q1 = page.locator("#table .knowledge-check");
      await expect(q1.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q1
        .getByLabel("A single Python list containing 100 tokens.", {
          exact: true,
        })
        .check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText(
        "A DataFrame is a 2D table",
      );
      await q1.getByRole("button", { name: "Try again" }).click();
      await q1
        .getByLabel(
          "A 2D table with rows indexed 0 to 4 and columns named 'prompt_id', 'model', and 'tokens'.",
          {
            exact: true,
          },
        )
        .check();
      await q1.getByRole("button", { name: "Check answer" }).click();
      await expect(q1.getByRole("status")).toContainText("Correct");

      // Quick check q2 in column section: wrong feedback + retry
      const q2 = page.locator("#column .knowledge-check");
      await expect(q2.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await q2.getByLabel("df[tokens]", { exact: true }).check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("NameError");
      await q2.getByRole("button", { name: "Try again" }).click();
      await q2.getByLabel('df["tokens"]', { exact: true }).check();
      await q2.getByRole("button", { name: "Check answer" }).click();
      await expect(q2.getByRole("status")).toContainText("Correct");

      // Practice check in practice section: wrong feedback, retry, keyboard
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice.getByLabel("100", { exact: true }).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("not the mean");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel("20.0", { exact: true }).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab: verify interactive mode toggling and loop step-through
      const lab = page.locator(
        "#lab [role='region'][aria-label='Prompt Log Analyzer']",
      );
      await expect(lab).toBeVisible();

      // Check pandas 1-step mode displays sum
      await expect(lab).toContainText('df["tokens"].sum()');
      await expect(lab).toContainText("100");

      // Toggle to .mean() via keyboard
      const meanBtn = lab.getByRole("button", { name: ".mean()" });
      await meanBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab).toContainText('df["tokens"].mean()');
      await expect(lab).toContainText("20.0");

      // Active button hover contrast (WCAG AA >= 4.5:1)
      await meanBtn.hover();
      const ratio = await meanBtn.evaluate((el) => {
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

      // Switch to manual loop walkthrough
      await lab
        .getByRole("button", { name: "Manual loop walkthrough" })
        .click();
      await expect(lab).toContainText("total = 0");

      // Step through full 6-step .mean() loop walkthrough
      await lab.getByRole("button", { name: "Start loop →" }).click();
      await expect(lab).toContainText("total = 10");
      await lab
        .getByRole("button", { name: "Next step (row 2 of 5) →" })
        .click();
      await expect(lab).toContainText("total = 30");
      await lab
        .getByRole("button", { name: "Next step (row 3 of 5) →" })
        .click();
      await lab
        .getByRole("button", { name: "Next step (row 4 of 5) →" })
        .click();
      await lab
        .getByRole("button", { name: "Next step (row 5 of 5) →" })
        .click();
      await expect(lab).toContainText("total = 100");
      await lab
        .getByRole("button", { name: "Divide total by count →" })
        .click();
      await expect(lab).toContainText("average = 20.0");

      // Final check: wrong feedback + retry + correct
      const check = page.locator("#check");
      await check
        .getByLabel("A for loop cannot add numbers in Python.", { exact: true })
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("can add numbers");
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByLabel(
          "It expresses the whole-column total in one concise call without writing loop and accumulator boilerplate.",
          {
            exact: true,
          },
        )
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText("Correct");

      // Theme toggle preserves both lab state and quiz state
      const themeToggle = page.getByRole("button", {
        name: "Switch color theme",
      });
      await themeToggle.click();
      await expect(lab).toContainText("average = 20.0");
      await expect(check.getByRole("status")).toContainText("Correct");

      // Reset lab returns to step 0
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab).toContainText("total = 0");
    });
  }
}

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-06/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-06 dictionaries lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-06");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 06",
      );

      // Verify all 5 conceptual diagrams
      for (const section of [
        "pairs",
        "missing",
        "changing",
        "nested",
        "choosing",
      ]) {
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

      // Practice check: wrong feedback, retry, keyboard
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice
        .getByLabel('len(ticket) == 2, ticket["topic"] == "refund"', {
          exact: true,
        })
        .check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("misspelt");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice
        .getByLabel('len(ticket) == 3, ticket["topic"] == "billing"', {
          exact: true,
        })
        .focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();
      const result = lab.getByTestId("read-result");
      await expect(result).toHaveText("'billing'");

      // Active button hover contrast (WCAG AA >= 4.5:1)
      const active = lab.getByRole("button", { name: "'topic'" });
      await active.hover();
      const ratio = await active.evaluate((el) => {
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

      // Panel 1: missing key read
      await lab
        .getByRole("button", { name: "'assignee'", exact: true })
        .click();
      await expect(result).toHaveText("KeyError: 'assignee'");
      await lab
        .getByRole("button", { name: "ticket.get(key)", exact: true })
        .click();
      await expect(result).toHaveText("None");
      await lab
        .getByRole("button", {
          name: "ticket.get(key, 'unassigned')",
          exact: true,
        })
        .click();
      await expect(result).toHaveText("'unassigned'");
      await expect(lab.getByTestId("default-note")).toContainText(
        "Nothing was stored or modified",
      );

      // Panel 2: writes and shared state
      const len = lab.getByTestId("ticket-len");
      await expect(len).toHaveText("3");
      await lab
        .getByRole("button", {
          name: "ticket['priority'] = 'low'",
          exact: true,
        })
        .click();
      await expect(len).toHaveText("3");
      await lab
        .getByRole("button", {
          name: "ticket['assignee'] = 'Sam'",
          exact: true,
        })
        .click();
      await expect(len).toHaveText("4");

      // Verify shared state: now reading assignee in Panel 1 succeeds with 'Sam'!
      await lab
        .getByRole("button", { name: "ticket[key]", exact: true })
        .click();
      await expect(result).toHaveText("'Sam'");

      // Typo write
      await lab
        .getByRole("button", { name: "ticket['priorty'] = 'low'", exact: true })
        .click();
      await expect(len).toHaveText("5");
      await expect(lab).toContainText("'priorty': 'low'");

      // Panel 3: nested inspector
      const nestedResult = lab.getByTestId("nested-result");
      await expect(nestedResult).toHaveText("'pro'");
      await lab
        .getByRole("button", { name: "nested_ticket['plan']", exact: true })
        .click();
      await expect(nestedResult).toHaveText("KeyError: 'plan'");

      // Theme toggle keeps lab and quiz state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(len).toHaveText("5");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Reset restores 3 base pairs
      await lab.getByRole("button", { name: "Reset ticket" }).click();
      await expect(len).toHaveText("3");

      // Final check
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel('run_config["temp"]', { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("KeyError: 'temp'");
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();
      await quiz
        .getByLabel('run_config["params"]["temp"]', { exact: true })
        .check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // No horizontal overflow on page and comparison table
      const tableWrap = page.locator("#choosing div").first();
      expect(
        await tableWrap.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBeTruthy();

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-08/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-08 loops lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-08");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 08",
      );

      // Each of the three diagrams renders with descriptive alt text
      for (const section of ["visit", "stop", "while"]) {
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
        .getByLabel("sent (one line only)", { exact: true })
        .check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText(
        "does not stop at the first item",
      );
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice
        .getByLabel("sent and sent (two lines)", { exact: true })
        .focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab: plain loop prints every parcel, one pass per press
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();
      const output = lab.getByTestId("lab-output");
      const message = lab.getByTestId("lab-message");
      await expect(output).toHaveText("nothing yet");
      await lab.getByRole("button", { name: "Next item →" }).click();
      await expect(output).toHaveText("sent");
      await expect(lab.getByTestId("chip-0")).toContainText("printed");
      await expect(lab.getByTestId("chip-1")).toContainText("next");

      // Active button hover contrast (WCAG AA >= 4.5:1)
      const active = lab.getByRole("button", { name: "Plain loop" });
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

      // Break mode stops at lost; the parcels after it are never visited
      await lab.getByRole("button", { name: "Break at lost" }).click();
      await expect(output).toHaveText("nothing yet");
      await lab.getByRole("button", { name: "Next item →" }).click();
      await lab.getByRole("button", { name: "Next item →" }).click();
      await expect(lab.getByTestId("chip-1")).toContainText("break");
      await expect(message).toContainText("the loop ends here");
      await expect(
        lab.getByRole("button", { name: "Next item →" }),
      ).toBeDisabled();
      await expect(lab.getByTestId("chip-4")).toContainText("not visited");
      await expect(output).toHaveText("sent");

      // Count mode: the count changes only on sent passes
      await lab.getByRole("button", { name: "Count sent" }).click();
      const count = lab.getByTestId("lab-count");
      await expect(count).toHaveText("0");
      for (let i = 0; i < 5; i++) {
        await lab.getByRole("button", { name: "Next item →" }).click();
      }
      await expect(count).toHaveText("3");
      await expect(message).toContainText("print(count) would show 3");

      // Continue mode: returned is skipped, the last sent still prints
      await lab.getByRole("button", { name: "Continue past returned" }).click();
      for (let i = 0; i < 5; i++) {
        await lab.getByRole("button", { name: "Next item →" }).click();
      }
      await expect(output).toHaveText("sent, lost, sent, sent");
      await expect(lab.getByTestId("chip-3")).toContainText("skipped");

      // Reset returns the belt to the start
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(output).toHaveText("nothing yet");

      // Final check: the count quiz
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel("'sent'", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText(
        "never holds the text",
      );
      await quiz.getByRole("button", { name: "Try again" }).click();
      await quiz.getByLabel("2", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // Theme toggle keeps the lab's state
      await lab.getByRole("button", { name: "Count sent" }).click();
      await lab.getByRole("button", { name: "Next item →" }).click();
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("chip-0")).toContainText("counted");

      // No horizontal overflow on the page or the belt
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      const belt = page.locator("#lab ol[aria-label]");
      expect(
        await belt.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBeTruthy();
    });
  }
}

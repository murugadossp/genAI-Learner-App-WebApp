import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-05/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-05 training vs inference`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-05");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 05",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Diagram highlights the focused phase.
      await expect(
        page.locator("#training").getByTestId("phase-training"),
      ).toContainText("In focus");
      await expect(
        page.locator("#training").getByTestId("phase-inference"),
      ).not.toContainText("In focus");

      // Lab.
      const lab = page.locator("#lab");
      const log = lab.getByTestId("log-entry");
      await lab.getByRole("button", { name: "1. Tag email 1" }).click();
      await expect(log.last()).toContainText("delivery (wrong");
      await lab.getByRole("button", { name: "2. Tag email 1 with" }).click();
      await expect(log.last()).toContainText("billing (right)");
      await expect(lab.getByTestId("settings")).toContainText("v1");
      await lab.getByRole("button", { name: "3. Tag email 2" }).click();
      await expect(log.last()).toContainText("delivery (wrong");
      await lab.getByRole("button", { name: "4. Train v2" }).click();
      await expect(lab.getByTestId("settings")).toContainText("v2");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("settings")).toContainText("v2");
      await lab.getByRole("button", { name: "3. Tag email 2" }).click();
      await expect(log.last()).toContainText("billing (right)");
      await expect(lab.getByRole("status")).toContainText("billing");
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab.getByTestId("settings")).toContainText("v1");
      await expect(log).toHaveCount(0);

      // Sorter.
      const score = page.getByTestId("score");
      const item = (n: number) => page.locator("#sort li:has(fieldset)").nth(n);
      await expect(score).toContainText("0 of 5");
      await item(2).getByLabel("Training").check();
      await expect(item(2).getByTestId("item-feedback")).toContainText(
        "Not quite",
      );
      await expect(item(2).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(page.locator("#sort").getByRole("status")).toContainText(
        "only part of this request",
      );
      await item(2).getByLabel("Inference").check();
      await expect(item(2).getByTestId("item-feedback")).toContainText("Right");
      await item(0).getByLabel("Training").check();
      await expect(score).toContainText("2 of 5");
      await item(1).getByLabel("Inference").focus();
      await page.keyboard.press("ArrowUp");
      await expect(item(1).getByLabel("Training")).toBeChecked();
      await page
        .locator("#sort")
        .getByRole("button", { name: "Reset" })
        .click();
      await expect(score).toContainText("0 of 5");
      await expect(page.getByTestId("item-feedback")).toHaveCount(0);

      // Quiz.
      await page.getByLabel(/The model forgot/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("no learned change to forget");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/only input to one request/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

test("c1-05: active lab button keeps contrast on hover", async ({ page }) => {
  await page.goto("/learn/genai-basics/c1-05");
  const btn = page.locator("#lab").getByRole("button", { name: "Reset" });
  await btn.hover();
  const [bg, fg] = await btn.evaluate((el) => {
    const s = getComputedStyle(el);
    return [s.backgroundColor, s.color];
  });
  expect(bg).not.toBe(fg);
});

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-03/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-03 data, features and labels lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-03");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 03",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Concept practice: wrong then right.
      const ex = page.locator("#example");
      await ex.getByLabel("Four: one for each column.").check();
      await expect(ex.getByTestId("task-feedback")).toContainText("Not quite");
      await expect(ex.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await ex.getByLabel("Five: one for each row.").check();
      await expect(ex.getByTestId("task-feedback")).toContainText("Right");
      const lab = page.locator("#label");
      await lab.getByLabel("Cherry", { exact: true }).check();
      await expect(lab.getByTestId("task-feedback")).toContainText("Right");

      // Lab: goal A, wrong, right, goal B, state kept, theme persistence.
      const labEl = page.locator("#lab");
      const score = labEl.getByTestId("score");
      const col = (name: string) =>
        labEl.locator("fieldset", { hasText: `Column: ${name}` });
      await expect(score).toContainText("0 of 4");
      await col("Fruit").getByLabel("Feature (clue)").check();
      await expect(
        col("Fruit").locator("..").getByTestId("item-feedback"),
      ).toContainText("Not quite");
      await col("Fruit").getByLabel("Label (answer)").check();
      await col("Colour").getByLabel("Feature (clue)").check();
      await expect(score).toContainText("2 of 4");
      await labEl.getByLabel("Goal B: guess the fruit’s size").check();
      await expect(labEl.getByTestId("goal-text")).toContainText("Goal B");
      await expect(score).toContainText("0 of 4");
      await col("Fruit").getByLabel("Feature (clue)").check();
      await expect(
        col("Fruit").locator("..").getByTestId("item-feedback"),
      ).toContainText("In Goal A");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await labEl.getByLabel("Goal A: name the fruit").check();
      await expect(score).toContainText("2 of 4");
      await expect(col("Fruit").getByLabel("Label (answer)")).toBeChecked();
      await labEl.getByRole("button", { name: "Reset this goal" }).click();
      await expect(score).toContainText("0 of 4");

      // New case practice.
      const nc = page.locator("#new-case");
      await nc.getByLabel("Lemon").check();
      await expect(nc.getByTestId("task-feedback")).toContainText("1 point");
      await nc.getByLabel("Banana").check();
      await expect(nc.getByTestId("task-feedback")).toContainText("2 points");

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/Hours slept, because/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("Not quite");
      await expect(quiz).toContainText("clue we would use");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Arrived late, because/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-04/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-04 model is not the app`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-04");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 04",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator("#around-it h3")).toHaveText([
        "Interface",
        "Data source",
        "Tool",
      ]);

      // Trace: step through, back, reset, theme persistence.
      const trace = page.locator("#trace");
      const step = trace.getByTestId("trace-step");
      await expect(step).toContainText("Step 1 of 6");
      await expect(trace.getByTestId("part-interface")).toContainText("In use");
      await trace.getByRole("button", { name: "Next →" }).click();
      await expect(step).toContainText("The model guesses the plant");
      await expect(trace.getByTestId("part-model")).toContainText("In use");
      await expect(trace.getByTestId("part-interface")).not.toContainText(
        "In use",
      );
      await expect(trace.getByRole("status")).toContainText("tomato plant");
      await trace.getByRole("button", { name: "Next →" }).click();
      await trace.getByRole("button", { name: "Next →" }).click();
      await trace.getByRole("button", { name: "Next →" }).click();
      await expect(trace.getByTestId("part-appcode")).toContainText("In use");
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(step).toContainText("Step 5 of 6");
      await trace.getByRole("button", { name: "Next →" }).click();
      await expect(
        trace.getByRole("button", { name: "Next →" }),
      ).toBeDisabled();
      await trace.getByRole("button", { name: "← Back" }).click();
      await expect(step).toContainText("Step 5 of 6");
      await trace.getByRole("button", { name: "Reset" }).click();
      await expect(step).toContainText("Step 1 of 6");

      // Sorter: wrong, right, change, keyboard, reset.
      const score = page.getByTestId("score");
      const item = (n: number) =>
        page.locator("#which-part li:has(fieldset)").nth(n);
      await expect(score).toContainText("0 of 6");
      await item(3).getByLabel("Data source").check();
      await expect(item(3).getByTestId("item-feedback")).toContainText(
        "Not quite",
      );
      await expect(item(3).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(
        page.locator("#which-part").getByRole("status"),
      ).toContainText("outside service");
      await item(3).getByLabel("Tool").check();
      await expect(item(3).getByTestId("item-feedback")).toContainText("Right");
      await item(4).getByLabel("Tool").check();
      await expect(item(4).getByTestId("item-feedback")).toContainText(
        "Here, it is Leaf Buddy’s plant model",
      );
      await item(4).getByLabel("Model").check();
      await item(1).getByLabel("Model").check();
      await expect(score).toContainText("3 of 6");
      await item(0).getByLabel("Model").focus();
      await page.keyboard.press("ArrowRight");
      await expect(item(0).getByLabel("Interface")).toBeChecked();
      await page
        .locator("#which-part")
        .getByRole("button", { name: "Reset" })
        .click();
      await expect(score).toContainText("0 of 6");
      await expect(page.getByTestId("item-feedback")).toHaveCount(0);

      // Quiz.
      await page.getByLabel(/The model, the part/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("named the cactus correctly");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/The data source, the stored/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

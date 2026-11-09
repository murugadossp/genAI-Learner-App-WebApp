import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-01 variables and data types lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-01");

      // Verify sections render in exact order matching meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify eyebrow displays Python for AI / Lesson 01
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 01",
      );

      // Verify memory model illustration loads with valid alt text
      const diagram = page.locator("article figure img");
      await expect(diagram).toHaveCount(1);
      await diagram.scrollIntoViewIfNeeded();
      await expect
        .poll(() => diagram.evaluate((e: HTMLImageElement) => e.naturalWidth))
        .toBeGreaterThan(0);
      expect(
        ((await diagram.getAttribute("alt")) ?? "").length,
      ).toBeGreaterThan(40);

      // Verify lab container exists
      const lab = page.getByRole("region", {
        name: "Interactive Python Type Sandbox",
      });
      await expect(lab).toBeVisible();

      // Initial state: max_tokens = 500 (int)
      await expect(lab).toContainText("max_tokens = 500");
      await expect(lab).toContainText("<class 'int'>");
      await expect(lab.locator('[role="status"]')).toContainText("600");

      // Operation test: click '+ "100" (text)' -> raises TypeError
      await lab.getByRole("button", { name: '+ "100" (text)' }).click();
      await expect(lab.locator('[role="status"]')).toContainText("TypeError");

      // Operation test: click Check with isinstance -> valid
      await lab.getByRole("button", { name: "Check with isinstance" }).click();
      await expect(lab.locator('[role="status"]')).toContainText(
        "Illustrative check: True",
      );

      // Toggle quote wrapping: turns 500 into "500" (str)
      const quoteToggle = lab.getByLabel(/Wrap in quotes/);
      await quoteToggle.check();
      await expect(lab).toContainText('max_tokens = "500"');
      await expect(lab).toContainText("<class 'str'>");
      await expect(lab).toContainText("'500'");
      await expect(lab.locator('[role="status"]')).toContainText(
        "Illustrative check failed",
      );

      // With string wrapping, concatenation works
      await lab.getByRole("button", { name: '+ "100" (text)' }).click();
      await expect(lab.locator('[role="status"]')).toContainText('"500100"');

      // Switch preset to temperature
      await lab.getByRole("button", { name: "temperature" }).click();
      await expect(lab).toContainText("temperature = 0.7");
      await expect(lab).toContainText("<class 'float'>");
      await lab.getByRole("button", { name: "* 2 (scale)" }).click();
      await expect(lab.locator('[role="status"]')).toContainText("1.4");

      // Switch preset to stream
      await lab.getByRole("button", { name: "stream" }).click();
      await expect(lab).toContainText("stream = True");
      await expect(lab).toContainText("<class 'bool'>");
      await lab.getByRole("button", { name: 'bool("False") gotcha' }).click();
      await expect(lab.locator('[role="status"]')).toContainText(
        "Result: True!",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab).toContainText("stream = True");
      await expect(lab).toContainText("<class 'bool'>");

      // Reset lab
      await lab.getByRole("button", { name: "↺ Reset Sandbox" }).click();
      await expect(lab).toContainText("max_tokens = 500");
      await expect(lab).toContainText("<class 'int'>");

      // Knowledge check: initially disabled
      const quiz = page.locator(".knowledge-check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer →" });
      await expect(checkBtn).toBeDisabled();

      // Wrong answer
      await quiz
        .getByLabel(/automatically converts numeric strings into integers/)
        .check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      const quizStatus = quiz.getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("strongly typed");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Correct answer
      await quiz.getByLabel(/Python raises a TypeError/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Correct");

      // Check course link
      await expect(
        page.locator("a", { hasText: "Next up: Operators in Chapter P1 →" }),
      ).toHaveAttribute("href", "/course?chapter=P1");

      // Bounded horizontal scroll check
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

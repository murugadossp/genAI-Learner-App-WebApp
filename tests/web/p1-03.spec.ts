import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-03/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-03 strings lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-03");

      // Verify sections render in exact order matching meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify eyebrow displays Python for AI / Lesson 03
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 03",
      );

      // Verify infographic image loads with valid alt text (>40 chars)
      const diagram = page.locator("article figure img");
      await expect(diagram).toHaveCount(1);
      await diagram.scrollIntoViewIfNeeded();
      await expect
        .poll(() => diagram.evaluate((e: HTMLImageElement) => e.naturalWidth))
        .toBeGreaterThan(0);
      expect(
        ((await diagram.getAttribute("alt")) ?? "").length,
      ).toBeGreaterThan(40);

      // Verify pipeline visual exists
      const pipelineVisual = page.locator(
        'div[aria-label="String Processing Pipeline Diagram"]',
      );
      await expect(pipelineVisual).toBeVisible();
      await expect(pipelineVisual).toContainText("Stage 1");
      await expect(pipelineVisual).toContainText("Stage 2");
      await expect(pipelineVisual).toContainText("Stage 3");
      await expect(pipelineVisual).toContainText("Stage 4");

      // Verify sandbox exists
      const lab = page.locator(
        'div[aria-label="Interactive AI String Processing Sandbox"]',
      );
      await expect(lab).toBeVisible();

      // Initial state: Customer Support preset
      await expect(lab).toContainText("Name tag: raw_query");
      await expect(lab).toContainText("raw_query UNCHANGED in memory");
      await expect(lab).toContainText("User: Alex");
      await expect(lab).toContainText("refund for order no. 881");

      // Verify active button maintains high contrast on hover without falling back to panel background
      const activePresetBtn = lab.getByRole("button", {
        name: "Customer Support",
      });
      await activePresetBtn.hover();
      const activeBg = await activePresetBtn.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      const labBg = await lab.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      expect(activeBg).not.toBe(labBg);

      // Switch to Doc Summarization preset
      await lab.getByRole("button", { name: "Doc Summarization" }).click();
      await expect(lab).toContainText("User: DocBot");
      await expect(lab).toContainText("summary: ai hallucination warning.");

      // Test toggle: Uncheck strip -> leading/trailing spaces remain in Doc Summarization
      const stripToggle = lab.getByLabel(/Apply .strip\(\)/);
      await stripToggle.uncheck();
      await expect(lab).toContainText(
        "   summary: ai hallucination warning.   ",
      );

      // Re-enable strip
      await stripToggle.check();

      // Switch to Token Log preset and verify .replace() executes cleanly
      await lab.getByRole("button", { name: "Token Log" }).click();
      await expect(lab).toContainText("User: Analyst");
      await expect(lab).toContainText("count=1202");

      // Test toggle: Uncheck 'f' prefix -> missing 'f' warning banner appears
      const fToggle = lab.getByLabel(/Include f prefix/);
      await fToggle.uncheck();
      await expect(lab).toContainText("Warning: Missing 'f' prefix!");
      await expect(lab).toContainText("User: {user_id}");
      await expect(lab).toContainText("Query: {clean_query}");

      // Test toggle: Preview .split()
      const splitToggle = lab.getByLabel(/Preview .split\(\)/);
      await splitToggle.check();
      await expect(lab).toContainText("Tokenized Word List");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab).toContainText("Warning: Missing 'f' prefix!");

      // Reset sandbox
      await lab.getByRole("button", { name: "Reset sandbox" }).click();
      await expect(lab).toContainText("User: Alex");
      await expect(lab).toContainText("refund for order no. 881");

      // Knowledge check: initially disabled
      const quiz = page.locator(".knowledge-check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer →" });
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 1: Assumes mutability
      await quiz.getByLabel(/Process: refund for order #881/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      const quizStatus = quiz.getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("strings in Python are immutable");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 2: Assumes literal braces
      await quiz.getByLabel(/Process: \{raw_query\}/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("The f prefix");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Correct answer: Unchanged raw string with original spaces and uppercase D
      await quiz.getByLabel(/Process:\s+RefunD for Order #881/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Correct");
      await expect(quizStatus).toContainText("Strings in Python are immutable");

      // Check course link
      await expect(
        page.locator("a", { hasText: "Next up: Lists in Chapter P1 →" }),
      ).toHaveAttribute("href", "/course/chapter-p1");

      // Bounded horizontal scroll check
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

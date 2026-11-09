import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-02 operators lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-02");

      // Verify sections render in exact order matching meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify eyebrow displays Python for AI / Lesson 02
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 02",
      );

      // Verify visual chunking figure has descriptive accessible text (>40 chars)
      const figure = page.locator("figure[aria-label]");
      await expect(figure).toBeVisible();
      const figureLabel = (await figure.getAttribute("aria-label")) ?? "";
      expect(figureLabel.length).toBeGreaterThan(40);
      await expect(figure).toContainText("Chunk 1 (500)");
      await expect(figure).toContainText("Chunk 2 (500)");
      await expect(figure).toContainText("Remainder (350)");

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

      // Verify lab container exists
      const lab = page.getByRole("region", {
        name: "AI Pipeline Operator Sandbox",
      });
      await expect(lab).toBeVisible();

      // Verify initial state: 1350 tokens, chunks tab active
      await expect(lab).toContainText("Total: 1350 tokens");
      await expect(lab).toContainText("1350 / 500 = 2.70");
      await expect(lab).toContainText("1350 // 500 = 2");
      await expect(lab).toContainText("1350 % 500 = 350");

      // Verify active button maintains high contrast on hover without falling back to panel background
      const activePresetBtn = lab.getByRole("button", {
        name: "Standard Document (1350 tokens)",
      });
      await activePresetBtn.hover();
      const activeBg = await activePresetBtn.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      const labBg = await lab.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      expect(activeBg).not.toBe(labBg);

      // Test stepper: Increase tokens by 100 -> 1450
      await lab
        .getByRole("button", { name: "Increase total tokens by 100" })
        .click();
      await expect(lab).toContainText("Total: 1450 tokens");
      await expect(lab).toContainText("1450 // 500 = 2");
      await expect(lab).toContainText("1450 % 500 = 450");

      // Test float toggle: turns 1450 into 1450.0 (float)
      const floatToggle = lab.getByRole("button", {
        name: "Toggle float total tokens",
      });
      await floatToggle.click();
      await expect(lab).toContainText("Total: 1450.0 tokens");
      await expect(lab).toContainText("1450.0 // 500 = 2.0");

      // Test Mode 2: Powers vs XOR
      await lab.getByRole("tab", { name: "Powers vs XOR (** vs ^)" }).click();
      await expect(lab).toContainText("2 ** 10 = 1024");
      await expect(lab).toContainText("2 ^ 10 = 8");
      await expect(lab).toContainText("Bitwise XOR");

      // Click another exponent (2 ** 8)
      await lab.getByRole("button", { name: "2 ** 8 (256)" }).click();
      await expect(lab).toContainText("2 ** 8 = 256");

      // Test Mode 3: Thresholds & Equality
      await lab
        .getByRole("tab", { name: "Thresholds & Equality (== vs =)" })
        .click();
      await expect(lab).toContainText("<= (Less or equal)");
      await expect(lab).toContainText("== (Equality check)");
      await expect(lab).toContainText("<class 'bool'>");

      // Test Mode 4: Boolean Guards
      await lab
        .getByRole("tab", { name: "Boolean Guards (and, or, not)" })
        .click();
      await expect(lab).toContainText("Guard 1 (and)");
      await expect(lab).toContainText("Guard 2 (or)");
      await expect(lab).toContainText("Guard 3 (not)");
      await expect(lab).toContainText("Short-circuiting");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab).toContainText("Guard 1 (and)");

      // Reset sandbox
      await lab.getByRole("button", { name: "Reset sandbox" }).click();
      await expect(lab).toContainText("Total: 1350 tokens");
      await expect(lab).toContainText("1350 // 500 = 2");

      // Knowledge check: initially disabled
      const quiz = page.locator(".knowledge-check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer →" });
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 1: 1350 // 500
      await quiz.getByLabel(/leftover = 1350 \/\/ 500/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      const quizStatus = quiz.getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText(
        "Floor division (//) computes the number of complete chunks",
      );

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 2: 1350 ^ 500 (bitwise XOR)
      await quiz.getByLabel(/leftover = 1350 \^ 500/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("1202");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Correct answer: 1350 % 500
      await quiz.getByLabel(/leftover = 1350 % 500/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Correct");
      await expect(quizStatus).toContainText("modulo operator (%)");

      // Check course link
      await expect(
        page.locator("a", { hasText: "Next up: Strings in Chapter P1 →" }),
      ).toHaveAttribute("href", "/course/chapter-p1");

      // Bounded horizontal scroll check
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

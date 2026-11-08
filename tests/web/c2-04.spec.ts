import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-04/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-04 base model to assistant lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );

      await page.goto("/learn/genai-basics/c2-04");

      // Verify sections render in exact order specified in meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Lab interaction: Scenario 1
      const optionBCard = page.getByTestId("option-B");
      await optionBCard
        .getByRole("button", { name: /Choose Option B as Assistant/ })
        .click();
      await page.getByRole("button", { name: "Check guess" }).click();

      const labStatus = page.locator("[role='status']").first();
      await expect(labStatus).toContainText("Correct! Option B");
      await expect(optionBCard).toContainText("Instruction-Tuned Assistant");

      // Test reset and incorrect guess
      await page
        .locator("#lab")
        .getByRole("button", { name: "Try again" })
        .click();
      const optionACard = page.getByTestId("option-A");
      await optionACard
        .getByRole("button", { name: /Choose Option A as Assistant/ })
        .click();
      await page.getByRole("button", { name: "Check guess" }).click();
      await expect(labStatus).toContainText("Not quite! Option B");

      // Test Prompt Wrapper toggle
      await page.getByRole("button", { name: "Try prompt wrapper" }).click();
      const wrapperPanel = page.getByTestId("wrapper-panel");
      await expect(wrapperPanel).toBeVisible();
      await expect(wrapperPanel).toContainText(
        "You are a helpful AI assistant",
      );

      // Test Turn Tokens toggle
      await page.getByRole("button", { name: "Inspect turn tokens" }).click();
      const tokensPanel = page.getByTestId("tokens-panel");
      await expect(tokensPanel).toBeVisible();
      await expect(tokensPanel).toContainText("<|start_header_id|>");

      // Test scenario switching (Scenario 2: Python dictionary)
      await page.getByRole("button", { name: /2\. Python dictionary/ }).click();
      await expect(
        page.getByText("Explain what a Python dictionary is in one sentence"),
      ).toBeVisible();
      const newOptionACard = page.getByTestId("option-A");
      await newOptionACard
        .getByRole("button", { name: /Choose Option A as Assistant/ })
        .click();
      await page.getByRole("button", { name: "Check guess" }).click();
      await expect(page.locator("[role='status']").first()).toContainText(
        "Correct! Option A",
      );

      // Verify theme toggle doesn't wipe state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.locator("[role='status']").first()).toContainText(
        "Correct! Option A",
      );

      // Knowledge check test
      // 1. Wrong answer
      await page
        .getByLabel(/Because base models can only generate numbers and code/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText(
        "Base models produce natural language fluently",
      );

      // 2. Retry and correct answer
      await page
        .locator("#check")
        .getByRole("button", { name: "Try again" })
        .click();
      await page
        .getByLabel(
          /Because a prompt prefix only adds more context to complete/,
        )
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // No horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

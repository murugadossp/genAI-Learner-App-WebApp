import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-06/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-06 reinforcement learning`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-06");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 06",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["loop", "delayed-rewards", "reward-not-correct"]) {
        const illustration = page.locator(`#${section} figure img`);
        await illustration.scrollIntoViewIfNeeded();
        expect(
          (await illustration.getAttribute("alt"))?.length,
        ).toBeGreaterThan(40);
        await expect
          .poll(() =>
            illustration.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive greenhouse grid lab
      const lab = page.getByTestId("greenhouse-lab");
      await expect(lab.getByTestId("step-count")).toHaveText("0 / 10 steps");
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: 0");
      await expect(lab.getByTestId("seedling-status")).toHaveText(
        "Seedling: Dry",
      );

      // Active mode button hover contrast check
      const goalModeBtn = lab.getByRole("button", {
        name: "Goal reward (delayed)",
      });
      await expect(goalModeBtn).toHaveAttribute("aria-pressed", "true");
      await goalModeBtn.hover();
      const hoverColors = await goalModeBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Manual step in Goal reward mode
      await lab.getByRole("button", { name: "Down" }).click();
      await expect(lab.getByTestId("step-count")).toHaveText("1 / 10 steps");
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: 0");

      // Show Pip's example run in Goal reward mode
      await lab.getByRole("button", { name: "Show Pip’s example run" }).click();
      await expect(lab.getByTestId("step-count")).toHaveText("5 / 10 steps");
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: +10");
      await expect(lab.getByTestId("seedling-status")).toHaveText(
        "Seedling: Watered",
      );
      await expect(lab.getByTestId("lab-status")).toContainText("step 5");

      // Switch to Flawed tap bonus (+4) mode
      const tapModeBtn = lab.getByRole("button", {
        name: "Flawed tap bonus (+4)",
      });
      await tapModeBtn.click();
      await expect(tapModeBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("step-count")).toHaveText("0 / 10 steps");

      // Hover contrast check on newly active mode button
      await tapModeBtn.hover();
      const tapHoverColors = await tapModeBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(tapHoverColors.bg).not.toBe(tapHoverColors.fg);
      expect(tapHoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(tapHoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Show Pip's example run in Flawed tap bonus mode (+20, seedling dry)
      await lab.getByRole("button", { name: "Show Pip’s example run" }).click();
      await expect(lab.getByTestId("step-count")).toHaveText("10 / 10 steps");
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: +20");
      await expect(lab.getByTestId("seedling-status")).toHaveText(
        "Seedling: Still dry",
      );
      await expect(lab.getByTestId("lab-status")).toContainText("stays dry");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: +20");
      await expect(lab.getByTestId("seedling-status")).toHaveText(
        "Seedling: Still dry",
      );

      // Keyboard Reset
      const resetBtn = lab.getByRole("button", { name: "Reset" });
      await resetBtn.focus();
      await page.keyboard.press("Enter");
      await expect(lab.getByTestId("step-count")).toHaveText("0 / 10 steps");
      await expect(lab.getByTestId("total-reward")).toHaveText("Reward: 0");
      await expect(lab.getByTestId("seedling-status")).toHaveText(
        "Seedling: Dry",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/The robot broke its reward rule/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("followed the reward rule");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Reinforcement learning cannot work unless/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("delayed rewards");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/A high score shows what the reward rule favors/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

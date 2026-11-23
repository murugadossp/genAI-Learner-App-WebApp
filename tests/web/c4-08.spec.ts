import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-08/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-08 knowledge, rules and reasoning`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-08");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 08",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify all three explainer images load with descriptive alt text
      for (const section of [
        "facts-and-rules",
        "knowledge-graphs",
        "hybrids",
      ]) {
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

      // Interactive lab: starts on Almond Croissant with both rules enabled
      const lab = page.getByTestId("rule-chain-lab");
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "Flagged: Contains tree nuts",
      );
      await expect(lab.getByTestId("trace-steps")).toContainText(
        "Almond Croissant contains Almonds",
      );

      // Active preset button hover contrast check
      const croissantBtn = lab.getByRole("button", {
        name: "Almond Croissant",
        exact: true,
      });
      await expect(croissantBtn).toHaveAttribute("aria-pressed", "true");
      await croissantBtn.hover();
      const hoverColors = await croissantBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Remove a stored fact to break the chain
      const pasteFactBtn = lab.getByRole("button", {
        name: /Almond Paste — made from → Almonds/,
      });
      await pasteFactBtn.click();
      await expect(pasteFactBtn).toHaveAttribute("aria-pressed", "false");
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "No tree-nut flag from the available facts",
      );
      await expect(lab.getByTestId("trace-steps")).toContainText(
        "Rule A stopped",
      );

      // Restore fact, then disable Rule A via keyboard
      await pasteFactBtn.click();
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "Flagged: Contains tree nuts",
      );
      const ruleABtn = lab.getByRole("button", {
        name: /Rule A: Unpack/,
      });
      await ruleABtn.focus();
      await page.keyboard.press("Enter");
      await expect(ruleABtn).toHaveAttribute("aria-pressed", "false");
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "No tree-nut flag from the available facts",
      );

      // Walnut Brownie still flags even with Rule A off (direct fact)
      await lab
        .getByRole("button", { name: "Walnut Brownie", exact: true })
        .click();
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "Flagged: Contains tree nuts",
      );

      // Theme toggle preserves lab state (Walnut Brownie + Rule A off)
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "Flagged: Contains tree nuts",
      );
      await expect(ruleABtn).toHaveAttribute("aria-pressed", "false");

      // Oat Muffin with Rule A back on: derives Oats, stays unflagged
      await ruleABtn.click();
      await lab
        .getByRole("button", { name: "Oat Muffin", exact: true })
        .click();
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "No tree-nut flag from the available facts",
      );
      await expect(lab.getByTestId("trace-steps")).toContainText(
        "Oat Muffin contains Oats",
      );

      // Reset restores Almond Croissant + flagged
      await lab.getByRole("button", { name: "Reset rule engine" }).click();
      await expect(lab.getByTestId("engine-verdict")).toHaveText(
        "Flagged: Contains tree nuts",
      );
      await expect(croissantBtn).toHaveAttribute("aria-pressed", "true");

      // Knowledge check: wrong feedback, retry, and correct answer
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/A learned language model given instructions/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "without a separate record-backed rule gate",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/A fixed-choice web form paired/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "misses the requirement to let patients make requests in everyday language",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/A hybrid system where a learned model interprets/)
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

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-04/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-04 updating beliefs with evidence`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-04");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 04",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["starting-belief", "rare-events"]) {
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

      // Interactive Test-result calculator
      const lab = page.getByTestId("test-result-lab");
      const rarePreset = lab.getByRole("button", { name: "Rare blight (1%)" });
      await expect(rarePreset).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("posterior-readout")).toHaveText("8.3%");
      await expect(lab.getByTestId("second-test-readout")).toContainText(
        "45.0%",
      );

      // Active preset button hover contrast check
      await rarePreset.hover();
      const hoverColors = await rarePreset.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Switch to Damp corner (20%) -> 69.2%
      await lab.getByRole("button", { name: "Damp corner (20%)" }).click();
      await expect(lab.getByTestId("posterior-readout")).toHaveText("69.2%");
      await expect(lab.getByTestId("lab-summary")).toContainText(
        "180 true positives out of 260 total positive tests",
      );

      // Switch to Stricter test (1% false alarm) -> 47.6%
      await lab
        .getByRole("button", { name: "Stricter test (1% false alarm)" })
        .click();
      await expect(lab.getByTestId("posterior-readout")).toHaveText("47.6%");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("posterior-readout")).toHaveText("47.6%");

      // Switch to Even split (50%) via keyboard -> 90.0%
      const evenBtn = lab.getByRole("button", { name: "Even split (50%)" });
      await evenBtn.focus();
      await page.keyboard.press("Enter");
      await expect(evenBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("posterior-readout")).toHaveText("90.0%");

      // Reset returns to Rare blight (1%) -> 8.3%
      await lab.getByRole("button", { name: "Reset calculator" }).click();
      await expect(rarePreset).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("posterior-readout")).toHaveText("8.3%");

      // Knowledge check: wrong options, retry, then correct option
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/There is an 80% chance the latch is worn/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("detection rate");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/The positive flag adds no useful information/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("narrows 1,000 locks down to 107");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/The latch is still more likely fine than worn/)
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

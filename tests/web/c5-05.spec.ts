import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-05/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-05 training, validation and test sets`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-05");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 05",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["why-split", "reusing-test"]) {
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

      // Interactive lab
      const lab = page.getByTestId("split-lab");
      const assignTab = lab.getByRole("button", {
        name: "1. Assign examples to splits",
      });
      await expect(assignTab).toHaveAttribute("aria-pressed", "true");

      // Active button hover contrast check
      await assignTab.hover();
      const hoverColors = await assignTab.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Mode 1: Presets and individual reassignment
      await expect(lab.getByTestId("split-feedback")).toContainText(
        "All three roles are covered",
      );
      await lab
        .getByRole("button", { name: "All in training (10 / 0 / 0)" })
        .click();
      await expect(lab.getByTestId("split-feedback")).toContainText(
        "Test is empty",
      );

      await lab
        .getByRole("button", { name: "Only On-time in test (6 / 2 / 2)" })
        .click();
      await expect(lab.getByTestId("split-feedback")).toContainText(
        "misses Late loans entirely",
      );

      // Keyboard reassign Loan #8 (Late) to Test -> fixes test balance
      const loan8TestBtn = lab.getByRole("button", {
        name: "Assign Loan #8 to Test",
      });
      await loan8TestBtn.focus();
      await page.keyboard.press("Enter");
      await expect(loan8TestBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("split-feedback")).toContainText(
        "All three roles are covered",
      );

      // Mode 2: Proper check vs reusing test
      await lab
        .getByRole("button", { name: "2. Proper check vs reusing test" })
        .click();
      await lab
        .getByRole("button", { name: "Run final Test check once" })
        .click();
      await expect(lab.getByTestId("workflow-scores")).toContainText("85%");
      await lab
        .getByRole("button", { name: "Reveal next month’s new loans" })
        .click();
      await expect(lab.getByTestId("workflow-scores")).toContainText("83%");

      // Switch to Reusing the test set
      await lab
        .getByRole("button", { name: "Reusing the test set (tune on Test)" })
        .click();
      await lab
        .getByRole("button", { name: "Reveal next month’s new loans" })
        .click();
      await expect(lab.getByTestId("workflow-scores")).toContainText("95%");
      await expect(lab.getByTestId("workflow-scores")).toContainText("70%");

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("workflow-feedback")).toContainText(
        "dropped to 70%",
      );

      // Reset returns to Mode 1 balanced default
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(assignTab).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("split-feedback")).toContainText(
        "All three roles are covered",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/300-day log is far too small/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("not the size of the log");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/fitted the model on the validation set/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("instead of the validation set");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/turns it into a tuning set/).check();
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

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-01 collecting representative data`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-01");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 01",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["who-it-serves", "more-data-myth"]) {
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
      const lab = page.getByTestId("sample-audit-lab");
      const auditTab = lab.getByRole("button", {
        name: "1. Find the missing group",
      });
      await expect(auditTab).toHaveAttribute("aria-pressed", "true");

      // Active button hover contrast check
      await auditTab.hover();
      const hoverColors = await auditTab.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Mode 1: wrong choice then correct missing setting in bus helper
      await lab.getByRole("button", { name: /Quiet indoor hall/ }).click();
      await expect(lab.getByTestId("audit-feedback")).toContainText(
        "most heavily covered setting",
      );
      await lab.getByRole("button", { name: /Rainy outdoor stop/ }).click();
      await expect(lab.getByTestId("audit-feedback")).toContainText(
        "Correct. Rainy outdoor stop has 0 clips",
      );

      // Switch to School Homework Helper and find the scarce group via keyboard
      await lab.getByRole("button", { name: "School Homework Helper" }).click();
      const adultBtn = lab.getByRole("button", {
        name: /Adult evening learners/,
      });
      await adultBtn.focus();
      await page.keyboard.press("Enter");
      await expect(adultBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("audit-feedback")).toContainText(
        "Correct. Adult evening learners (18+) have only 8 essays",
      );

      // Mode 2: Test "more data"
      await lab.getByRole("button", { name: /2\. Test/ }).click();
      await expect(lab.getByTestId("strategy-summary")).toContainText(
        "1 of 4 settings present (1,000 total clips)",
      );

      await lab
        .getByRole("button", { name: "Add 9,000 office clips (10,000 total)" })
        .click();
      await expect(lab.getByTestId("strategy-summary")).toContainText(
        "1 of 4 settings present (10,000 total clips)",
      );

      await lab
        .getByRole("button", { name: "Add 600 targeted clips (1,600 total)" })
        .click();
      await expect(lab.getByTestId("strategy-summary")).toContainText(
        "4 of 4 settings present (1,600 total clips)",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("strategy-summary")).toContainText(
        "4 of 4 settings present (1,600 total clips)",
      );

      // Reset returns to Mode 1 default
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(auditTab).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("audit-feedback")).toContainText(
        "Select one group above",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/20,000 records is too small in total size/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Total count alone");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/matches its exact city census share/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("exact census percentages");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/leaving print and non-adult borrowers out/)
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

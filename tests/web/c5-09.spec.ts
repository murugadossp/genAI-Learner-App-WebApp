import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-09/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    throw new Error(`Could not parse RGB color: ${color}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(parseRgb(fg));
  const l2 = relativeLuminance(parseRgb(bg));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-09 data leakage and misleading results`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-09");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 09",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      // Section order matches meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Both explainer images render with descriptive alt text (>40 chars)
      for (const section of [
        "target-leakage",
        "duplicates-and-prep",
        "preprocessing",
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

      // Interactive lab: Case 1 active by default
      const lab = page.getByTestId("leak-inspector-lab");
      const case1Btn = lab.getByRole("button", {
        name: "Case 1: Refund column",
        exact: true,
      });
      await expect(case1Btn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("offline-score")).toHaveText("97%");
      await expect(lab.getByTestId("live-score")).toHaveText("61%");
      await expect(lab.getByTestId("score-gap-badge")).toHaveText(
        "36-point offline/live score gap",
      );
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 0 of 4 cases",
      );

      // WCAG >= 4.5:1 hover contrast check on active case button
      await case1Btn.hover();
      const caseHoverColors = await case1Btn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(
        contrastRatio(caseHoverColors.fg, caseHoverColors.bg),
      ).toBeGreaterThanOrEqual(4.5);

      // Wrong diagnosis first, then correct diagnosis + Apply the fix
      const prepOpt = lab.getByRole("button", {
        name: /Preprocessing leakage/,
      });
      await prepOpt.click();
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "Not quite",
      );

      const targetOpt = lab.getByRole("button", {
        name: /Target leakage \(future clue\)/,
      });
      await targetOpt.focus();
      await page.keyboard.press("Enter");
      await expect(targetOpt).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "Correct",
      );
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 1 of 4 cases",
      );

      // WCAG >= 4.5:1 hover contrast check on active diagnosis option button
      await targetOpt.hover();
      const optHoverColors = await targetOpt.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(
        contrastRatio(optHoverColors.fg, optHoverColors.bg),
      ).toBeGreaterThanOrEqual(4.5);

      // Apply the fix and confirm score drops toward live score
      await lab.getByRole("button", { name: /Apply the fix/ }).click();
      await expect(lab.getByTestId("offline-score")).toHaveText("73%");
      await expect(lab.getByTestId("live-score")).toHaveText("72%");
      await expect(lab.getByTestId("fixed-summary")).toContainText(
        "Removed Customer delay refund issued",
      );

      // Switch to Case 2 and diagnose Duplicate / group overlap
      await lab
        .getByRole("button", { name: "Case 2: Duplicate rows", exact: true })
        .click();
      await expect(lab.getByTestId("offline-score")).toHaveText("93%");
      await lab
        .getByRole("button", { name: /Duplicate \/ group overlap/ })
        .click();
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 2 of 4 cases",
      );

      // Diagnose preparation and a clean pipeline from the facts, not the gap.
      await lab
        .getByRole("button", { name: "Case 3: Full-table prep", exact: true })
        .click();
      await expect(lab.getByTestId("offline-score")).toHaveText("79%");
      await lab.getByRole("button", { name: /Preprocessing leakage/ }).click();
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "The problem is the pipeline order",
      );
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "not leakage-safe even if its scores happened to be close",
      );

      await lab
        .getByRole("button", { name: "Case 4: Clean split", exact: true })
        .click();
      await lab
        .getByRole("button", { name: /No leakage — honest split/ })
        .click();
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "follows the stated leakage checks",
      );
      await expect(lab.getByTestId("diagnosis-feedback")).toContainText(
        "that gap alone does not prove an estimate is fair",
      );
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 4 of 4 cases",
      );

      // Theme toggle preserves lab state
      const expectedNextTheme = theme === "light" ? "dark" : "light";
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedNextTheme,
      );
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 4 of 4 cases",
      );

      // Reset inspector restores Case 1 and 0 audited
      await lab.getByRole("button", { name: "Reset inspector" }).click();
      await expect(lab.getByTestId("offline-score")).toHaveText("97%");
      await expect(lab.getByTestId("audited-count")).toContainText(
        "Audited: 0 of 4 cases",
      );

      // Knowledge check: wrong feedback, retry, and correct answer
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/A small dataset automatically inflated/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "A small dataset can make an estimate uncertain",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/A duplicate order copy landed/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Duplicate overlap can affect");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Target leakage: the after-cancellation survey/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();

      // Theme persistence across reload (remove initScript override effect by testing saved localStorage)
      const savedTheme = await page.evaluate(() =>
        localStorage.getItem("genai-theme"),
      );
      expect(savedTheme).toBe(expectedNextTheme);
    });
  }

test("theme preference persists across page reload", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/learn/genai-basics/c5-09");
  await page.evaluate(() => localStorage.setItem("genai-theme", "light"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page
    .getByRole("button", { name: "Switch color theme" })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

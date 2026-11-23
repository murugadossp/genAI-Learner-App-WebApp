import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-08/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Unable to parse RGB color: ${color}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(parseRgb(fg));
  const l2 = relativeLuminance(parseRgb(bg));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-08 lesson and interaction`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await page.evaluate((initialTheme) => {
        localStorage.setItem("genai-theme", initialTheme);
      }, theme);
      await page.goto("/learn/genai-basics/c5-08");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 08",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");
      const sectionIds = await page
        .locator("article section[id]")
        .evaluateAll((sections) => sections.map((section) => section.id));
      expect(sectionIds).toEqual(meta.sections.map((section) => section.id));

      const expectedAlt = [
        [
          "15 correct",
          "20 total",
          "75%",
          "5 fraud missed",
          "Analogy",
          "Quiet days can hide a missed fire",
          "Key takeaways",
          "Overall score counts every case",
          "Rare cases can be hidden",
          "Check which errors occurred",
        ],
        [
          "Actual: Fraud",
          "Actual: Legitimate",
          "Predicted: Flagged",
          "Predicted: Allowed",
          "True positive",
          "False negative",
          "False positive",
          "True negative",
          "4 caught",
          "1 missed",
          "3 false alarms",
          "12 cleared",
          "Analogy",
          "A smoke alarm catches smoke",
          "Key takeaways",
          "Rows show what happened",
          "Columns show the prediction",
          "Errors have different costs",
        ],
        [
          "Precision",
          "Among flagged",
          "4 caught",
          "7 flagged",
          "57%",
          "Recall",
          "Among actual fraud",
          "5 actual",
          "80%",
          "A net gathers fish",
          "Analogy",
          "Key takeaways",
          "Precision checks alerts",
          "Recall checks cases found",
          "Both count caught cases",
        ],
      ];
      const imageSections = [
        "accuracy-trap",
        "confusion-matrix",
        "precision-and-recall",
      ];
      for (const [index, sectionId] of imageSections.entries()) {
        const image = page.locator(`#${sectionId} figure img`);
        await image.scrollIntoViewIfNeeded();
        const alt = await image.getAttribute("alt");
        expect(alt?.length).toBeGreaterThan(40);
        for (const label of expectedAlt[index]) {
          expect(alt).toContain(label);
        }
        await expect
          .poll(() =>
            image.evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      const lab = page.getByTestId("threshold-lab");
      await expect(lab.getByTestId("threshold-value")).toHaveText("Cutoff: 50");
      await expect(lab.getByTestId("metric-accuracy")).toContainText("80%");
      await expect(lab.getByTestId("metric-precision")).toContainText("57%");
      await expect(lab.getByTestId("metric-recall")).toContainText("80%");
      await expect(lab.getByTestId("cell-tp")).toContainText("4");
      await expect(lab.getByTestId("cell-fp")).toContainText("3");
      await expect(lab.getByTestId("cell-fn")).toContainText("1");
      await expect(lab.getByTestId("cell-tn")).toContainText("12");

      const low = lab.getByRole("button", { name: "Low (30)" });
      await low.click();
      await low.hover();
      await expect(low).toHaveAttribute("aria-pressed", "true");
      const lowColors = await low.evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, foreground: style.color };
      });
      expect(
        contrastRatio(lowColors.foreground, lowColors.background),
      ).toBeGreaterThanOrEqual(4.5);
      await expect(lab.getByTestId("threshold-value")).toHaveText("Cutoff: 30");
      await expect(lab.getByTestId("metric-recall")).toContainText("100%");
      await expect(lab.getByTestId("metric-precision")).toContainText("45%");
      await expect(lab.getByTestId("cell-fp")).toContainText("6");

      const high = lab.getByRole("button", { name: "High (70)" });
      await high.focus();
      await page.keyboard.press("Enter");
      await expect(high).toHaveAttribute("aria-pressed", "true");
      await high.hover();
      const highColors = await high.evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, foreground: style.color };
      });
      expect(
        contrastRatio(highColors.foreground, highColors.background),
      ).toBeGreaterThanOrEqual(4.5);
      await expect(lab.getByTestId("metric-precision")).toContainText("75%");
      await expect(lab.getByTestId("metric-recall")).toContainText("60%");

      const slider = lab.getByRole("slider", { name: /Decision threshold/ });
      await slider.fill("90");
      await expect(lab.getByTestId("threshold-value")).toHaveText("Cutoff: 90");
      await expect(lab.getByTestId("metric-precision")).toContainText("100%");
      await expect(lab.getByTestId("metric-recall")).toContainText("20%");

      const expectedToggledTheme = theme === "light" ? "dark" : "light";
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedToggledTheme,
      );
      await expect(lab.getByTestId("threshold-value")).toHaveText("Cutoff: 90");
      await lab.getByRole("button", { name: "Reset threshold" }).click();
      await expect(lab.getByTestId("threshold-value")).toHaveText("Cutoff: 50");

      const quiz = page.locator(".knowledge-check");
      const quizStatus = quiz.getByRole("status");
      await quiz.getByRole("radio", { name: /Accuracy,/ }).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("accuracy look strong");
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(quizStatus).toBeEmpty();
      await quiz.getByRole("radio", { name: /Recall,/ }).check();
      await quiz.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedToggledTheme,
      );
    });
  }
}

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-07/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Could not parse color: ${color}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  const first = relativeLuminance(parseRgb(fg));
  const second = relativeLuminance(parseRgb(bg));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c5-07 lesson and lab`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-07");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 07",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const sectionIds = await page
        .locator("article section[id]")
        .evaluateAll((elements) => elements.map((element) => element.id));
      expect(sectionIds).toEqual(meta.sections.map((section) => section.id));

      for (const sectionId of ["good-fit", "diagnosing-the-gap"]) {
        const image = page.locator(`#${sectionId} figure img`);
        await image.scrollIntoViewIfNeeded();
        expect((await image.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            image.evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
          )
          .toBe(true);
        const alt = await image.getAttribute("alt");
        expect(alt).toContain("Analogy");
        expect(alt).toContain("Key takeaways");
      }

      const lab = page.getByTestId("curve-fit-lab");
      const overfitButton = lab.getByRole("button", {
        name: "Too flexible (Overfit)",
        exact: true,
      });
      const revealButton = lab.getByRole("button", {
        name: /unseen validation days/i,
      });
      await expect(overfitButton).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("train-error")).toHaveText("0.0 scoops");
      await expect(lab.getByTestId("val-error")).toHaveText("Hidden");

      await revealButton.focus();
      await page.keyboard.press("Enter");
      await expect(revealButton).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("val-error")).not.toHaveText("Hidden");

      for (const button of await lab
        .locator('button[aria-pressed="true"]')
        .all()) {
        await button.hover();
        const colors = await button.evaluate((element) => {
          const style = getComputedStyle(element);
          return { background: style.backgroundColor, foreground: style.color };
        });
        expect(
          contrastRatio(colors.foreground, colors.background),
        ).toBeGreaterThanOrEqual(4.5);
      }

      const goodButton = lab.getByRole("button", {
        name: "Balanced (Good fit)",
        exact: true,
      });
      await goodButton.click();
      await expect(goodButton).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("lab-diagnosis")).toContainText(
        "Good fit — captures the pattern",
      );

      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(goodButton).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("val-error")).not.toHaveText("Hidden");
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        theme === "light" ? "dark" : "light",
      );

      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(overfitButton).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("val-error")).toHaveText("Hidden");

      const quiz = page.locator("#check");
      const quizStatus = quiz.getByRole("status");
      const answers = [
        {
          label:
            "Underfitting: the curve is too simple to match even the training days.",
          feedback:
            "Underfitting would usually have large errors on training and validation examples.",
        },
        {
          label:
            "A good fit: matching every training day proves it learned the pattern.",
          feedback:
            "A close training match alone does not prove generalisation.",
        },
        {
          label:
            "No conclusion: validation examples should be added to training first.",
          feedback:
            "Adding validation examples to training removes this held-back check.",
        },
      ];
      for (const answer of answers) {
        await quiz.getByLabel(answer.label).check();
        await quiz.getByRole("button", { name: /Check answer/ }).click();
        await expect(quizStatus).toContainText(answer.feedback);
        await quiz.getByRole("button", { name: "Try again" }).click();
      }

      await quiz
        .getByLabel(
          "Overfitting: the training match did not carry over to held-back days.",
        )
        .check();
      await quiz.getByRole("button", { name: /Check answer/ }).click();
      await expect(quizStatus).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

test("theme choice persists across reload on c5-07", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/learn/genai-basics/c5-07");
  const initialTheme = await page.evaluate(
    () =>
      document.documentElement.getAttribute("data-theme") ??
      localStorage.getItem("genai-theme") ??
      "light",
  );
  const nextTheme = initialTheme === "dark" ? "light" : "dark";
  await page
    .getByRole("button", { name: "Switch color theme" })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", nextTheme);
});

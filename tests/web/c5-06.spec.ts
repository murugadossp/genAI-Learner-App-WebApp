import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-06/meta.json";

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
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
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
    test(`${width}px ${theme}: c5-06 loss measuring prediction errors`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c5-06");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 06",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify all three explainer images load with descriptive alt text
      for (const section of ["what-is-loss", "mae-vs-mse", "loss-vs-outcome"]) {
        const illustration = page.locator(`#${section} figure img`);
        await illustration.scrollIntoViewIfNeeded();
        const alt = (await illustration.getAttribute("alt")) ?? "";
        expect(alt.length).toBeGreaterThan(40);
        expect(alt).toContain("Analogy");
        expect(alt).toContain("Key takeaways");
        await expect
          .poll(() =>
            illustration.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive lab: starts at 4.0 min/km with MAE active
      const lab = page.getByTestId("loss-slider-lab");
      await expect(lab.getByText(/Illustrative toy dataset/)).toBeVisible();
      await expect(lab.getByTestId("slope-readout")).toHaveText("4.0 min/km");
      await expect(lab.getByTestId("mae-score")).toContainText("4.4 min");
      await expect(lab.getByTestId("mse-score")).toContainText("96.8 min²");

      // Active button hover contrast check (WCAG AA >= 4.5:1)
      const maeBtn = lab.getByRole("button", {
        name: "MAE (absolute error)",
        exact: true,
      });
      await expect(maeBtn).toHaveAttribute("aria-pressed", "true");
      const expectActiveButtonContrast = async () => {
        const pressed = lab.locator('button[aria-pressed="true"]');
        for (const button of await pressed.all()) {
          await button.hover();
          const colors = await button.evaluate((el) => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, fg: cs.color };
          });
          expect(contrastRatio(colors.fg, colors.bg)).toBeGreaterThanOrEqual(
            4.5,
          );
        }
      };
      await expectActiveButtonContrast();

      // Switch to MSE and jump to Best MSE (6.0)
      const mseBtn = lab.getByRole("button", {
        name: "MSE (squared error)",
        exact: true,
      });
      await mseBtn.click();
      await expect(mseBtn).toHaveAttribute("aria-pressed", "true");
      await expectActiveButtonContrast();

      const bestMseBtn = lab.getByRole("button", {
        name: "Best MSE (6.0)",
        exact: true,
      });
      await bestMseBtn.click();
      await expect(lab.getByTestId("slope-readout")).toHaveText("6.0 min/km");
      await expectActiveButtonContrast();
      await expect(lab.getByTestId("mae-score")).toContainText("6.4 min");
      await expect(lab.getByTestId("mse-score")).toContainText("52.8 min²");
      await expect(lab.getByTestId("loss-insight")).toContainText(
        "MSE hits its lowest value (52.8)",
      );

      // Keyboard adjustment on slider
      const slider = lab.getByRole("slider");
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(lab.getByTestId("slope-readout")).toHaveText("6.5 min/km");

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
      await expect(lab.getByTestId("slope-readout")).toHaveText("6.5 min/km");
      await expect(mseBtn).toHaveAttribute("aria-pressed", "true");

      // Reset restores 4.0 min/km and MAE
      await lab.getByRole("button", { name: "Reset line" }).click();
      await expect(lab.getByTestId("slope-readout")).toHaveText("4.0 min/km");
      await expect(lab.getByTestId("mae-score")).toContainText("4.4 min");
      await expect(maeBtn).toHaveAttribute("aria-pressed", "true");

      // Knowledge check: wrong feedback, retry, and correct answer
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/Model A is automatically the better choice/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "treats an arrival predicted 4 minutes early the same as one predicted 4 minutes late",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/Model B must have been scored with MSE/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "A protective buffer can increase MAE",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/A lower loss score reflects a closer average fit/)
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

test("c5-06 theme toggle persists across reload", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => {
    if (!localStorage.getItem("genai-theme")) {
      localStorage.setItem("genai-theme", "light");
    }
  });
  await page.goto("/learn/genai-basics/c5-06");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Switch color theme" })
    .first()
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

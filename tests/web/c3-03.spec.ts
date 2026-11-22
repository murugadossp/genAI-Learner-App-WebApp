import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-03/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Unexpected color format: ${color}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(
  c1: [number, number, number],
  c2: [number, number, number],
): number {
  const l1 = relativeLuminance(c1);
  const l2 = relativeLuminance(c2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-03 system instructions and roles`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );

      await page.goto("/learn/genai-basics/c3-03");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 03",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Conceptual diagrams load and carry descriptive alt text.
      const figures = page.locator(
        "#system-instructions figure, #roles figure",
      );
      await expect(figures).toHaveCount(2);
      for (const img of await figures.locator("img").all()) {
        await img.scrollIntoViewIfNeeded();
        expect((await img.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            img.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Instruction lab: presets, hover contrast, rule-pushing slip, theme persistence, reset.
      const lab = page.getByTestId("instruction-lab");
      const resetBtn = lab.getByRole("button", { name: "Reset" });
      await expect(resetBtn).toBeDisabled();
      await expect(lab.getByTestId("simulated-reply")).toContainText(
        "commuter bikes",
      );

      const mechanicBtn = lab.getByRole("button", {
        name: "Mechanic role + rules",
      });
      await mechanicBtn.click();
      await expect(mechanicBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("assembled-system")).toContainText(
        "friendly bike mechanic",
      );
      await expect(lab.getByTestId("simulated-reply")).toContainText(
        "Lift the chain back onto the front gear ring",
      );
      await expect(lab.getByRole("status")).toContainText(
        "Mechanic role plus rules",
      );

      // Verify active button maintains strong contrast when hovered.
      await mechanicBtn.hover();
      const { fg, bg } = await mechanicBtn.evaluate((el) => {
        const s = getComputedStyle(el);
        return { fg: s.color, bg: s.backgroundColor };
      });
      expect(contrastRatio(parseRgb(fg), parseRgb(bg))).toBeGreaterThanOrEqual(
        4.5,
      );

      const safetyBtn = lab.getByRole("button", {
        name: "Safety coach role + rules",
      });
      await safetyBtn.focus();
      await page.keyboard.press("Enter");
      await expect(safetyBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("simulated-reply")).toContainText(
        "Coast out of traffic",
      );

      const pushBtn = lab.getByRole("button", {
        name: "Rule-pushing message",
      });
      await pushBtn.click();
      await expect(pushBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("simulated-reply")).toContainText(
        "Simulated slip",
      );
      await expect(lab.getByTestId("readout-limit")).toContainText(
        "Never guess repair prices",
      );

      // Theme toggle preserves lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(safetyBtn).toHaveAttribute("aria-pressed", "true");
      await expect(pushBtn).toHaveAttribute("aria-pressed", "true");

      // Reset returns to defaults.
      await expect(resetBtn).toBeEnabled();
      await resetBtn.click();
      await expect(resetBtn).toBeDisabled();
      await expect(
        lab.getByRole("button", { name: "No shop instruction" }),
      ).toHaveAttribute("aria-pressed", "true");
      await expect(
        lab.getByRole("button", { name: "Normal question" }),
      ).toHaveAttribute("aria-pressed", "true");

      // Knowledge check: wrong feedback, retry, correct explanation.
      const checkSection = page.locator("#check");
      await checkSection.getByLabel(/The role needs a stronger title/).check();
      await checkSection.getByRole("button", { name: "Check answer" }).click();
      const quizStatus = checkSection.getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("cannot connect the model");

      await checkSection.getByRole("button", { name: "Try again" }).click();
      await checkSection
        .getByLabel(/System instructions and roles steer replies/)
        .check();
      await checkSection.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");
      await expect(quizStatus).toContainText("broke the three-step rule");

      // No horizontal overflow at this viewport.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

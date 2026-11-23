import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-03/meta.json";

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) throw new Error(`Unexpected rgb color: ${color}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: string, bg: string): number {
  const l1 = relativeLuminance(parseRgb(fg));
  const l2 = relativeLuminance(parseRgb(bg));
  const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-03 classification choosing categories`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((t) => {
        if (!sessionStorage.getItem("c4-03-seeded-theme")) {
          localStorage.setItem("genai-theme", t);
          sessionStorage.setItem("c4-03-seeded-theme", "1");
        }
      }, theme);
      await page.goto("/learn/genai-basics/c4-03");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 03",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["scores-not-labels", "tradeoff"]) {
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

      // Interactive threshold lab
      const lab = page.getByTestId("threshold-lab");
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.50");
      await expect(lab.getByTestId("flagged-count")).toHaveText("4");
      await expect(lab.getByTestId("inbox-count")).toHaveText("2");
      await expect(lab.getByTestId("false-alarm-count")).toHaveText("1");
      await expect(lab.getByTestId("missed-spam-count")).toHaveText("0");
      await expect(lab.getByTestId("email-promo")).toContainText("False alarm");

      // Active preset hover WCAG contrast ratio check (>= 4.5:1)
      const defaultPreset = lab.getByRole("button", { name: "Default (0.50)" });
      await expect(defaultPreset).toHaveAttribute("aria-pressed", "true");
      await defaultPreset.hover();
      const hoverColors = await defaultPreset.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(contrastRatio(hoverColors.fg, hoverColors.bg)).toBeGreaterThan(
        4.5,
      );

      // Flag less (0.75) preset: 0 false alarms, 1 missed spam
      await lab.getByRole("button", { name: "Flag less (0.75)" }).click();
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.75");
      await expect(lab.getByTestId("flagged-count")).toHaveText("2");
      await expect(lab.getByTestId("inbox-count")).toHaveText("4");
      await expect(lab.getByTestId("false-alarm-count")).toHaveText("0");
      await expect(lab.getByTestId("missed-spam-count")).toHaveText("1");
      await expect(lab.getByTestId("email-seo")).toContainText("Missed spam");
      await expect(lab.getByTestId("lab-status")).toContainText(
        "0 false alarms",
      );

      // Flag more (0.20) preset: 2 false alarms, 0 missed spam
      await lab.getByRole("button", { name: "Flag more (0.20)" }).click();
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.20");
      await expect(lab.getByTestId("flagged-count")).toHaveText("5");
      await expect(lab.getByTestId("inbox-count")).toHaveText("1");
      await expect(lab.getByTestId("false-alarm-count")).toHaveText("2");
      await expect(lab.getByTestId("missed-spam-count")).toHaveText("0");

      // Theme toggle preserves lab state
      const toggledTheme = theme === "light" ? "dark" : "light";
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        toggledTheme,
      );
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.20");
      await expect(lab.getByTestId("false-alarm-count")).toHaveText("2");

      // Keyboard operation on slider and exact-tie boundary check (0.80 email)
      const slider = lab.getByRole("slider", { name: /Spam cutoff/i });
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.25");

      // Exact tie at 0.80 -> Spam; above at 0.85 -> Inbox (Missed spam)
      await slider.fill("0.8");
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.80");
      await expect(lab.getByTestId("email-bank")).toContainText("Filter: Spam");
      await slider.fill("0.85");
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.85");
      await expect(lab.getByTestId("email-bank")).toContainText(
        "Filter: Inbox",
      );
      await expect(lab.getByTestId("email-bank")).toContainText("Missed spam");

      // Reset
      await lab.getByRole("button", { name: "Reset to 0.50" }).click();
      await expect(lab.getByTestId("threshold-value")).toHaveText("0.50");
      await expect(lab.getByTestId("false-alarm-count")).toHaveText("1");
      await expect(lab.getByTestId("missed-spam-count")).toHaveText("0");

      // Knowledge check (all wrong options + correct option)
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/recalculates a lower score/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("does not recalculate");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/still flagged as Spam because 0\.64/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("do not need to retrain");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/false alarms can only rise or stay/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("tradeoff direction is reversed");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/false alarms can only drop or stay/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();

      // Theme choice persists across reload
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        toggledTheme,
      );
    });
  }

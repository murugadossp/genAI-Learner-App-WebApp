import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c5-10/meta.json";

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) throw new Error(`Unable to parse RGB color: ${color}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
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
    test(`${width}px ${theme}: c5-10 performance across different groups`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript((t) => {
        if (!localStorage.getItem("genai-theme")) {
          localStorage.setItem("genai-theme", t);
        }
      }, theme);
      await page.goto("/learn/genai-basics/c5-10");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Data and Evaluation / Lesson 10",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-5");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify both explainer images load with descriptive alt text (>40 chars)
      const imageLabels = [
        {
          section: "why-averages-hide",
          labels: [
            "Analogy",
            "Key takeaways",
            "Local accent",
            "Regional accent",
          ],
        },
        {
          section: "error-types",
          labels: ["Analogy", "Key takeaways", "Group A", "Group B"],
        },
        {
          section: "intersectional",
          labels: ["Analogy", "Key takeaways", "Quiet", "Noisy", "Regional"],
        },
      ];
      for (const { section, labels } of imageLabels) {
        const illustration = page.locator(`#${section} figure img`);
        await illustration.scrollIntoViewIfNeeded();
        const alt = await illustration.getAttribute("alt");
        expect(alt?.length).toBeGreaterThan(40);
        for (const label of labels) expect(alt).toContain(label);
        await expect
          .poll(() =>
            illustration.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive lab: starts on Overall (combined) + Accuracy
      const lab = page.getByTestId("subgroup-lab");
      const overallBtn = lab.getByRole("button", {
        name: "Overall (combined)",
        exact: true,
      });
      await expect(overallBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("group-card-overall")).toContainText("86%");
      await expect(lab.getByTestId("group-card-overall")).toContainText(
        "172 of 200 calls correct",
      );
      await expect(lab.getByTestId("gap-badge")).toHaveText(
        "Combined view (no split)",
      );

      // Real WCAG >= 4.5:1 hover contrast check on active pressed button
      await overallBtn.hover();
      const hoverColors = await overallBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(
        contrastRatio(hoverColors.fg, hoverColors.bg),
      ).toBeGreaterThanOrEqual(4.5);

      // Slice by accent -> 90% Local vs 70% Regional (20-point gap)
      const accentBtn = lab.getByRole("button", {
        name: "By accent",
        exact: true,
      });
      await accentBtn.click();
      await expect(accentBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("gap-badge")).toHaveText(
        "Gap: 20 percentage points",
      );
      await expect(lab.getByTestId("group-card-local")).toContainText("90%");
      await expect(lab.getByTestId("group-card-regional")).toContainText("70%");

      // Switch metric via keyboard to Missed urgent (FN rate)
      const fnBtn = lab.getByRole("button", {
        name: "Missed urgent (FN rate)",
        exact: true,
      });
      await fnBtn.focus();
      await page.keyboard.press("Enter");
      await expect(fnBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("gap-badge")).toHaveText(
        "Gap: 30 percentage points",
      );
      await expect(lab.getByTestId("group-card-local")).toContainText("10%");
      await expect(lab.getByTestId("group-card-regional")).toContainText("40%");

      // Switch to Accent + line quality (intersectional)
      const interBtn = lab.getByRole("button", {
        name: "Accent + line quality",
        exact: true,
      });
      await interBtn.click();
      await expect(lab.getByTestId("gap-badge")).toHaveText(
        "Gap: 65 percentage points",
      );
      await expect(lab.getByTestId("group-card-regional-noisy")).toContainText(
        "70%",
      );
      await expect(lab.getByTestId("group-card-regional-noisy")).toContainText(
        "7 of 10 urgent calls missed",
      );

      // Hover contrast check on active metric button too
      await fnBtn.hover();
      const fnHoverColors = await fnBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(
        contrastRatio(fnHoverColors.fg, fnHoverColors.bg),
      ).toBeGreaterThanOrEqual(4.5);

      // Theme toggle preserves lab state
      const expectedAfterToggle = theme === "light" ? "dark" : "light";
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedAfterToggle,
      );
      await expect(interBtn).toHaveAttribute("aria-pressed", "true");
      await expect(fnBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("group-card-regional-noisy")).toContainText(
        "70%",
      );

      // Reset view restores Overall + Accuracy
      await lab.getByRole("button", { name: "Reset view" }).click();
      await expect(overallBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("group-card-overall")).toContainText("86%");

      // Knowledge check: wrong feedback, retry, and correct answer (index 2)
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/Approve the tool because 91% accuracy/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("85% of these cases");
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/Remove age from the input/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "does not establish equal performance",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/Compare only whether both groups/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "Matching accuracy can still hide",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Compare accuracy and important error rates/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();

      // Theme persistence across reload (toggled theme stays saved in localStorage)
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        expectedAfterToggle,
      );
    });
  }

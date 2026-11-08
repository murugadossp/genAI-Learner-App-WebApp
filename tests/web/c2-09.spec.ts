import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-09/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-09 temperature and sampling lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      const problems: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(m.text());
      });
      page.on("pageerror", (e) => problems.push(e.message));
      await page.goto("/learn/genai-basics/c2-09");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // The "where it sits" section: network zone, sampling zone, worked table.
      const flow = page.getByTestId("flow");
      await expect(flow.locator('[data-zone="network"]')).toContainText(
        "logit",
      );
      await expect(flow.locator('[data-zone="sampling"]')).toContainText(
        "divide each logit by T",
      );
      const worked = page.getByTestId("worked");
      await expect(worked.getByRole("row", { name: /Sydney/ })).toContainText(
        "51.0%",
      );
      await expect(worked.getByRole("row", { name: /Sydney/ })).toContainText(
        "66.9%",
      );
      await expect(worked.getByRole("row", { name: /Auckland/ })).toContainText(
        "<0.1%",
      );

      // Four explanatory illustrations load and have descriptive alt text.
      const figures = page.locator("article figure img");
      await expect(figures).toHaveCount(4);
      for (let i = 0; i < 4; i++) {
        const img = figures.nth(i);
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth))
          .toBeGreaterThan(0);
        expect(((await img.getAttribute("alt")) ?? "").length).toBeGreaterThan(
          40,
        );
      }
      await page.evaluate(() => window.scrollTo(0, 0));

      const slider = page.getByLabel(/^Temperature/);
      const summary = page.getByTestId("summary");
      const probs = page.getByTestId("prob");
      await expect(slider).toHaveValue("1");
      // Story prompt at temperature 1: invented scores give door 40%.
      await expect(probs.first()).toHaveText("40%");

      // Probabilities in the first column add up to roughly 100%.
      const total = await probs.evaluateAll((els) =>
        els.reduce((a, e) => a + parseFloat(e.textContent ?? "0"), 0),
      );
      expect(Math.abs(total - 100)).toBeLessThan(1);

      // Low temperature sharpens, high flattens.
      await slider.fill("0.2");
      const low = parseFloat((await probs.first().textContent()) ?? "0");
      await slider.fill("2");
      const high = parseFloat((await probs.first().textContent()) ?? "0");
      expect(low).toBeGreaterThan(90);
      expect(high).toBeLessThan(30);
      await expect(page.locator(".lab").getByRole("status")).toContainText(
        "Temperature 2.0",
      );

      // Temperature 0 is greedy: all draws go to the top choice.
      await slider.fill("0");
      await expect(probs.first()).toHaveText("100%");
      await expect(page.getByTestId("count").first()).toHaveText("20");

      // Factual prompt: low temperature makes the wrong answer near-certain.
      await page.getByLabel(/Factual/).check();
      await slider.fill("0.1");
      await expect(summary).toContainText(
        "Chance of the correct answer, Canberra: 1.8%",
      );
      await expect(summary).toContainText("98.2%");
      // Tiny but non-zero chances are not shown as 0%.
      await expect(probs.nth(2)).toHaveText("<0.1%");
      await slider.fill("1");
      await expect(summary).toContainText("Canberra: 34.2%");
      // The lab agrees with the worked table in the lesson text.
      await expect(probs.first()).toHaveText("51%");
      await expect(page.locator(".lab-disclosure")).toContainText(
        "ranks a common mix-up just above the correct answer",
      );

      // Top-k removes choices; remaining chances still add up.
      await page.getByLabel(/Top-k/).check();
      await expect(
        page.locator('[data-testid="choice-row"][data-removed="yes"]'),
      ).toHaveCount(2);
      await page.getByLabel(/Top-p/).check();
      await expect(
        page.locator('[data-testid="choice-row"][data-removed="yes"]'),
      ).toHaveCount(3);

      // The lesson text says top-p keeps 4 of 8 on the story prompt at T=1.
      await page.getByLabel(/Open-ended/).check();
      await expect(
        page.locator('[data-testid="choice-row"][data-removed="yes"]'),
      ).toHaveCount(4);
      await page.getByLabel(/Factual/).check();

      // Draw again changes the seed but keeps probabilities.
      const live = page.locator(".lab").getByRole("status");
      await expect(live).toContainText("Draw set 1");
      await page.getByRole("button", { name: /Draw 20 again/ }).click();
      await expect(live).toContainText("Draw set 2");
      const counts = await page
        .getByTestId("count")
        .evaluateAll((els) =>
          els.reduce((a, e) => a + Number(e.textContent), 0),
        );
      expect(counts).toBe(20);

      // Theme switch keeps lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(slider).toHaveValue("1");
      await expect(page.getByLabel(/Top-p/)).toBeChecked();

      // Reset.
      await page.getByRole("button", { name: "Reset lab" }).click();
      await expect(slider).toHaveValue("1");
      await expect(page.getByLabel(/Open-ended/)).toBeChecked();
      await expect(page.getByLabel(/Keep every choice/)).toBeChecked();

      // Keyboard operation of the slider.
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(slider).toHaveValue("1.1");

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/guarantees that the answers/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("nearly certain");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/more consistent by favouring/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      // No hydration or other console errors during the whole journey.
      expect(problems).toEqual([]);

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

test("320px: the lab table stays inside the lab in its widest state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/learn/genai-basics/c2-09");
  await page.getByLabel(/Factual/).check();
  await page.getByLabel(/Top-p/).check();
  const fits = await page.evaluate(() => {
    const lab = document.querySelector(".lab")!.getBoundingClientRect();
    const cells = [
      ...document.querySelectorAll(
        '[data-testid="choices"] th, [data-testid="choices"] td',
      ),
    ];
    return {
      cellsInside: cells.every(
        (c) => c.getBoundingClientRect().right <= lab.right,
      ),
      docFits: document.documentElement.scrollWidth <= innerWidth,
    };
  });
  expect(fits.cellsInside).toBe(true);
  expect(fits.docFits).toBe(true);
});

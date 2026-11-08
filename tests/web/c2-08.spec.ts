import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-08/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-08 knowledge cutoff lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c2-08");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const answer = page.getByTestId("answer");
      const slider = page.getByLabel(/Training cutoff/);
      // Default cutoff 14: the fare change at month 18 is after the cutoff.
      await expect(answer).toContainText("Out of date");
      await expect(answer).toContainText("5 coins");
      await expect(answer).toContainText("Fact today in this toy world: 6");
      await expect(page.getByTestId("event-row").nth(4)).toContainText(
        "Not in training",
      );

      // Move the cutoff past the change: thin coverage first, then well covered.
      await slider.fill("19");
      await expect(page.locator(".lab").getByRole("status")).toContainText(
        "Cutoff month 19. Unsteady",
      );
      await expect(answer).toContainText("Unsteady");
      await expect(answer).toContainText("6 coins or 5 coins");
      await slider.fill("21");
      await expect(answer).toContainText("Matches today");
      await expect(answer).toContainText("6 coins");

      // Supplying text: an old notice stays stale, a current one is current.
      await slider.fill("14");
      await page.getByLabel(/old notice/).check();
      await expect(answer).toContainText("Out of date");
      await page.getByLabel(/current notice/).check();
      await expect(answer).toContainText("Matches today");
      await expect(answer).toContainText("6 coins");

      // Today question.
      await page.getByLabel(/What month is it today/).check();
      await expect(answer).toContainText("Month 24");
      await page.getByLabel(/Model alone/).check();
      await expect(answer).toContainText("Probably around month 14");

      // Theme switch keeps lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(slider).toHaveValue("14");
      await expect(answer).toContainText("Probably around month 14");

      // Reset.
      await page.getByRole("button", { name: "Reset lab" }).click();
      await expect(slider).toHaveValue("14");
      await expect(answer).toContainText("5 coins");

      // Keyboard operation of the slider.
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(slider).toHaveValue("15");

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/Everything before the cutoff is reliable/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("uneven");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/was not in its training text/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

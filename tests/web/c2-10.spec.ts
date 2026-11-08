import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-10/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-10 reasoning models lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c2-10");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const answer = page.getByTestId("answer");
      const slider = page.getByLabel(/Work before answering/);
      await expect(answer).toContainText(
        "Answer: Asha: cat, Ben: dog, Chen: fish",
      );
      await expect(answer).toContainText("Does not match");
      await expect(slider).toBeDisabled();

      await page.getByLabel(/prompt says/).check();
      await expect(page.getByTestId("shown")).toContainText("in that order");
      await expect(answer).toContainText(
        "Answer: Asha: cat, Ben: dog, Chen: fish",
      );

      await page.getByLabel(/Reasoning model: works first/).check();
      await expect(slider).toBeEnabled();
      await slider.fill("2");
      await expect(answer).toContainText(
        "Answer: Asha: cat, Ben: dog, Chen: fish",
      );
      await slider.fill("3");
      await expect(page.locator(".lab").getByRole("status")).toContainText(
        "Answer: Asha: fish, Ben: cat, Chen: dog",
      );
      await expect(answer).toContainText(
        "Answer: Asha: fish, Ben: cat, Chen: dog",
      );
      await expect(answer).toContainText("Matches the worked answer");
      await expect(page.getByTestId("work")).toContainText("Discard it");
      const cost3 = await page.getByTestId("cost").innerText();
      await slider.fill("4");
      expect(await page.getByTestId("cost").innerText()).not.toEqual(cost3);

      // Summary omits the discarded attempt; full work shows it.
      await expect(page.getByTestId("shown")).not.toContainText("Discard it");
      await page.getByLabel("Show the full work").check();
      await expect(page.getByTestId("shown")).toContainText("Everything above");
      await page.getByLabel(/Show nothing/).check();
      await expect(page.getByTestId("shown")).toContainText("only the answer");

      // Simple sum: right from the start, extra work only adds cost.
      await page.getByLabel(/Quick fact/).check();
      await expect(answer).toContainText("Answer: Paris");
      await expect(answer).toContainText("extra work only added cost");
      await slider.fill("0");
      await expect(answer).toContainText("Raise the limit");
      await slider.fill("4");

      // Theme switch keeps lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(slider).toHaveValue("4");
      await expect(answer).toContainText("Answer: Paris");

      // Reset.
      await page.getByRole("button", { name: "Reset lab" }).click();
      await expect(slider).toHaveValue("0");
      await expect(answer).toContainText(
        "Answer: Asha: cat, Ben: dog, Chen: fish",
      );

      // Keyboard operation of the slider.
      await page.getByLabel(/Reasoning model: works first/).check();
      await slider.focus();
      await page.keyboard.press("ArrowRight");
      await expect(slider).toHaveValue("1");

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/faithful log/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("verify the result");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Partly: asking for steps/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c2-07/meta.json";

// c2-07 is a draft: it is served by the dev/test build only.
for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c2-07 why models make things up`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c2-07");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      const sentence = page.getByTestId("sentence");
      await expect(sentence).toHaveText(
        "The Lantern Bay Library opened in 1962.",
      );
      await page.getByRole("button", { name: "Nothing at all" }).click();
      await expect(sentence).toHaveText(
        "The Lantern Bay Library opened in 1964.",
      );
      await page.getByRole("button", { name: "Ask again" }).click();
      await expect(sentence).toHaveText(
        "The Lantern Bay Library opened in 1958.",
      );
      await expect(page.getByTestId("year-row")).toHaveCount(4);
      await page.getByRole("button", { name: "Reset draws" }).click();
      await expect(sentence).toContainText("1964");

      // Answer A: mark everything wrongly as supported, then check.
      const claims = page.getByTestId("claim");
      await expect(claims).toHaveCount(4);
      const check = page.getByRole("button", { name: /Check my marks/ });
      await expect(check).toBeDisabled();
      for (let i = 0; i < 4; i++)
        await claims.nth(i).getByLabel("Matches the notice").check();
      await check.click();
      await expect(page.getByText("You matched 1 of 4")).toBeVisible();
      await expect(claims.nth(0)).toContainText("Contradicts the notice");

      // Theme switch keeps lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(page.getByText("You matched 1 of 4")).toBeVisible();
      await expect(sentence).toContainText("1964");

      // Answer B is independent.
      await page.getByRole("button", { name: /Answer B/ }).click();
      await expect(check).toBeDisabled();
      await page.getByRole("button", { name: /Answer A/ }).click();
      await page.getByRole("button", { name: "Clear this answer" }).click();
      await expect(check).toBeDisabled();

      await page.getByLabel(/probably right, because a model/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const status = page.locator(".knowledge-check").getByRole("status");
      await expect(status).toContainText("Not quite");
      await expect(status).toContainText("not reliable");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/guaranteed to be correct/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Answer B did");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Nothing reliable about accuracy/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(status).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

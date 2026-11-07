import { test, expect } from "@playwright/test";
for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: full journey and lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/");
      await expect(
        page.getByRole("link", { name: "Try a lesson" }),
      ).toHaveAttribute("href", "/learn/genai-basics/c2-01");
      const heroButton = page.getByRole("button", { name: "Try another" });
      await heroButton.hover();
      await expect(heroButton).toHaveCSS(
        "background-color",
        "rgb(36, 59, 179)",
      );
      await expect(heroButton).toHaveCSS("color", "rgb(255, 255, 255)");
      await expect(
        page.getByRole("heading", {
          name: "Understand AI. Get your hands on the ideas.",
        }),
      ).toBeVisible();
      await page
        .getByRole("link", { name: "Find your starting point" })
        .click();
      await expect(
        page.getByRole("heading", { name: "Keep your curiosity going." }),
      ).toBeVisible();
      await page.getByLabel("Find a topic").fill("python");
      await expect(
        page.getByRole("heading", { name: "Python for AI" }),
      ).toBeVisible();
      await expect(
        page
          .locator("article.coming-soon")
          .filter({ hasText: "Python for AI" }),
      ).toContainText("Coming soon");
      await expect(
        page.getByRole("link", { name: /Python for AI/ }),
      ).toHaveCount(0);
      await page.getByLabel("Find a topic").fill("language models");
      await page
        .getByRole("link", { name: /How language models work/ })
        .click();
      await expect(
        page.getByRole("heading", { name: "How GenAI Works" }),
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Start lesson" }),
      ).toHaveAttribute("href", "/learn/genai-basics/c2-01");
      await page
        .getByRole("link", { name: /How a model predicts the next token/ })
        .click();
      await expect(
        page.getByRole("heading", { name: "What the loop is doing." }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.getByRole("button", { name: "Choose next token" }).click();
      await page.getByRole("button", { name: "Expand workspace" }).click();
      const dialog = page.getByRole("dialog", { name: "The generation loop" });
      await expect(dialog).toContainText("The sky is blue");
      await expect(dialog).toContainText("50%");
      await dialog.getByRole("button", { name: "Switch color theme" }).click();
      await expect(dialog).toContainText("The sky is blue");
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Expand workspace" }),
      ).toBeFocused();
      await expect(
        page.getByRole("button", { name: "Check answer" }),
      ).toBeDisabled();
      await page.getByLabel(/The claim has been checked/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(page.getByRole("status")).toContainText(
        "does not check a trusted source",
      );
      await page.getByRole("button", { name: "Try again" }).click();
      await expect(
        page.getByRole("button", { name: "Check answer" }),
      ).toBeDisabled();
      await page.getByLabel(/That token is a likely continuation/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(page.getByRole("status")).toContainText("Correct");
    });
  }

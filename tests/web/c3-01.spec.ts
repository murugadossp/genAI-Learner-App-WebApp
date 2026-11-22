import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-01 giving clear goals and instructions`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-01");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 01",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["vague", "three-parts", "more-words"]) {
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

      // Interactive lab
      const lab = page.getByTestId("prompt-lab");
      await expect(lab.getByTestId("word-count")).toHaveText("6 words");
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "0 of 3 clear parts",
      );

      // Active preset hover contrast check
      const vaguePreset = lab.getByRole("button", { name: "Vague (6 words)" });
      await expect(vaguePreset).toHaveAttribute("aria-pressed", "true");
      await vaguePreset.hover();
      const hoverColors = await vaguePreset.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      // Ensure active button keeps accent background (not light panel rgb(237, 240, 231) or dark panel rgb(44, 54, 46))
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Long & vague preset: more words, still 0 clear parts
      await lab
        .getByRole("button", { name: "Long & vague (31 words)" })
        .click();
      await expect(lab.getByTestId("word-count")).toHaveText("31 words");
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "0 of 3 clear parts",
      );
      await expect(lab.getByTestId("lab-status")).toContainText(
        "Filler adjectives made the prompt longer",
      );

      // Clear task preset: fewer words, 3 clear parts
      await lab.getByRole("button", { name: "Clear task (22 words)" }).click();
      await expect(lab.getByTestId("word-count")).toHaveText("22 words");
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "3 of 3 clear parts",
      );
      await expect(lab.getByTestId("guess-list")).toContainText(
        "None of these three",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "3 of 3 clear parts",
      );

      // Toggle off Action via keyboard
      const actionBtn = lab.getByRole("button", {
        name: "Action: short notice",
      });
      await actionBtn.focus();
      await page.keyboard.press("Enter");
      await expect(actionBtn).toHaveAttribute("aria-pressed", "false");
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "2 of 3 clear parts",
      );

      // Reset
      await lab.getByRole("button", { name: "Reset prompt builder" }).click();
      await expect(lab.getByTestId("word-count")).toHaveText("6 words");
      await expect(lab.getByTestId("clear-count")).toHaveText(
        "0 of 3 clear parts",
      );

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/Please write something really warm, inspiring/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("polite adjectives");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Write a short message about our Saturday bike clinic/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("leaves out the outcome");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Write a short group-chat post for experienced cyclists/)
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

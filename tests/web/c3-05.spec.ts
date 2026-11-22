import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-05/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-05 requesting structured outputs`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-05");

      // Section order matches meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Chapter context in LessonFrame
      await expect(page.locator("article .eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 5",
      );

      // Explainer images render and have descriptive alt text (> 40 chars)
      const images = page.locator("article figure img");
      expect(await images.count()).toBe(2);
      for (let i = 0; i < 2; i++) {
        const img = images.nth(i);
        await img.scrollIntoViewIfNeeded();
        const alt = await img.getAttribute("alt");
        expect((alt ?? "").length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            img.evaluate((el) => {
              const image = el as HTMLImageElement;
              return image.complete && image.naturalWidth > 0;
            }),
          )
          .toBe(true);
      }

      // Active preset button maintains contrast on hover
      const cleanBtn = page.getByRole("button", { name: "Clean reply" });
      await expect(cleanBtn).toHaveAttribute("aria-pressed", "true");
      await cleanBtn.hover();
      const hoverColors = await cleanBtn.evaluate((el) => {
        const style = getComputedStyle(el);
        return { bg: style.backgroundColor, color: style.color };
      });
      expect(hoverColors.bg).not.toEqual(hoverColors.color);
      // Should stay accent background, not fall back to light --panel
      const panelBg = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--panel")
          .trim(),
      );
      expect(hoverColors.bg).not.toEqual(panelBg);

      // Default Clean reply passes all 3 format checks
      await expect(page.getByTestId("check-syntax")).toContainText("Pass");
      await expect(page.getByTestId("check-fields")).toContainText("Pass");
      await expect(page.getByTestId("check-values")).toContainText("Pass");
      await expect(page.getByTestId("truth-check")).toContainText(
        "Oak Park Shelter",
      );

      // Wrapper text fails syntax
      await page.getByRole("button", { name: "Wrapper text" }).click();
      await expect(page.getByTestId("check-syntax")).toContainText("Fail");
      await expect(page.getByTestId("lab-status")).toContainText(
        "Valid JSON syntax",
      );

      // Renamed field passes syntax, fails required fields
      await page.getByRole("button", { name: "Renamed field" }).click();
      await expect(page.getByTestId("check-syntax")).toContainText("Pass");
      await expect(page.getByTestId("check-fields")).toContainText("Fail");
      await expect(page.getByTestId("check-fields")).toContainText("location");

      // Unallowed value passes syntax & fields, fails allowed values
      await page.getByRole("button", { name: "Unallowed value" }).click();
      await expect(page.getByTestId("check-syntax")).toContainText("Pass");
      await expect(page.getByTestId("check-fields")).toContainText("Pass");
      await expect(page.getByTestId("check-values")).toContainText("Fail");

      // Wrong fact passes all 3 format checks but shows Maple Park Shelter in human check
      await page.getByRole("button", { name: "Wrong fact" }).click();
      await expect(page.getByTestId("check-syntax")).toContainText("Pass");
      await expect(page.getByTestId("check-fields")).toContainText("Pass");
      await expect(page.getByTestId("check-values")).toContainText("Pass");
      await expect(page.getByTestId("truth-check")).toContainText(
        "Maple Park Shelter",
      );

      // Live editing: fix Wrapper text directly in textarea
      await page.getByRole("button", { name: "Wrapper text" }).click();
      const editor = page.getByLabel(/Model reply/);
      await editor.fill(
        '{"event":"Bike repair clinic","date":"Saturday, May 16","location":"Oak Park Shelter","cost":"unknown"}',
      );
      await expect(page.getByTestId("check-syntax")).toContainText("Pass");
      await expect(page.getByTestId("check-fields")).toContainText("Pass");
      await expect(page.getByTestId("check-values")).toContainText("Pass");

      // Theme switch preserves edited lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(editor).toHaveValue(/"cost":"unknown"/);

      // Reset lab restores Clean reply
      await page.getByRole("button", { name: "Reset lab" }).click();
      await expect(cleanBtn).toHaveAttribute("aria-pressed", "true");
      await expect(editor).toHaveValue(/"cost": "free"/);

      // Knowledge check: wrong feedback, retry, correct
      await page.getByLabel(/completely accurate because valid JSON/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("wrong date or location");

      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/matches your format rules/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // No horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

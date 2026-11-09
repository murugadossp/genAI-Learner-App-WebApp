import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-05/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-05 tuples and sets lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-05");

      // Verify section IDs match meta.json in exact order
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));

      // Verify eyebrow shows Python for AI / Lesson 05
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 05",
      );

      // Verify all three concept images render and have descriptive alt text (>40 chars)
      for (const section of ["tuples", "sets", "choosing"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        expect((await picture.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Exercise practice Check (#practice) including wrong feedback, retry, and keyboard operation
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice.getByLabel(/tuple\(raw_sources\)/).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText(
        "keeps the duplicate",
      );
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel(/set\(raw_sources\)/).focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Exercise interactive lab (#lab)
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();

      // Verify active preset button maintains real luminance contrast on hover
      const activePresetBtn = lab.getByRole("button", {
        name: "Citation Deduplicator",
      });
      await activePresetBtn.hover();
      const contrastRatio = await activePresetBtn.evaluate((el) => {
        const parseRgb = (s: string) => {
          const m = s.match(/\d+(\.\d+)?/g);
          return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
        };
        const lum = (rgb: number[]) => {
          const [r, g, b] = rgb.map((v) => {
            const c = v / 255;
            return c <= 0.03928
              ? c / 12.92
              : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const style = getComputedStyle(el);
        const l1 = lum(parseRgb(style.color));
        const l2 = lum(parseRgb(style.backgroundColor));
        const brightest = Math.max(l1, l2);
        const darkest = Math.min(l1, l2);
        return (brightest + 0.05) / (darkest + 0.05);
      });
      expect(contrastRatio).toBeGreaterThan(3.5);

      // Step 1: Toggle trailing comma off -> becomes str (len = 7)
      await lab.getByRole("button", { name: /Trailing comma/ }).click();
      await expect(lab).toContainText("str (len = 7)");

      // Step 2: Attempt item assignment on tuple -> TypeError
      await lab.getByRole("button", { name: /model_spec\[1\] = 8192/ }).click();
      await expect(lab).toContainText(
        "TypeError: 'tuple' object does not support item assignment",
      );

      // Step 3: Add new ID and duplicate ID to set
      await lab.getByRole("button", { name: /\+ \.add\("doc_09"\)/ }).click();
      await expect(lab).toContainText("(len = 3)");
      await lab.getByRole("button", { name: /\+ \.add\("doc_12"\)/ }).click();
      await expect(lab).toContainText("already in the set");
      await expect(lab).toContainText("(len = 3)");

      // Step 4: Check absent membership query
      await lab.getByRole("button", { name: /Check "doc_99" in set/ }).click();
      await expect(lab).toContainText("False");

      // Theme toggle preserves both lab state and practice quiz state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab).toContainText(
        "TypeError: 'tuple' object does not support item assignment",
      );
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Switch preset and reset sandbox
      await lab.getByRole("button", { name: "Vision Tile Config" }).click();
      await expect(lab).toContainText("vision-v2");
      await lab.getByRole("button", { name: "Reset sandbox" }).click();
      await expect(lab).toContainText("gpt-4o-mini");
      await expect(lab).toContainText("tuple (len = 1)");

      // Exercise final knowledge check (#check)
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();

      await quiz
        .getByLabel("tag is a tuple, and len(sources) is 2.", { exact: true })
        .check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("no trailing comma");

      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      await quiz
        .getByLabel("tag is a str, and len(sources) is 2.", { exact: true })
        .check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // Verify theme switch preserves final quiz state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // Verify next link uses chapter-p1 route
      await expect(
        page.locator("a", { hasText: "Next up: Dictionaries in Chapter P1 →" }),
      ).toHaveAttribute("href", "/course/chapter-p1");

      // Verify no page-level horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

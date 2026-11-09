import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-01 AI rings lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-01");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 01",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Each concept section has an image that loaded and a ring diagram.
      for (const id of ["ai", "ml", "dl", "genai"]) {
        const section = page.locator(`#${id}`);
        const img = section.locator("img");
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth))
          .toBeGreaterThan(0);
        await expect(img).toHaveAttribute("alt", /.{20,}/);
        await expect(
          section.getByRole("img", { name: /Nested rings/ }),
        ).toHaveCount(1);
      }
      await expect(page.locator("#ml img")).toHaveAttribute(
        "alt",
        /Labelled examples.*Learned model.*New message.*Spam/,
      );
      await expect(
        page
          .locator("#dl")
          .getByRole("img", { name: /Highlighted: Deep learning/ }),
      ).toBeVisible();
      await expect(page.locator("#genai")).toContainText(
        "Older methods can generate too",
      );
      await expect(page.locator("#ml [data-current='true']")).toHaveAttribute(
        "data-level",
        "1",
      );

      // Sorter: wrong (too far in), wrong (too far out), correct, change, reset.
      const score = page.getByTestId("score");
      const fb = page.getByTestId("item-feedback");
      const item = (n: number) => page.locator("#sorter ol > li").nth(n);
      await expect(score).toContainText("0 of 6");
      await item(0).getByLabel("Machine learning").check();
      await expect(page.locator("#sorter").getByRole("status")).toContainText(
        "further in than it goes",
      );
      await expect(item(0).locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(fb.first()).toContainText("further in than it goes");
      await item(1).getByLabel("Artificial intelligence").check();
      await expect(item(1).getByTestId("item-feedback")).toContainText(
        "more specific ring",
      );
      await item(1).getByLabel("Machine learning").check();
      await expect(item(1).getByTestId("item-feedback")).toContainText("Right");
      await item(0).getByLabel("Artificial intelligence").check();
      await expect(score).toContainText("2 of 6");

      // Theme switch keeps sorter state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(score).toContainText("2 of 6");
      await expect(item(1).getByLabel("Machine learning")).toBeChecked();

      // Keyboard: arrow keys move within an item's radio group.
      await item(2).getByLabel("Artificial intelligence").focus();
      await page.keyboard.press("ArrowDown");
      await expect(item(2).getByLabel("Machine learning")).toBeChecked();

      // Reset.
      await page
        .locator("#sorter")
        .getByRole("button", { name: "Reset" })
        .click();
      await expect(score).toContainText("0 of 6");
      await expect(fb).toHaveCount(0);

      // Quiz: wrong feedback, retry, correct.
      await page.getByLabel(/It is not AI, because nothing/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("Not quite");
      await expect(quiz).toContainText("classic AI");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/It is AI but not machine learning/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

test("chapter 1 course page lists c1-01 and links to it", async ({ page }) => {
  await page.goto("/course/chapter-1");
  await expect(
    page.getByRole("heading", { name: "AI Foundations", level: 1 }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /How AI, ML, deep learning and GenAI/ })
    .click();
  await expect(page).toHaveURL(/\/learn\/genai-basics\/c1-01$/);
  await page.goto("/course");
  await expect(page.locator(".eyebrow").first()).toContainText("Chapter 2");
});

test("AI foundations card in the studio leads to chapter 1", async ({
  page,
}) => {
  await page.goto("/studio");
  await page
    .getByRole("link", { name: /AI foundations/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/course\/chapter-1$/);
  await expect(
    page.getByRole("heading", { name: "AI Foundations", level: 1 }),
  ).toBeVisible();
});

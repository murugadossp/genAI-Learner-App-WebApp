import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c1-06/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c1-06 what AI is good and bad at`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c1-06");
      await expect(page.locator(".eyebrow").first()).toContainText(
        "AI foundations / Lesson 06",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-1");
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["fluent", "strengths", "weak-spots"]) {
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

      // Grid diagrams: same grid in three sections, with descriptive alt text.
      for (const id of ["stakes", "checkable", "levels"]) {
        const grid = page.locator(`#${id} [role="img"]`);
        await expect(grid).toBeVisible();
        const label = (await grid.getAttribute("aria-label")) ?? "";
        expect(label.length).toBeGreaterThan(40);
      }
      await expect(page.locator("#levels [role='img']")).toHaveAttribute(
        "aria-label",
        /Low stakes and hard to check|low stakes and hard to check/i,
      );
      // No label breaks mid-word in the levels grid: every cell word fits.
      const broken = await page
        .locator("#levels [data-cell]")
        .evaluateAll(
          (els) => els.filter((e) => e.scrollWidth > e.clientWidth + 1).length,
        );
      expect(broken).toBe(0);

      // Lab.
      const lab = page.locator("#rate");
      const task = (n: number) => lab.getByTestId("task").nth(n);
      await expect(lab.getByTestId("score")).toContainText("0 of 6");
      // Task 3 (index 2): low stakes, hard to check.
      await task(2).getByLabel("High").check();
      await expect(task(2).getByTestId("item-feedback")).toContainText(
        "Stakes: not quite",
      );
      await expect(task(2).locator("fieldset").first()).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await expect(lab.getByRole("status")).toContainText("average coffee");
      await expect(
        lab.getByRole("group", {
          name: "Task 3: stakes if the answer is wrong",
        }),
      ).toBeVisible();
      await task(0).getByLabel("Low", { exact: true }).check();
      await expect(lab.getByRole("status")).toContainText("Right. A clumsy");
      await task(2).getByLabel("Low", { exact: true }).check();
      await task(2).getByLabel("Easy to check").check();
      await expect(task(2).getByTestId("item-feedback").nth(1)).toContainText(
        "Checkability: not quite",
      );
      await expect(task(2).getByTestId("level")).toHaveCount(0);
      await task(2).getByLabel("Hard to check").check();
      await expect(task(2).getByTestId("level")).toContainText("unconfirmed");
      await expect(lab.getByTestId("score")).toContainText("1 of 6");
      // Task 4 (index 3): high, easy.
      await task(3).getByLabel("High").check();
      await task(3).getByLabel("Easy to check").check();
      await expect(task(3).getByTestId("level")).toContainText(
        "against the source",
      );
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("score")).toContainText("2 of 6");
      // Keyboard: arrows move within a group.
      await task(0).getByLabel("Low", { exact: true }).focus();
      await page.keyboard.press("ArrowRight");
      await expect(task(0).getByLabel("High")).toBeChecked();
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(lab.getByTestId("score")).toContainText("0 of 6");
      await expect(lab.getByTestId("item-feedback")).toHaveCount(0);

      // Quiz.
      await page.getByLabel(/Trust the date: the answer is fluent/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quiz = page.locator(".knowledge-check").getByRole("status");
      await expect(quiz).toContainText("do not show the date is supported");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Ask the assistant “are you sure/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("not an independent check");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Treat the date as unconfirmed/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quiz).toContainText("Correct");

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c9-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c9-02 workflows versus agents lesson`, async ({
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

      await page.goto("/learn/genai-basics/c9-02");

      // Section order matches meta.json.
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Three concept images load and have descriptive alt text.
      const figures = page.locator("article figure img");
      await expect(figures).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        const img = figures.nth(i);
        await img.scrollIntoViewIfNeeded();
        await expect(img).toBeVisible();
        await expect
          .poll(() =>
            img.evaluate((el) => {
              const image = el as HTMLImageElement;
              return image.complete && image.naturalWidth > 0;
            }),
          )
          .toBe(true);
        const alt = (await img.getAttribute("alt")) ?? "";
        expect(alt.length).toBeGreaterThan(40);
      }
      await expect(figures.nth(0)).toHaveAttribute("alt", /Classify ticket/);
      await expect(figures.nth(1)).toHaveAttribute("alt", /Run a tool/);
      await expect(figures.nth(1)).toHaveAttribute("alt", /Stop/);
      await expect(figures.nth(2)).toHaveAttribute("alt", /dashed outline/);

      // Lab: a wrong answer gets specific feedback; the score updates.
      const lab = page.locator("fieldset", {
        hasText: "Every ticket is classified",
      });
      await lab.getByLabel("Agent loop", { exact: true }).check();
      const feedback = page.getByTestId("item-feedback").first();
      await expect(feedback).toContainText("Not quite");
      await expect(feedback).toContainText("the code sets the order");
      await lab.getByLabel("Workflow", { exact: true }).check();
      await expect(feedback).toContainText("Right: Workflow");
      await expect(page.getByTestId("score")).toContainText("1 of 5 correct");

      // The model-call-in-a-fixed-step item is a workflow, not an agent.
      const trap = page.locator("fieldset", {
        hasText: "calls a model to write a one-sentence summary",
      });
      await trap.getByLabel("Agent loop", { exact: true }).check();
      await expect(
        page.locator("li", { has: trap }).getByTestId("item-feedback"),
      ).toContainText("does not choose what runs next");

      // Knowledge check: wrong option gives its own feedback, then retry.
      const check = page.locator("#check");
      await check
        .getByRole("radio", { name: /An agent loop, because it uses a model/ })
        .check();
      await check.getByRole("button", { name: "Check answer →" }).click();
      await expect(check.getByRole("status")).toContainText(
        "Using a model does not make this an agent loop",
      );
      await check.getByRole("button", { name: "Try again" }).click();
      await check
        .getByRole("radio", { name: /A workflow, because the code sets/ })
        .check();
      await check.getByRole("button", { name: "Check answer →" }).click();
      await expect(check.getByRole("status")).toContainText("Correct.");

      // Back link goes to the Chapter 9 course page, which is in the lesson.
      await expect(
        page.getByRole("link", { name: /Back to Chapter 9/ }),
      ).toHaveAttribute("href", "/course/chapter-9");

      // No horizontal page overflow at this width.
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);

      expect(problems).toEqual([]);
    });
  }

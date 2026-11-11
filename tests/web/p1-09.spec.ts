import { test, expect, type Page } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-09/meta.json";

async function contrastOf(locator: ReturnType<Page["locator"]>) {
  return locator.evaluate((el) => {
    const parse = (v: string) =>
      (v.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const lum = (c: number[]) => {
      const [r, g, b] = c.map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    let node: Element | null = el;
    let bgStr = getComputedStyle(el).backgroundColor;
    while (
      node &&
      /rgba\(\s*0,\s*0,\s*0,\s*0\s*\)|transparent/.test(bgStr) &&
      node.parentElement
    ) {
      node = node.parentElement;
      bgStr = getComputedStyle(node).backgroundColor;
    }
    const fg = lum(parse(getComputedStyle(el).color));
    const bg = lum(parse(bgStr));
    return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
  });
}

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-09 functions lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-09");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 09",
      );

      // The three concept images render and have descriptive alt text
      for (const section of ["define", "default", "return"]) {
        const picture = page.locator(`#${section} img`);
        await picture.scrollIntoViewIfNeeded();
        const alt = await picture.getAttribute("alt");
        expect(alt?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            picture.evaluate(
              (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Practice: default argument. Wrong answer, retry, then keyboard-selected correct answer
      const practice = page.locator("#practice");
      await practice.getByLabel("Chat: Pasta", { exact: true }).check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText("default Chat");
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice.getByLabel("Recipe: Pasta", { exact: true }).focus();
      await page.keyboard.press("Space");
      await practice.getByRole("button", { name: "Check answer" }).focus();
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Print or return: the function has no return line, so x holds None
      const printcheck = page.locator("#printcheck");
      await printcheck.getByLabel("Title: Pasta only", { exact: true }).check();
      await printcheck.getByRole("button", { name: "Check answer" }).click();
      await expect(printcheck.getByRole("status")).toContainText(
        "x holds None",
      );
      await printcheck.getByRole("button", { name: "Try again" }).click();
      await printcheck
        .getByLabel("Title: Pasta, then None", { exact: true })
        .check();
      await printcheck.getByRole("button", { name: "Check answer" }).click();
      await expect(printcheck.getByRole("status")).toContainText("Correct");

      // Docstring: the example shows the Args and Returns layout
      const docstring = page.locator("#docstring");
      await expect(docstring).toContainText("Args:");
      await expect(docstring).toContainText("Returns:");

      // Lab: presets change the shown result and the handed-back value
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();
      const shown = lab.getByTestId("shown-result");
      const returned = lab.getByTestId("returned-result");
      await expect(returned).toHaveText('"Chat: Pasta"');
      await expect(shown).toHaveText("Nothing");
      await lab
        .getByRole("button", {
          name: 'make_title("Pasta", "Recipe")',
          exact: true,
        })
        .click();
      await expect(returned).toHaveText('"Recipe: Pasta"');
      await lab
        .getByRole("button", { name: 'show_title("Pasta")', exact: true })
        .click();
      await expect(shown).toHaveText("Title: Pasta");
      await expect(returned).toHaveText("None");
      await lab
        .getByRole("button", {
          name: 'print(make_title("Pasta"))',
          exact: true,
        })
        .click();
      await expect(shown).toHaveText("Chat: Pasta");

      // Lab code: after show_title is pressed, line 0 is dimmed and line 3 is highlighted. Both pass 4.5:1
      const codePanel = lab.getByRole("region", {
        name: /The two functions and the call/,
      });
      await lab
        .getByRole("button", { name: 'show_title("Pasta")', exact: true })
        .click();
      for (const index of [0, 3]) {
        const ratio = await contrastOf(codePanel.locator("span").nth(index));
        expect(ratio).toBeGreaterThan(4.5);
      }

      // Active preset keeps readable colours while hovered (WCAG AA >= 4.5:1)
      const active = lab.getByRole("button", {
        name: 'show_title("Pasta")',
        exact: true,
      });
      await active.hover();
      await expect.poll(() => contrastOf(active)).toBeGreaterThan(4.5);

      // Final check: an unused return value does not print
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel("Note: Milk", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("does not print");
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel("done", { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");
    });
  }
}

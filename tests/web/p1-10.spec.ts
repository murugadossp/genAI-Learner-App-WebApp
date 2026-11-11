import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-10/meta.json";

for (const width of [390, 768, 1440]) {
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-10 modules and packages lesson`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-10");

      // Sections render in exact order as meta.json
      expect(
        await page
          .locator("article section[id]")
          .evaluateAll((els) => els.map((el) => el.id)),
      ).toEqual(meta.sections.map((s) => s.id));
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 10",
      );

      // Each of the four diagrams renders with descriptive alt text
      for (const section of ["module", "import", "package", "loads"]) {
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

      // The three import-style cards stay inside their list
      const styleList = page.getByTestId("import-styles");
      await expect(styleList.getByRole("listitem")).toHaveCount(3);
      expect(
        await styleList.evaluate((el) => el.scrollWidth <= el.clientWidth),
      ).toBeTruthy();

      // Practice check: wrong feedback, retry, keyboard
      const practice = page.locator("#practice");
      await expect(practice.locator("fieldset")).toHaveAttribute(
        "aria-describedby",
        /.+/,
      );
      await practice
        .getByLabel("It prints Topic: refund", { exact: true })
        .check();
      await practice.getByRole("button", { name: "Check answer" }).click();
      await expect(practice.getByRole("status")).toContainText(
        "which name the first line creates",
      );
      await practice.getByRole("button", { name: "Try again" }).click();
      await practice
        .getByLabel("NameError: name 'tags' is not defined", { exact: true })
        .focus();
      await page.keyboard.press("Space");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Enter");
      await expect(practice.getByRole("status")).toContainText("Correct");

      // Lab starts with no import line: the call cannot find the name json
      const lab = page.locator("#lab .lab");
      await expect(lab).toBeVisible();
      const name = lab.getByTestId("lab-name");
      const output = lab.getByTestId("lab-output");
      const message = lab.getByTestId("lab-message");
      const program = lab.getByTestId("lab-program");
      await expect(name).toHaveText("none");
      await expect(output).toHaveText("NameError: name 'json' is not defined");
      await expect(program).toContainText("# (no import line)");

      // import json creates the name json, so json.loads(reply) runs
      const importJson = lab.getByRole("button", {
        name: "import json",
        exact: true,
      });
      await importJson.click();
      await expect(importJson).toHaveAttribute("aria-pressed", "true");
      await expect(name).toHaveText("json");
      await expect(output).toHaveText("refund");
      await expect(program).toContainText("data = json.loads(reply)");
      await expect(lab.getByTestId("lab-data")).toHaveText(
        "{'topic': 'refund', 'urgent': True}",
      );

      // Active button hover contrast (WCAG AA >= 4.5:1)
      await importJson.hover();
      const ratio = await importJson.evaluate((el) => {
        const rgb = (s: string) =>
          (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
        const lum = (c: number[]) => {
          const [r, g, b] = c.map((v) => {
            const x = v / 255;
            return x <= 0.03928
              ? x / 12.92
              : Math.pow((x + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };
        const s = getComputedStyle(el);
        const a = lum(rgb(s.color));
        const b = lum(rgb(s.backgroundColor));
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      });
      expect(ratio).toBeGreaterThan(4.5);

      // The bare call fails after import json: the name loads was not created
      await lab
        .getByRole("button", { name: "loads(reply)", exact: true })
        .click();
      await expect(output).toHaveText("NameError: name 'loads' is not defined");
      await expect(message).toContainText("created the name json");

      // from json import loads creates loads, so the bare call runs
      await lab
        .getByRole("button", { name: "from json import loads", exact: true })
        .click();
      await expect(name).toHaveText("loads");
      await expect(output).toHaveText("refund");

      // import json as j creates only j: json.loads fails, j.loads runs
      await lab
        .getByRole("button", { name: "import json as j", exact: true })
        .click();
      await expect(name).toHaveText("j");
      await lab
        .getByRole("button", { name: "json.loads(reply)", exact: true })
        .click();
      await expect(output).toHaveText("NameError: name 'json' is not defined");
      await lab
        .getByRole("button", { name: "j.loads(reply)", exact: true })
        .click();
      await expect(output).toHaveText("refund");

      // Keyboard: a call button can be chosen with Enter
      await lab
        .getByRole("button", { name: "loads(reply)", exact: true })
        .focus();
      await page.keyboard.press("Enter");
      await expect(output).toHaveText("NameError: name 'loads' is not defined");

      // Reset returns to the starting choices
      await lab.getByRole("button", { name: "Reset" }).click();
      await expect(name).toHaveText("none");
      await expect(program).toContainText("data = json.loads(reply)");

      // Final check: disabled until a choice, wrong feedback, retry, correct
      const quiz = page.locator("#check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer" });
      await expect(checkBtn).toBeDisabled();
      await quiz.getByLabel('print(reply["topic"])', { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText(
        "reply is still a str",
      );
      await quiz.getByRole("button", { name: "Try again" }).click();
      await quiz.getByLabel('print(data["topic"])', { exact: true }).check();
      await checkBtn.click();
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // Theme toggle keeps the lab's and the quiz's state
      await lab
        .getByRole("button", { name: "import json as j", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(name).toHaveText("j");
      await expect(quiz.getByRole("status")).toContainText("Correct");

      // No horizontal overflow on the page
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }
}

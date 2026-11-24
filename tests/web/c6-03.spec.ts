import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c6-03/meta.json";

const screenshotDir = join(tmpdir(), "c6-03-rendered");
mkdirSync(screenshotDir, { recursive: true });

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(
      width + "px " + theme + ": c6-03 gradient descent lesson",
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript(
          (value) => localStorage.setItem("genai-theme", value),
          theme,
        );
        const errors: string[] = [];
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/learn/genai-basics/c6-03");

        const ids = await page
          .locator("article section[id]")
          .evaluateAll((elements) => elements.map((element) => element.id));
        expect(ids).toEqual(meta.sections.map((section) => section.id));
        await expect(page.locator(".lesson-toolbar a").first()).toHaveAttribute(
          "href",
          "/course/chapter-6",
        );
        await expect(
          page.getByText("Neural Networks and Deep Learning / Lesson 03"),
        ).toBeVisible();

        const infographic = page.locator("#step figure img");
        await expect(infographic).toHaveAttribute(
          "alt",
          "Gradient descent. A direction, then a step. w = 0; Slope = −4; Loss = 8; Rate = 0.25; w = 1; Loss = 4.5; Target = 4. The arrow moves down the bowl toward the target. Analogy: low point; a little at a time. Key takeaways: The learning rate scales the slope; Training repeats updates.",
        );
        await expect
          .poll(() =>
            infographic.evaluate(
              (image: HTMLImageElement) =>
                image.complete && image.naturalWidth > 0,
            ),
          )
          .toBeTruthy();

        const lab = page.getByTestId("gradient-lab");
        await expect(lab.getByTestId("prediction")).toHaveText("0.00");
        await expect(lab.getByTestId("loss")).toHaveText("8.00");
        await expect(lab.getByRole("img")).toHaveAccessibleName(
          /The toy loss bowl and update path/,
        );
        await expect(lab.getByRole("img")).toHaveAccessibleDescription(
          /U-shaped curve[\s\S]*target, 4[\s\S]*current prediction/,
        );

        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        ).toBeTruthy();
        await page.screenshot({
          path: join(screenshotDir, "c6-03-" + width + "-" + theme + ".png"),
          fullPage: true,
        });
        expect(errors).toEqual([]);
      },
    );
  }

test("gradient updates, learning-rate trade-off, theme state, and quiz retry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("genai-theme", "light"));
  await page.goto("/learn/genai-basics/c6-03");

  const lab = page.getByTestId("gradient-lab");
  const rate = lab.getByLabel(/Learning rate/);
  const prediction = lab.getByTestId("prediction");
  const loss = lab.getByTestId("loss");
  const readout = lab.locator('p[role="status"]');
  await expect(readout).toContainText("Step 0");
  await page.getByRole("button", { name: "Take one step" }).click();
  await expect(prediction).toHaveText("1.00");
  await expect(loss).toHaveText("4.50");
  await expect(readout).toContainText("Step 1");

  await page.getByRole("button", { name: "Reset" }).click();
  await rate.fill("0.05");
  await page.getByRole("button", { name: "Take one step" }).click();
  await expect(prediction).toHaveText("0.20");
  await expect(loss).toHaveText("7.22");

  await page.getByRole("button", { name: "Reset" }).click();
  await rate.fill("2.2");
  await page.getByRole("button", { name: "Take one step" }).click();
  await expect(prediction).toHaveText("8.80");
  await expect(loss).toHaveText("11.52");
  await page.getByRole("button", { name: "Take one step" }).click();
  await expect(prediction).toHaveText("-1.76");
  await expect(loss).toHaveText("16.59");

  await page.getByRole("button", { name: "Reset" }).click();
  await rate.fill("0.25");
  await page.getByRole("button", { name: "Run 8 more steps" }).click();
  await expect(prediction).toHaveText("3.60");
  await expect(loss).toHaveText("0.08");
  await expect(readout).toContainText("Step 8");
  await page.getByRole("button", { name: "Reset" }).click();

  await rate.focus();
  await page.keyboard.press("ArrowRight");
  await expect(rate).toHaveValue("0.3");
  const stepButton = page.getByRole("button", { name: "Take one step" });
  await stepButton.focus();
  await page.keyboard.press("Enter");
  await expect(prediction).toHaveText("1.20");
  await page.getByRole("button", { name: "Reset" }).click();

  await rate.fill("0.25");
  await page.getByRole("button", { name: "Take one step" }).click();
  await page
    .getByRole("button", { name: "Switch color theme" })
    .first()
    .click();
  await expect(prediction).toHaveText("1.00");
  await expect(rate).toHaveValue("0.25");
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(prediction).toHaveText("0.00");

  const quiz = page.locator("#check");
  const wrongAnswer = quiz.getByLabel(/w = 4/);
  await wrongAnswer.focus();
  await page.keyboard.press("Space");
  const checkButton = quiz.getByRole("button", { name: "Check answer" });
  await checkButton.focus();
  await page.keyboard.press("Enter");
  const feedback = quiz.getByRole("status");
  await expect(feedback).toContainText("Not quite");
  await expect(feedback).toContainText("does not jump all the way");
  const retryButton = quiz.getByRole("button", { name: "Try again" });
  await retryButton.focus();
  await page.keyboard.press("Enter");
  const correctAnswer = quiz.getByLabel(/w = 1/);
  await correctAnswer.focus();
  await page.keyboard.press("Space");
  await checkButton.focus();
  await page.keyboard.press("Enter");
  await expect(feedback).toContainText("Correct");
  await expect(feedback).toContainText("equals 1");
});

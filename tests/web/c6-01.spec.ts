import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c6-01/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(
      width + "px " + theme + ": c6-01 neurons, weights and biases",
      async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript((selectedTheme) => {
          if (!localStorage.getItem("genai-theme")) {
            localStorage.setItem("genai-theme", selectedTheme);
          }
        }, theme);
        await page.goto("/learn/genai-basics/c6-01");

        await expect(page.locator(".eyebrow").first()).toContainText(
          "Neural Networks and Deep Learning / Lesson 01",
        );
        await expect(
          page.getByRole("link", { name: "← Learning path" }),
        ).toHaveAttribute("href", "/course/chapter-6");

        const ids = await page
          .locator("article section[id]")
          .evaluateAll((sections) => sections.map((section) => section.id));
        expect(ids).toEqual(meta.sections.map((section) => section.id));

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "Neurons, weights and biases",
        );
        await expect(page.getByText(/not a tiny brain/).first()).toBeVisible();

        const lab = page.getByTestId("weight-lab");
        const rain = lab.getByRole("checkbox", { name: /Rain signal/ });
        const clouds = lab.getByRole("checkbox", { name: /Dark-cloud signal/ });
        const rainWeight = lab.getByRole("slider", { name: /Rain weight/ });
        const cloudWeight = lab.getByRole("slider", {
          name: /Dark-cloud weight/,
        });

        await expect(lab.getByTestId("score-value")).toHaveText("1");
        await expect(lab.getByTestId("reminder-result")).toContainText(
          "Reminder on",
        );
        await rainWeight.fill("0");
        await expect(lab.getByTestId("score-value")).toHaveText("-1");
        await expect(lab.getByTestId("reminder-result")).toContainText(
          "Reminder off",
        );
        await expect(lab.locator('[role="status"]')).toContainText("Score -1");

        await rain.uncheck();
        await clouds.check();
        await expect(lab.getByTestId("score-value")).toHaveText("-2");
        await expect(lab.locator('[role="status"]')).toContainText(
          "Reminder off",
        );

        await rainWeight.fill("1");
        await cloudWeight.fill("1");
        await clouds.uncheck();
        await expect(lab.getByTestId("score-value")).toHaveText("-1");

        // Theme changes keep the current interactive state.
        await cloudWeight.fill("1.5");
        await page
          .getByRole("button", { name: "Switch color theme" })
          .first()
          .click();
        await expect(lab.getByTestId("score-value")).toHaveText("-1");
        await expect(cloudWeight).toHaveValue("1.5");

        await rainWeight.focus();
        await expect(rainWeight).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(rainWeight).toHaveValue("1.5");
        await expect(lab.getByTestId("score-value")).toHaveText("-1");

        await lab.getByRole("button", { name: "Reset example" }).click();
        await expect(lab.getByTestId("score-value")).toHaveText("1");
        await expect(rain).toBeChecked();
        await expect(clouds).not.toBeChecked();

        await page.reload();
        await expect(page.locator("html")).toHaveAttribute(
          "data-theme",
          theme === "light" ? "dark" : "light",
        );

        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
      },
    );
  }

test("c6-01 knowledge check gives specific feedback and retries", async ({
  page,
}) => {
  await page.goto("/learn/genai-basics/c6-01");
  const status = page.locator("#check").getByRole("status");

  await page.getByLabel("Increase rain weight from 2 to 3.").check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(status).toContainText(
    "Rain is 0 here, so 0 times a different rain weight still contributes 0.",
  );

  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByLabel("Change bias from −1 to 0.").check();
  await page.getByRole("button", { name: "Check answer" }).click();
  await expect(status).toContainText(
    "Correct. Bias is added to the weighted inputs",
  );
});

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c6-02/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c6-02 layers and activations`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (value) => localStorage.setItem("genai-theme", value),
        theme,
      );
      await page.goto("/learn/genai-basics/c6-02");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "Neural Networks and Deep Learning / Lesson 02",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-6");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((elements) => elements.map((element) => element.id));
      expect(ids).toEqual(meta.sections.map((section) => section.id));

      const diagrams = page.locator("article section figure svg[role='img']");
      await expect(diagrams).toHaveCount(3);
      for (const diagram of await diagrams.all())
        expect(
          (await diagram.getAttribute("aria-label"))?.length,
        ).toBeGreaterThan(40);

      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);

      const lab = page.getByTestId("boundary-lab");
      const plot = lab.getByTestId("score-plot");
      await expect(plot).toHaveAttribute(
        "aria-label",
        /single affine transform makes one straight line with a boundary at offset zero/i,
      );

      await lab
        .getByRole("radio", { name: "Two transforms, no activation" })
        .check();
      await expect(plot).toHaveAttribute(
        "aria-label",
        /same straight line and one boundary/i,
      );

      await lab
        .getByRole("radio", { name: "Two transforms with ReLU" })
        .check();
      await expect(plot).toHaveAttribute(
        "aria-label",
        /score is above zero only between offsets minus 1.5 and 1.5/i,
      );
      await expect(lab.getByRole("status")).toContainText("minus 1.5 and 1.5");

      await lab.getByRole("button", { name: "Reset to one transform" }).click();
      await expect(plot).toHaveAttribute(
        "aria-label",
        /single affine transform makes one straight line/i,
      );

      const check = page.locator("#check");
      await check
        .getByRole("radio", { name: /Any added layer automatically/ })
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText(
        "does not measure accuracy or guarantee improvement",
      );
      await check.getByRole("button", { name: "Try again" }).click();
      await expect(check.getByRole("status")).toBeEmpty();
      await check
        .getByRole("radio", {
          name: /nonlinear step can change which input patterns/,
        })
        .check();
      await check.getByRole("button", { name: "Check answer" }).click();
      await expect(check.getByRole("status")).toContainText(
        "two boundary edges",
      );
    });
  }

test("c6-02 theme switch preserves the selected network and check state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("genai-theme", "light"));
  await page.goto("/learn/genai-basics/c6-02");

  const lab = page.getByTestId("boundary-lab");
  await lab.getByRole("radio", { name: "Two transforms with ReLU" }).check();
  const check = page.locator("#check");
  await check.getByRole("radio", { name: /nonlinear step can change/ }).check();

  await page
    .getByRole("button", { name: "Switch color theme" })
    .first()
    .click();
  await expect(
    lab.getByRole("radio", { name: "Two transforms with ReLU" }),
  ).toBeChecked();
  await expect(
    check.getByRole("radio", { name: /nonlinear step can change/ }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("c6-02 radio controls and quiz work from the keyboard", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto("/learn/genai-basics/c6-02");

  const lab = page.getByTestId("boundary-lab");
  const oneTransform = lab.getByRole("radio", { name: "One affine transform" });
  await oneTransform.focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    lab.getByRole("radio", { name: "Two transforms, no activation" }),
  ).toBeChecked();
  await page.keyboard.press("ArrowDown");
  await expect(
    lab.getByRole("radio", { name: "Two transforms with ReLU" }),
  ).toBeChecked();

  const check = page.locator("#check");
  await check
    .getByRole("radio", {
      name: /nonlinear step can change which input patterns/,
    })
    .focus();
  await page.keyboard.press("ArrowDown");
  await expect(
    check.getByRole("radio", { name: /Any added layer automatically/ }),
  ).toBeChecked();
  await page.keyboard.press("Tab");
  const submit = check.getByRole("button", { name: "Check answer" });
  await expect(submit).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(check.getByRole("status")).toContainText(
    "does not measure accuracy or guarantee improvement",
  );
});

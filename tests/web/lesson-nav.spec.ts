import { test, expect } from "@playwright/test";

test.describe("Previous / Next lesson navigation", () => {
  test("Chapter 1: first, middle, and last lessons navigate cleanly", async ({
    page,
  }) => {
    await page.goto("/learn/genai-basics/c1-01");
    const nav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link", { name: /Previous/ })).toHaveCount(0);
    const nextFromFirst = nav.getByRole("link", {
      name: /Next.*AI in everyday products/,
    });
    await expect(nextFromFirst).toHaveAttribute(
      "href",
      "/learn/genai-basics/c1-02",
    );
    await expect(
      nav.getByRole("link", { name: /Back to AI foundations/ }),
    ).toHaveAttribute("href", "/course/chapter-1");

    await nextFromFirst.click();
    await expect(page).toHaveURL(/\/learn\/genai-basics\/c1-02$/);
    const midNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      midNav.getByRole("link", {
        name: /Previous.*How AI, ML, deep learning and GenAI fit together/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c1-01");
    await expect(
      midNav.getByRole("link", {
        name: /Next.*Data, examples, features and labels/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c1-03");

    await midNav.getByRole("link", { name: /Previous/ }).click();
    await expect(page).toHaveURL(/\/learn\/genai-basics\/c1-01$/);

    await page.goto("/learn/genai-basics/c1-07");
    const lastNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      lastNav.getByRole("link", {
        name: /Previous.*What AI is good and bad at/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c1-06");
    await expect(lastNav.getByRole("link", { name: /Next/ })).toHaveCount(0);
    await expect(
      lastNav.getByRole("link", { name: /Back to/ }),
    ).toHaveAttribute("href", "/course/chapter-1");
  });

  test("Chapter 2: first, middle, and last lessons", async ({ page }) => {
    await page.goto("/learn/genai-basics/c2-01");
    const firstNav = page.getByRole("navigation", {
      name: "Lesson navigation",
    });
    await expect(firstNav.getByRole("link", { name: /Previous/ })).toHaveCount(
      0,
    );
    await expect(
      firstNav.getByRole("link", {
        name: /Next.*How a model predicts the next token/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c2-02");

    await page.goto("/learn/genai-basics/c2-05");
    const midNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      midNav.getByRole("link", {
        name: /Previous.*From base model to assistant/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c2-04");
    await expect(
      midNav.getByRole("link", { name: /Next.*The context window/ }),
    ).toHaveAttribute("href", "/learn/genai-basics/c2-06");

    await page.goto("/learn/genai-basics/c2-10");
    const lastNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      lastNav.getByRole("link", { name: /Previous.*Temperature and sampling/ }),
    ).toHaveAttribute("href", "/learn/genai-basics/c2-09");
    await expect(lastNav.getByRole("link", { name: /Next/ })).toHaveCount(0);
  });

  test("Chapter 4: first, middle, and last lessons navigate cleanly", async ({
    page,
  }) => {
    await page.goto("/learn/genai-basics/c4-01");
    const firstNav = page.getByRole("navigation", {
      name: "Lesson navigation",
    });
    await expect(firstNav.getByRole("link", { name: /Previous/ })).toHaveCount(
      0,
    );
    await firstNav
      .getByRole("link", { name: /Next.*Regression: predicting numbers/ })
      .click();
    await expect(page).toHaveURL(/\/learn\/genai-basics\/c4-02$/);

    const midNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      midNav.getByRole("link", { name: /Previous.*Supervised learning/ }),
    ).toHaveAttribute("href", "/learn/genai-basics/c4-01");
    await expect(
      midNav.getByRole("link", {
        name: /Next.*Classification: choosing categories/,
      }),
    ).toHaveAttribute("href", "/learn/genai-basics/c4-03");

    await page.goto("/learn/genai-basics/c4-08");
    const lastNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      lastNav.getByRole("link", { name: /Previous.*Search and planning/ }),
    ).toHaveAttribute("href", "/learn/genai-basics/c4-07");
    await expect(lastNav.getByRole("link", { name: /Next/ })).toHaveCount(0);
    await expect(
      lastNav.getByRole("link", { name: /Back to How Machines Learn/ }),
    ).toHaveAttribute("href", "/course/chapter-4");
  });

  test("Python P1: first, middle, and last lessons navigate cleanly", async ({
    page,
  }) => {
    await page.goto("/learn/python-for-ai/p1-01");
    const firstNav = page.getByRole("navigation", {
      name: "Lesson navigation",
    });
    await expect(firstNav.getByRole("link", { name: /Previous/ })).toHaveCount(
      0,
    );
    await firstNav.getByRole("link", { name: /Next.*Operators/ }).click();
    await expect(page).toHaveURL(/\/learn\/python-for-ai\/p1-02$/);

    const midNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      midNav.getByRole("link", { name: /Previous.*Variables and Data Types/ }),
    ).toHaveAttribute("href", "/learn/python-for-ai/p1-01");
    await expect(
      midNav.getByRole("link", { name: /Next.*Strings/ }),
    ).toHaveAttribute("href", "/learn/python-for-ai/p1-03");

    await page.goto("/learn/python-for-ai/p1-14");
    const lastNav = page.getByRole("navigation", { name: "Lesson navigation" });
    await expect(
      lastNav.getByRole("link", { name: /Previous.*Columns and tables/ }),
    ).toHaveAttribute("href", "/learn/python-for-ai/p1-13");
    await expect(lastNav.getByRole("link", { name: /Next/ })).toHaveCount(0);
    await expect(
      lastNav.getByRole("link", { name: /Back to/ }),
    ).toHaveAttribute("href", "/course/chapter-p1");
  });

  for (const width of [390, 768, 1440]) {
    for (const theme of ["light", "dark"] as const) {
      test(`${width}px ${theme}: responsive layout with no horizontal overflow`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript(
          (t) => localStorage.setItem("genai-theme", t),
          theme,
        );
        await page.goto("/learn/genai-basics/c4-02");
        const nav = page.getByRole("navigation", {
          name: "Lesson navigation",
        });
        const prevLink = nav.getByRole("link", {
          name: /Previous.*Supervised learning/,
        });
        const nextLink = nav.getByRole("link", {
          name: /Next.*Classification: choosing categories/,
        });
        const backLink = nav.getByRole("link", {
          name: /Back to How Machines Learn/,
        });

        await expect(prevLink).toBeVisible();
        await expect(nextLink).toBeVisible();
        await expect(backLink).toBeVisible();

        const [prevBox, nextBox] = await Promise.all([
          prevLink.boundingBox(),
          nextLink.boundingBox(),
        ]);
        expect(prevBox).not.toBeNull();
        expect(nextBox).not.toBeNull();
        if (width <= 640) {
          // Stacked vertically on narrow screens.
          expect(nextBox!.y).toBeGreaterThanOrEqual(
            prevBox!.y + prevBox!.height - 1,
          );
        } else {
          // Side-by-side on wider screens.
          expect(Math.abs(prevBox!.y - nextBox!.y)).toBeLessThan(4);
          expect(nextBox!.x).toBeGreaterThan(prevBox!.x);
        }

        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBeTruthy();
      });
    }
  }
});

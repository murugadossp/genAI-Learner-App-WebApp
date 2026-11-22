import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-07/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-07 search and planning`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-07");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 07",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      for (const section of ["what-is-search", "planning-vs-learning"]) {
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

      // Interactive Maze route explorer
      const lab = page.getByTestId("maze-lab");
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "0 squares checked",
      );

      // Active button hover contrast check (Warehouse aisle & Layer-by-layer)
      const bfsBtn = lab.getByRole("button", { name: "Layer-by-layer (BFS)" });
      await expect(bfsBtn).toHaveAttribute("aria-pressed", "true");
      await bfsBtn.hover();
      const hoverColors = await bfsBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Warehouse aisle: BFS -> 14 checked, 5 steps
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "14 squares checked",
      );
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 5 steps",
      );

      // Warehouse aisle: DFS -> 12 checked, 11 steps
      await lab.getByRole("button", { name: "Corridor-first (DFS)" }).click();
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "12 squares checked",
      );
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 11 steps",
      );

      // Warehouse aisle: Goal-guided -> 8 checked, 5 steps
      await lab
        .getByRole("button", { name: "Goal-guided (Heuristic)" })
        .click();
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "8 squares checked",
      );
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 5 steps",
      );

      // Detour trap: BFS -> 17 checked, 6 steps vs Greedy -> 10 checked, 8 steps
      await lab.getByRole("button", { name: "Detour trap" }).click();
      await lab.getByRole("button", { name: "Layer-by-layer (BFS)" }).click();
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "17 squares checked",
      );
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 6 steps",
      );

      await lab
        .getByRole("button", { name: "Goal-guided (Heuristic)" })
        .click();
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "10 squares checked",
      );
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 8 steps",
      );
      await expect(lab.getByRole("status")).toContainText(
        "route found in 8 steps after checking 10 squares",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 8 steps",
      );

      // Wall edit updates description and replans immediately (also verifies heuristic estimate in cell label)
      await lab
        .getByRole("button", {
          name: /Row 4, Col 1:.*Estimated 5 steps to Goal\. Activate to place crate/,
        })
        .click();
      await expect(lab.getByTestId("map-description")).toContainText(
        "Custom wall layout edited on Detour trap",
      );
      await lab.getByRole("button", { name: "Run to goal" }).click();
      await expect(lab.getByTestId("route-length")).toHaveText(
        "Route: 6 steps",
      );

      // Step & Reset
      await lab.getByRole("button", { name: "Reset map" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "0 squares checked",
      );
      await expect(lab.getByTestId("map-description")).toContainText(
        "8-step detour",
      );
      await lab.getByRole("button", { name: "Step forward" }).click();
      await expect(lab.getByTestId("squares-checked")).toHaveText(
        "1 square checked",
      );

      // Knowledge check: wrong feedback, retry, then correct
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page
        .getByLabel(/It used machine learning to train on the building/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("zero past delivery logs");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/Testing possible routes on this map automatically trained/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("bookkeeping for the current map");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(
          /It used search and planning to find a sequence of allowed moves/,
        )
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c4-04/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c4-04 unsupervised learning and clustering`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c4-04");

      await expect(page.locator(".eyebrow").first()).toContainText(
        "How Machines Learn / Lesson 04",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-4");

      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify both conceptual diagrams load and have descriptive alt text
      for (const section of ["no-labels", "clusters-vs-categories"]) {
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

      // Interactive clustering lab
      const lab = page.getByTestId("clustering-lab");
      await lab.scrollIntoViewIfNeeded();

      const noGroupsBtn = lab.getByRole("button", { name: "No groups" });
      await expect(noGroupsBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("lab-status")).toContainText(
        "Unlabeled view",
      );

      // Hover contrast check on active button
      await noGroupsBtn.hover();
      const hoverColors = await noGroupsBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(hoverColors.bg).not.toBe(hoverColors.fg);
      expect(hoverColors.bg).not.toBe("rgb(237, 240, 231)");
      expect(hoverColors.bg).not.toBe("rgb(44, 54, 46)");

      // Switch to 3 clusters
      const threeBtn = lab.getByRole("button", { name: "3 clusters" });
      await threeBtn.click();
      await expect(threeBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "Cluster 1 (4 books)",
      );
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "Cluster 3 (4 books)",
      );

      // Hover contrast check on newly active 3 clusters button
      await threeBtn.hover();
      const threeHover = await threeBtn.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, fg: cs.color };
      });
      expect(threeHover.bg).not.toBe(threeHover.fg);
      expect(threeHover.bg).not.toBe("rgb(237, 240, 231)");
      expect(threeHover.bg).not.toBe("rgb(44, 54, 46)");

      // Reveal human shelves
      const revealBtn = lab.getByRole("button", {
        name: "Reveal human shelves",
      });
      await revealBtn.click();
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "2 Picture books",
      );
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "1 Travel",
      );
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "1 Poetry",
      );
      await expect(lab.getByTestId("book-inspector")).toContainText("Travel");

      // Inspect another book via keyboard
      const sourdoughPoint = lab.getByRole("button", {
        name: /Sourdough Basics/,
      });
      await sourdoughPoint.focus();
      await page.keyboard.press("Enter");
      await expect(lab.getByTestId("book-inspector")).toContainText(
        "Sourdough Basics",
      );
      await expect(lab.getByTestId("book-inspector")).toContainText(
        "Cookbooks",
      );

      // Check 4 clusters split
      await lab.getByRole("button", { name: "4 clusters" }).click();
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "Cluster 4 (2 books)",
      );

      // Theme toggle preserves lab state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("cluster-summary")).toContainText(
        "Cluster 4 (2 books)",
      );
      await expect(lab.getByTestId("book-inspector")).toContainText(
        "Sourdough Basics",
      );

      // Reset lab
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(noGroupsBtn).toHaveAttribute("aria-pressed", "true");
      await expect(lab.getByTestId("book-inspector")).toContainText("Hidden");

      // Knowledge check
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await page.getByLabel(/The clustering failed because/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText(
        "does not establish a clustering failure",
      );
      await page.getByRole("button", { name: "Try again" }).click();

      await page.getByLabel(/discovered a real hidden category/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("similarity group");
      await page.getByRole("button", { name: "Try again" }).click();

      await page
        .getByLabel(/The algorithm grouped visits using visit length/)
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

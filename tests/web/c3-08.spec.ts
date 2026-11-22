import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/genai-basics/c3-08/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: c3-08 checking facts, sources and generated code`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/genai-basics/c3-08");

      // Chapter context and link.
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Prompting and Working with AI / Lesson 08",
      );
      await expect(
        page.getByRole("link", { name: "← Learning path" }),
      ).toHaveAttribute("href", "/course/chapter-3");

      // Section order matches meta.json.
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Both conceptual illustrations load and have descriptive alt text (>40 chars).
      for (const section of ["principle", "sources"]) {
        const img = page.locator(`#${section} figure img`);
        await img.scrollIntoViewIfNeeded();
        expect((await img.getAttribute("alt"))?.length).toBeGreaterThan(40);
        await expect
          .poll(() =>
            img.evaluate(
              (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
            ),
          )
          .toBe(true);
      }

      // Interactive VerifyLab.
      const lab = page.getByTestId("verify-lab");
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 0 of 2",
      );

      // Hover contrast on active step tab button.
      const activeTab = lab.getByRole("button", { name: /1\. Fact check/ });
      await expect(activeTab).toHaveAttribute("aria-pressed", "true");
      await activeTab.hover();
      const colors = await activeTab.evaluate((el) => {
        const cs = getComputedStyle(el);
        const panel = getComputedStyle(document.documentElement)
          .getPropertyValue("--panel")
          .trim();
        return { bg: cs.backgroundColor, fg: cs.color, panel };
      });
      expect(colors.bg).not.toBe(colors.fg);
      expect(colors.bg).not.toBe("rgba(0, 0, 0, 0)");

      // Step 1: Fact check — picking the right verdict before opening the notice does not count as verified yet.
      await lab.getByLabel(/Wrong detail in the reply/).check();
      await expect(lab.getByTestId("fact-feedback")).toContainText(
        "open the Official 2026 Notice above",
      );
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 0 of 2",
      );
      await lab
        .getByRole("button", { name: "Open Official 2026 Notice" })
        .click();
      await expect(lab.getByTestId("fact-notice")).toContainText(
        "Ages 5 and under",
      );
      await expect(lab.getByTestId("fact-feedback")).toContainText("Correct");
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 1 of 2",
      );
      await lab.getByLabel(/Supported by the notice/).check();
      await expect(lab.getByTestId("fact-feedback")).toContainText("Not quite");
      await expect(lab.getByTestId("lab-live")).toContainText(
        "ages 5 and under",
      );
      await lab.getByLabel(/Wrong detail in the reply/).check();
      await expect(lab.getByTestId("fact-feedback")).toContainText("Correct");
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 1 of 2",
      );

      // Step 2: Source check.
      await lab.getByRole("button", { name: /2\. Source check/ }).click();
      await lab
        .getByRole("button", { name: /Ask AI: “Are you sure\?”/ })
        .click();
      await expect(lab.getByTestId("source-ai-reply")).toContainText(
        "Section 4",
      );
      await lab
        .getByRole("button", { name: "Open Official 2026 Notice" })
        .click();
      await expect(lab.getByTestId("source-notice")).toContainText(
        "only on weekends",
      );
      await lab.getByLabel(/Citation proves the rule/).check();
      await expect(lab.getByTestId("source-feedback")).toContainText(
        "Not quite",
      );
      await lab.getByLabel(/Invented section and wrong rule/).check();
      await expect(lab.getByTestId("source-feedback")).toContainText("Correct");
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 2 of 2",
      );

      // Step 3: Optional code check.
      await lab.getByRole("button", { name: /3\. Code check/ }).click();
      await lab.getByRole("button", { name: "Age 30 (normal)" }).click();
      await expect(lab.getByTestId("code-test-result")).toContainText("Match");
      await lab.getByRole("button", { name: "Age 5 (boundary)" }).click();
      await expect(lab.getByTestId("code-test-result")).toContainText(
        "Mismatch — boundary bug",
      );
      await lab.getByLabel(/Bug on boundary ages/).check();
      await expect(lab.getByTestId("code-feedback")).toContainText("Correct");
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Optional code check verified",
      );

      // Theme toggle preserves lab state.
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 2 of 2",
      );
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Optional code check verified",
      );

      // Reset clears all lab state.
      await lab.getByRole("button", { name: "Reset lab" }).click();
      await expect(lab.getByTestId("lab-progress")).toContainText(
        "Required checks verified: 0 of 2",
      );

      // Knowledge check: wrong feedback, retry, correct answer.
      await page.getByLabel(/Use the 6 PM time as written/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      const quizStatus = page.locator(".knowledge-check").getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("numbered section does not prove");
      await page.getByRole("button", { name: "Try again" }).click();
      await page.getByLabel(/Ask the same chat to quote/).check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("not an independent check");
      await page.getByRole("button", { name: "Try again" }).click();
      await page
        .getByLabel(/Open the official city parking code yourself/)
        .check();
      await page.getByRole("button", { name: "Check answer" }).click();
      await expect(quizStatus).toContainText("Correct");

      // Bounded horizontal overflow.
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
    });
  }

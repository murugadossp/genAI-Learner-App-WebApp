import { test, expect } from "@playwright/test";
import meta from "../../src/lessons/python-for-ai/p1-04/meta.json";

for (const width of [390, 768, 1440])
  for (const theme of ["light", "dark"] as const) {
    test(`${width}px ${theme}: p1-04 lists lesson`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      await page.addInitScript(
        (t) => localStorage.setItem("genai-theme", t),
        theme,
      );
      await page.goto("/learn/python-for-ai/p1-04");

      // Verify sections render in exact order matching meta.json
      const ids = await page
        .locator("article section[id]")
        .evaluateAll((els) => els.map((e) => e.id));
      expect(ids).toEqual(meta.sections.map((s) => s.id));

      // Verify eyebrow displays Python for AI / Lesson 04
      await expect(page.locator(".eyebrow").first()).toContainText(
        "Python for AI / Lesson 04",
      );

      // Verify infographic image loads with valid alt text (>40 chars)
      const diagram = page.locator("article figure img");
      await expect(diagram).toHaveCount(1);
      await diagram.scrollIntoViewIfNeeded();
      await expect
        .poll(() => diagram.evaluate((e: HTMLImageElement) => e.naturalWidth))
        .toBeGreaterThan(0);
      expect(
        ((await diagram.getAttribute("alt")) ?? "").length,
      ).toBeGreaterThan(40);

      // Verify ListMemoryVisual diagram
      const visual = page.locator(
        'div[aria-label="Interactive List Structure & Indexing Diagram"]',
      );
      await expect(visual).toBeVisible();
      await expect(visual).toContainText("refund_policy");
      await expect(visual).toContainText("+0");
      await expect(visual).toContainText("-4");

      // Switch mode on visual diagram
      await visual
        .getByRole("button", { name: "2. Slice Window [1:3]" })
        .click();
      await expect(visual).toContainText("retrieved_docs[1:3]");

      // Verify interactive sandbox
      const lab = page.locator(
        'div[aria-label="Interactive AI List Processing Sandbox"]',
      );
      await expect(lab).toBeVisible();

      // Initial state: RAG Candidates preset
      await expect(lab).toContainText("len(retrieved_docs) = 4");
      await expect(lab).toContainText('"refund_policy"');
      await expect(lab).toContainText('"shipping_faq"');

      // Verify active button maintains contrast on hover without falling back to panel background
      const activePresetBtn = lab.getByRole("button", {
        name: "RAG Candidates",
      });
      await activePresetBtn.hover();
      const activeBg = await activePresetBtn.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      const labBg = await lab.evaluate(
        (e) => getComputedStyle(e).backgroundColor,
      );
      expect(activeBg).not.toBe(labBg);

      // Switch to Chat History preset
      await lab.getByRole("button", { name: "Chat History" }).click();
      await expect(lab).toContainText('"system_instruction"');
      await expect(lab).toContainText('"user_query_1"');

      // Switch to Confidence Scores preset
      await lab.getByRole("button", { name: "Confidence Scores" }).click();
      await expect(lab).toContainText('"conf_0.94"');

      // Test Index Inspector by clicking slot 1
      await lab.getByLabel(/Index 1 \(negative -3\)/).click();
      await expect(lab).toContainText("retrieved_docs[1]");
      await expect(lab).toContainText('"conf_0.88"');

      // Switch back to RAG Candidates
      await lab.getByRole("button", { name: "RAG Candidates" }).click();

      // Test slicing controls
      const stopSelect = lab.getByLabel("Stop index");
      await stopSelect.selectOption("1");
      await expect(lab).toContainText("Yields 1 items");
      await expect(lab).toContainText('["refund_policy"]');

      // Test in-place .append()
      await lab.getByRole("button", { name: ".append()", exact: true }).click();
      await expect(lab).toContainText("len(retrieved_docs) = 5");
      await expect(lab).toContainText('"user_profile"');

      // Test configurable slot update and clamp behavior after pop
      const slotSelect = lab.getByLabel("Select slot to update");
      await slotSelect.selectOption("4"); // Select last slot (index 4)
      await lab.getByRole("button", { name: ".pop() Tail" }).click(); // Pop tail (now len = 4)
      await expect(slotSelect).toHaveValue("3"); // Selector clamped to last valid slot 3
      const updateInput = lab.getByLabel("New text for slot");
      await updateInput.fill("clamped_rule");
      await lab.getByRole("button", { name: "Assign docs[i]" }).click();
      // Assert specifically that slot 3 displays the new clamped value
      await expect(lab.getByLabel(/Index 3/)).toContainText("clamped_rule");

      // Test trap: Trigger Bug
      await lab
        .getByRole("button", { name: "Trigger Bug: docs = docs.append()" })
        .click();
      await expect(lab).toContainText(
        "⚠️ The .append() Return Trap Triggered!",
      );
      await expect(lab).toContainText("rebound to None");
      await expect(lab).toContainText("AttributeError");
      await expect(lab).toContainText("TypeError");

      // Theme toggle preserves trap state
      await page
        .getByRole("button", { name: "Switch color theme" })
        .first()
        .click();
      await expect(lab).toContainText(
        "⚠️ The .append() Return Trap Triggered!",
      );

      // Restore list reference and verify the underlying list preserved items
      await lab
        .getByRole("button", {
          name: "Restore reference (Simulation demo)",
        })
        .click();
      await expect(lab).not.toContainText(
        "⚠️ The .append() Return Trap Triggered!",
      );
      await expect(lab).toContainText("len(retrieved_docs) = 5");

      // Reset sandbox
      await lab.getByRole("button", { name: "Reset sandbox" }).click();
      await expect(lab).toContainText("len(retrieved_docs) = 4");

      // Knowledge check: initially disabled
      const quiz = page.locator(".knowledge-check");
      const checkBtn = quiz.getByRole("button", { name: "Check answer →" });
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 1: Option 0
      await quiz
        .getByLabel(/top_candidates evaluates to \['doc_billing'/)
        .check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      const quizStatus = quiz.getByRole("status");
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText("rebinds candidates to None");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Wrong answer 2: Option 3 (IndexError misconception)
      await quiz.getByLabel(/IndexError: list index out of range/).check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Not quite");
      await expect(quizStatus).toContainText(".append() never raises");

      // Retry
      await quiz.getByRole("button", { name: "Try again" }).click();
      await expect(checkBtn).toBeDisabled();

      // Correct answer: Option 1 (index 1: TypeError)
      await quiz
        .getByLabel(/TypeError: 'NoneType' object is not subscriptable/)
        .check();
      await expect(checkBtn).toBeEnabled();
      await checkBtn.click();
      await expect(quizStatus).toContainText("Correct");
      await expect(quizStatus).toContainText("list.append() method mutates");

      // Check course link
      await expect(
        page.locator("a", {
          hasText: "Next up: Tuples and Sets in Chapter P1 →",
        }),
      ).toHaveAttribute("href", "/course/chapter-p1");

      // Bounded horizontal scroll check
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }

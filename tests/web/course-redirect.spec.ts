import { test, expect } from "@playwright/test";

test("/course permanently redirects to the chapter 2 course page", async ({
  request,
}) => {
  const response = await request.get("/course", { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toBe("/course/chapter-2");
});

test("/course/chapter-2 renders the chapter page", async ({ page }) => {
  await page.goto("/course/chapter-2");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

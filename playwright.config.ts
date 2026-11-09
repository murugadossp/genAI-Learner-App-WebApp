import { defineConfig } from "@playwright/test";
const port = process.env.TEST_PORT || "3100";
export default defineConfig({
  testDir: "tests/web",
  use: { baseURL: `http://127.0.0.1:${port}`, browserName: "chromium" },
  webServer: {
    command: `npm run start -- -p ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30000,
  },
});

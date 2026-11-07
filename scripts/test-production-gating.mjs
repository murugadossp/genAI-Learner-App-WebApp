import { cp, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, basename } from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { lessons } from "./lesson-registry.mjs";

const root = resolve(import.meta.dirname, "..");
const dir = await mkdtemp(join(tmpdir(), "web-production-check-"));
const ignored = new Set([
  ".git",
  ".next",
  "node_modules",
  "test-results",
  "playwright-report",
]);
let server;
function command(program, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(program, args, {
      cwd: dir,
      stdio: "inherit",
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`${program} exited with ${code}`)),
    );
  });
}
try {
  await cp(root, dir, {
    recursive: true,
    filter: (path) => path === root || !ignored.has(basename(path)),
  });
  await cp(join(root, "node_modules"), join(dir, "node_modules"), {
    recursive: true,
    verbatimSymlinks: true,
  });
  await command("npm", ["run", "build"], {
    env: { ...process.env, APP_ENV: "production", VERCEL_ENV: "" },
  });
  const port = await new Promise((resolvePromise, reject) => {
    const listener = createServer();
    listener.on("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const port = listener.address().port;
      listener.close(() => resolvePromise(port));
    });
  });
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-p",
      String(port),
      "-H",
      "127.0.0.1",
    ],
    { cwd: dir, stdio: "ignore" },
  );
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      await fetch(`http://127.0.0.1:${port}/`);
      ready = true;
      break;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  if (!ready) throw new Error("Production server failed to start");
  for (const [path, expected] of [
    ["/", 200],
    ["/studio", 404],
    ["/course", 404],
    ...lessons()
      .map((lesson) => [
        `/learn/${lesson.module}/${lesson.lessonId}`,
        lesson.webStatus === "published" ? 200 : 404,
      ]),
  ]) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, {
      redirect: "manual",
    });
    if (response.status !== expected)
      throw new Error(`${path}: expected ${expected}, got ${response.status}`);
    if (path === "/" && !(await response.text()).includes("coming soon"))
      throw new Error("Production home is not the placeholder");
    console.log(`${path}: ${response.status}`);
  }
} finally {
  if (server) {
    server.kill();
    await new Promise((r) => server.once("exit", r));
  }
  await rm(dir, { recursive: true, force: true });
}

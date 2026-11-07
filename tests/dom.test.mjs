import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const html = readFileSync(
  new URL("../mockups/index.html", import.meta.url),
  "utf8",
);
const script = readFileSync(
  new URL("../mockups/app.js", import.meta.url),
  "utf8",
);
function setup(t, hash = "#lesson") {
  const dom = new JSDOM(html, {
    url: `http://localhost/mockups/${hash}`,
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  t.after(() => dom.window.close());
  const w = dom.window;
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function () {
    w.lastScrolled = this;
  };
  // These stubs cover application state only. Native Escape/Tab/focus trapping requires browser review.
  w.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new w.Event("close"));
  };
  w.eval(script);
  const $ = (s) => w.document.querySelector(s);
  const route = (hash) => {
    w.history.pushState(null, "", hash);
    w.dispatchEvent(new w.HashChangeEvent("hashchange"));
  };
  return { w, $, route };
}
test("landing preview, catalog groups, metadata search, empty state, and nav destination", (t) => {
  const { w, $, route } = setup(t, "#landing");
  $("#hero-try").click();
  assert.equal($("#hero-word").textContent, "clear");
  assert.equal($("nav a:last-child").hash, "#home/catalog");
  route("#home");
  assert.equal(w.document.querySelectorAll("#catalog-results .card").length, 7);
  for (const group of ["Mathematics", "RAG"]) {
    $(`[data-filter="${group}"]`).click();
    assert.equal(
      w.document.querySelectorAll("#catalog-results .card").length,
      1,
    );
  }
  $('[data-filter="All"]').click();
  for (const query of ["Visual intuition", "Tradeoffs", "Engineering"]) {
    $("#search").value = query;
    $("#search").dispatchEvent(new w.Event("input"));
    assert.equal(
      w.document.querySelectorAll("#catalog-results .card").length,
      1,
    );
  }
  $("#search").value = "not-a-topic";
  $("#search").dispatchEvent(new w.Event("input"));
  assert.ok($(".empty"));
});
test("history-style hash navigation and leaving the lesson preserve its lab and quiz nodes", async (t) => {
  const { w, $, route } = setup(t);
  const lab = $("#generation-lab");
  $("#next-token").click();
  $('[value="b"]').click();
  $("#check-answer").click();
  route("#lesson/experiment");
  assert.equal(w.document.activeElement, $("#experiment h2"));
  await new Promise((resolve) => {
    w.addEventListener("hashchange", resolve, { once: true });
    w.history.back();
  });
  assert.equal(w.location.hash, "#lesson");
  assert.equal($("#generation-lab"), lab);
  assert.equal($("#sentence").textContent, "The sky is blue");
  assert.ok($('[value="b"]').checked);
  assert.match($("#feedback").textContent, /Correct/);
  route("#course");
  route("#lesson");
  assert.equal($("#generation-lab"), lab);
  assert.ok($('[value="b"]').checked);
});
test("quiz selection and submission keep the live region mounted and accessible", (t) => {
  const { w, $ } = setup(t);
  const feedback = $("#feedback");
  assert.equal(feedback.hidden, false);
  assert.equal(feedback.getAttribute("role"), "status");
  assert.ok(feedback.classList.contains("visually-hidden"));
  assert.ok($("#check-answer").disabled);
  $('[value="a"]').click();
  assert.equal($("#check-answer").disabled, false);
  assert.equal(feedback.textContent, "");
  $("#check-answer").click();
  assert.match(feedback.textContent, /Not quite/);
  assert.equal(feedback.hidden, false);
  $('[value="b"]').click();
  assert.equal(feedback.textContent, "");
  assert.ok(feedback.classList.contains("visually-hidden"));
  $("#check-answer").click();
  assert.match(feedback.textContent, /Correct/);
  assert.equal($("#feedback"), feedback);
});
test("workspace preserves one lab, theme state and return focus", (t) => {
  const { w, $ } = setup(t);
  const lab = $("#generation-lab");
  $("#next-token").click();
  $("#expand-workspace").click();
  assert.ok($("#wide-workspace").open);
  assert.equal($("#workspace-slot #generation-lab"), lab);
  $("#next-token").click();
  $("[data-toggle-theme]").click();
  assert.equal($("#theme").getAttribute("aria-pressed"), "true");
  assert.equal($("[data-toggle-theme]").getAttribute("aria-pressed"), "true");
  assert.equal(w.localStorage.getItem("genai-theme"), "dark");
  $('[data-close-dialog="wide-workspace"]').click();
  assert.equal($("#lab-home #generation-lab"), lab);
  assert.equal($("#sentence").textContent, "The sky is blue today");
  assert.equal(w.document.activeElement, $("#expand-workspace"));
  assert.equal(w.document.body.classList.contains("dialog-open"), false);
  $("#next-token").click();
  assert.ok($("#next-token").disabled);
  $("#restart-lab").click();
  assert.equal($("#sentence").textContent, "The sky is");
});
test("section menu moves focus to the selected heading, including same-hash selection", (t) => {
  const { w, $, route } = setup(t);
  route("#lesson/check");
  $('[data-open-menu="sections"]').click();
  $('#menu-links a[href="#lesson/check"]').click();
  assert.equal(w.document.activeElement, $("#check h2"));
  assert.equal($("#lesson-menu").open, false);
});
test("completion, reset and consecutive toasts", (t) => {
  const { w, $, route } = setup(t);
  const timers = new Map();
  let id = 0;
  const nativeTimeout = w.setTimeout.bind(w);
  const nativeClear = w.clearTimeout.bind(w);
  w.setTimeout = (fn, delay) => {
    if (delay !== 2600) return nativeTimeout(fn, delay);
    timers.set(++id, fn);
    return id;
  };
  w.clearTimeout = (id) => {
    timers.delete(id);
    nativeClear(id);
  };
  $("#complete").click();
  assert.equal(w.localStorage.getItem("genai-demo-complete"), "true");
  $("#complete").click();
  assert.equal(timers.size, 1);
  route("#home");
  assert.match($(".resume").textContent, /Lesson completed/);
  $("#reset").click();
  assert.equal(w.localStorage.getItem("genai-demo-complete"), null);
  assert.equal(timers.size, 1);
  route("#lesson");
  assert.equal($("#sentence").textContent, "The sky is");
  assert.equal($("input:checked"), null);
});
test("demo remains usable when local storage is unavailable", (t) => {
  const { w, $ } = setup(t);
  Object.defineProperty(w, "localStorage", {
    get() {
      throw new Error("blocked");
    },
  });
  $("#theme").click();
  $("#complete").click();
  $("#reset").click();
  assert.ok($("#generation-lab"));
});

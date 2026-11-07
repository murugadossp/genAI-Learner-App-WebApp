const $ = (s) => document.querySelector(s);
const storage = {
  get(k) {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  remove(k) {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};
const courses = [
  {
    title: "AI foundations",
    group: "Foundations",
    icon: "◎",
    level: "Start here",
    body: "Build a mental model of AI, from data and training to the systems around a model.",
    meta: "Concepts · Everyday examples",
  },
  {
    title: "How language models work",
    group: "LLMs",
    icon: "▥",
    level: "Core concepts",
    body: "Follow the journey from tokens to predictions, context, and generation.",
    meta: "Visual labs · Guided explanations",
  },
  {
    title: "Python for AI",
    group: "Python",
    icon: "{ }",
    level: "Practical",
    body: "Work with data, write useful functions, and build your programming foundations.",
    meta: "Code examples · Exercises",
  },
  {
    title: "Mathematics you can see",
    group: "Mathematics",
    icon: "∑",
    level: "Foundations",
    body: "Make vectors, probability, and gradients tangible through visual experiments.",
    meta: "Visual intuition · Applied maths",
  },
  {
    title: "Retrieval & RAG",
    group: "RAG",
    icon: "⌕",
    level: "Build on basics",
    body: "Connect models to useful information. Explore retrieval, grounding, and evaluation.",
    meta: "System diagrams · Tradeoffs",
  },
  {
    title: "Agents & LangGraph",
    group: "Agents",
    icon: "⋈",
    level: "Intermediate",
    body: "Explore tools, state, orchestration, and resilient multi-agent workflows.",
    meta: "Workflow labs · Case studies",
  },
  {
    title: "Designing AI systems",
    group: "Systems",
    icon: "▧",
    level: "Engineering",
    body: "Connect architecture, evaluation, operations, and responsible AI decisions.",
    meta: "Architecture · Real-world reasoning",
  },
];
let activeFilter = "All",
  query = "",
  step = 0;
const completed = () => storage.get("genai-demo-complete") === "true";
function card(c) {
  return `<a class="card" href="#course"><div class="card-top"><span class="course-icon" aria-hidden="true">${c.icon}</span><span class="pill">${c.level}</span></div><h3>${c.title}</h3><p>${c.body}</p><div class="card-bottom"><span>${c.meta}</span><span aria-hidden="true">↗</span></div></a>`;
}
function heading(label, title, sub = "") {
  return `<div class="page-heading"><div class="eyebrow">${label}</div><h1>${title}</h1><p class="muted">${sub}</p></div>`;
}
function landing() {
  return `<div class="container"><section class="hero"><div><div class="eyebrow"><span class="dot"></span>A little curiosity. A lot of possibility.</div><h1>Understand AI.<br>Get your hands<br><em>on the ideas.</em></h1><p>Go from “I’ve heard of that” to “I know how it works.” Explore, experiment, and build real intuition—one concept at a time.</p><div class="actions"><a class="button" href="#home">Find your starting point <span>↗</span></a><a class="button secondary" href="#lesson">Try a lesson <span>→</span></a></div><div class="micro">For curious minds and builders. No AI background needed.</div></div><div class="hero-art"><div class="art-top"><span>THE IDEA, MADE VISIBLE</span><span class="live-dot">● INTERACTIVE PREVIEW</span></div><div class="diagram"><div class="diagram-box">Your context<br><br>“The sky is”</div><span aria-hidden="true">→</span><div class="diagram-box model"><div class="nodes" aria-hidden="true">⠿⠿</div>language model</div></div><div class="token-output"><div class="eyebrow">One possible next token</div><p>The sky is <span class="token" id="hero-word" aria-live="polite">blue</span></p><div class="micro">A prediction, not a lookup. What else could come next?</div></div><div class="art-bottom"><span>Change the prediction. Notice the idea.</span><button id="hero-try">Try another ↻</button></div><div class="note-chip">Less passive reading. More “aha.”</div></div></section><div class="trust-strip"><span><strong>01 /</strong> Understand the concept</span><span><strong>02 /</strong> Play with the mechanics</span><span><strong>03 /</strong> Put it into practice</span></div><section class="section"><div class="section-head"><div><div class="eyebrow">A connected curriculum</div><h2>Big ideas. Clear starting points.</h2></div><a class="text-link" href="#home">Explore all paths ↗</a></div><div class="grid">${courses.slice(0, 3).map(card).join("")}</div></section><section class="section" style="padding-top:0"><div class="dark-panel"><div><div class="eyebrow" style="color:#bdcba9">Built for understanding</div><h2 style="margin-top:14px">Read it. Change it.<br>Make it click.</h2><p>Go deeper than a definition. Every learning experience connects an explanation to something you can inspect and try.</p><a class="button secondary" style="color:#edf1e8;border-color:#71806f" href="#lesson">Step inside a lesson ↗</a></div><div class="steps"><div class="step"><b>01</b><div><h3>Start with a clear mental model</h3><p>Plain language, concrete examples, and the “why.”</p></div></div><div class="step"><b>02</b><div><h3>Explore an interactive experiment</h3><p>Move one thing. See what changes. Connect the dots.</p></div></div><div class="step"><b>03</b><div><h3>Check your understanding</h3><p>Useful feedback that explains the reasoning.</p></div></div></div></div></section></div>`;
}
function home() {
  return `<div class="container"><div class="workspace"><aside class="sidebar" aria-label="Studio navigation"><a class="active" href="#home">◫ &nbsp; My learning</a><a href="#home/catalog">▦ &nbsp; Explore paths</a><a href="#lesson">⌁ &nbsp; Try a lab</a><div class="sidebar-note"><strong>Your next “aha” awaits.</strong><p>Small steps add up to a clearer picture.</p><span class="pill">Demo workspace</span></div></aside><div>${heading("Your learning studio", "Keep your curiosity going.", "Pick up an idea, or find a new one to explore.")}<div class="resume"><div><div class="eyebrow">${completed() ? "Lesson completed · demo progress" : "Continue learning · demo progress"}</div><h2>One token.<br>A world of possibilities.</h2><p class="muted">How a model predicts the next token</p><a class="button" href="#lesson">${completed() ? "Revisit the lesson" : "Continue lesson"} <span>→</span></a></div><div class="resume-art" aria-hidden="true"><span>The</span><span>sky</span><span style="background:#dce9a7;color:#243126">?</span></div></div><div class="section-head" id="catalog"><div><div class="eyebrow">Choose your next direction</div><h2>Explore learning paths</h2></div><span class="micro">7 topic collections</span></div><label class="micro" for="search">Find a topic</label><input class="search" id="search" type="search" placeholder="Search AI, Python, agents…" autocomplete="off"><div class="filters" aria-label="Filter paths">${["All", "Foundations", "Python", "LLMs", "Agents", "Systems"].map((x) => `<button data-filter="${x}" class="${x === activeFilter ? "active" : ""}" aria-pressed="${x === activeFilter}">${x}</button>`).join("")}</div><p class="micro">Catalog preview · All cards open the sample course experience.</p><div class="grid" id="catalog-results" aria-live="polite"></div></div></div></div>`;
}
function course() {
  return `<div class="container">${heading("Learning path / Sample course", "How language models work", "From a sequence of tokens to a system you can reason about.")}<div class="course-layout"><div><div class="callout">Learn the mechanism, then explore its limits. This sample course connects visual intuition to the decisions you make as an engineer.</div><div class="section-head" style="margin-top:30px"><h2 style="font-size:22px">Your learning path</h2><span class="micro">Demo outline</span></div><details class="chapter" open><summary>01 &nbsp; From text to predictions</summary><div class="lesson-row"><span>○</span><span>What is a token?</span><span class="duration">Preview only</span></div><a class="lesson-row selected" href="#lesson"><span>${completed() ? "✓" : "◉"}</span><span>How a model predicts the next token</span><span class="duration">Open lesson →</span></a><div class="lesson-row"><span>○</span><span>Where models learn: pretraining and data</span><span class="duration">Preview only</span></div></details><details class="chapter"><summary>02 &nbsp; Context, knowledge & uncertainty</summary><div class="lesson-row">The context window <span class="duration">Preview only</span></div><div class="lesson-row">Why models make things up <span class="duration">Preview only</span></div></details><details class="chapter"><summary>03 &nbsp; Steering generation</summary><div class="lesson-row">Temperature and sampling <span class="duration">Preview only</span></div><div class="lesson-row">From base model to assistant <span class="duration">Preview only</span></div></details><p class="micro">Topics follow the shared curriculum. Web lessons are authored independently; these states do not represent publication status.</p></div><aside class="card aside-card"><span class="course-icon" aria-hidden="true">▥</span><h3 style="margin-top:20px">A peek inside the model</h3><p>By the end, you should be able to:</p><ul><li>Explain next-token prediction.</li><li>Read a probability distribution.</li><li>Separate likely text from verified facts.</li></ul><div class="progress"><span style="width:${completed() ? "100" : "0"}%"></span></div><p class="micro">${completed() ? "1 of 1" : "0 of 1"} sample lessons completed</p><a class="button" href="#lesson" style="width:100%">${completed() ? "Revisit sample" : "Start sample lesson"} →</a><p class="micro" style="margin-top:17px;margin-bottom:0">Prerequisite: a basic understanding of tokens.<br>No coding required for the visual lab.</p></aside></div></div>`;
}
function lesson() {
  return `<div class="lesson-shell"><div class="lesson-toolbar"><a class="text-link" href="#course">← Learning path</a><div><button data-open-menu="contents">Course contents</button><button data-open-menu="sections">In this lesson ↓</button></div></div><article class="article"><div class="eyebrow">How GenAI works / Lesson 02</div><h1>One token at a time.</h1><p class="lead">A language model doesn’t write an answer all at once. It repeatedly predicts what could come next.</p><div class="lesson-meta"><span>Concept + interactive lab</span><span>Beginner friendly</span><span>Web sample</span></div><section id="idea"><h2>A prediction, then another.</h2><p>Imagine the model sees <strong>“The sky is”</strong>. It assigns probabilities to possible next tokens. “Blue” might receive a high probability, but “clear” or “dark” could also fit. The model produces scores over its vocabulary; these become a probability distribution.</p><p>A decoding rule chooses a token. That token is added to the context, and the model makes a new prediction using the updated sequence. This repeated process is called <strong>autoregressive generation</strong>.</p><div class="callout"><strong>The key distinction:</strong> a probable continuation is text that fits the context. It is not necessarily a true statement about the world.</div></section><section id="experiment"><h2>Watch the context grow.</h2><p>Step through a tiny illustrative sequence. Notice that each choice changes the context for the next prediction.</p><div id="lab-home"><div class="lab" id="generation-lab"><div class="lab-head"><strong>01 / The generation loop</strong><button id="expand-workspace">Expand workspace ↗</button></div><div class="lab-body"><div class="generation-flow"><div class="flow-stage"><span class="eyebrow">01 / Context</span><h3>Read the sequence</h3><div class="sentence" id="sentence" aria-live="polite"></div><p class="micro">The prompt plus everything generated so far.</p></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-stage model-stage"><span class="eyebrow">02 / Model</span><h3>Score what comes next</h3><div class="model-visual" aria-hidden="true">⠿ → ⠿ → ⠿</div><p class="micro">Learned weights produce scores. Softmax turns scores into probabilities.</p></div><span class="flow-arrow" aria-hidden="true">→</span><div class="flow-stage"><span class="eyebrow">03 / Choose & append</span><h3>One possible continuation</h3><div id="probabilities"></div></div></div><div class="loop-caption">↳ Append the chosen token to the context. Repeat with the updated sequence.</div><div class="lab-actions"><button class="button small" id="next-token">Choose next token →</button><button id="restart-lab">↻ Reset</button><span class="micro" id="step-label"></span></div><p class="micro" style="margin-top:20px;margin-bottom:0">Hand-authored probabilities and preset choices, not a real model or tokenizer. Real models score a much larger vocabulary; tokens can be word fragments.</p></div></div></div></section><section id="mechanics"><h2>What the loop is doing.</h2><p>In a real system, the model outputs scores called <em>logits</em>. A softmax operation converts those scores to probabilities. A decoding strategy can choose the highest-probability token or sample from the distribution.</p><pre><code># Illustrative pseudocode — not executable here
context = tokenize(prompt)
for _ in range(max_new_tokens):
    logits = model(context)
    probabilities = softmax(logits[-1])
    token = sample(probabilities)
    if token == end_token:
        break
    context.append(token)</code></pre><p>The next call includes the new token. Generating a longer answer repeats this loop, subject to stopping rules and context limits. The example above omits implementation details such as caching.</p><div class="callout"><strong>Engineering connection:</strong> streaming exposes this incremental generation to the user. Seeing text appear early improves perceived responsiveness even while the rest of the answer is still being generated.</div></section><section id="check"><div class="eyebrow">Make the idea stick</div><h2>Likely doesn’t mean verified.</h2><p>A model assigns a high probability to the next token in a factual claim. What can you conclude?</p><div id="quiz"><button class="quiz-option" data-answer="wrong">A. The claim has been checked against a trusted source.</button><button class="quiz-option" data-answer="right">B. That token is a likely continuation given the model and context.</button><button class="quiz-option" data-answer="wrong">C. The model is retrieving an exact sentence from its training data.</button></div><div class="feedback" id="feedback" role="status"></div></section><section id="takeaway"><h2>Take this with you.</h2><p>Generation is a loop: <strong>predict → choose → append → repeat</strong>. The distribution describes possible continuations, and the decoding strategy selects among them. Neither step alone verifies a claim.</p></section><div class="end-lesson"><a class="text-link" href="#course">← Back to the learning path</a><button class="button" id="complete">${completed() ? "Completed ✓" : "Mark sample complete ✓"}</button></div><p class="micro">Completion is stored on this browser only. This is a design preview.</p></article></div><nav class="mobile-lesson-bar" aria-label="Lesson navigation"><button data-open-menu="contents">☷ Contents</button><button data-open-menu="sections">≡ Sections</button><button id="next-section">Next section ↓</button></nav><dialog id="lesson-menu" class="menu-dialog" aria-labelledby="menu-title"><div class="dialog-heading"><h2 id="menu-title">Lesson navigation</h2><button data-close-dialog="lesson-menu" aria-label="Close navigation">✕</button></div><div id="menu-links"></div></dialog><dialog id="wide-workspace" class="workspace-dialog" aria-labelledby="workspace-title"><div class="dialog-heading"><div><div class="eyebrow">Interactive workspace · simulation</div><h2 id="workspace-title">The generation loop</h2></div><div class="dialog-controls"><button data-toggle-theme aria-label="Toggle light and dark theme">◐ Theme</button><button data-close-dialog="wide-workspace">← Return to lesson</button></div></div><div id="workspace-slot"></div></dialog>`;
}
const stages = [
  {
    text: "The sky is",
    words: [
      ["blue", 62],
      ["clear", 25],
      ["dark", 13],
    ],
  },
  {
    text: "The sky is blue",
    words: [
      ["today", 50],
      [".", 35],
      ["and", 15],
    ],
  },
  {
    text: "The sky is blue today",
    words: [
      [".", 80],
      ["because", 15],
      ["and", 5],
    ],
  },
  { text: "The sky is blue today.", words: [] },
];
function updateLab() {
  const s = stages[step];
  $("#sentence").textContent = s.text;
  $("#probabilities").innerHTML = s.words.length
    ? s.words
        .map(
          ([word, p]) =>
            `<div class="prob-row"><span>${word}</span><div class="bar"><span style="width:${p}%"></span></div><span>${p}%</span></div>`,
        )
        .join("")
    : '<p class="completion">Sequence complete. Each prediction used the updated context.</p>';
  $("#step-label").textContent = `${step} of 3 steps`;
  $("#next-token").disabled = step === 3;
  $("#next-token").textContent =
    step === 3 ? "Sequence complete ✓" : "Choose next token →";
}
function filterCatalog() {
  const list = courses.filter(
    (c) =>
      (activeFilter === "All" || c.group === activeFilter) &&
      (c.title + " " + c.body).toLowerCase().includes(query.toLowerCase()),
  );
  $("#catalog-results").innerHTML = list.length
    ? list.map(card).join("")
    : '<div class="empty muted">No matching paths. Try “Python” or clear your filters.</div>';
}
let currentView = "";
const lessonSections = [
  ["idea", "The big idea"],
  ["experiment", "Try the experiment"],
  ["mechanics", "Under the hood"],
  ["check", "Check understanding"],
  ["takeaway", "Take it with you"],
];
let dialogTrigger = null;
function closeDialog(id) {
  const dialog = document.getElementById(id);
  if (dialog?.open) dialog.close();
}
function openDialog(id, trigger) {
  dialogTrigger = trigger;
  document.getElementById(id).showModal();
  document.body.classList.add("dialog-open");
}
function bindDialogs() {
  document.querySelectorAll("dialog").forEach((dialog) =>
    dialog.addEventListener("close", () => {
      if (dialog.id === "wide-workspace") {
        $("#lab-home").append($("#generation-lab"));
        $("#expand-workspace").hidden = false;
      }
      document.body.classList.remove("dialog-open");
      if (dialogTrigger?.isConnected)
        dialogTrigger.focus({ preventScroll: true });
    }),
  );
}
function render() {
  const [raw, anchor] = (location.hash.slice(1) || "landing").split("/");
  const view = ["landing", "home", "course", "lesson"].includes(raw)
    ? raw
    : "landing";
  if (currentView !== view || !anchor) {
    document.body.classList.remove("dialog-open");
    document.body.classList.toggle("reading-lesson", view === "lesson");
    currentView = view;
    $("#main").innerHTML = { landing, home, course, lesson }[view]();
    document.title = `${{ landing: "Learn by exploring", home: "Your learning studio", course: "How language models work", lesson: "One token at a time" }[view]} — GenAI Learner`;
    window.scrollTo(0, 0);
    if (view === "home") {
      query = "";
      $("#search").addEventListener("input", (e) => {
        query = e.target.value;
        filterCatalog();
      });
      filterCatalog();
    }
    if (view === "lesson") {
      step = 0;
      updateLab();
      bindDialogs();
    }
    $("#main").focus({ preventScroll: true });
  }
  if (anchor) {
    const target = document.getElementById(anchor);
    if (target) target.scrollIntoView();
  }
}
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").style.display = "block";
  setTimeout(() => ($("#toast").style.display = "none"), 2600);
}
document.addEventListener("click", (e) => {
  if (e.target.closest(".skip")) {
    e.preventDefault();
    $("#main").focus();
    return;
  }
  const menuLink = e.target.closest("#menu-links a");
  if (menuLink) closeDialog("lesson-menu");
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.openMenu) {
    const sections = b.dataset.openMenu === "sections";
    $("#menu-title").textContent = sections
      ? "In this lesson"
      : "Course contents";
    $("#menu-links").innerHTML = sections
      ? lessonSections
          .map(
            ([id, title]) =>
              `<a href="#lesson/${id}">${title} <span>↗</span></a>`,
          )
          .join("")
      : '<a href="#course">Course overview →</a><p class="micro">01 / Text to predictions</p><p class="muted">What is a token? · Preview only</p><a href="#lesson/idea">Next-token prediction →</a><p class="muted">Pretraining & data · Preview only</p>';
    openDialog("lesson-menu", b);
  }
  if (b.dataset.closeDialog) closeDialog(b.dataset.closeDialog);
  if (b.id === "expand-workspace") {
    $("#workspace-slot").append($("#generation-lab"));
    b.hidden = true;
    openDialog("wide-workspace", b);
  }
  if (b.id === "next-section") {
    const next = lessonSections.find(
      ([id]) => document.getElementById(id).getBoundingClientRect().top > 120,
    );
    if (next) {
      location.hash = `lesson/${next[0]}`;
      document.getElementById(next[0]).scrollIntoView();
    } else {
      $("#complete").scrollIntoView();
      $("#complete").focus({ preventScroll: true });
    }
  }
  if (b.id === "theme" || b.hasAttribute("data-toggle-theme")) {
    document.body.classList.toggle("dark");
    storage.set(
      "genai-theme",
      document.body.classList.contains("dark") ? "dark" : "light",
    );
    $("#theme").setAttribute(
      "aria-label",
      `Switch to ${document.body.classList.contains("dark") ? "light" : "dark"} theme`,
    );
  }
  if (b.id === "reset") {
    storage.remove("genai-demo-complete");
    storage.remove("genai-theme");
    document.body.classList.remove("dark");
    $("#theme").setAttribute("aria-label", "Switch to dark theme");
    activeFilter = "All";
    query = "";
    currentView = "";
    render();
    toast("Demo progress and preferences reset.");
  }
  if (b.id === "hero-try") {
    const words = ["blue", "clear", "dark", "overcast"];
    const i = words.indexOf($("#hero-word").textContent);
    $("#hero-word").textContent = words[(i + 1) % words.length];
  }
  if (b.dataset.filter) {
    activeFilter = b.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-pressed", x === b);
    });
    filterCatalog();
  }
  if (b.id === "next-token" && step < 3) {
    step++;
    updateLab();
  }
  if (b.id === "restart-lab") {
    step = 0;
    updateLab();
  }
  if (b.dataset.answer) {
    document
      .querySelectorAll(".quiz-option")
      .forEach((x) => x.classList.toggle("chosen", x === b));
    $("#feedback").textContent =
      b.dataset.answer === "right"
        ? "Exactly. The probability reflects a continuation, not a fact-check. You still need evidence to verify the claim."
        : "Not quite. Next-token prediction does not itself check a source or retrieve an exact training sentence. Try the answer that describes a continuation.";
  }
  if (b.id === "complete") {
    storage.set("genai-demo-complete", "true");
    b.textContent = "Completed ✓";
    toast("Sample lesson complete. Your demo progress is saved.");
  }
});
if (storage.get("genai-theme") === "dark") {
  document.body.classList.add("dark");
  $("#theme").setAttribute("aria-label", "Switch to light theme");
}
window.addEventListener("hashchange", render);
render();

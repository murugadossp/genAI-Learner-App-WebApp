"use client";
import Link from "next/link";
import { useState } from "react";
import Shell from "./Shell";
import { Card } from "./Cards";
import { courses, lessonUrl } from "./data";
export default function Landing() {
  const [word, setWord] = useState(0);
  const words = ["blue", "clear", "dark", "overcast"];
  return (
    <Shell>
      <div className="container">
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="dot" />A little curiosity. A lot of possibility.
            </div>
            <h1>
              Understand AI.
              <br />
              Get your hands
              <br />
              <em>on the ideas.</em>
            </h1>
            <p>
              Go from “I’ve heard of that” to “I know how it works.” Explore,
              experiment, and build real intuition—one concept at a time.
            </p>
            <div className="actions">
              <Link className="button" href="/studio">
                Find your starting point <span>↗</span>
              </Link>
              <Link className="button secondary" href={lessonUrl}>
                Try a lesson <span>→</span>
              </Link>
            </div>
            <div className="micro">
              For curious minds and builders. No AI background needed.
            </div>
          </div>
          <div className="hero-art">
            <div className="art-top">
              <span>THE IDEA, MADE VISIBLE</span>
              <span className="live-dot">● INTERACTIVE PREVIEW</span>
            </div>
            <div className="diagram">
              <div className="diagram-box">
                Your context
                <br />
                <br />
                “The sky is”
              </div>
              <span aria-hidden="true">→</span>
              <div className="diagram-box model">
                <div className="nodes" aria-hidden="true">
                  ⠿⠿
                </div>
                language model
              </div>
            </div>
            <div className="token-output">
              <div className="eyebrow">One possible next token</div>
              <p>
                The sky is{" "}
                <span className="token" aria-live="polite">
                  {words[word]}
                </span>
              </p>
              <div className="micro">
                A prediction, not a lookup. What else could come next?
              </div>
            </div>
            <div className="art-bottom">
              <span>Change the prediction. Notice the idea.</span>
              <button onClick={() => setWord((word + 1) % words.length)}>
                Try another ↻
              </button>
            </div>
            <div className="note-chip">Less passive reading. More “aha.”</div>
          </div>
        </section>
        <div className="trust-strip">
          <span>
            <strong>01 /</strong> Understand the concept
          </span>
          <span>
            <strong>02 /</strong> Play with the mechanics
          </span>
          <span>
            <strong>03 /</strong> Put it into practice
          </span>
        </div>
        <section className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">A connected curriculum</div>
              <h2>Big ideas. Clear starting points.</h2>
            </div>
            <Link className="text-link" href="/studio">
              Explore all paths ↗
            </Link>
          </div>
          <div className="grid">
            {courses.slice(0, 3).map((c) => (
              <Card key={c.title} course={c} />
            ))}
          </div>
        </section>
        <section className="section section-flush">
          <div className="dark-panel">
            <div>
              <div className="eyebrow inverse-eyebrow">
                Built for understanding
              </div>
              <h2 className="feature-title">
                Read it. Change it.
                <br />
                Make it click.
              </h2>
              <p>
                Go deeper than a definition. Every learning experience connects
                an explanation to something you can inspect and try.
              </p>
              <Link
                className="button secondary inverse-button"
                href={lessonUrl}
              >
                Step inside a lesson ↗
              </Link>
            </div>
            <div className="steps">
              {[
                [
                  "01",
                  "Start with a clear mental model",
                  "Plain language, concrete examples, and the “why.”",
                ],
                [
                  "02",
                  "Explore an interactive experiment",
                  "Move one thing. See what changes. Connect the dots.",
                ],
                [
                  "03",
                  "Check your understanding",
                  "Useful feedback that explains the reasoning.",
                ],
              ].map(([n, t, p]) => (
                <div className="step" key={n}>
                  <b>{n}</b>
                  <div>
                    <h3>{t}</h3>
                    <p>{p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { RingDiagram } from "./RingDiagram";
import { Sorter } from "./Sorter";
import styles from "./lesson.module.css";

function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className={styles.figure}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} width={1200} height={800} loading="lazy" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="How AI, ML, deep learning and GenAI fit together"
      lead="These four terms are often used as if they meant the same thing. They are nested: each one is a special case of the one around it. We take them one at a time, from the outside in."
    >
      <section id="big-picture">
        <h2 tabIndex={-1}>AI is the whole field, not one technology.</h2>
        <p>
          In its broad sense, <strong>artificial intelligence</strong> is the
          field of building systems that do tasks which normally take human
          intelligence, such as recognising a pattern, making a decision,
          planning a route or producing language. The definition is about the
          task. It does not say how the system must be built.
        </p>
        <p>
          Throughout this lesson we follow <strong>Postbox</strong>, an invented
          mail app. It has jobs like <strong>predicting</strong> when a parcel
          arrives, <strong>classifying</strong> a message as spam or not,{" "}
          <strong>recommending</strong> an article, and{" "}
          <strong>generating</strong> a draft reply. Those jobs are{" "}
          <em>what</em> a system does. The four rings are about <em>how</em> it
          is built to do them.
        </p>
        <RingDiagram current={0} />
        <div className="callout">
          <strong>Key idea:</strong> learning is one way to build AI. It is not
          the definition of AI. A system built entirely from rules that a person
          wrote is still AI; it is just not machine learning.
        </div>
      </section>
      <section id="ai">
        <h2 tabIndex={-1}>Artificial intelligence: the outer ring.</h2>
        <Figure
          src="/lessons/c1-01/ai-rules.jpg"
          alt="A person writing if-then rules on cards that feed a simple machine sorting envelopes into two trays."
          caption="Rules written by a person, doing a job by themselves."
        />
        <p>
          The outer ring holds every method for getting a machine to do such a
          task, whether a person designed it by hand or it was learned. Classic
          examples are rule-based programs, search and planning.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            “If the subject says WINNER and the message has three or more links,
            mark it spam.” A person wrote that rule. Nothing was learned, and it
            is still AI.
          </p>
        </div>
        <RingDiagram current={0} />
      </section>
      <section id="ml">
        <h2 tabIndex={-1}>Machine learning: learning from examples.</h2>
        <Figure
          src="/lessons/c1-01/ai-ml.jpg"
          alt="Many example envelopes tagged with ticks and crosses flow into a machine that learns a pattern and sorts a new envelope on its own."
          caption="Show the system many examples and let it find the pattern."
        />
        <p>
          In <strong>machine learning</strong>, the behaviour comes from
          patterns fitted to example data, not from a rule a person wrote for
          each case. The system adjusts its own internal values until it does
          well on the examples.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            A spam model is shown thousands of emails labelled spam or not. A
            person picks the clues, such as link count, and the model learns how
            much each clue should matter. Nobody wrote “three links means spam”.
          </p>
        </div>
        <RingDiagram current={1} />
      </section>
      <section id="dl">
        <h2 tabIndex={-1}>Deep learning: many layers.</h2>
        <Figure
          src="/lessons/c1-01/ai-dl.jpg"
          alt="A neural network drawn as many columns of connected nodes, turning a raw envelope image on the left into a sorted result on the right."
          caption="Many layers, each building on the one before."
        />
        <p>
          <strong>Deep learning</strong> is machine learning with neural
          networks that have many layers. Those layers can learn their own clues
          straight from raw input such as text or pixels, so a person does not
          have to choose them. Not all machine learning is deep: a simple
          straight-line fit to past data is machine learning but not deep
          learning.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            A many-layer network reads the raw message text and learns its own
            clues, such as phrasing and layout, to decide spam or not spam. It
            only labels messages. It does not write anything.
          </p>
        </div>
        <RingDiagram current={2} />
      </section>
      <section id="genai">
        <h2 tabIndex={-1}>Generative AI: making something new.</h2>
        <Figure
          src="/lessons/c1-01/ai-genai.jpg"
          alt="A machine producing something new: a blank page filling with a freshly written letter, next to a small painting and a sound wave."
          caption="New text, images or audio, not a stored copy."
        />
        <p>
          <strong>Generative AI</strong> is deep learning trained to produce new
          content, such as text, images, audio or code. Today’s systems are
          mostly built this way. Not all deep learning generates: the spam
          network above labels messages and writes nothing.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            A generative model writes a new draft reply in the tone you ask for.
            The draft is new text, not a stored template, and it can be wrong,
            so you read it before sending.
          </p>
        </div>
        <RingDiagram current={3} />
        <p>
          Read the rings in one direction. A generative model is also deep
          learning, machine learning and AI. The reverse does not hold: the
          keyword rule is AI, but it is outside machine learning.
        </p>
      </section>
      <section id="sorter">
        <h2 tabIndex={-1}>Where does each one sit?</h2>
        <Sorter />
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Where the picture is too tidy.</h2>
        <ul>
          <li>
            <strong>Real products mix approaches.</strong> Postbox might block
            known bad senders with a rule, score the rest with a learned model,
            and draft replies with a generative one. The ring belongs to a
            component, not the whole app.
          </li>
          <li>
            <strong>The edges are fuzzy.</strong> “AI” is also used loosely, and
            sometimes as a marketing label. When a product says it is
            “AI-powered”, ask what job it does and how that part was built.
          </li>
          <li>
            <strong>Inner is not better.</strong> A rule can be the right tool
            when behaviour must be exact and explainable. A generative model can
            write fluent text that is wrong. Choose by the job and the cost of
            mistakes.
          </li>
          <li>
            <strong>Some diagrams draw it differently.</strong> Generative AI is
            sometimes described as a use of deep learning rather than a ring of
            its own. The nesting idea holds either way.
          </li>
        </ul>
      </section>
      <Check
        id="check"
        question="A chess program’s developers hand-wrote its search procedure and its scoring rules. It was never trained on data. Which statement is right?"
        options={[
          "It is machine learning, because anything that plays chess well must have learned.",
          "It is not AI, because nothing in it learned from data.",
          "It is AI but not machine learning: AI includes systems built from hand-written rules and search, as well as learned ones.",
          "It is generative AI, because it produces moves.",
        ]}
        correct={2}
        wrongFeedback={[
          "Playing well does not mean learning. This program’s behaviour comes from rules and search that people wrote, so it is outside the machine learning ring.",
          "AI is defined by the task, not by whether learning was involved. Hand-built rules and search are classic AI.",
          "",
          "Generative AI means a model trained to produce new content such as text or images. Choosing a move by search and scoring is a different thing, and nothing here was trained.",
        ]}
        explanation="AI is the outer ring and covers hand-built methods too. Machine learning is the inner ring where behaviour is fitted from examples, and this program has none."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            AI is the whole field, and rules count. Machine learning is the part
            where behaviour is fitted from examples, deep learning is the part
            that uses many-layer networks, and generative AI is the part that
            produces new content. Each is inside the one before it. When you
            meet an “AI” product, ask what job it does and how it was built.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { RingsLab } from "./RingsLab";
import styles from "./lesson.module.css";
export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="How AI, ML, deep learning and GenAI fit together"
      lead="These four terms are often used as if they meant the same thing. They are nested: each one is a special case of the one around it. This lesson shows the nesting, and why a system built from hand-written rules still counts."
    >
      <section id="big-picture">
        <h2 tabIndex={-1}>AI is the whole field, not one technology.</h2>
        <p>
          In its broad sense, <strong>artificial intelligence</strong> is the
          field of building systems that do tasks which normally take human
          intelligence, such as recognising a pattern, making a decision,
          planning a route or producing language. The definition is about the
          task. It does not say how the system must be built, and there is more
          than one way to build it.
        </p>
        <p>
          Throughout this lesson we follow <strong>Postbox</strong>, an invented
          mail app. It has four jobs: <strong>predict</strong> when a parcel
          arrives, <strong>classify</strong> a message as spam or not,{" "}
          <strong>recommend</strong> an article to read next, and{" "}
          <strong>generate</strong> a draft reply. Those are jobs, which is what
          a system does. The rings below are about <em>how</em> it is built to
          do them.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> learning is one way to build AI. It is not
          the definition of AI. A system built entirely from rules that a person
          wrote is still AI; it is just not machine learning.
        </div>
      </section>
      <section id="lab">
        <h2 tabIndex={-1}>Pick a job, then pick how it is built.</h2>
        <p>
          Choose one of Postbox’s jobs and one way of building it. The rings
          show which groups that build belongs to. Try classifying with
          hand-written rules, then with a simple learned model, and watch how
          the picture changes. Then try <em>generate</em> with a deep network
          that is not generative.
        </p>
        <RingsLab />
      </section>
      <section id="rings">
        <h2 tabIndex={-1}>Reading the rings.</h2>
        <ul className={styles.defs}>
          <li>
            <strong>Artificial intelligence</strong>, the outer ring. Any
            technique that gets a machine to do such a task, hand-built or
            learned. Classic examples include search and planning programs and
            rule-based systems.
          </li>
          <li>
            <strong>Machine learning</strong>. The system’s behaviour comes from
            patterns fitted to example data, not from a rule a person wrote for
            each case. Postbox’s spam model was not told “three links means
            spam”; it was shown many labelled emails and adjusted its own
            values.
          </li>
          <li>
            <strong>Deep learning</strong>. Machine learning with neural
            networks that have many layers, which can learn their own features
            from raw input such as text or pixels. Not all machine learning is
            deep: simpler models, such as a straight-line fit or a small
            decision tree, are still machine learning.
          </li>
          <li>
            <strong>Generative AI</strong>. Models trained to produce new
            content, such as text, images, audio or code. Today’s are mostly
            built with deep learning. Not all deep learning generates: a deep
            network that labels messages as spam does not write anything.
          </li>
        </ul>
        <p>
          The reading rule is one-directional. A generative model is also deep
          learning, machine learning and AI. The reverse does not hold:
          Postbox’s keyword rule is AI, but it is outside machine learning
          because nothing was learned from data.
        </p>
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

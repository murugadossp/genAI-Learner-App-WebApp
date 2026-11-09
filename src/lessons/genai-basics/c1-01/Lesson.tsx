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
          We take the four terms one at a time, from the outside in. Each one is
          a more specific way of doing the one before it:
        </p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Artificial intelligence:</strong> any way of getting a
            machine to do such a task.
          </li>
          <li>
            <strong>Machine learning:</strong> the machine learns the pattern
            from examples.
          </li>
          <li>
            <strong>Deep learning:</strong> learning with a many-layer network.
          </li>
          <li>
            <strong>Generative AI:</strong> models that make new text, images or
            audio. Today’s well-known ones are built with deep learning.
          </li>
        </ol>
        <p>
          Throughout this lesson we follow <strong>Postbox</strong>, an invented
          mail app. It has jobs like <strong>predicting</strong> when a parcel
          arrives, <strong>classifying</strong> a message as spam or not,{" "}
          <strong>recommending</strong> an article, and{" "}
          <strong>generating</strong> a draft reply. Those jobs are{" "}
          <em>what</em> a system does. The four rings are about <em>how</em> it
          is built to do them.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> learning is one way to build AI. It is not
          the definition of AI. A system that does such a task using only rules
          a person wrote can still be AI; it is just not machine learning.
        </div>
      </section>
      <section id="ai">
        <h2 tabIndex={-1}>Artificial intelligence: the outer ring.</h2>
        <Figure
          src="/lessons/c1-01/ai-rules.jpg"
          alt="A friendly computer player about to place an X on a tic-tac-toe board, beside three rule cards. Labels: Designed AI; The computer player; Win if you can; Block the other player; Otherwise take the centre; Rules written by people, not learned."
          caption="Designed AI: a computer opponent that follows rules people wrote."
        />
        <p>
          <strong>Artificial intelligence</strong> is the whole box below.
          Machine learning, deep learning and generative AI are all kinds of AI,
          drawn inside it.
        </p>
        <p>
          AI has two families, based on where its behaviour comes from. In{" "}
          <strong>designed AI</strong>, people write the rules or steps it
          follows. In <strong>learned AI</strong>, the behaviour is fitted from
          examples. People design the system either way. The next three sections
          are about learned AI. This one is about designed AI.
        </p>
        <p>Picture a tic-tac-toe opponent that follows three rules:</p>
        <ol>
          <li>Win if you can.</li>
          <li>Otherwise, block the other player.</li>
          <li>Otherwise, take the centre.</li>
        </ol>
        <p>
          It seems to think, but a person wrote every rule and it learned
          nothing from past games. It is still AI: a machine doing a task that
          normally takes human thought.
        </p>
        <p>
          Bigger designed systems work the same way. Classic chess programs
          search many moves ahead. Route planners search a map. Many real
          systems add learning on top.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            One rule, such as “WINNER plus three links means spam”, is closer to
            ordinary software. It becomes AI when a system searches or reasons
            to make a judgement, like the tic-tac-toe player. The line is
            blurry.
          </p>
        </div>
        <RingDiagram current={0} wholeField />
      </section>
      <section id="ml">
        <h2 tabIndex={-1}>Machine learning: learning from examples.</h2>
        <Figure
          src="/lessons/c1-01/ai-ml.jpg"
          alt="Labelled example envelopes flow into a machine that then sorts a new message into a ticked or crossed tray. Labels: Machine learning; Many labelled examples; The machine learns the pattern; Sorts a new message."
          caption="Show the system many examples and let it find the pattern."
        />
        <p>
          In <strong>machine learning</strong>, the system learns the pattern
          from examples, so a person does not have to write a rule for every
          case. People still design how it learns. The system adjusts its own
          internal values until it does well on the examples.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            The spam model sees thousands of emails labelled spam or not. A
            person picks clues, such as link count, and the model learns how
            much each one matters. Nobody wrote “three links means spam”.
          </p>
        </div>
        <RingDiagram current={1} />
      </section>
      <section id="dl">
        <h2 tabIndex={-1}>Deep learning: many layers.</h2>
        <Figure
          src="/lessons/c1-01/ai-dl.jpg"
          alt="An envelope enters a neural network with many layers and a result tray comes out. Labels: Deep learning; Raw input: the message text; Many layers, each finds richer clues; Output: spam or not spam."
          caption="Many layers, each building on the one before."
        />
        <p>
          <strong>Deep learning</strong> is machine learning with neural
          networks that have many layers.
        </p>
        <p>
          Those layers can find their own clues in raw text or pixels, so a
          person does not have to pick them. Not all machine learning is deep: a
          straight-line fit to past data is machine learning but not deep
          learning.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            A many-layer network reads the raw message text and finds its own
            clues, such as phrasing and layout, to decide spam or not. It only
            labels messages. It writes nothing.
          </p>
        </div>
        <RingDiagram current={2} />
      </section>
      <section id="genai">
        <h2 tabIndex={-1}>Generative AI: making something new.</h2>
        <Figure
          src="/lessons/c1-01/ai-genai.jpg"
          alt="A speech bubble feeds a machine that outputs a page, a painting and a sound wave. Labels: Generative AI; Your request; A model trained to generate; New text, image or audio."
          caption="New output generated by the model, not picked from a fixed list."
        />
        <p>
          <strong>Generative AI</strong> produces new content: text, images,
          audio or code.
        </p>
        <p>
          The chatbots and image tools you hear about today are built with deep
          learning. That is why this ring sits inside deep learning.
        </p>
        <p>
          Generating is a job, not one technology. Older methods can generate
          too, but their output is clumsy. And not all deep learning generates:
          the spam network above writes nothing.
        </p>
        <div className={styles.example}>
          <strong>In Postbox</strong>
          <p>
            A generative model writes a new draft reply in the tone you ask for.
            It is generated, not picked from a fixed template. It can still be
            wrong, and it can sometimes repeat wording from training or from
            your request, so read it before sending.
          </p>
        </div>
        <RingDiagram current={3} />
        <p>
          Read the rings one way. A modern generative model is also deep
          learning, machine learning and AI. The reverse is not true: the
          tic-tac-toe player is AI, but not machine learning.
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
            <strong>The rings simplify.</strong> Generating new content is a
            capability that simpler methods can have too, so the innermost ring
            really stands for today’s deep generative models. Some diagrams
            describe generative AI as a use of deep learning rather than a ring
            of its own. The nesting idea holds either way.
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
            that uses many-layer networks, and generative AI is the part, built
            today with deep learning, that produces new content. Each is inside
            the one before it. When you meet an “AI” product, ask what job it
            does and how it was built.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

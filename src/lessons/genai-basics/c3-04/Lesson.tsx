import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ExamplesLab } from "./ExamplesLab";
import examplesPatternImg from "./images/examples-pattern.webp";
import examplesVsWeightsImg from "./images/examples-vs-weights.webp";
import styles from "./lesson.module.css";

export default function Lesson({
  embedded = false,
  toolbar,
  footer = true,
}: {
  embedded?: boolean;
  toolbar?: React.ReactNode;
  footer?: boolean;
}) {
  return (
    <LessonFrame
      number="04"
      title="Teaching through examples"
      lead="Show a model a pattern with input-output examples to guide its reply—without changing how the model is trained."
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      embedded={embedded}
      toolbar={toolbar}
      footer={footer}
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>What you will learn in this lesson.</h2>
        <p>
          Sometimes a style or format is much easier to show than to explain in
          a long list of rules. Including a few sample pairs inside your prompt
          helps a model follow the pattern you want.
        </p>
        <p>We will cover four ideas in order:</p>
        <ol className={styles.roadmapList}>
          <li>
            <strong>Prompt examples:</strong> worked input-output pairs placed
            directly inside your prompt to show a pattern.
          </li>
          <li>
            <strong>Zero-shot, one-shot, and few-shot:</strong> names for
            prompts with zero, one, or a small set of examples.
          </li>
          <li>
            <strong>Pattern guidance (not a guarantee):</strong> why examples
            steer a reply without acting as a strict rule.
          </li>
          <li>
            <strong>Context vs model weights:</strong> why examples work only
            while they are in the current <strong>context window</strong> (the
            text the model reads for a request) and never change the model’s
            learned settings (<strong>weights</strong>).
          </li>
        </ol>
        <div className={styles.exampleBox}>
          <h3>Running example: the bakery daily staff board</h3>
          <p>
            A small bakery rewrites messy staff notes into neat one-line entries
            in this house style: <code>[Category] Action — short reason</code>.
          </p>
          <p>
            The board uses three categories: <code>[Supplies]</code>,{" "}
            <code>[Schedule]</code>, and <code>[Equipment]</code>.
          </p>
        </div>
      </section>

      <section id="why-examples">
        <h2 tabIndex={-1}>
          Showing a pattern can be clearer than describing it.
        </h2>
        <p>
          Imagine training a new barista to write chalkboard cards. Handing them
          one finished card is often faster and clearer than writing a long
          paragraph about tone, dashes, and word count.
        </p>
        <p>
          In technical terms, a language model generates a reply by predicting
          likely next tokens from the text in its prompt. When your prompt
          includes sample input-output pairs (<strong>prompt examples</strong>),
          continuing that pattern becomes a much more likely path for the model.
        </p>

        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <h3>Same instruction, no examples</h3>
            <p className="micro">
              Instruction: “Rewrite this bakery staff note as a short, calm
              entry for the daily staff board.”
            </p>
            <p>
              <strong>New note:</strong> “Oven 2 runs 10 minutes slow today, so
              start the bread tray early.”
            </p>
            <p>
              <strong>Illustrative reply:</strong> “Oven 2 is running about 10
              minutes slow today. Please put the bread tray in earlier than
              usual so it finishes on time.”
            </p>
          </div>
          <div className={styles.compareCard}>
            <h3>Same instruction, plus examples</h3>
            <p className="micro">
              Same instruction, plus three sample <code>Note → Board</code>{" "}
              pairs showing <code>[Supplies]</code>, <code>[Schedule]</code>,
              and <code>[Equipment]</code>.
            </p>
            <p>
              <strong>New note:</strong> “Oven 2 runs 10 minutes slow today, so
              start the bread tray early.”
            </p>
            <p>
              <strong>Illustrative reply:</strong> “[Equipment] Start bread tray
              early — Oven 2 is 10 min slow today.”
            </p>
          </div>
        </div>

        <figure className={styles.figure}>
          <Image
            src={examplesPatternImg}
            alt="Diagram titled Prompt examples show the pattern with subtitle Sample pairs guide the reply. Left to right arrows connect a Prompt card containing Example: Note to Board line and New note: Oven 2 slow, into a Model card labelled Same weights, and out to a Reply card reading [Equipment] Start bread early. A bottom strip contrasts No examples: style is open with With examples: closer to pattern."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            Prompt examples sit inside the input and guide the reply toward the
            pattern without changing the model’s weights.
          </figcaption>
        </figure>

        <div className={styles.exampleBox}>
          <h3>Everyday example: two-word meeting actions</h3>
          <p>
            If you want meeting notes turned into tiny two-word tasks like{" "}
            <code>Email Alex</code> or <code>Book room</code>, showing two
            sample pairs in your prompt is usually clearer than explaining every
            word-count and verb rule.
          </p>
        </div>
      </section>

      <section id="shot-counts">
        <h2 tabIndex={-1}>Zero-shot, one-shot, and few-shot.</h2>
        <p>
          People group example-based prompts by one simple criterion:{" "}
          <strong>
            how many worked input-output examples are inside the current prompt
          </strong>
          .
        </p>

        <div className={styles.shotGrid}>
          <div className={styles.shotCard}>
            <h3>Zero-shot</h3>
            <p className={styles.shotCount}>0 examples (instruction only)</p>
            <p>
              Best for simple tasks where a clear instruction already gets a
              good answer and exact house style does not matter.
            </p>
          </div>
          <div className={styles.shotCard}>
            <h3>One-shot</h3>
            <p className={styles.shotCount}>1 sample pair</p>
            <p>
              Sets a basic shape quickly, though one example can leave category
              names or edge cases open.
            </p>
          </div>
          <div className={styles.shotCard}>
            <h3>Few-shot</h3>
            <p className={styles.shotCount}>A small set (often 2–5)</p>
            <p>
              Shows both the exact format and how different kinds of inputs map
              to different outputs.
            </p>
          </div>
        </div>

        <p>
          There is no single magic number for few-shot prompts. Adding many long
          examples uses up space in the model’s <strong>context window</strong>,
          so a few short, varied examples are often better than a long pile.
        </p>

        <div className={styles.exampleBox}>
          <h3>Everyday example: sorting personal receipts</h3>
          <p>
            Suppose you want receipts labelled <code>Food</code>,{" "}
            <code>Travel</code>, or <code>Home</code>. One example shows the
            single-word output shape; three varied examples—one for each
            label—show the full set of categories you expect.
          </p>
        </div>
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Examples guide a reply; they do not guarantee it.</h2>
        <p>
          Prompt examples steer which next tokens look likely; they do not lock
          the model into a rigid computer rule. Even with good examples, a reply
          can still drift, so you still check the output.
        </p>
        <p>Three common ways examples fall short:</p>
        <ul className={styles.roadmapList}>
          <li>
            <strong>Inconsistent examples:</strong> if one example is a crisp{" "}
            <code>[Supplies]</code> line and another is a chatty paragraph, the
            model may blend both styles.
          </li>
          <li>
            <strong>One-sided examples:</strong> if all three examples use the
            label <code>[Supplies]</code>, the model can be nudged to repeat{" "}
            <code>[Supplies]</code> even when a note is about equipment.
          </li>
          <li>
            <strong>Unfamiliar or tricky inputs:</strong> a note that mixes two
            topics or uses unusual wording can still break the format. When you
            need strict machine-readable fields such as JSON, you validate the
            output separately (covered in Lesson 3.5).
          </li>
        </ul>

        <div className={styles.exampleBox}>
          <h3>Everyday example: tone leaking into a refund email</h3>
          <p>
            If you paste three upbeat product blurbs as style examples and then
            ask for a calm refund reply, the model may carry the cheerful tone
            into a message where it does not belong.
          </p>
        </div>
      </section>

      <section id="no-retraining">
        <h2 tabIndex={-1}>
          Examples stay in the current context; they do not retrain the model.
        </h2>
        <p>
          Taping a sample card beside the bakery whiteboard helps everyone on
          today’s shift write matching entries, but it does not rewrite the
          shop’s printed handbook.
        </p>
        <p>
          In the same way, prompt examples work inside the current{" "}
          <strong>context window</strong> (often called{" "}
          <strong>in-context learning</strong>). The model’s{" "}
          <strong>weights</strong>—the learned numbers produced during
          training—stay completely unchanged.
        </p>
        <p>
          Inside the <em>same</em> conversation, many chat apps re-send earlier
          turns in the context window, so your examples can keep guiding later
          messages there. Open a brand-new chat without those examples, and the
          model has only your new prompt to go on.
        </p>

        <figure className={styles.figure}>
          <Image
            src={examplesVsWeightsImg}
            alt="Diagram titled Examples stay in context with subtitle Model weights do not change. Row 1 connects Chat 1: 3 examples + note to Model (same weights) to Matches board style. Row 2 connects Chat 2: note only to Model (same weights) to Style may differ. Bottom strip reads Illustrative: examples guide while in context — weights stay unchanged."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            Both chats use the same unchanged model weights. The examples can
            guide the format while they are present in context.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try it: add examples and watch the style shift.</h2>
        <p>
          Use the scripted simulation below to compare how different sets of
          examples steer the same bakery staff note while the model’s weights
          stay unchanged.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol className={styles.stepsList}>
          <li>
            Start on <strong>0 examples</strong> and read the plain zero-shot
            reply.
          </li>
          <li>
            Select <strong>1 example</strong> and notice how the{" "}
            <code>[Tag] Action — reason</code> shape appears, even though the
            tag name is guessed.
          </li>
          <li>
            Select <strong>3 varied examples</strong> to see the exact{" "}
            <code>[Equipment]</code> match, then try{" "}
            <strong>Messy examples</strong> to see how mixed samples blur the
            output.
          </li>
          <li>
            Select <strong>New chat (no examples)</strong> and check both the
            reply and the <strong>Model weights: unchanged</strong> badge.
          </li>
        </ol>

        <ExamplesLab />
      </section>

      <section id="questions">
        <h2 tabIndex={-1}>Quick questions.</h2>
        <div className={styles.qaList}>
          <div className={styles.qaItem}>
            <h3>
              If I add ten examples, will the model always follow the format?
            </h3>
            <p>
              No. Extra examples can clarify tricky cases, but they still guide
              probabilities rather than enforce a hard rule—and long lists take
              up space in the context window.
            </p>
          </div>
          <div className={styles.qaItem}>
            <h3>
              Why did the model keep my format on the second message of the same
              chat?
            </h3>
            <p>
              Many chat apps automatically re-send earlier turns from that
              conversation inside the context window. The examples are still in
              the input, not saved inside the model’s weights.
            </p>
          </div>
          <div className={styles.qaItem}>
            <h3>When is zero-shot better than adding examples?</h3>
            <p>
              When a clear, short instruction already gives you the answer you
              need, zero-shot saves you typing time and keeps the prompt
              compact.
            </p>
          </div>
        </div>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="You include three [Category] Action — reason examples in a chat so a model rewrites bakery staff notes in that style, and it follows the pattern. Ten minutes later, you open a brand-new chat with the same model and send only the instruction and a new staff note, with no examples. The reply comes back as a plain two-sentence note without brackets. What best explains why?"
        options={[
          "The model forgot what it learned during training because ten minutes passed.",
          "Examples stop working after one message, even inside the same conversation.",
          "Your examples only guided the earlier chat while they were in its context; they did not change the model's weights.",
          "Three examples are too few to guide a model's formatting.",
        ]}
        correct={2}
        explanation="Prompt examples work inside the current context window without updating the model's learned weights. In a brand-new chat without those examples, the model has only the instruction to go on, so its style can differ."
        wrongFeedback={[
          "Time passing did not erase training. Your earlier examples never changed the model's weights in the first place.",
          "Inside the same conversation, many chat apps re-send earlier messages in the context window, so examples can keep guiding later turns. Here, you opened a brand-new chat with no examples in context.",
          "",
          "The scenario says the three examples worked in the first chat. The format disappeared in the new chat because the examples were no longer in the prompt.",
        ]}
      />

      <section id="takeaway" className="takeaway">
        <span className="eyebrow">Take this with you</span>
        <h2 tabIndex={-1}>Take this with you.</h2>
        <p>
          Showing 1–3 clear, varied input-output examples is often the fastest
          way to steer a model toward a specific tone or structure.
        </p>
        <p>
          Examples guide a reply without guaranteeing it—inconsistent or
          one-sided samples can mislead—and they act only while they are in the
          current context, never changing the model’s weights.
        </p>
      </section>
    </LessonFrame>
  );
}

import Image from "next/image";
import splitStagesImage from "./assets/split-stages.webp";
import stageGateImage from "./assets/stage-gate.webp";
import longVsCheckedImage from "./assets/long-vs-checked.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { StagePlannerLab } from "./StagePlannerLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="06"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Breaking complex tasks into steps"
      lead="Split a multi-part task into small stages you can check one by one, instead of trusting one long reply."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Why one big prompt hides mistakes.</h2>
        <p>
          When you ask an AI assistant to gather facts, apply rules, and write a
          final message all at once, an early slip can hide inside a smooth
          reply. Here you will see how to split work into small stages, check
          each stage before moving on, and avoid mistaking a long explanation
          for proof.
        </p>
        <p>
          A <strong>single-pass prompt</strong> asks an AI assistant to handle
          several jobs in one message. A <strong>checkable subtask</strong> is
          one small, focused step whose output you can verify against a clear
          rule or source. A <strong>stage gate</strong> is the quick check you
          do on one step’s output before passing it to the next step.
        </p>
        <div className={styles.example}>
          <strong>Our invented example: Priya’s Saturday Book Swap</strong>
          <p>
            Priya has 4 volunteers and 4 roles for a neighborhood Book Swap.
            Each volunteer takes one role and must be free during that shift.
          </p>
          <ul className={styles.exampleList}>
            <li>
              <strong>Ben:</strong> Free morning only. Only volunteer cleared
              for heavy lifting (no car).
            </li>
            <li>
              <strong>Lina:</strong> Free afternoon only. Available for the
              welcome table (no car, no heavy lifting).
            </li>
            <li>
              <strong>Omar:</strong> Free all day. Only volunteer with a car for
              book pickup; cannot lift heavy boxes.
            </li>
            <li>
              <strong>Tessa:</strong> Free morning only. Available for sorting
              books by age group (no car, no heavy lifting).
            </li>
          </ul>
          <ul className={styles.exampleList}>
            <li>
              <strong>Rule 1:</strong> One role per volunteer; each person must
              be free during that shift.
            </li>
            <li>
              <strong>Rule 2:</strong> Morning setup needs one person cleared
              for heavy boxes and one person to sort books by age group.
            </li>
            <li>
              <strong>Rule 3:</strong> Afternoon shift needs one person at the
              welcome table and one person with a car for afternoon book pickup.
            </li>
            <li>
              <strong>Rule 4:</strong> The final email must list each person’s
              exact shift and role, and stay under 80 words.
            </li>
          </ul>
        </div>
      </section>

      <section id="split">
        <h2 tabIndex={-1}>Split one big goal into checkable subtasks.</h2>
        <p>
          Think of cooking a new dish by prepping ingredients, tasting the
          sauce, and then plating—rather than tossing everything into one pan
          and hoping it turns out right. In the same way, a{" "}
          <strong>checkable subtask</strong> isolates one small job so you can
          verify it quickly.
        </p>
        <p>
          Instead of one big prompt, Priya splits her Book Swap into three small
          stages: first extract each volunteer’s free shift and limits, second
          match the 4 roles against Rules 1–3, and third draft the short email
          from the checked schedule. Splitting does not guarantee a perfect
          answer on the first try, but it keeps each output short enough to
          inspect.
        </p>
        <figure className={styles.figure}>
          <Image
            src={splitStagesImage}
            alt="Three-stage workflow moving left to right: 1. Extract facts, then Check, then 2. Match roles, then Check, then 3. Draft email. Bottom strip: One job per step makes mistakes easy to spot."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Each stage has one clear job and a quick check before the next stage
            begins.
          </figcaption>
        </figure>
        <p>
          Outside this example, suppose you are planning a weekend train trip
          with a friend. First list the available train times, check them
          against your calendar, and only then draft the message proposing a
          train.
        </p>
      </section>

      <section id="gate">
        <h2 tabIndex={-1}>Check each stage before moving on.</h2>
        <p>
          Before a road trip, you check the street address on a map rather than
          driving for an hour to the wrong town. A <strong>stage gate</strong>{" "}
          works the same way: you check one stage’s output against your source
          notes or rules before passing it forward.
        </p>
        <p>
          Suppose Stage 2 drafts a schedule that puts Lina on morning book
          sorting. Because Priya checks the 4-line schedule against her notes at
          the stage gate, she spots that Lina is free in the afternoon only and
          fixes the schedule before Stage 3 ever writes the email.
        </p>
        <figure className={styles.figure}>
          <Image
            src={stageGateImage}
            alt="Left-to-right flow showing Stage 2 draft with Lina: Morning entering a Stage gate labeled Check notes, producing Fixed roles with Lina: Afternoon, and then feeding into Stage 3 email. Bottom strip: Fix a slip early to keep the next step clean."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Checking between stages stops a wrong shift from carrying into the
            final email.
          </figcaption>
        </figure>
        <p>
          In everyday cooking, if you halve a recipe, check the halved
          ingredient amounts first before writing your shopping list. Catching a
          mistake in the small step keeps the later step clean.
        </p>
      </section>

      <section id="length">
        <h2 tabIndex={-1}>
          Why a long explanation does not prove correctness.
        </h2>
        <p>
          A long, polite voicemail with directions to the wrong street still
          sends you to the wrong street. An AI assistant generates fluent text
          word by word, so a long, confident explanation can still rest on a
          broken rule or a wrong shift.
        </p>
        <p>
          In Priya’s single-pass prompt, the reply can spend a whole paragraph
          praising Lina’s “morning energy” even though Priya’s notes say Lina is
          free in the afternoon only. Detailed wording shows fluency, not
          verification against your notes.
        </p>
        <figure className={styles.figure}>
          <Image
            src={longVsCheckedImage}
            alt="Diagram titled Length Is Not Proof with subtitle Fluent words can still hide a slip. A Long reply card containing Smooth wording and Wrong shift: Lina Morning points right to a warning card labeled Still wrong. Bottom strip contrasts Check against notes with a checkmark against Trust because it is long with an X."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Smooth wording and extra length do not replace checking against your
            actual notes.
          </figcaption>
        </figure>
        <p>
          Outside this example, a detailed AI summary of a store return policy
          can read smoothly while still misstating the return window. Check key
          facts against the source rather than judging by length.
        </p>
        <div className={styles.quickQuestions}>
          <h3>Quick questions</h3>
          <dl>
            <dt>
              If I ask the assistant to “explain every step in detail,” does
              that guarantee the answer is right?
            </dt>
            <dd>
              No. A longer explanation can make mistakes easier for you to spot
              if you check each part, but length alone does not prove accuracy.
            </dd>
            <dt>Should every tiny task be split into multiple stages?</dt>
            <dd>
              No. Simple one-part tasks rarely need staging; split work when
              several rules or facts must all hold at once.
            </dd>
          </dl>
        </div>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Plan Priya’s Book Swap in stages.</h2>
        <p>
          Compare a single big prompt with a 3-stage plan on Priya’s Book Swap
          notes. Try it in this order:
        </p>
        <ol className={styles.tryList}>
          <li>
            In <strong>Single big prompt</strong> mode, read the fluent reply,
            then click <strong>Reveal buried mistakes</strong> to see the broken
            rules.
          </li>
          <li>
            Switch to <strong>3-stage plan</strong> and move from{" "}
            <strong>1. Extract facts</strong> to <strong>2. Match roles</strong>
            .
          </li>
          <li>
            Try <strong>Skip check → Stage 3</strong> first to watch the wrong
            shifts carry into the email, then go back and choose{" "}
            <strong>Check &amp; fix slips → Stage 3</strong>.
          </li>
        </ol>
        <StagePlannerLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="Priya asks an AI assistant to plan a community dinner in one prompt using her volunteer notes and rules. The assistant returns a 400-word explanation that sounds clear and thorough. What should Priya do to make sure the schedule is right?"
        options={[
          "Trust the schedule because a 400-word explanation shows the assistant thought carefully.",
          "Ask the assistant to write an even longer explanation before checking anything.",
          "Break the work into small stages and check each stage’s output against her notes and rules before moving on.",
          "Keep the schedule as-is and only shorten the final email.",
        ]}
        correct={2}
        wrongFeedback={[
          "Length and fluent wording do not prove correctness; a 400-word reply can still break a shift or role rule.",
          "Adding more words does not verify the schedule. You still need to check the output against the actual notes and rules.",
          "",
          "Shortening the final email fixes word count only; any wrong shifts from earlier will still carry into the shorter email.",
        ]}
        explanation="Splitting the work into small, checkable stages and verifying each stage against her notes and rules catches mistakes before they reach the final email."
      />

      <section id="takeaway" className={styles.takeaway}>
        <h2 tabIndex={-1}>Take this with you.</h2>
        <ul>
          <li>
            Split multi-part work into small <strong>checkable subtasks</strong>
            —one focused job per step.
          </li>
          <li>
            Use a <strong>stage gate</strong>: check each step’s output against
            your notes or rules before feeding it into the next step.
          </li>
          <li>
            Do not mistake a long, smooth explanation for proof; verify the
            details against your source.
          </li>
        </ul>
      </section>
    </LessonFrame>
  );
}

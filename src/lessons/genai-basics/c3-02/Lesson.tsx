import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { PromptBlockLab } from "./PromptBlockLab";
import promptInputsImg from "./images/prompt-inputs.webp";
import leaveOutImg from "./images/leave-out.webp";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Providing context and constraints"
      lead="Give an AI assistant the background facts and limits your task needs, and leave out text that distracts or should stay private."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Four checks before you paste.</h2>
        <p>
          In{" "}
          <Link className="text-link" href="/learn/genai-basics/c2-06">
            The context window
          </Link>
          , you saw that a model draws on what it learned during training, while
          the text it can read in the current exchange is limited to what fits
          in the conversation. Once you have a clear task, the next choice is
          what extra text to include in your <strong>prompt</strong>—the message
          you send to the assistant.
        </p>
        <p>
          Pasting everything you have is a common trap. Instead, check every
          piece of text through four decision lenses before you paste
          it—starting with safety first, because one note can fit more than one
          lens.
        </p>

        <div className={styles.lensGrid}>
          <div className={styles.lensCard}>
            <span className={`${styles.lensTag} ${styles.lensSafety}`}>
              1. Check first · Keep out
            </span>
            <h3>Sensitive information</h3>
            <p>
              Personal, confidential, or secret details that could harm someone
              or break rules if shared. Keep these out first, even when they
              relate to your task.
            </p>
          </div>
          <div className={styles.lensCard}>
            <span className={`${styles.lensTag} ${styles.lensInclude}`}>
              2. Include
            </span>
            <h3>Relevant context</h3>
            <p>
              Safe background facts about your specific situation that the model
              does not know and needs for this task.
            </p>
          </div>
          <div className={styles.lensCard}>
            <span className={`${styles.lensTag} ${styles.lensInclude}`}>
              3. Include
            </span>
            <h3>Constraints</h3>
            <p>
              Rules that shape the reply—such as length, format, tone, or topics
              to leave out.
            </p>
          </div>
          <div className={styles.lensCard}>
            <span className={`${styles.lensTag} ${styles.lensNoise}`}>
              4. Leave out
            </span>
            <h3>Distracting text</h3>
            <p>
              Unrelated, outdated, or contradictory details that compete for
              attention and can pull the reply off track.
            </p>
          </div>
        </div>

        <div className={styles.exampleBox}>
          <strong>Our invented running example</strong>
          <p>
            Sam runs Cedar Bike Shop and wants an AI assistant to draft a short{" "}
            <strong>
              public Thanksgiving hours and repair drop-off notice
            </strong>{" "}
            for the shop&apos;s website. Sam has a folder of shop notes—some
            helpful, some outdated, and one containing a customer&apos;s private
            contact details.
          </p>
        </div>
      </section>

      <section id="context">
        <h2 tabIndex={-1}>Supply only the relevant background.</h2>
        <p>
          Think of briefing a substitute teacher before class. You hand over
          today&apos;s lesson plan and attendance list, not the entire school
          year&apos;s filing cabinet.
        </p>
        <p>
          An AI model draws on patterns from training and the text in your
          current prompt. It does not know your local schedule, cutoff times, or
          rules unless you supply them as <strong>relevant context</strong>.
        </p>
        <div className={styles.exampleBox}>
          <strong>In Sam&apos;s shop</strong>
          <p>
            Without the shop&apos;s dates, the assistant has to guess or insert
            vague placeholders. Sam supplies two relevant facts: the{" "}
            <strong>Thanksgiving 2026 schedule</strong> (closed Thu, Nov 26;
            open Fri, Nov 27, 10:00 a.m.–4:00 p.m.; regular hours Sat, Nov 28)
            and the <strong>Wed, Nov 25 at 5:00 p.m.</strong> repair drop-off
            cutoff for pre-holiday service.
          </p>
        </div>
        <p>
          <strong>Everyday example:</strong> When asking for a weeknight dinner
          idea, list the ingredients already in your fridge and how much time
          you have—not your grocery receipts from last month.
        </p>
      </section>

      <section id="constraints">
        <h2 tabIndex={-1}>Set clear limits to shape the reply.</h2>
        <p>
          Think of ordering a small sign from a print shop. You give the size
          and wording limits up front so you do not get a giant poster with
          extra slogans you did not want.
        </p>
        <p>
          <strong>Constraints</strong> set boundaries on how the assistant
          writes: length, format, tone, or what to leave out. In real prompts,
          one phrase can act as both context and a constraint—for example,
          &ldquo;for first-time visitors&rdquo; names the audience and limits
          jargon.
        </p>
        <p>
          Clear limits steer the draft strongly, though models can still slip on
          strict rules like exact word counts. Always read and check the draft
          before using it.
        </p>
        <div className={styles.exampleBox}>
          <strong>In Sam&apos;s shop</strong>
          <p>
            Left unconstrained, the assistant writes a long greeting and invents
            a promotional phone line. Sam adds two constraints: keep the notice
            under 60 words with a friendly tone and three day bullets, and do
            not mention sales, discounts, or phone numbers.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={promptInputsImg}
            alt="Diagram titled Focused Prompt Inputs: Relevant Context (Nov 26-27 hours, Wed 5 p.m. cutoff) and Constraints (Under 60 words, 3 bullets, no sales) flow left to right into AI Model and produce a Focused Draft labeled Notice using supplied details. Bottom strip reads Facts supply details and Limits guide shape."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Relevant context supplies the facts the model lacks, and constraints
            guide the shape of the draft. You still review the finished notice
            before posting it.
          </figcaption>
        </figure>
        <p>
          <strong>Everyday example:</strong> When summarizing a long club
          meeting note, ask for three short bullet points in plain English and
          tell the assistant to skip side discussions.
        </p>
      </section>

      <section id="leave-out">
        <h2 tabIndex={-1}>Leave out distracting and sensitive text.</h2>
        <p>
          Think of photocopying a form. You clear old sticky notes and other
          people&apos;s ID cards off the glass before pressing start.
        </p>
        <p>
          <strong>Distracting text</strong>—such as outdated offers or unrelated
          tasks—competes for space and attention inside the context window and
          can bleed into the draft. <strong>Sensitive information</strong>—such
          as personal phone numbers, home addresses, passwords, or private
          account digits—stays out first, even if it sits in the same note or
          relates to your work.
        </p>
        <p>
          Before sharing any real personal or workplace data, check the
          tool&apos;s terms and your organization&apos;s rules. If you only need
          a template structure, replace private details with neutral
          placeholders like <code>[Customer Name]</code>.
        </p>
        <div className={styles.exampleBox}>
          <strong>In Sam&apos;s shop</strong>
          <p>
            Sam leaves out a note about last year&apos;s 15% helmet sale and a
            supplier inner-tube order so they do not sneak into the holiday
            notice. Sam also keeps customer Priya Nair&apos;s phone number, home
            address, and credit card digits completely out of the prompt.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={leaveOutImg}
            alt="Diagram titled What to Leave Out: Public Schedule and Limits flows into Your Prompt, while Outdated Sale Notes labeled Distracting and Customer Phone and Address labeled Sensitive are stopped at a red Keep Out barrier. Bottom strip reads Your choice before sending: share only what is safe and needed."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The Keep Out barrier represents your own check before pressing
            send—not an automatic filter built into the tool.
          </figcaption>
        </figure>
        <p>
          <strong>Everyday example:</strong> Before pasting a customer support
          email thread to draft a polite reply, delete the customer&apos;s
          account number, personal email address, and an unrelated earlier
          billing question.
        </p>

        <div className={styles.quickQuestions}>
          <h3>Quick questions</h3>
          <ul>
            <li>
              <strong>
                Can I paste everything and tell the AI to ignore the extra
                parts?
              </strong>{" "}
              That is still risky: private details are already shared once you
              send the prompt, and unrelated text can still pull the reply off
              track.
            </li>
            <li>
              <strong>
                Do word-count limits guarantee an exact word count?
              </strong>{" "}
              No. Constraints guide the reply strongly, but models can still
              drift over or under a strict count, so check the result.
            </li>
            <li>
              <strong>Does removing a name make a prompt anonymous?</strong> Not
              necessarily. An address, rare job title, or combination of details
              can still identify a person.
            </li>
          </ul>
        </div>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Build Sam&apos;s prompt from blocks.</h2>
        <p>
          Try assembling Sam&apos;s prompt one block at a time and watch how the
          illustrative reply responds.
        </p>
        <ol className={styles.stepsList}>
          <li>
            Start with no blocks selected and notice how the reply guesses the
            hours and rambles.
          </li>
          <li>
            Add the four helpful blocks (the schedule, drop-off cutoff,
            length/format limit, and do-not-add boundary) to build a focused
            prompt.
          </li>
          <li>
            Turn on the old sale note and the customer contact note one at a
            time to see what goes wrong, then remove them or press{" "}
            <strong>Reset blocks</strong>.
          </li>
        </ol>
        <p className={styles.disclosure}>
          <strong>Simulation note:</strong> The replies and warnings below are
          pre-written, simplified illustrations of common model behaviors, not a
          live AI model. Real models vary in how closely they follow limits or
          react to extra text.
        </p>
        <PromptBlockLab />
      </section>

      <Check
        id="check"
        question="You want an AI assistant to draft a 3-sentence public FAQ answer explaining your library's late-fee policy. You have four notes: (A) the current 2026 late-fee rules, (B) a rule to keep the reply under 50 words in plain language, (C) a patron's overdue notice with their home address and phone number, and (D) minutes from last year's roof-repair meeting. Which notes should you put in the prompt?"
        options={[
          "Paste all four notes and tell the assistant to ignore anything unrelated or private.",
          "Include only note A so the prompt stays short, and adjust the length after reading the draft.",
          "Include notes A and B, and leave out notes C and D.",
          "Include notes A, B, and D for extra library background, and leave out only note C.",
        ]}
        correct={2}
        wrongFeedback={[
          "Pasting note C still shares a patron's private address and phone number even if you ask the assistant to ignore them, and note D is unrelated text that can distract the draft.",
          "Note A gives the right facts, but leaving out note B drops a helpful constraint on length and plain language that guides the first draft.",
          "",
          "Leaving out note C protects the patron's privacy, but note D (last year's roof-repair minutes) is unrelated to late fees and adds distracting text.",
        ]}
        explanation="Note A supplies the relevant current facts and note B sets clear length and tone constraints. Note C contains sensitive patron data and note D is unrelated distracting text, so both stay out."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            A strong prompt is selective, not exhaustive: supply the relevant
            background facts and clear constraints your task needs, leave out
            distracting and sensitive text before sending, and review the draft.
          </p>
          <p className={styles.takeawayLink}>
            <Link className="text-link" href="/learn/genai-basics/c2-06">
              ← Review prerequisite: The context window
            </Link>
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

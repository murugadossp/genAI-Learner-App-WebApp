import Image from "next/image";
import Link from "next/link";
import principleImg from "./assets/verification-principle.webp";
import citationImg from "./assets/citation-check.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { VerifyLab } from "./VerifyLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="08"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Checking facts, sources and generated code"
      lead="A polished reply, a neat citation, or clean-looking code can still be wrong. One verification habit lets you check all three before you rely on them."
    >
      <section id="principle">
        <h2 tabIndex={-1}>One habit covers facts, sources, and code.</h2>
        <p>
          In Lesson 2.7 you saw that an AI model writes fluent text without
          checking whether each detail is supported. That means confident
          wording, a formatted reference, or neat code is not proof that an
          answer is right.
        </p>
        <p>
          One verification principle covers all three: test any claim that
          matters with an <strong>independent check</strong> outside the AI’s
          own reply. Asking the same chat “are you sure?” is not an independent
          check, because the model can smoothly repeat or defend a mistake.
        </p>
        <p>
          In this lesson you will apply that habit in order: checking a fact
          against a <strong>primary source</strong>, running a{" "}
          <strong>citation check</strong> on a named reference, and (optionally,
          with no programming background needed) checking generated code with a{" "}
          <strong>test case</strong> and a <strong>boundary case</strong>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={principleImg}
            alt="One Verification Principle: Check the claim outside the AI reply. Four cards flow left to right: AI Reply to Specific Claim to Independent Check to Confirm, Fix, or Flag. Bottom strip: Same habit for facts, sources, and code."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Start from one specific claim in the AI reply, check it outside the
            chat, and then confirm it, fix it, or flag it as unverified.
          </figcaption>
        </figure>
        <div className={styles.example}>
          <strong>Running example: Maya and the Riverbend Pool</strong>
          <p>
            Maya is an invented community volunteer drafting a neighborhood FAQ
            and a tiny day-pass price rule for the invented{" "}
            <strong>Riverbend Community Pool</strong>. Every claim in this
            lesson is checked against one invented 2026 official notice so no
            real-world fact is at stake.
          </p>
        </div>
        <div className={styles.noticeCard}>
          <strong>
            Official Riverbend Pool Notice (2026) —
            riverbend-pool.example/passes
          </strong>
          <p className="micro">
            Single-page notice (updated April 2026; replaces archived 2023
            flyer). All ages are whole years.
          </p>
          <ul>
            <li>
              Opening date: May 15, 2026 (open daily, 7:00 AM to 8:00 PM).
            </li>
            <li>
              Resident day pass: $6 per visit; <strong>ages 5 and under</strong>{" "}
              enter free ($0).
            </li>
            <li>
              Senior discount: <strong>ages 65 and older</strong> pay $4 per
              visit.
            </li>
            <li>
              Lap-swim lane booking: required <strong>only on weekends</strong>{" "}
              (Saturday and Sunday); no booking needed Monday–Friday.
            </li>
          </ul>
        </div>
      </section>

      <section id="facts">
        <h2 tabIndex={-1}>Checking facts: go to the primary record.</h2>
        <p>
          A <strong>primary source</strong> is the original official record,
          document, or data where a fact comes from, rather than a summary or an
          AI reply.
        </p>
        <p>
          Specific details — numbers, dates, fees, and age cutoffs — are often
          where an AI draft blends a real detail with a plausible-sounding slip.
        </p>
        <div className={styles.example}>
          <strong>In Maya’s draft</strong>
          <p>
            The assistant writes: “Resident day passes cost $6, and children
            under 10 enter free.” Comparing that sentence against the Official
            2026 Notice shows the $6 fee is right, but the free-entry cutoff is
            ages <strong>5 and under</strong>, not under 10.
          </p>
        </div>
        <p>
          <strong>Everyday example:</strong> if an assistant tells you a local
          clinic’s holiday hours, check the clinic’s own website or call them
          directly instead of relying on an AI summary that may blend last
          year’s hours.
        </p>
      </section>

      <section id="sources">
        <h2 tabIndex={-1}>
          Checking sources: a citation is a lead, not proof.
        </h2>
        <p>
          A common trap is assuming that a formatted citation means the claim
          was verified. In practice, a citation is only a lead until you run a{" "}
          <strong>citation check</strong>: open the named source yourself and
          check three things.
        </p>
        <ol className={styles.tryList}>
          <li>
            <strong>Exists?</strong> Does the page, book, or section actually
            exist?
          </li>
          <li>
            <strong>Matches claim?</strong> Does it actually say what the AI
            claims, rather than something different or opposite?
          </li>
          <li>
            <strong>Current?</strong> Is it the current version for your
            situation, not an archived rule?
          </li>
        </ol>
        <figure className={styles.figure}>
          <Image
            src={citationImg}
            alt="Checking an AI Citation: Treat a citation as a lead, not proof. AI Citation points to Open the Source, which branches right to three check cards: Exists?, Matches Claim?, and Current?. Bottom strip: A formatted citation can still be invented, misquoted, or outdated."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Opening the source yourself answers all three checks: whether it
            exists, supports the exact claim, and is still current.
          </figcaption>
        </figure>
        <div className={styles.example}>
          <strong>In Maya’s draft</strong>
          <p>
            The assistant writes: “Lap-swim lanes require advance booking every
            day (Source: Riverbend Pool Notice, Section 4: Daily Lane Policy).”
            Opening the official 2026 notice reveals two problems: it is a
            single page with no Section 4, and booking is required only on
            weekends.
          </p>
        </div>
        <p>
          <strong>Everyday example:</strong> an assistant quotes a book and
          gives a page number; opening that page can show a completely different
          paragraph or a chapter that does not exist.
        </p>
        <div className="callout">
          <strong>Quick questions</strong>
          <dl className={styles.qaList}>
            <dt>What if the link opens a real website?</dt>
            <dd>
              Still read the page: an assistant can attach a real link to a
              claim that the page never makes.
            </dd>
            <dt>
              What if I ask the assistant to double-check its own citation?
            </dt>
            <dd>
              Asking the same chat is not an independent check; it can smoothly
              confirm an invented reference.
            </dd>
          </dl>
        </div>
      </section>

      <section id="code">
        <h2 tabIndex={-1}>Checking generated code (optional).</h2>
        <p>
          You can skip code practice if you do not work with code, or follow
          along here with zero programming background.
        </p>
        <p>
          The same verification principle applies: do not judge code by how neat
          it looks — test what it actually does. Think of checking a recipe by
          tasting the dish rather than admiring how cleanly it is printed.
        </p>
        <p>
          In technical terms, you check code with a <strong>test case</strong>{" "}
          (a concrete input whose right answer you already know) and a{" "}
          <strong>boundary case</strong> (an input right on the edge of a rule,
          such as age 5 for “ages 5 and under”).
        </p>
        <div className={styles.example}>
          <strong>In Maya’s draft (whole-year ages)</strong>
          <p>
            Below is <strong>pseudocode</strong> — simplified step-by-step
            instructions written like code. Read it from top to bottom and stop
            at the first match: <code>if</code> checks the first condition,{" "}
            <code>else if</code> checks the next only if the first failed, and{" "}
            <code>else</code> catches everything left (<code>&lt;</code> means
            less than, <code>&gt;</code> means greater than, and{" "}
            <code>-&gt;</code> means “give this price”).
          </p>
          <pre className={styles.codeBlock}>
            <code>{`if age < 5       -> $0   (under 5)
else if age > 65 -> $4   (over 65)
else             -> $6   (everyone else)`}</code>
          </pre>
          <p>
            Testing a normal case like <strong>age 30</strong> returns $6, which
            matches the 2026 notice. Testing the boundary cases{" "}
            <strong>age 5</strong> and <strong>age 65</strong> catches the bug:
            both return $6 instead of $0 and $4, because 5 is not less than 5
            and 65 is not greater than 65.
          </p>
        </div>
        <p>
          <strong>Everyday example:</strong> if an assistant writes a
          spreadsheet formula for a 10% discount on orders of $50 or more,
          testing $60 may pass while testing exactly $50 catches whether “$50 or
          more” was accidentally written as “over $50.”
        </p>
        <p className="micro">
          Safety note: before running unfamiliar AI-generated code on your own
          computer, check what files or accounts it touches, or run it in a safe
          sandbox.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Lab: verify Maya’s AI draft step by step.</h2>
        <p>
          Walk through Maya’s flawed draft using the same verification habit for
          each claim. Try it in this order:
        </p>
        <ol className={styles.tryList}>
          <li>
            In <strong>Step 1 (Fact check)</strong>, open the Official 2026
            Notice, compare the age cutoff, and pick your verdict.
          </li>
          <li>
            In <strong>Step 2 (Source check)</strong>, first try asking the AI
            “Are you sure?” to see why self-checking fails, then open the
            Official 2026 Notice and pick your verdict.
          </li>
          <li>
            Optionally open <strong>Step 3 (Code check)</strong>, run{" "}
            <strong>Age 30 (normal)</strong> first, then test{" "}
            <strong>Age 5 (boundary)</strong> and{" "}
            <strong>Age 65 (boundary)</strong> before picking a verdict.
          </li>
        </ol>
        <p className="micro">
          Simulation note: Maya’s draft, the AI follow-up reply, the Riverbend
          Pool notice, and the rule runner below are invented and scripted for
          this lesson — not a live AI model or real town pool.
        </p>
        <VerifyLab />
      </section>

      <Check
        id="check"
        question="An AI assistant summarizes a city parking rule for an event flyer and cites “Municipal Code Section 12.4 — Free after 6 PM.” What is your best next step?"
        options={[
          "Use the 6 PM time as written, because citing a numbered code section indicates a verified lookup.",
          "Open the official city parking code yourself to check Section 12.4 and the 6 PM rule.",
          "Ask the same chat to quote Section 12.4 word for word and rely on it if the quote matches.",
          "Keep the 6 PM time on the flyer, but remove the Section 12.4 reference in case the number changed.",
        ]}
        correct={1}
        wrongFeedback={[
          "A numbered section does not prove a lookup happened. Models can invent section numbers or pair a real section with the wrong rule.",
          "",
          "Asking the same chat for a quote is not an independent check. An assistant can generate a matching quote that never appeared in the code.",
          "Removing the citation hides where the claim came from without checking whether the 6 PM rule itself is accurate.",
        ]}
        explanation="A citation is a lead to check, not proof. Opening the primary source lets you confirm that the section exists, matches the claim, and is still current."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            One habit covers facts, sources, and generated code: verify what
            matters with an independent check outside the AI’s own reply.
          </p>
          <p>
            Check facts against primary records, open citations to confirm they
            exist, match, and are current, and test code on both normal and
            boundary cases.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-07">
          Review: Why models make things up →
        </Link>
      </section>
    </LessonFrame>
  );
}

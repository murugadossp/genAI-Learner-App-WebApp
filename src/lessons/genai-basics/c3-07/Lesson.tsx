import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { RevisionLab } from "./RevisionLab";
import styles from "./lesson.module.css";
import polishImg from "./assets/polish-vs-improve.webp";
import feedbackImg from "./assets/targeted-feedback.webp";
import compareImg from "./assets/compare-requirements.webp";

export default function Lesson() {
  return (
    <LessonFrame
      number="07"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Improving an answer through iteration"
      lead="A smoother draft can still miss what you asked for. Give targeted feedback and compare every revision with your original requirements."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Three habits for revising an AI draft.</h2>
        <p>
          A first AI draft often gets part of a task right and misses the rest.
          Think of fitting a jacket: a tailor needs specific pin marks, not just
          “make it nicer.”
        </p>
        <p>
          In this lesson you will meet four ideas in order:{" "}
          <strong>iteration</strong>, <strong>requirements</strong>,{" "}
          <strong>polish</strong>, and <strong>drift</strong>.
        </p>
        <ul>
          <li>
            <strong>Iteration</strong> means revising a draft in focused rounds
            instead of expecting one prompt to do everything.
          </li>
          <li>
            <strong>Requirements</strong> are the checklist of details and
            limits the final answer needs to meet.
          </li>
          <li>
            <strong>Polish</strong> means making wording sound smoother,
            brighter, or more lively.
          </li>
          <li>
            <strong>Drift</strong> happens when a new revision breaks or drops a
            requirement that an earlier draft already met.
          </li>
        </ul>
        <div className={styles.example}>
          <strong>Running example: Sam’s Book Swap Flyer (invented)</strong>
          <p>
            Sam is using an AI assistant to draft a flyer for a neighborhood
            book swap. The flyer has three original requirements:
          </p>
          <ol>
            <li>
              <strong>Swap rule:</strong> state “bring one book to take one
              book”.
            </li>
            <li>
              <strong>Time and place:</strong> state Saturday, 2 p.m. at Oak
              Park Pavilion.
            </li>
            <li>
              <strong>Plain and short:</strong> three short sentences or fewer,
              in plain everyday words.
            </li>
          </ol>
        </div>
      </section>

      <section id="polish">
        <h2 tabIndex={-1}>Polish is not improvement.</h2>
        <p>
          Vague feedback such as “make it better” does not say what is missing.
          An assistant often responds by rewriting the style while leaving gaps
          unfixed.
        </p>
        <div className={styles.example}>
          <strong>In Sam’s flyer: Draft 1 and a vague rewrite</strong>
          <p>
            <strong>Draft 1:</strong> “Come to Oak Park Pavilion on Saturday
            afternoon for a neighborhood book swap. Everyone in the area is
            welcome to browse books and meet other readers. Stop by anytime and
            find a new story to take home.”
          </p>
          <p>
            Draft 1 is three plain sentences, but it misses the swap rule and
            the 2 p.m. start time. Sam replies: “Make it better and more
            exciting.”
          </p>
          <p>
            <strong>Polished draft:</strong> “Step into a vibrant afternoon of
            literary magic at Oak Park Pavilion this Saturday! Join neighbors
            for an unforgettable celebration of storytelling, fresh inspiration,
            and community spirit. Let your weekend sparkle with pages waiting to
            be turned!”
          </p>
        </div>
        <p>
          The polished draft sounds livelier, yet it still omits the swap rule
          and 2 p.m. Worse, its flowery hype broke the plain-language
          requirement.
        </p>
        <figure className={styles.figure}>
          <Image
            src={polishImg}
            alt="Infographic titled Polish is not improvement: Draft 1 (No swap rule, No 2 p.m.) points via an arrow labelled Make it better to Polished draft (No swap rule, No 2 p.m., Flowery words). Bottom takeaway: Check the requirements, not just the style."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Vague polish can change the tone while leaving missing requirements
            unfixed.
          </figcaption>
        </figure>
        <p>
          The same thing happens outside AI. If you ask a teammate to “clean up”
          a meeting invite, they may smooth out every sentence while the video
          link is still missing.
        </p>
      </section>

      <section id="feedback">
        <h2 tabIndex={-1}>Give targeted feedback.</h2>
        <p>
          <strong>Targeted feedback</strong> names the specific change you want
          instead of asking vaguely for “better.” Adding{" "}
          <strong>what to keep</strong> also protects requirements that already
          work.
        </p>
        <div className={styles.example}>
          <strong>In Sam’s flyer: naming the gap</strong>
          <p>
            Instead of “make it better,” Sam writes: “Add two missing facts: the
            time is 2 p.m., and the rule is bring one book to take one book.”
          </p>
          <p>
            That note names the exact changes, though it does not remind the
            assistant to keep three short, plain sentences. As you will see
            next, adding a “keep” instruction helps prevent drift.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={feedbackImg}
            alt="Infographic titled Targeted feedback: Draft 1 points to Focused note containing two chips, Change: add 2 p.m. and swap rule and Keep: short, plain words, which points to Revised draft. Bottom takeaway: Name a clear fix and protect what already works."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Targeted feedback names both the change you want and the parts to
            protect.
          </figcaption>
        </figure>
        <p>
          For an everyday example, when revising a job-application cover note,
          you might ask: “Shorten this to one short paragraph, and keep my two
          years of shop experience.”
        </p>
      </section>

      <section id="compare">
        <h2 tabIndex={-1}>Compare every version with your requirements.</h2>
        <p>
          Even after targeted feedback, a revision can introduce{" "}
          <strong>drift</strong>. Fixing one gap can make a draft grow too long
          or quietly drop a detail that passed earlier.
        </p>
        <div className={styles.example}>
          <strong>In Sam’s flyer: catching drift between rounds</strong>
          <p>
            After Sam asked to add 2 p.m. and the swap rule,{" "}
            <strong>Draft 2</strong> included both facts — but grew to four
            wordy sentences, breaking the three-sentence limit.
          </p>
          <p>
            In Round 2, Sam gave targeted feedback naming both change and keep:
            “Cut this to three short, plain sentences. Keep Saturday at 2 p.m.,
            Oak Park Pavilion, and ‘bring one book to take one book’.”
          </p>
          <p>
            <strong>Draft 3:</strong> “Join neighbors for a book swap this
            Saturday at 2 p.m. at Oak Park Pavilion. Bring one book to take one
            book. Stop by to trade stories and find your next read.”
          </p>
        </div>
        <p>
          Comparing Draft 3 against the full original list shows all three
          requirements pass. That checklist also tells Sam when to stop instead
          of polishing forever.
        </p>
        <figure className={styles.figure}>
          <Image
            src={compareImg}
            alt="Infographic titled Compare with the original list: Original list (Swap rule, Sat 2 p.m., Oak Park, 3 plain sentences) points to Compare Draft 2, then to Check result showing green checks for Swap rule and Sat 2 p.m., Oak Park, and a red X for 4 sentences. Bottom takeaway: Stop only when every requirement passes."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Checking the full list catches what slipped and shows when a draft
            is ready.
          </figcaption>
        </figure>
        <p>
          Outside AI, this is like editing a birthday invite to add “no gifts
          please” and rereading the whole card so you catch that the house
          address was accidentally deleted.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try it: two-round revision exercise.</h2>
        <p>
          Step through two revision rounds on Sam’s flyer. Try these steps in
          order:
        </p>
        <ol>
          <li>
            Read <strong>Draft 1</strong> and check the three original
            requirements at the top.
          </li>
          <li>
            In <strong>Round 1</strong>, try <em>Vague polish</em> first to see
            how livelier wording can leave requirements broken.
          </li>
          <li>
            Next, switch Round 1 to <em>Targeted — add missing facts</em> and
            check the list to spot what drifted.
          </li>
          <li>
            In <strong>Round 2</strong>, compare <em>Vague tighten</em> with{" "}
            <em>Targeted — what to change + what to keep</em> to see all three
            requirements pass.
          </li>
          <li>
            Press <strong>Reset to Draft 1</strong> any time to test another
            path.
          </li>
        </ol>
        <RevisionLab />
      </section>

      <section id="questions">
        <h2 tabIndex={-1}>Quick questions and limits.</h2>
        <ul className={styles.qaList}>
          <li>
            <strong>
              Does a smoother-sounding draft mean the answer improved?
            </strong>{" "}
            Not by itself. Check whether the draft meets every original
            requirement, not just whether it reads smoothly.
          </li>
          <li>
            <strong>Should I ask for five big changes in one follow-up?</strong>{" "}
            Usually it is clearer to focus on one or two specific changes per
            round so you can see what worked and what slipped.
          </li>
          <li>
            <strong>How do I know when to stop iterating?</strong> Stop once the
            draft meets your original requirements (and you have verified any
            facts that matter).
          </li>
        </ul>
        <p className="micro">
          Scope note: this lesson focuses on checking a revision against your
          own requirements. Verifying outside facts, sources, and generated code
          comes next in Lesson 3.8.
        </p>
      </section>

      <Check
        id="check"
        question="Sam asks an AI assistant to revise a three-sentence plain flyer so it includes Saturday at 2 p.m., Oak Park Pavilion, and the swap rule. The new draft sounds much smoother and includes all of those details, but it is now five sentences long and uses formal wording instead of plain everyday language. What is the best next step?"
        options={[
          "Use the draft as it is, because smoother writing means the answer improved.",
          "Ask the assistant to “make it better” so it fixes the remaining issues on its own.",
          "Give targeted feedback to cut it to three plain sentences while keeping Saturday at 2 p.m., Oak Park Pavilion, and the swap rule.",
          "Start over from a blank chat without checking which requirements passed.",
        ]}
        correct={2}
        explanation="Comparing the draft with the original requirements caught the length and tone drift. Targeted feedback names both what to fix (three plain sentences) and what to keep (Saturday at 2 p.m., Oak Park Pavilion, and the swap rule)."
        wrongFeedback={[
          "Smoother wording is polish, not full improvement. The draft still breaks the three-sentence limit and the plain-language requirement.",
          "Vague feedback does not say what slipped or what to protect, so the assistant may polish the style again or drop the time, place, or swap rule.",
          "",
          "Starting over without checking throws away what already worked (the time, place, and swap rule) and risks repeating the same gaps.",
        ]}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Polish is not improvement. Revise in focused rounds with targeted
            feedback—naming what to change, and what to keep when you want to
            protect working parts—compare every new version with your original
            requirements to catch drift, and stop once every requirement passes.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

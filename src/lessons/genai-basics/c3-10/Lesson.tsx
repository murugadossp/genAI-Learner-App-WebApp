import Image from "next/image";
import threeQuestionsImg from "./assets/three-questions.webp";
import threeModesImg from "./assets/three-modes.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { TaskSorter } from "./TaskSorter";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="10"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Deciding what to hand to AI"
      lead="Just because AI can write a fast answer does not mean it should do the job. This lesson shows how to weigh stakes, checkability, and your own skill before you decide what to hand over."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Not every task belongs to AI.</h2>
        <p>
          When an assistant answers in seconds, it is tempting to automate
          everything. Speed alone does not make handing over a task a good idea.
        </p>
        <p>
          In earlier lessons you saw that fluent replies can be wrong and that
          people stay responsible for the outcome. Here you will use three
          checks—<strong>stakes</strong>, <strong>checkability</strong>, and{" "}
          <strong>your own skill</strong>—to choose between three modes:{" "}
          <strong>Hand over</strong>, <strong>Work together</strong>, and{" "}
          <strong>Do myself</strong>.
        </p>
        <div className={styles.example}>
          <strong>Invented running example: Priya</strong>
          <p>
            Priya helps run a small neighborhood book club and takes an evening
            Spanish class. You will follow her tasks through this lesson and
            sort six of them in the lab.
          </p>
        </div>
      </section>

      <section id="three-questions">
        <h2 tabIndex={-1}>Three questions to ask before you delegate.</h2>
        <p>
          Think of handing a job to an eager new helper who works fast but can
          still slip. Before you pass a task over, ask three questions:
        </p>
        <ul>
          <li>
            <strong>1. Stakes:</strong> How much would a mistake matter if it
            slipped through? In this guide we split stakes into{" "}
            <strong>low</strong> (a harmless typo in a personal packing list)
            and <strong>higher</strong> (a wrong room number on a printed flyer,
            a lost deposit, or a safety risk).
          </li>
          <li>
            <strong>2. Checkability:</strong> Can you reliably verify the result
            before anyone relies on it? A task is <strong>easy to check</strong>{" "}
            when a trusted source or your own notes sit right in front of you,
            and <strong>hard to check</strong> when no reliable check is
            available (such as guessing what is in an unlabeled dish).
          </li>
          <li>
            <strong>3. Your own skill:</strong> This has two sides. First, do
            you know enough to spot a subtle error? If not, the task is hard for{" "}
            <em>you</em> to check. Second, is doing the task yourself how you
            build or keep a skill you care about—like doing mental-math drills
            for practice instead of using a calculator?
          </li>
        </ul>
        <p>
          Keep one extra boundary in mind: do not paste{" "}
          <strong>private or sensitive information</strong> into a tool that
          should not receive it, and keep tasks that call for genuine{" "}
          <strong>personal care</strong> (like a sympathy note to a close
          friend) with a person.
        </p>
        <figure className={styles.figure}>
          <Image
            src={threeQuestionsImg}
            alt="Diagram titled Before You Hand a Task to AI: a Task flows left to right into a stacked group of three checks—1. Stakes (Cost of a mistake?), 2. Checkability (Can you verify it?), and 3. Your Skill (Spot errors or practice?)—and then right to Your Decision, with a bottom strip reading Even a good AI draft needs a person in charge."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Pass a task through stakes, checkability, and your own skill before
            deciding how much to hand to AI.
          </figcaption>
        </figure>
      </section>

      <section id="three-modes">
        <h2 tabIndex={-1}>Three ways to split the work.</h2>
        <p>
          Put those three questions together to pick one mode. Check for stop
          signals first; if none apply, look at the stakes.
        </p>

        <ul className={styles.modeCards}>
          <li className={`${styles.modeCard} ${styles.modeHandOver}`}>
            <h3>Hand over (then quick check)</h3>
            <p>
              <strong>When it fits:</strong> No stop signal applies, stakes are{" "}
              <strong>low</strong>, and the result is{" "}
              <strong>easy for you to check</strong>. AI does the bulk of the
              drafting or sorting; you still scan it before using it.
            </p>
            <p>
              <strong>In Priya’s week:</strong> Grouping her eight book-club
              snacks into familiar categories (fruit, baked goods, and drinks)
              she can check at a glance. Everyday example: sorting a rough
              personal packing list by category before a weekend trip.
            </p>
          </li>

          <li className={`${styles.modeCard} ${styles.modeWorkTogether}`}>
            <h3>Work together</h3>
            <p>
              <strong>When it fits:</strong> No stop signal applies, stakes are{" "}
              <strong>higher</strong>, and the result is{" "}
              <strong>easy for you to check</strong> against a reliable source
              or your own skill. AI helps with a draft or summary while you
              supply key facts, verify every important detail, and make the
              final call.
            </p>
            <p>
              <strong>In Priya’s week:</strong> Drafting an open-house flyer for
              the library board while keeping her confirmed date, room number,
              and accessibility notes beside her. Everyday example: turning your
              own meeting bullets into a summary and checking each deadline
              against your notes before sending.
            </p>
          </li>

          <li className={`${styles.modeCard} ${styles.modeDoMyself}`}>
            <h3>Do myself (keep off AI)</h3>
            <p>
              <strong>When it fits:</strong> Any stop signal applies—the result
              is <strong>hard for you to check</strong> (no reliable source, or
              you lack the skill to catch errors), the{" "}
              <strong>main goal is building your own skill</strong>, or the task
              involves <strong>private information</strong> or{" "}
              <strong>personal care</strong>.
            </p>
            <p>
              <strong>In Priya’s week:</strong> Writing her five-sentence
              Spanish homework paragraph to practice past-tense verbs. Also
              deciding whether an unmarked homemade dish is safe for a guest
              with a severe peanut allergy: keeping it off AI does not mean
              guessing yourself—skip serving it unless both its ingredients and
              peanut cross-contact safety are reliably confirmed.
            </p>
            <p>
              <strong>Everyday example:</strong> Writing a heartfelt condolence
              card to a close friend, or practicing guitar chords yourself.
            </p>
          </li>
        </ul>

        <figure className={styles.figure}>
          <Image
            src={threeModesImg}
            alt="Diagram titled Three Ways to Split the Work showing three side-by-side cards: Hand Over (Low stakes, Easy to check, Quick review), Work Together (Higher stakes, Easy to check, Verify and edit), and Do Myself (Hard to check, Skill practice, Private or care), with a bottom strip reading Every mode keeps a person responsible for the result."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Match AI’s role to the task. Even in Hand Over, a quick human check
            stays in the loop.
          </figcaption>
        </figure>

        <h3>Quick questions</h3>
        <ul>
          <li>
            <strong>Does “Hand over” mean zero checking?</strong> No. Even
            low-stakes drafts can have odd slips, so give the result a quick
            look before using it.
          </li>
          <li>
            <strong>Can the same task move between modes?</strong> Yes. Getting
            an official source in front of you can turn a hard-to-check task
            into one where you can work together safely.
          </li>
          <li>
            <strong>
              What if I am not skilled enough to check AI’s answer?
            </strong>{" "}
            Then the task is hard for you to check. Keep it off AI, or involve a
            qualified person who can verify the work.
          </li>
        </ul>
      </section>

      <section id="sort-lab">
        <h2 tabIndex={-1}>Sort six of Priya’s tasks.</h2>
        <TaskSorter />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where this guide is too tidy.</h2>
        <ul>
          <li>
            Stakes, checkability, and skill sit on scales, not in rigid boxes.
            Borderline tasks exist, and two reasonable people may draw the line
            slightly differently.
          </li>
          <li>
            Tasks shift as your situation changes: once you build a skill or get
            a trusted source in hand, you are better equipped to check AI’s
            help.
          </li>
          <li>
            “Do myself” means keeping a task off AI, not guessing alone on a
            high-stakes safety, legal, or medical question—involve a qualified
            person when needed.
          </li>
          <li>
            How to write clear prompts and choose between specific AI models are
            covered in earlier lessons of this chapter.
          </li>
        </ul>
      </section>

      <Check
        id="check"
        question="Priya has two tasks tonight. First, she must write a short Spanish paragraph for her evening class, where the assignment is to practice past-tense verbs on her own. Second, she wants to group a five-item snack list into familiar categories (fruit, baked goods, and drinks) for Saturday’s club meeting; she has all five items in front of her, knows which category each belongs in, and includes no private details. Which plan fits both tasks best?"
        options={[
          "Hand both tasks to AI so she finishes faster and spends less time writing.",
          "Do both tasks completely herself, because AI should not be used for everyday lists.",
          "Hand the Spanish homework to AI to get a smoother paragraph, and group the snack list herself.",
          "Write the Spanish paragraph herself to practice the skill, and let AI group the snack list before giving it a quick check.",
        ]}
        correct={3}
        wrongFeedback={[
          "Automating both tasks skips the Spanish practice that Priya wants to build, even though the snack list is low stakes and easy for her to check.",
          "The snack list has low stakes, is easy to check against her five familiar items in seconds, and is not a skill she is trying to practice, so AI can help with a quick check.",
          "This swaps the two tasks: the Spanish homework is meant to build Priya’s own skill, while the snack list is low stakes and easy to check.",
          "",
        ]}
        explanation="The Spanish paragraph is a skill-building task, so doing it herself is the whole point. The five-item snack list has low stakes, uses familiar categories she can verify in seconds, and has no private details, so she can hand it to AI and do a quick check."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Do not automate everything. Before handing a task to AI, weigh the
            stakes, whether you can reliably check the result, and whether you
            need the skill yourself—then choose to hand over with a quick check,
            work together, or do it yourself.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

import Image from "next/image";
import Link from "next/link";
import vagueGuessing from "./assets/vague-guessing.webp";
import threeParts from "./assets/three-parts.webp";
import lengthVsClarity from "./assets/length-vs-clarity.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { PromptLab } from "./PromptLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Giving clear goals and instructions"
      lead="An AI assistant cannot read your mind. When a request is vague, it fills in the blanks with guesses—and adding more filler words will not fix that."
    >
      <section id="vague">
        <h2 tabIndex={-1}>Why vague requests miss the mark.</h2>
        <p>
          A <strong>prompt</strong> is the message or instruction you type to an
          AI assistant. A <strong>vague request</strong> is a prompt that leaves
          key decisions unstated, so the assistant has to guess what you meant.
        </p>
        <p>
          It is a lot like telling a friend, “Bring something for dinner.” They
          might show up with ice cream, bread, or a full main dish—none of which
          is wrong, just not what you needed.
        </p>
        <div className={styles.example}>
          <strong>Running example: Maya’s Saturday bike clinic</strong>
          <p>
            Maya (an invented character for this lesson) helps run a free
            Saturday morning bike-repair clinic at her local library. She types
            this vague prompt: “Write something about the bike clinic.”
          </p>
        </div>
        <p>
          Because Maya only asked to “write something,” the assistant has to
          guess the form, the reader, and the goal. It could produce a history
          essay, a volunteer ad, or a thank-you note.
        </p>
        <figure className={styles.figure}>
          <Image
            src={vagueGuessing}
            alt="Diagram titled Vague Prompts Force Guessing: a vague prompt 'Write something about the bike clinic.' leads to Assistant guesses, branching into three possible drafts: History essay?, Volunteer ad?, and Thank-you note?."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            When key decisions are left out, one vague prompt can branch into
            very different drafts.
          </figcaption>
        </figure>
        <p>
          In this lesson, you will turn a vague request into a{" "}
          <strong>clear task</strong> using three parts: <strong>action</strong>
          , <strong>audience</strong>, and <strong>outcome</strong>. Then you
          will see why extra <strong>padding</strong> (filler words) does not
          make a vague prompt clearer, try rewriting Maya’s prompt, and check
          your understanding.
        </p>
      </section>

      <section id="three-parts">
        <h2 tabIndex={-1}>Three parts that turn a wish into a task.</h2>
        <p>
          You do not need special phrasing or secret tricks to write a clear
          prompt. In everyday work, naming three specific decisions—often in a
          single plain sentence—removes most of the guesswork.
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>1. Action</h3>
            <p>
              Say what specific kind of thing to make or do, not just “write
              something.”
            </p>
            <p className="micro">
              <strong>Maya’s clinic:</strong> “Write a short notice.”
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Instead of “Help with my
              resume,” try “Rewrite my job summary into three plain bullet
              points.”
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>2. Audience</h3>
            <p>Name who will read or use the finished reply.</p>
            <p className="micro">
              <strong>Maya’s clinic:</strong> “for neighbors with a broken
              bike.”
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Explaining a school schedule
              change to a parent focuses on pickup times; explaining it to a bus
              driver focuses on route stops.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>3. Outcome</h3>
            <p>
              State what the finished reply should help that reader know or do.
            </p>
            <p className="micro">
              <strong>Maya’s clinic:</strong> “so they know to drop in Saturday
              morning for a free repair.”
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> A clinic note meant to bring in
              broken bikes reads very differently from one meant to recruit
              volunteer mechanics.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <strong>Maya’s clear prompt (22 words)</strong>
          <p>
            “Write a short notice for neighbors with a broken bike so they know
            to drop in Saturday morning for a free repair.”
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={threeParts}
            alt="Diagram titled Three Parts of a Clear Task: three input cards (Action: Write a short notice, Audience: Neighbors with a broken bike, Outcome: Drop in Saturday for free repair) converge into Clear task and lead to Focused draft: Saturday drop-in repair notice."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Action, audience, and outcome work together to steer the assistant
            toward one focused draft.
          </figcaption>
        </figure>
      </section>

      <section id="more-words">
        <h2 tabIndex={-1}>Why more words do not always help.</h2>
        <p>
          A common mistake is thinking a longer prompt automatically gets a
          better reply. In practice, adding <strong>padding</strong>—extra
          adjectives, polite rambling, or repeated wishes like “make it really
          nice and helpful”—lengthens the prompt without naming any of the three
          clear parts.
        </p>
        <p>
          Imagine asking a colleague for spreadsheet help with a long apology
          and five adjectives (“make it super clean, polished, and impressive”)
          while never saying which chart you need or who will read it. More
          words did not answer the real questions.
        </p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <div className={styles.compareMeta}>
              <span className={styles.badge}>31 words</span>
              <span className={`${styles.badge} ${styles.badgeWarn}`}>
                0 of 3 clear parts
              </span>
            </div>
            <p>
              “Please help me write something really nice, friendly, super
              helpful, clear, polished, and engaging about the bike clinic so it
              sounds really great, warm, welcoming, impressive, thoughtful, and
              very well written.”
            </p>
            <p className="micro">
              Longer, but “write something” is still too broad to count as a
              clear action, and both audience and outcome are missing.
            </p>
          </div>
          <div className={styles.compareCard}>
            <div className={styles.compareMeta}>
              <span className={styles.badge}>22 words</span>
              <span className={`${styles.badge} ${styles.badgeGood}`}>
                3 of 3 clear parts
              </span>
            </div>
            <p>
              “Write a short notice for neighbors with a broken bike so they
              know to drop in Saturday morning for a free repair.”
            </p>
            <p className="micro">
              Shorter than the padded prompt, yet it names the action, audience,
              and outcome directly.
            </p>
          </div>
        </div>
        <figure className={styles.figure}>
          <Image
            src={lengthVsClarity}
            alt="Diagram titled Longer Is Not Clearer: compares a top row '31 words · 0 clear parts' ('really nice, friendly, super helpful...') leading to 'Still vague', against a bottom row '22 words · 3 clear parts' ('Notice · Neighbors · Free Saturday repair') leading to 'Clear task'."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Specific decisions beat extra adjectives. Extra words help when they
            supply real details, not filler.
          </figcaption>
        </figure>
        <p>
          Longer prompts can also hurt when extra sentences pile on conflicting
          wishes—for example, asking for a “super brief” note and also asking
          for “every detail of the clinic’s history.”
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Rewrite Maya’s prompt and compare replies.</h2>
        <p>
          Before you click, notice what happens when you add padding versus when
          you name a clear part: padding raises the word count while leaving the
          assistant’s guesses unchanged.
        </p>
        <ol className={styles.steps}>
          <li>
            Start on <strong>Vague (6 words)</strong> and read the three things
            the assistant had to guess.
          </li>
          <li>
            Click <strong>Long &amp; vague (31 words)</strong> and notice that
            the word count jumps while the clear-part count stays at 0 of 3.
          </li>
          <li>
            Turn on <strong>Action</strong>, <strong>Audience</strong>, and{" "}
            <strong>Outcome</strong> one by one and watch each guess disappear.
          </li>
          <li>
            Click <strong>Reset</strong> to return to Maya’s original prompt.
          </li>
        </ol>
        <PromptLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What clear instructions still cannot guarantee.</h2>
        <p>
          Naming the action, audience, and outcome steers the draft, but it does
          not guarantee a ready-to-send result. As you saw in Lesson 1.6, a
          fluent reply can still invent details or miss local facts.
        </p>
        <p>
          Even with her clear prompt, Maya still needs to check the draft and
          add real details the assistant was not given—such as the library
          address and exact opening hours.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>Does a clear prompt always have to be short?</strong>
            <p>
              No. A prompt should be as long as the real task details require.
              The problem is filler words that add length without helping the
              assistant make better decisions.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Do I need all three parts for every prompt?</strong>
            <p>
              Not for tiny routine jobs. If you paste one sentence and ask “Fix
              the spelling,” the action is already clear on its own.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              What about pasting background notes, roles, or tables?
            </strong>
            <p>
              Those build on a clear task. You will practise background context
              and limits, roles, examples, and formatted outputs like tables in
              the next lessons of this chapter.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="Maya now needs a message to recruit volunteer mechanics for this Saturday’s bike clinic. She wants to replace her vague prompt “Write about volunteering at the bike clinic.” Which prompt gives the assistant the clearest task?"
        options={[
          "Please write something really warm, inspiring, well-structured, and engaging about volunteering at the bike clinic so it feels really great.",
          "Write a short message about our Saturday bike clinic for local cyclists.",
          "Write a short group-chat post for experienced cyclists asking them to sign up for a volunteer repair shift this Saturday.",
          "Write a ten-paragraph article about the history of community bike clinics and why volunteering matters.",
        ]}
        correct={2}
        explanation="It names the action (a short group-chat post), the audience (experienced cyclists), and the outcome (signing up for a volunteer repair shift this Saturday), leaving far less for the assistant to guess."
        wrongFeedback={[
          "This adds polite adjectives, but “write something” still leaves the format, audience, and volunteer ask too vague for the assistant to know what to draft.",
          "This names an action and an audience, but leaves out the outcome: the assistant has to guess whether local cyclists should bring a broken bike, donate parts, or sign up to volunteer.",
          "",
          "This is specific, but it asks for the wrong action and outcome—a ten-paragraph history article will not help Maya recruit mechanics for this Saturday’s shift.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Clarity beats word count.</strong> Before you send a prompt
            that could go in several directions, check that it names three
            things: <strong>action</strong> (what to make or do),{" "}
            <strong>audience</strong> (who will read it), and{" "}
            <strong>outcome</strong> (what the reply should achieve).
          </p>
          <p className="micro">
            Ready to continue? Return to{" "}
            <Link className="text-link" href="/course/chapter-3">
              Prompting and Working with AI
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

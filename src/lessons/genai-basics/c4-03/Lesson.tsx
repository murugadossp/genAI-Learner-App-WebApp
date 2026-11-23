import Image from "next/image";
import Link from "next/link";
import scoreToLabel from "./images/score-to-label.webp";
import thresholdTradeoff from "./images/threshold-tradeoff.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ThresholdLab } from "./ThresholdLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Classification: choosing categories"
      lead="Sorting messages into categories is not a sure-thing guess. Many spam filters rate each email with a number first, then use a cutoff rule to pick the final category."
    >
      <section id="scores-not-labels">
        <h2 tabIndex={-1}>Why many classifiers start with a score.</h2>
        <p>
          In Lesson 4.2, regression estimated a number such as a price.{" "}
          <strong>Classification</strong> is supervised learning that chooses a{" "}
          <strong>category</strong> (also called a <strong>class</strong>) from
          a fixed set of options, such as sorting an email into{" "}
          <code>Spam</code> or <code>Inbox</code>.
        </p>
        <p>
          In this lesson, you will follow six terms in order:{" "}
          <strong>classification</strong>, <strong>category</strong>,{" "}
          <strong>score</strong>, <strong>threshold (cutoff)</strong>,{" "}
          <strong>false alarm</strong>, and <strong>missed spam</strong>.
        </p>
        <p>
          A common misconception is that a classifier &ldquo;knows&rdquo; the
          true category. While some classifiers output a label directly, many
          first compute a numeric <strong>score</strong>—for example, on a scale
          from <code>0.00</code> to <code>1.00</code>, where a higher score
          means this filter rates the email as more spam-like based on clues it
          learned from labeled examples.
        </p>
        <p>
          Even when a score looks like a percentage, a raw score of{" "}
          <code>0.66</code> is not automatically a 66% real-world chance of
          spam. Checking whether scores match real-world chances is a separate
          calibration step you will see in Chapter 5.
        </p>
        <p>
          Next, a separate <strong>threshold</strong> (or{" "}
          <strong>cutoff</strong>) number turns that score into a label using a
          decision rule. In this lesson, the rule is: if an email&rsquo;s score
          is at or above the cutoff (including an exact tie), the filter flags
          it as <code>Spam</code>; if the score is below the cutoff, the filter
          keeps it in <code>Inbox</code>.
        </p>
        <p>
          Think of a smoke detector: its sensor measures smoke level first, and
          an alarm trigger level decides whether to beep. The analogy has a
          limit—a smoke detector measures physical smoke, whereas a spam filter
          only scores text clues learned from past examples.
        </p>
        <div className={styles.example}>
          <strong>Running example: Sam&rsquo;s small bookstore inbox</strong>
          <p>
            Sam (an invented shop owner for this lesson) receives six emails
            with illustrative spam scores. To see when the filter makes a
            mistake, we compare the filter&rsquo;s decision (<code>Inbox</code>{" "}
            or <code>Spam</code>) against Sam&rsquo;s own judgment—called the
            reference label (<code>Wanted</code> or <code>Spam</code>).
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={scoreToLabel}
            alt="Three-band diagram titled From score to category with subtitle A classifier scores an email, then a cutoff picks the label. Left to right in the middle band: Email FLASH SALE: 30% off novels goes to Classifier, producing Score: 0.66, which enters Cutoff: 0.50 showing 0.66 is at or above 0.50 and outputs Decision: Spam. Bottom left Analogy card shows a smoke detector: Like a smoke detector checking smoke level against an alarm trigger. Bottom right Key takeaways card lists: The model outputs a score, not the true class; A cutoff turns that score into a label; The score stays fixed if the cutoff moves."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            In this filter, the model outputs a score first and the cutoff rule
            turns that score into a category decision.
          </figcaption>
        </figure>
      </section>

      <section id="threshold-decision">
        <h2 tabIndex={-1}>How a cutoff turns a score into a category.</h2>
        <p>
          Because the model does not know Sam&rsquo;s true intent, a cutoff can
          produce two kinds of mistakes:
        </p>
        <ul className={styles.steps}>
          <li>
            <strong>False alarm:</strong> a <code>Wanted</code> email scores at
            or above the cutoff and gets flagged as <code>Spam</code>.
          </li>
          <li>
            <strong>Missed spam:</strong> a <code>Spam</code> email scores below
            the cutoff and slips into <code>Inbox</code>.
          </li>
        </ul>
        <p>
          Look at what happens on Sam&rsquo;s six invented emails when we apply
          the same fixed scores at two different cutoffs. Two borderline emails
          explain why mistakes happen: Sam signed up for the publisher&rsquo;s{" "}
          <code>0.66</code> flash-sale offer (so Sam labels it{" "}
          <code>Wanted</code>), while the calm <code>0.52</code> website-listing
          message is an unsolicited sales pitch Sam considers <code>Spam</code>.
        </p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <h3>At cutoff 0.50</h3>
            <p>
              Four emails score <code>0.50</code> or higher (<code>0.94</code>,{" "}
              <code>0.80</code>, <code>0.66</code>, <code>0.52</code>) and are
              flagged as <code>Spam</code>. Two emails (<code>0.26</code>,{" "}
              <code>0.10</code>) stay in <code>Inbox</code>.
            </p>
            <p className="micro">
              <strong>Result:</strong> 1 false alarm (the <code>0.66</code>{" "}
              publisher promo) and 0 missed spam.
            </p>
          </div>
          <div className={styles.compareCard}>
            <h3>At cutoff 0.75</h3>
            <p>
              Only two emails score <code>0.75</code> or higher (
              <code>0.94</code>, <code>0.80</code>) and are flagged as{" "}
              <code>Spam</code>. Four emails (<code>0.66</code>,{" "}
              <code>0.52</code>, <code>0.26</code>, <code>0.10</code>) stay in{" "}
              <code>Inbox</code>.
            </p>
            <p className="micro">
              <strong>Result:</strong> 0 false alarms, and 1 missed spam (the{" "}
              <code>0.52</code> unsolicited sales pitch).
            </p>
          </div>
        </div>
        <p>
          Notice why no single cutoff can get all six right: the wanted{" "}
          <code>0.66</code> publisher promo scored higher than the{" "}
          <code>0.52</code> spam pitch. Because those scores overlap, people
          choose the cutoff based on which mistake hurts less—not because one
          number is magic.
        </p>
        <p>
          Outside email, an airport metal detector works the same way when
          screening for prohibited items. Turning sensitivity higher catches
          more metal objects, but everyday belt buckles and keys trigger more
          false alarms.
        </p>
      </section>

      <section id="tradeoff">
        <h2 tabIndex={-1}>Moving the cutoff trades one mistake for another.</h2>
        <p>
          On a fixed set of scores, moving the cutoff moves the boundary line
          without changing any email&rsquo;s score:
        </p>
        <ul className={styles.steps}>
          <li>
            <strong>Lowering the cutoff</strong> flags the same or more emails
            as <code>Spam</code>. Missed spam stays the same or drops, while
            false alarms stay the same or rise.
          </li>
          <li>
            <strong>Raising the cutoff</strong> flags the same or fewer emails
            as <code>Spam</code>. False alarms stay the same or drop, while
            missed spam stays the same or rises.
          </li>
        </ul>
        <p>
          A count can stay flat when no email scores at or above the lower
          cutoff and below the higher cutoff. For example, on Sam&rsquo;s six
          emails, moving from <code>0.50</code> to <code>0.60</code> leaves
          false alarms at 1, because the <code>0.66</code> promo is still at or
          above both cutoffs.
        </p>
        <p>
          Different jobs call for different cutoffs. Sam prefers a higher cutoff
          like <code>0.75</code> so real customer orders and publisher offers
          are not buried in Spam, accepting an occasional spam email in the
          inbox. By contrast, a bank fraud alert may use a lower cutoff so
          suspicious charges are flagged for a human check.
        </p>
        <figure className={styles.figure}>
          <Image
            src={thresholdTradeoff}
            alt="Three-band diagram titled Moving the cutoff trades mistakes with subtitle Scores stay fixed while the cutoff line shifts. Middle band shows two aligned 0.0 to 1.0 score tracks with the same six fixed dots: top track Low cutoff: 0.20 has shaded Filter: Spam at or above cutoff on the right and marks 0.66 (Sam: Wanted) as False alarm; bottom track High cutoff: 0.75 shifts the cutoff line right and marks 0.52 (Sam: Spam) as Missed spam. Bottom left Analogy card shows a metal detector: Like a metal detector for prohibited items: higher sensitivity catches more, with more false alarms. Bottom right Key takeaways card lists: Lower cutoff: same or less missed spam, same or more false alarms; Higher cutoff: same or fewer false alarms, same or more missed spam; Pick the cutoff for the mistake that costs more."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The email scores do not move—only the cutoff line shifts left or
            right, keeping or trading false alarms against missed spam.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>
          Try it: move the spam cutoff on Sam&rsquo;s inbox.
        </h2>
        <p>
          Every email&rsquo;s score stays fixed while you drag the slider. Watch
          how the vertical cutoff line crosses each score bar and flips the
          filter&rsquo;s decision.
        </p>
        <ol className={styles.steps}>
          <li>
            Start at <strong>Default (0.50)</strong> and find the{" "}
            <code>0.66</code> publisher promo marked{" "}
            <strong>False alarm</strong>.
          </li>
          <li>
            Click <strong>Flag less (0.75)</strong> and notice that false alarms
            drop to 0 while the <code>0.52</code> sales pitch becomes{" "}
            <strong>Missed spam</strong>.
          </li>
          <li>
            Click <strong>Flag more (0.20)</strong> and see how flagging more
            emails catches all spam but causes 2 false alarms (the{" "}
            <code>0.66</code> publisher promo and the <code>0.26</code> customer
            question).
          </li>
          <li>
            Drag the slider across <code>0.50</code> to <code>0.70</code> and
            watch the <code>0.66</code> wanted promo and <code>0.52</code> spam
            pitch show why no cutoff gets zero mistakes, then click{" "}
            <strong>Reset to 0.50</strong>.
          </li>
        </ol>
        <ThresholdLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What a score does—and does not—mean.</h2>
        <p>
          A high score means this filter rated the email as strongly spam-like
          based on clues learned from labeled examples—not that it checked the
          sender&rsquo;s real intent. When real messages borrow spam-like words
          (&ldquo;FLASH SALE&rdquo;) or spam borrows polite wording, scores
          overlap and mistakes follow.
        </p>
        <p>
          Classification also extends beyond two categories. A bookstore support
          classifier might score three categories—<code>Order</code>,{" "}
          <code>Return</code>, and <code>General question</code>—and typically
          pick the highest-scoring label, or route low-scoring messages to a
          person.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>Is 0.50 always the best cutoff?</strong>
            <p>
              No. <code>0.50</code> is a common starting point, not a universal
              rule. Teams choose a cutoff based on which mistake costs more in
              their setting.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Does moving the cutoff retrain the model?</strong>
            <p>
              No. The model and its scores stay unchanged. Moving the cutoff
              only changes the decision rule applied to those scores.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              How is classification different from regression (Lesson 4.2)?
            </strong>
            <p>
              Regression estimates a continuous number, like a house price or
              temperature. Classification chooses a label from a fixed set of
              categories, often using scores and a decision rule.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="In a separate invented batch of scored emails, Sam’s spam filter gives a customer’s order email (which Sam labels Wanted) a spam score of 0.64. At the 0.50 cutoff (scores 0.50 or higher are flagged as Spam), the filter flags it as Spam. Without retraining the model, Sam raises the cutoff to 0.75 and reapplies the rule to this email and the rest of the same batch. What happens?"
        options={[
          "The model recalculates a lower score for the email so it goes to Inbox, and both false alarms and missed spam drop to zero.",
          "The email keeps its 0.64 score and now goes to Inbox; across the batch, false alarms can only drop or stay the same, while missed spam can only rise or stay the same.",
          "The email is still flagged as Spam because 0.64 is above 0.50, and a new cutoff only takes effect after the model is retrained.",
          "The email keeps its 0.64 score and goes to Inbox, while across the batch false alarms can only rise or stay the same and missed spam can only drop or stay the same.",
        ]}
        correct={1}
        explanation="Raising the cutoff does not change the model or its scores: 0.64 is now below 0.75, so the rule puts the email in Inbox. Across the same batch of scores, flagging fewer emails as Spam can only keep or lower false alarms and keep or raise missed spam."
        wrongFeedback={[
          "Changing the cutoff does not recalculate the email's 0.64 score, and raising the cutoff gives no guarantee that both kinds of mistake drop to zero across the batch.",
          "",
          "You do not need to retrain a model to apply a new cutoff rule. Reapplying the 0.75 cutoff to the existing 0.64 score moves it below the cutoff into Inbox.",
          "The first half is right—the score stays 0.64 and goes to Inbox—but the tradeoff direction is reversed: raising the cutoff flags fewer emails as Spam, so false alarms can only drop or stay the same while missed spam can only rise or stay the same.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Many classifiers score first; a cutoff decides.</strong> A
            model does not know the true category—in score-based filters, it
            outputs a score and a separate cutoff rule turns that score into a
            label. Moving the cutoff on a fixed batch does not change the
            scores; it can only keep or trade false alarms against missed cases
            so you can match the decision to what matters most.
          </p>
          <p className="micro">
            Ready to continue? Return to{" "}
            <Link className="text-link" href="/course/chapter-4">
              How Machines Learn
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

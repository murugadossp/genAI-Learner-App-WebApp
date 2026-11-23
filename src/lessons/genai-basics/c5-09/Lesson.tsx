import Image from "next/image";
import Link from "next/link";
import targetLeakageImg from "./images/target-leakage.webp";
import duplicateOverlapImg from "./images/duplicate-overlap.webp";
import preprocessingLeakageImg from "./images/preprocessing-leakage.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { LeakInspectorLab } from "./LeakInspectorLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="09"
      chapter={{ label: "Data and Evaluation", href: "/course/chapter-5" }}
      title="Data leakage and misleading results"
      lead="A high score is useful evidence, but it does not prove a model will work in real use. Follow the clues that can make an evaluation look better than it is."
    >
      <section id="what-is-leakage">
        <h2 tabIndex={-1}>What a high test score can miss.</h2>
        <p>
          A <strong>test set</strong> is a held-back group of examples used to
          estimate how a model may perform on new examples. Its{" "}
          <strong>test score</strong> summarizes performance on that group; it
          is an estimate, not a guarantee.
        </p>
        <p>
          A <strong>data split</strong> assigns examples to separate groups for
          learning and checking. The <strong>training set</strong> is the group
          used to fit a model; keeping the test set out of training makes the
          check more informative.
        </p>
        <p>
          <strong>Data leakage</strong> happens when information that would not
          be available in real use influences model training or evaluation. The
          score can then reward a shortcut instead of the pattern the model
          needs to learn.
        </p>
        <p>
          We will follow three possible routes: a clue from after the decision,
          repeated or related examples across the split, and preparation that
          uses held-back data. Then you can audit a delivery example.
        </p>
        <div className={styles.example}>
          <strong>Running example: Northside Parcel Delivery</strong>
          <p>
            Northside wants to predict at <strong>8:00 AM dispatch</strong>{" "}
            whether each parcel will arrive late by 6:00 PM. We will ask what
            information is fair to use at dispatch and whether the offline check
            resembles next week’s parcels.
          </p>
        </div>
        <p>
          In the earlier lesson on{" "}
          <Link href="/learn/genai-basics/c5-05">
            training, validation and test sets
          </Link>
          , the test set was kept for a final check. A separate test set helps,
          but it cannot fix every way information may leak into a pipeline.
        </p>
      </section>

      <section id="target-leakage">
        <h2 tabIndex={-1}>Target leakage: a clue from after the decision.</h2>
        <p>
          The <strong>prediction moment</strong> is when a model must make its
          real decision. The <strong>target</strong> is the outcome it is trying
          to predict, and a <strong>feature</strong> is an input it can use.
          <strong> Target leakage</strong> occurs when a feature reveals the
          target using information unavailable at the prediction moment.
        </p>
        <p>
          Imagine taking a practice quiz with the answer key printed on the
          page. Doing well on that quiz says little about how you will do when
          the key is gone.
        </p>
        <div className={styles.example}>
          <strong>Worked example: the refund column</strong>
          <p>
            Northside’s old records include parcel weight, route, and whether a
            delay refund was issued. Refunds are issued after a parcel arrives
            late. Using that column to predict lateness at 8:00 AM gives the
            model a clue that will not exist when it makes a live prediction.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={targetLeakageImg}
            alt="Target leakage infographic: 8:00 AM dispatch sends weight and route to a model predicting late arrival, while an after-delivery refund is marked as a future clue. The bottom has separate Analogy and Key takeaways cards."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            The dashed arrow marks information that appears after dispatch but
            can still slip into historical evaluation.
          </figcaption>
        </figure>
        <p>
          A similar mistake could happen in a subscription model: a cancellation
          survey sent after someone cancels cannot help predict, on the first
          day of the month, who is still active and may cancel later.
        </p>
      </section>

      <section id="duplicates-and-prep">
        <h2 tabIndex={-1}>Duplicate overlap: the test has seen a copy.</h2>
        <p>
          <strong>Duplicate overlap</strong> means the same record, or a copied
          version of it, appears in both training data and the test set. The
          score may partly measure recognition of a record already seen.
        </p>
        <p>
          A <strong>random row split</strong> assigns individual rows to groups
          without keeping related rows together. It can be a poor match when
          repeated records or shared identities matter.
        </p>
        <div className={styles.example}>
          <strong>Worked example: a re-imported order</strong>
          <p>
            A scanner re-imports Northside’s Order #104. A random row split
            places the original order in training and its copy in the test set.
            A strong score on that test does not show how well the model handles
            a genuinely new order.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={duplicateOverlapImg}
            alt="Duplicate overlap infographic: an order log sends Order #104 and its copy through a random split into training and test, where the test copy is marked already seen. The bottom has separate Analogy and Key takeaways cards."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            For a new-order evaluation, copies should be removed before
            splitting the records.
          </figcaption>
        </figure>
        <p>
          <strong>Group overlap</strong> is related but not identical: different
          records from the same person, account, or event appear in both sets.
          If the goal is to work with new patients, for example, two scans of
          one patient should usually stay together. If the goal is a later scan
          from a known patient, a time-based split may better match the
          question. Choose the split to match the intended use.
        </p>
      </section>

      <section id="preprocessing">
        <h2 tabIndex={-1}>
          Preprocessing leakage: test data shapes preparation.
        </h2>
        <p>
          <strong>Preprocessing</strong> means preparing inputs before a model
          uses them, such as filling missing numbers or scaling values. To{" "}
          <strong>fit</strong> a preparation step is to calculate the values it
          will use from a chosen data group.{" "}
          <strong>Preprocessing leakage</strong> happens when this calculation
          includes held-back test examples before evaluation.
        </p>
        <div className={styles.example}>
          <strong>Worked example: filling missing travel times</strong>
          <p>
            Suppose Northside fills missing travel times with an average. If it
            calculates that average using every week before separating the last
            week for testing, information from the test week has shaped the
            training inputs. Instead, split by week, calculate the average from
            training weeks, and reuse that value for the test week.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={preprocessingLeakageImg}
            alt="Preprocessing leakage infographic: all records are split first, a train average is fitted on the training set, and the saved value is applied to training and test data. Separate Analogy and Key takeaways cards reinforce the order."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            Preparation steps can be fitted on training data and then applied
            consistently to held-back examples.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Audit Northside’s delivery pipeline.</h2>
        <p>
          The worked examples showed what to look for. Now inspect four
          illustrative pipelines. Compare each offline test score with a new
          week’s live score, identify the cause of any gap, then apply a fix.
        </p>
        <ol className={styles.steps}>
          <li>
            Start with the refund column. Compare every feature with the 8:00 AM
            prediction moment, choose a diagnosis, and apply the fix.
          </li>
          <li>
            Inspect the duplicate-order and whole-table preparation cases.
            Notice which part of each pipeline creates the concern.
          </li>
          <li>
            Finish with the time-based, train-only preparation case. Ask whether
            its test setup resembles the next week of parcels.
          </li>
        </ol>
        <LeakInspectorLab />
      </section>

      <section id="preventing-leakage">
        <h2 tabIndex={-1}>A short audit before trusting a score.</h2>
        <ul className={styles.checklist}>
          <li className={styles.checklistItem}>
            <strong>1. Name the prediction moment</strong>
            Remove inputs recorded after the model must decide.
          </li>
          <li className={styles.checklistItem}>
            <strong>2. Check records and groups</strong>
            Remove accidental copies. Keep related examples together when the
            evaluation is meant to test unseen people or events.
          </li>
          <li className={styles.checklistItem}>
            <strong>3. Match the split to the use</strong>
            For a future prediction, training on earlier periods and testing on
            a later period may give a more relevant estimate.
          </li>
          <li className={styles.checklistItem}>
            <strong>4. Fit preparation on training data</strong>
            Learn averages, ranges, and encodings from training data, then apply
            those values to validation and test examples.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>Does a high score prove the model is good?</strong>
            <p>
              No. Check whether the evaluation is fair and whether the score
              matches the real task before relying on it.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Is every high score caused by leakage?</strong>
            <p>
              No. A task can be predictable. An unexpectedly high result is a
              reason to audit the data and split, not proof of a leak.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A magazine predicts on the first day of each month which active subscribers may cancel that month. A survey is sent only after a subscriber clicks cancel, but the column is included in a test set and the score is 96%. Live performance is poor. What best explains the misleading score?"
        options={[
          "A small dataset automatically inflated the test score.",
          "A duplicate order copy landed in both the training and test sets.",
          "Target leakage: the after-cancellation survey gives a clue unavailable at the prediction moment.",
          "Training-only preparation made the score artificially high.",
        ]}
        correct={2}
        explanation="The survey is recorded after cancellation, so it reveals information unavailable for active subscribers on the first day of the month. The high test score therefore does not establish that the model will work in live use."
        wrongFeedback={[
          "A small dataset can make an estimate uncertain, but it does not explain why this test used a post-cancellation clue.",
          "Duplicate overlap can affect an evaluation, but no repeated subscriber records are described here. The survey was sent after cancellation.",
          "",
          "The scenario does not describe preparation on held-back data. The after-cancellation survey makes the setup unfair for the stated prediction moment.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>A high score earns trust only after a fair check.</strong>{" "}
            Future clues, duplicate or overlapping records, and preparation
            fitted on test data can make results look better than performance on
            new cases. Match the test to the real decision, then inspect how
            every feature and preparation step got there.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

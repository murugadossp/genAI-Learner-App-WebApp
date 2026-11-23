import Image from "next/image";
import Link from "next/link";
import accuracyTrapImg from "./images/accuracy-trap.webp";
import confusionMatrixImg from "./images/confusion-matrix.webp";
import precisionRecallImg from "./images/precision-recall.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ThresholdLab } from "./ThresholdLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="08"
      chapter={{ label: "Data and Evaluation", href: "/course/chapter-5" }}
      title="Accuracy, precision and recall"
      lead="A score can look strong while hiding the errors that matter. Read the counts first, then choose a measure that fits the cost of mistakes."
    >
      <section id="accuracy-trap">
        <h2 tabIndex={-1}>Accuracy can hide a missed case.</h2>
        <p>
          <strong>Accuracy</strong> is the share of all predictions that match
          what actually happened. It answers “how many were right overall?” but
          does not show which kinds of mistakes occurred.
        </p>
        <p>
          We will follow one invented example through the lesson: Northgate Bank
          tests a card-fraud screener on 20 transactions. Five are actually
          fraud and 15 are legitimate. Here, fraud is the{" "}
          <strong>positive class</strong> (the outcome we want to find);
          legitimate is the
          <strong> negative class</strong>.
        </p>
        <div className={styles.example}>
          <strong>Worked example: the “flag nothing” baseline</strong>
          <p>
            If the screener calls every transaction legitimate, it gets 15 of 20
            right: <strong>75% accuracy</strong>. Yet it catches none of the
            five frauds. A smoke alarm that stays quiet on ordinary days can
            still fail its purpose if it misses a fire.
          </p>
        </div>
        <p>
          This is why accuracy alone is not enough when one class is uncommon or
          when the cost of each error differs. The next step is to inspect the
          counts behind the score.
        </p>
        <figure className={styles.figure}>
          <Image
            src={accuracyTrapImg}
            alt="Accuracy: 15 correct of 20 total gives 75%; 5 fraud missed. Analogy: Quiet days can hide a missed fire. Key takeaways: ✓ Overall score counts every case; ✓ Rare cases can be hidden; ✓ Check which errors occurred."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The baseline is correct on 15 ordinary transactions, yet misses all
            five fraud cases.
          </figcaption>
        </figure>
      </section>

      <section id="confusion-matrix">
        <h2 tabIndex={-1}>A confusion matrix separates four outcomes.</h2>
        <p>
          A <strong>confusion matrix</strong> is a 2-by-2 table that compares
          actual outcomes with the screener’s predictions. Its rows show what
          actually happened; its columns show whether the screener flagged or
          allowed a transaction.
        </p>
        <p>
          A <strong>true positive</strong> is fraud correctly flagged. A
          <strong> false negative</strong> is fraud allowed by mistake. A
          <strong> false positive</strong> is a legitimate transaction wrongly
          flagged. A <strong>true negative</strong> is a legitimate transaction
          correctly allowed.
        </p>
        <p>
          In the lab, these four outcomes are shortened to TP, FN, FP, and TN.
        </p>
        <div className={styles.example}>
          <strong>Worked example: Northgate at its current cutoff</strong>
          <p>
            On the same 20 transactions, the screener catches 4 frauds, misses
            1, flags 3 legitimate purchases, and allows 12 legitimate ones. So
            it gets 16 of 20 right (80% accuracy), with both kinds of error
            visible in the counts.
          </p>
        </div>
        <p>
          In an everyday smoke-alarm analogy, a real fire that triggers the
          alarm is a true positive; burnt toast that triggers it is a false
          positive. A fire with no alarm is a false negative, while clear air
          with no alarm is a true negative.
        </p>
        <figure className={styles.figure}>
          <Image
            src={confusionMatrixImg}
            alt="Confusion matrix: Actual: Fraud and Actual: Legitimate rows meet Predicted: Flagged and Predicted: Allowed columns. The cells are True positive (4 caught), False negative (1 missed), False positive (3 false alarms), and True negative (12 cleared). Analogy: A smoke alarm catches smoke. Key takeaways: ✓ Rows show what happened; ✓ Columns show the prediction; ✓ Errors have different costs."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The rows are actual outcomes; the columns are the screener’s
            predictions.
          </figcaption>
        </figure>
      </section>

      <section id="precision-and-recall">
        <h2 tabIndex={-1}>Precision and recall answer different questions.</h2>
        <p>
          <strong>Precision</strong> asks: of everything the screener flagged,
          what share was really fraud? Its formula is true positives divided by
          all predicted positives: <strong>TP / (TP + FP)</strong>.
        </p>
        <p>
          <strong>Recall</strong> asks: of all the fraud that was actually
          present, what share did the screener flag? Its formula is true
          positives divided by all actual positives:{" "}
          <strong>TP / (TP + FN)</strong>.
        </p>
        <div className={styles.example}>
          <strong>
            Worked example: same four catches, different denominators
          </strong>
          <p>
            Northgate flagged 7 transactions; 4 were fraud, so precision is 4 /
            7, about <strong>57%</strong>. There were 5 actual frauds; 4 were
            caught, so recall is 4 / 5, or <strong>80%</strong>. Precision
            checks the alerts; recall checks how many real cases were found.
          </p>
        </div>
        <p>
          Imagine a net: precision is about how many of the things in the net
          are the fish you wanted; recall is about how many of those fish in the
          water the net caught. The analogy helps separate the denominators, but
          real screening decisions need evidence about actual costs.
        </p>
        <figure className={styles.figure}>
          <Image
            src={precisionRecallImg}
            alt="Precision and Recall comparison: Precision looks Among flagged with 4 caught of 7 flagged for 57%; Recall looks Among actual fraud with 4 caught of 5 actual for 80%. Analogy: A net gathers fish. Key takeaways: Precision checks alerts; Recall checks cases found; Both count caught cases."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Both measures count the same four caught frauds, but use different
            groups as their denominator.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Move the cutoff and see what changes.</h2>
        <p>
          A <strong>risk score</strong> is a number the screener assigns to an
          item; in this toy example, higher scores mean “more suspicious.” A
          <strong> decision threshold</strong> is the cutoff used to turn that
          score into an action: at or above it is flagged, and below it is
          allowed. These invented scores are not calibrated probabilities.
        </p>
        <div className={styles.example}>
          <strong>Before you try it</strong>
          <p>
            At cutoff 50, four of five frauds are flagged and three legitimate
            transactions are false alarms. Lowering the cutoff can catch more
            fraud while adding alerts; raising it can reduce alerts while
            missing more fraud.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>Start at 50 and compare the three measures and four counts.</li>
          <li>Choose 30 and observe what happens to recall and precision.</li>
          <li>Choose 70, then 90, and compare the missed cases and alerts.</li>
          <li>Use Reset threshold to return to the starting point.</li>
        </ol>
        <ThresholdLab />
      </section>

      <section id="choosing-metrics">
        <h2 tabIndex={-1}>Choose the measure that fits the error cost.</h2>
        <p>
          A <strong>false alarm</strong> can waste a person’s time or block a
          legitimate action. A <strong>missed case</strong> can let a real
          problem pass. Which matters more depends on the task.
        </p>
        <ul className={styles.steps}>
          <li>
            If a false alarm is especially costly, inspect precision: for
            example, a spam filter should avoid hiding important mail.
          </li>
          <li>
            If missing a real case is especially costly, inspect recall: a
            safety screen may need to catch most hazards for follow-up review.
          </li>
          <li>
            If both error types matter, consider precision and recall together.
            The F1 score combines both into one number, but can hide which one
            is weaker.
          </li>
        </ul>
        <p>
          A <strong>validation set</strong> is data used to choose settings such
          as the threshold. A separate <strong>test set</strong> is held back
          for a final evaluation. Choose the threshold on validation data, then
          report its result on the test data; repeatedly tuning to test results
          can make that final score less informative.
        </p>
        <div className={styles.qaList}>
          <div className={styles.qaItem}>
            <strong>Could recall be high while precision is low?</strong>
            <p>
              Yes. Flagging every transaction would find all five frauds in this
              batch, but it would also create many false alarms.
            </p>
          </div>
          <div className={styles.qaItem}>
            <strong>Could precision be high while recall is low?</strong>
            <p>
              Yes. Flagging only one very suspicious fraud could make every
              alert correct while missing the other four.
            </p>
          </div>
        </div>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A fictional airport screener checks 1,000 bags, including about 10 with forbidden batteries. A missed battery could cause a cargo fire; a flagged bag gets a brief manual check. Which measure best matches the larger cost?"
        options={[
          "Accuracy, because the overall share of correct bag decisions is enough to show whether rare batteries are caught.",
          "Precision, because the team should minimize every manual check even if more batteries pass through.",
          "Recall, because finding most actual batteries matters more than briefly checking some safe bags.",
          "Neither measure, because a separate test set automatically accounts for the cost of each mistake.",
        ]}
        correct={2}
        explanation="Recall measures the share of actual positive cases found. Here, missing a battery has the larger stated cost, so recall matches the goal."
        wrongFeedback={[
          "With only about 10 positive bags, many correct decisions on safe bags can make accuracy look strong while missed batteries remain hidden.",
          "Precision focuses on how many flagged bags are truly positive. Here, a missed battery has the higher stated cost.",
          "",
          "A test set measures performance on held-back data; it does not decide which errors matter more.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            Accuracy summarizes overall correctness. A confusion matrix shows
            what kinds of predictions were right or wrong. Precision checks
            flagged cases; recall checks actual cases found. Choose a measure
            and threshold based on the cost of each mistake.
          </p>
          <p className="micro">
            Ready to continue? Return to{" "}
            <Link className="text-link" href="/course/chapter-5">
              Data and Evaluation
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

import Image from "next/image";
import Link from "next/link";
import beliefUpdateFlow from "./images/belief-update-flow.webp";
import rareEventCounts from "./images/rare-event-counts.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { TestResultLab } from "./TestResultLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="04"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Updating beliefs with evidence"
      lead="A positive test result does not replace what you knew beforehand—it updates it. When an event is rare, even a test that catches most real cases can produce far more false positives than true positives."
    >
      <section id="starting-belief">
        <h2 tabIndex={-1}>Start with what you knew before the test.</h2>
        <p>
          In Lesson 5.3 you saw that probabilities are estimates of uncertainty,
          not guarantees. When new evidence arrives—like a rapid test result or
          an alert from an AI detector—you revise that estimate rather than
          throwing away everything you knew before.
        </p>
        <p>
          Imagine checking the weather forecast before looking out the window. A
          dark cloud raises your belief that it will rain, yet a dark cloud in a
          dry desert summer still means something very different from one during
          monsoon season.
        </p>
        <p>This lesson uses five core terms in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Base rate (prior):</strong> how common an event is in the
            group before you see the new test result.
          </li>
          <li>
            <strong>True positive:</strong> a positive test result when the
            event is genuinely present.
          </li>
          <li>
            <strong>False positive (false alarm):</strong> a positive test
            result when the event is actually absent.
          </li>
          <li>
            <strong>Updated belief (posterior):</strong> the revised chance that
            the event is present after seeing the test result.
          </li>
          <li>
            <strong>Bayes’ rule (updating with counts):</strong> combining the
            base rate with how often the test flags real cases versus non-cases
            to find the updated belief.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: Nora’s orchard rapid leaf test</strong>
          <p>
            Nora (an invented grower for this lesson) tests{" "}
            <strong>1,000 apple trees</strong> for a rare leaf blight using a
            rapid strip test. Only <strong>1% of trees</strong> actually have
            blight (<strong>10 blighted</strong>, <strong>990 healthy</strong>).
            The strip catches <strong>90% of blighted trees</strong> (its{" "}
            <strong>detection rate</strong>, or true-positive rate) and wrongly
            flags <strong>10% of healthy trees</strong> (its{" "}
            <strong>false-alarm rate</strong>, or false-positive rate, meaning
            90% of healthy trees test negative).
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={beliefUpdateFlow}
            alt="Diagram titled Updating a belief with subtitle Combine your starting belief with new evidence. Flows left to right from two blue cards, Base rate (prior) labeled How common before the test and New evidence labeled Positive test result, into a lavender card Update with counts labeled True vs false positives, and then into a green card Updated belief (posterior) labeled Revised chance it is true. Bottom cards show Analogy (Like checking the forecast before trusting a dark cloud.) and Key takeaways (Start from the base rate before testing; Weigh true positives against false positives; Evidence updates a belief, not replaces it)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Updating a belief combines your starting base rate with the new test
            evidence by comparing true positives against false positives.
          </figcaption>
        </figure>
      </section>

      <section id="rare-events">
        <h2 tabIndex={-1}>Why rare events create so many false positives.</h2>
        <p>
          Suppose one of Nora’s trees tests positive. Because the strip catches
          90% of blighted trees and lets 90% of healthy trees test negative, it
          is tempting to think there is a 90% chance the tree has blight.
        </p>
        <p>
          Count all 1,000 trees instead, and the picture flips. A{" "}
          <strong>false negative</strong> happens when a blighted tree tests
          negative, and a <strong>true negative</strong> happens when a healthy
          tree tests negative:
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Actual tree state</th>
                <th scope="col">Trees</th>
                <th scope="col">Tests positive</th>
                <th scope="col">Tests negative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Blighted (1% base rate)</strong>
                </td>
                <td>10</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeGood}`}>
                    9 true positives
                  </span>
                </td>
                <td>1 false negative</td>
              </tr>
              <tr>
                <td>
                  <strong>Healthy (99%)</strong>
                </td>
                <td>990</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeWarn}`}>
                    99 false positives
                  </span>
                </td>
                <td>891 true negatives</td>
              </tr>
              <tr className={styles.rowHighlight}>
                <td>
                  <strong>Total</strong>
                </td>
                <td>1,000</td>
                <td>
                  <strong>108 positive tests</strong>
                </td>
                <td>892 negative tests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Out of <strong>108 positive tests</strong>, only{" "}
          <strong>9 trees</strong> truly have blight. That puts the updated
          belief at <strong>9 ÷ 108 ≈ 8.3%</strong> (about 1 in 12)—far from
          90%.
        </p>
        <p>
          Why? Taking 10% of a huge healthy group (990 trees) produces{" "}
          <strong>99 false positives</strong>, which easily outnumbers 90% of a
          tiny blighted group (<strong>9 true positives</strong>). Notice the
          difference between two questions that sound alike:
        </p>
        <ul>
          <li>
            <strong>Chance of a positive test if the tree has blight:</strong>{" "}
            90% (9 of 10 blighted trees).
          </li>
          <li>
            <strong>Chance the tree has blight if the test is positive:</strong>{" "}
            8.3% (9 of 108 positive tests).
          </li>
        </ul>
        <figure className={styles.figure}>
          <Image
            src={rareEventCounts}
            alt="Diagram titled Why rare events fool a test with subtitle 1,000 trees, 1% blight, 90% detection, 10% false alarms. Flows left to right from 1,000 trees splitting into 10 blighted (1%) leading to 9 true positives and 990 healthy (99%) leading to 99 false positives, which both merge into 108 positive tests with highlight 9 of 108 real (8.3%). Bottom cards show Analogy (A small leak in a huge pipe still floods a tiny cup.) and Key takeaways (10% of 990 healthy trees gives 99 false alarms; False alarms easily outnumber 9 real cases; Positive test means 8.3% chance, not 90%)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            When an event is rare, even a modest false-alarm rate applied to the
            large negative group creates far more false positives than true
            positives.
          </figcaption>
        </figure>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Bank card fraud alerts</h3>
            <p>
              Genuine card payments usually outnumber fraudulent ones by
              thousands to one. Even a detector with a small false-alarm rate
              can flag many ordinary purchases—which is why banks commonly ask
              you to confirm an alert before blocking a card.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Routine medical screening</h3>
            <p>
              When a routine screen checks a wide population for a rare
              condition and has even a modest false-alarm rate relative to how
              rare that condition is, a first positive result can frequently
              turn out to be a false alarm. Clinicians typically follow up with
              a second, more specific test rather than treating on the first
              screen alone.
            </p>
          </div>
        </div>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>
          Test-result calculator: watch the updated belief shift.
        </h2>
        <p>
          Even when a test’s detection and false-alarm rates stay identical, a
          positive result leads to a very different updated belief when the
          starting base rate changes. Before trying the calculator, trace one
          quick comparison in Nora’s orchard.
        </p>
        <div className={styles.example}>
          <strong>Worked example: a damp corner with a 20% base rate</strong>
          <p>
            In a shady, damp corner where blight affects{" "}
            <strong>20% of trees</strong> (200 blighted, 800 healthy), the same
            90% detection / 10% false-alarm strip produces{" "}
            <strong>180 true positives</strong> and{" "}
            <strong>80 false positives</strong>. Out of 260 positive tests,{" "}
            <strong>180 ÷ 260 ≈ 69.2%</strong> are truly blighted—because the
            starting belief was twenty times higher.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            Start on <strong>Rare blight (1%)</strong> and confirm that 9 true
            positives out of 108 total positives gives <strong>8.3%</strong>.
          </li>
          <li>
            Click <strong>Damp corner (20%)</strong> to see the updated belief
            jump to <strong>69.2%</strong> with the exact same test.
          </li>
          <li>
            Click <strong>Stricter test (1% false alarm)</strong> and notice
            that even cutting false alarms ten-fold still leaves a rare 1% event
            below 50% (<strong>47.6%</strong>).
          </li>
          <li>
            Try <strong>Even split (50%)</strong> to see the one case where a
            90% / 10% test actually yields 90.0%, then move the sliders yourself
            and click <strong>Reset calculator</strong> to start fresh.
          </li>
        </ol>
        <TestResultLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>When belief updates go wrong in practice.</h2>
        <p>
          Counting true and false positives is simple once you know the rates,
          but real-world decisions run into three common traps:
        </p>
        <ul>
          <li>
            <strong>Using the wrong base rate:</strong> if you apply a
            whole-orchard base rate (1%) to a damp, high-risk corner (20%), your
            updated belief will underestimate the real risk.
          </li>
          <li>
            <strong>Assuming repeated tests are independent:</strong> the
            calculator’s second-test figure (45.0% in Nora’s 1% example) holds
            only when the second test’s errors are independent of the first
            test’s errors given whether the tree actually has blight. If a
            harmless leaf stain fools the same strip twice, repeating it does
            not add full new evidence.
          </li>
          <li>
            <strong>Ignoring false negatives:</strong> a negative test lowers
            your belief, yet it rarely drops it to zero—in Nora’s 1,000 trees, 1
            of the 10 blighted trees still tested negative.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does a high false-positive count mean the test is useless?
            </strong>
            <p>
              No. In Nora’s orchard, a positive strip raised the chance of
              blight more than eight-fold—from 1% to 8.3%—narrowing 1,000 trees
              down to 108 for a closer inspection.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Why does the same test give 8.3% in one group and 69.2% in
              another?
            </strong>
            <p>
              Because evidence updates your starting belief rather than
              replacing it. When real cases start out much more common, they
              make up a much larger share of all positive tests.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>How does this connect to evaluating AI classifiers?</strong>
            <p>
              The updated belief after a positive flag—the share of all positive
              flags that are truly positive—is the same ratio called{" "}
              <strong>precision</strong>, which you will explore alongside other
              evaluation measures in Lesson 5.8.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A city bike-share team checks 1,000 docking locks with a quick sensor test. About 1% of locks (10 of 1,000) have a worn latch, while 990 are fine. The sensor flags 80% of worn latches (8 true positives) and wrongly flags 10% of fine latches (99 false positives), giving 107 positive flags in total. One lock flashes positive. Which statement is right?"
        options={[
          "There is an 80% chance the latch is worn, because the sensor flags 80% of worn latches and this lock just flashed positive.",
          "The positive flag adds no useful information at all, because false positives outnumber true positives by more than ten to one.",
          "The latch is still more likely fine than worn—only 8 of 107 positive flags are worn (about 7.5%)—though its chance is now well above 1%.",
          "Running the exact same sensor a second time is guaranteed to confirm a worn latch if it flashes positive again, whatever caused the first flag.",
        ]}
        correct={2}
        explanation="Out of 107 positive flags, 8 are worn latches and 99 are fine latches, so the updated belief is 8 ÷ 107 ≈ 7.5%. The lock is still more likely fine than worn, yet the positive flag raised its chance more than seven-fold above the 1% base rate."
        wrongFeedback={[
          "80% is the chance a worn latch gets flagged (the detection rate), not the chance a flagged lock is worn. Out of 107 positive flags, only 8 are actually worn latches.",
          "False positives outnumber true positives here, yet the flag still narrows 1,000 locks down to 107 and raises the chance of a worn latch from 1% to about 7.5%.",
          "",
          "Even a second independent positive test updates the probability rather than guaranteeing certainty—and if the same harmless quirk fools the sensor twice, the two tests are not independent.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Evidence updates a belief—it does not replace it.</strong>{" "}
            Start from the <strong>base rate (prior)</strong>, count{" "}
            <strong>true positives</strong> against{" "}
            <strong>false positives</strong>, and compute the{" "}
            <strong>updated belief (posterior)</strong>. When an event is rare,
            even a strong test can produce far more false positives than real
            cases—so a positive test is a signal to look closer, not automatic
            proof.
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

import Image from "next/image";
import Link from "next/link";
import threeSplits from "./images/three-splits.webp";
import testSetReuse from "./images/test-set-reuse.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { SplitLab } from "./SplitLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="05"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Training, validation and test sets"
      lead="To tell whether a supervised model genuinely handles new cases, divide your labeled data into separate jobs: one part to learn from, one part to choose settings, and one held-out part for a final check."
    >
      <section id="why-split">
        <h2 tabIndex={-1}>Why one dataset is not enough.</h2>
        <p>
          Imagine preparing for a driving theory exam. You study from a practice
          sheet, take a few mock quizzes to see which topics need more work, and
          then sit a brand-new final exam you have never seen before.
        </p>
        <p>
          Splitting data for a machine learning model follows a similar idea—but
          only as an analogy. A model does not study or reason like a person; it
          adjusts internal rules from past examples. If you score it only on the
          exact examples it learned from, a model that simply memorised past
          answers can look strong while struggling on new cases.
        </p>
        <p>This lesson covers four ideas in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Training set:</strong> the labeled examples the model learns
            patterns from.
          </li>
          <li>
            <strong>Validation set:</strong> separate examples used to compare
            options and tune model settings.
          </li>
          <li>
            <strong>Test set:</strong> separate examples held out until the end
            for a single final check on unseen cases.
          </li>
          <li>
            <strong>Reusing the test set:</strong> why repeatedly tweaking a
            model to raise its test score can make the result overly optimistic.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: Maya’s town library</strong>
          <p>
            Maya (an invented character for this lesson) helps run a local
            library. Using an invented log of 100 past book loans—each labeled{" "}
            <strong>On time</strong> or <strong>Late</strong>—she wants a
            supervised model to predict which future loans may be returned late
            so staff can send reminders.
          </p>
        </div>
        <p>
          In this small example, Maya sets aside 60 loans for training, 20 for
          validation, and 20 for testing. Because 20 test loans is tiny—just one
          loan shifts the score by 5 percentage points—real projects usually use
          much larger datasets, though the three roles stay the same.
        </p>
        <figure className={styles.figure}>
          <Image
            src={threeSplits}
            alt="Diagram titled Three roles for your data with subtitle Split labeled examples before you build and check. Flows left to right from Labeled past data into three separate cards: Training set (Learn patterns), Validation set (Choose settings), and Test set (Held-out final check). Bottom cards show Analogy (Practice sheet, mock quiz, and unseen final exam.) and Key takeaways (Keep the three splits separate; Use validation to choose settings; Hold out test until the end)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A fixed three-way split assigns each labeled example to one job:
            learning patterns, choosing settings, or running a held-out final
            check.
          </figcaption>
        </figure>
      </section>

      <section id="three-roles">
        <h2 tabIndex={-1}>What each split is for.</h2>
        <p>
          Tell the three splits apart by one rule:{" "}
          <strong>the job the data does</strong> while you build and check the
          model.
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Training set</h3>
            <p>
              <strong>Job:</strong> teach the model patterns connecting inputs
              to the recorded target.
            </p>
            <p className="micro">
              <strong>In Maya’s library:</strong> 60 past loans the model uses
              to learn which loan lengths and book types tend to return late.
            </p>
            <p className="micro">
              <strong>Outside example:</strong> past clinic appointments used to
              learn patterns behind missed visits.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Validation set</h3>
            <p>
              <strong>Job:</strong> compare model options and choose settings
              (such as how strict a rule should be) without touching the test
              set.
            </p>
            <p className="micro">
              <strong>In Maya’s library:</strong> 20 separate loans used to
              compare Setting A, Setting B, and Setting C and pick the best one.
            </p>
            <p className="micro">
              <strong>Outside example:</strong> a second batch of clinic records
              used to compare two reminder models before picking one.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Test set</h3>
            <p>
              <strong>Job:</strong> give a more reliable estimate of how the
              chosen model performs on unseen data after decisions are finished.
            </p>
            <p className="micro">
              <strong>In Maya’s library:</strong> 20 untouched loans checked
              once at the end.
            </p>
            <p className="micro">
              <strong>Outside example:</strong> a held-out month of clinic
              appointments checked once before the clinic rolls out reminders.
            </p>
          </div>
        </div>
        <p>
          In this fixed three-way assignment, each example belongs to only one
          split so the same record is never both learned from and tested on.
          Names vary slightly across teams—many call the validation set the{" "}
          <strong>dev set</strong>—so focus on each split’s job.
        </p>
        <p>
          Split ratios such as 60/20/20 or 80/10/10 are common starting points,
          not fixed rules. Very large datasets often use a much smaller share
          for validation and testing because even 1% can be thousands of
          examples, while small datasets sometimes use{" "}
          <strong>cross-validation</strong> (rotating examples through training
          and validation roles while still keeping the test set separate).
        </p>
      </section>

      <section id="reusing-test">
        <h2 tabIndex={-1}>Why reusing the test set breaks the check.</h2>
        <p>
          It is tempting to think: “Why not check every tweak on the test set so
          I can see if the score goes up?” Once you use test-set results to
          guide changes, the test set stops being an unseen check and quietly
          becomes a tuning set.
        </p>
        <div className={styles.example}>
          <strong>Worked example: Maya’s shortcut backfires</strong>
          <p>
            Suppose Maya skips validation and tries Settings A, B, and C
            directly on her 20 test loans. She notices which specific loans
            Setting B missed, adds custom tweaks (Setting D) to fix those exact
            cases, and re-runs the same test set. The score jumps from 85% to
            95%—not because Setting D understands new borrowers better, but
            because it was tailored to quirks of those 20 loans.
          </p>
        </div>
        <p>
          Think of a teacher handing out the real final exam paper every Friday
          so students can adjust their notes until they score 100%. That score
          shows how well they adapted to that specific paper—it can hide weak
          spots that show up on a fresh exam.
        </p>
        <p>
          An untouched, representative test set gives a{" "}
          <strong>more reliable estimate</strong>—never a guarantee—of future
          performance. If the test score reveals a real problem and you need
          another round of model changes, treat the old test set as tuning data
          and collect fresh unseen examples for a new final check.
        </p>
        <figure className={styles.figure}>
          <Image
            src={testSetReuse}
            alt="Diagram titled Why reusing the test set misleads with subtitle Tuning on test examples can inflate the score. Top green row flows left to right: Tune on validation to Check test once to More reliable estimate. Bottom red row flows left to right: Tweak on test set to Re-check same test to Often inflated score. Bottom cards show Analogy (Practising on the real exam paper hides weak spots.) and Key takeaways (Test-set tweaks bias the score; Scores can drop on fresh data; Use fresh data after extra tweaks)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Tuning on validation and checking the test set once gives a more
            reliable estimate; tweaking settings on the test set can produce an
            inflated score that drops on fresh data.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try it: build splits and test the workflow.</h2>
        <p>
          Use the two-part lab below to practise assigning examples to splits
          and to see how reusing the test set changes the gap between test
          scores and fresh data.
        </p>
        <div className={styles.example}>
          <strong>Worked trace: checking a 10-loan split</strong>
          <p>
            Start with 10 invented loans (5 <strong>On time</strong>, 5{" "}
            <strong>Late</strong>). Putting 6 in Training (3 On time, 3 Late), 2
            in Validation (1 of each), and 2 in Test (1 of each) covers all
            three roles. Moving all 10 into Training leaves zero held-out loans
            to check how the model behaves on unseen cases.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            On <strong>1. Assign examples to splits</strong>, try{" "}
            <strong>All in training (10 / 0 / 0)</strong> and{" "}
            <strong>Only On-time in test (6 / 2 / 2)</strong>, then read the
            split diagnostic.
          </li>
          <li>
            Click individual <strong>Train</strong>, <strong>Val</strong>, or{" "}
            <strong>Test</strong> buttons on a few loans to fix any missing role
            or outcome.
          </li>
          <li>
            Switch to <strong>2. Proper check vs reusing test</strong>, run the
            final Test check once for Setting B, and reveal next month’s new
            loans.
          </li>
          <li>
            Toggle to <strong>Reusing the test set (tune on Test)</strong>,
            inspect <strong>Setting D (tweaked for Test)</strong>, and reveal
            next month’s new loans to see the drop. Click{" "}
            <strong>Reset lab</strong> to start fresh.
          </li>
        </ol>
        <SplitLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Practical limits and quick questions.</h2>
        <p>
          A clean split protects your evaluation process, but it cannot solve
          every data problem on its own.
        </p>
        <ul>
          <li>
            <strong>Splitting does not fix unrepresentative data:</strong> if
            your original log misses a group of borrowers, every split will miss
            them too (Lesson 5.1).
          </li>
          <li>
            <strong>Respect time order when predicting the future:</strong> when
            patterns shift across seasons or months, splitting by date—training
            on earlier records and testing on later ones—matches how the model
            will be used. Deeper leakage problems are covered in Lesson 5.9.
          </li>
          <li>
            <strong>Small test sets are noisy:</strong> in Maya’s 20-loan test
            set, a single loan changes the score by 5 percentage points. Larger
            test sets give steadier estimates (and Lesson 5.8 covers metrics
            beyond simple accuracy).
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Can I skip the validation set if I am not comparing settings?
            </strong>
            <p>
              Yes. If you train one fixed model without tuning or choosing among
              options, a training/test split can be enough—most real projects
              still keep a validation set because they compare several choices.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Why not train on 100% of the data so the model learns more?
            </strong>
            <p>
              Without held-out data, you have no reliable way to tell whether
              the model learned general patterns or simply memorised the
              examples it saw (more in Lesson 5.7).
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If my model scores poorly on the test set, is that data ruined?
            </strong>
            <p>
              No—you can inspect the errors or fold those records into future
              training or validation. You just need fresh unseen examples before
              calling a later score an unbiased final check.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A bakery builds a model to predict whether daily sourdough loaves will sell out, using 300 days of past sales records split into a training set, a validation set, and a test set. The team trains five different model settings on the training set, checks all five on the test set, tweaks the rules three more times to raise the test-set score from 76% to 92%, and then reports 92% as the expected accuracy on future days. What is the main problem with this workflow?"
        options={[
          "The 300-day log is far too small for any supervised model to learn useful patterns, so the splits cannot produce valid predictions.",
          "The team trained on the wrong split—they should have fitted the model on the validation set and tuned settings on training.",
          "Repeatedly selecting and adjusting settings on the test set turns it into a tuning set, so the reported score can look overly optimistic.",
          "Holding out validation and test sets wasted useful records—the team should have trained on all 300 days and skipped final testing.",
        ]}
        correct={2}
        explanation="By using the test set to compare five settings and make three more rounds of tweaks, the team tuned to that specific split. The 92% figure reflects how well the tweaks fit those test days rather than an untouched check on future days."
        wrongFeedback={[
          "300 days of records can be enough for a simple model to learn patterns—the problem here is how the test set was reused during tuning, not the size of the log.",
          "Training on the training set was right; the mistake was using the test set instead of the validation set to compare and tweak settings.",
          "",
          "Training on all 300 days without a held-out check leaves the bakery with no reliable way to estimate how the model handles unseen future days.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Separate learning, choosing, and checking.</strong> Use the{" "}
            <strong>training set</strong> to learn patterns, the{" "}
            <strong>validation set</strong> to compare options and tune
            settings, and a held-out <strong>test set</strong> once at the end
            for a more reliable estimate on unseen data—because{" "}
            <strong>reusing the test set to tune can inflate the score</strong>.
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

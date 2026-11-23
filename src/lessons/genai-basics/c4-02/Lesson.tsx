import Image from "next/image";
import Link from "next/link";
import readingFittedLine from "./images/reading-fitted-line.webp";
import estimateVsActual from "./images/estimate-vs-actual.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { RegressionLab } from "./RegressionLab";
import styles from "./lesson.module.css";

const DELIVERIES = [
  { km: 1, actual: 9, predicted: 8, residual: "+1 min" },
  { km: 2, actual: 11, predicted: 12, residual: "−1 min" },
  { km: 3, actual: 14, predicted: 16, residual: "−2 min" },
  { km: 4, actual: 22, predicted: 20, residual: "+2 min" },
  { km: 5, actual: 25, predicted: 24, residual: "+1 min" },
  { km: 6, actual: 27, predicted: 28, residual: "−1 min" },
];

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Regression: predicting numbers"
      lead="When a supervised model predicts a number—like minutes, temperature, or price—it fits a trend to past examples. That prediction is an estimate, not a guarantee."
    >
      <section id="what-is-regression">
        <h2 tabIndex={-1}>Predicting a number, not a label.</h2>
        <p>
          In Lesson 4.1, you saw that supervised learning trains on past
          examples that pair an <strong>input</strong> with a known{" "}
          <strong>target</strong>. When the target is a number along a scale,
          the task is called <strong>regression</strong>.
        </p>
        <p>
          Regression differs from <strong>classification</strong>—choosing a
          category such as “spam” or “not spam,” which you will explore in
          Lesson 4.3. Predicting a car trip’s arrival time from distance or a
          home’s monthly electricity bill from outdoor temperature are everyday
          regression tasks.
        </p>
        <div className={styles.example}>
          <strong>Running example: Sam’s bike deliveries</strong>
          <p>
            Sam (an invented bike courier for this lesson) logged 6 past local
            deliveries: distances from 1 km to 6 km (the input) and delivery
            times from 9 to 27 minutes (the target).
          </p>
        </div>
        <p>
          In this lesson, you will learn how to read a trend line to make an
          estimate, see why real results often differ from that line, test how
          moving a single data point shifts the trend, and check why guessing
          outside your data range can mislead you.
        </p>
      </section>

      <section id="reading-the-line">
        <h2 tabIndex={-1}>How to read a fitted line.</h2>
        <p>
          Plot Sam’s 6 past deliveries as dots on a chart, with distance along
          the bottom and minutes up the side. A simple regression model draws
          one straight <strong>fitted line</strong> through the cloud of dots to
          capture the overall trend.
        </p>
        <p>
          The method used in this lesson—<strong>ordinary least squares</strong>
          —chooses the straight line with the smallest total of the{" "}
          <strong>squared vertical gaps</strong> between the dots and the line
          (squaring multiplies each gap by itself, so a 2-minute gap counts as 4
          and larger misses carry extra weight). Any number you read off that
          line for a new input is an <strong>estimate</strong>: a best guess
          based on past examples, not a promise.
        </p>
        <p>
          Think of a kitchen chart that gives cooking time by weight: it gives
          you a solid starting estimate for a new roast, even though oven heat
          still varies slightly.
        </p>
        <ol className={styles.steps}>
          <li>
            Find the new input—say, a <strong>3.5 km</strong> delivery—on the
            horizontal <strong>Distance (km)</strong> axis.
          </li>
          <li>
            Move straight up until you meet the <strong>fitted line</strong>.
          </li>
          <li>
            Read straight across to the vertical <strong>Time (min)</strong>{" "}
            axis to get the estimate: <strong>18 min</strong>.
          </li>
        </ol>
        <figure className={styles.figure}>
          <Image
            src={readingFittedLine}
            alt="Schematic infographic titled Reading a fitted line showing blue past delivery dots near an indigo straight fitted line. A dashed green arrow rises from 3.5 km on the Distance (km) axis to a green diamond on the line and points left to 18 min on the Time (min) axis, while a separate black arrow points right from the plot to a green chip labelled Estimate: 18 min, above an Analogy card comparing it to a cooking-time chart and a Key takeaways card."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Schematic view of reading a fitted line: start at the new distance,
            move up to the line, and read across for the estimated time (see the
            table and interactive chart below for Sam’s exact 6 deliveries).
          </figcaption>
        </figure>
      </section>

      <section id="estimates-not-guarantees">
        <h2 tabIndex={-1}>Why every prediction is an estimate.</h2>
        <p>
          A common misconception is that a regression prediction is exact. Look
          closely at Sam’s 6 past deliveries below: not a single dot sits
          directly on the fitted line.
        </p>
        <p>
          The signed difference—<strong>actual minus predicted</strong>—is
          called a <strong>residual</strong> (often called an{" "}
          <strong>error</strong>). A positive residual means the ride took
          longer than predicted; a negative residual means it arrived faster.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Distance</th>
                <th scope="col">Actual</th>
                <th scope="col">Estimate</th>
                <th scope="col">Residual</th>
              </tr>
            </thead>
            <tbody>
              {DELIVERIES.map((row) => (
                <tr key={row.km}>
                  <td>{row.km} km</td>
                  <td>{row.actual} min</td>
                  <td>{row.predicted} min</td>
                  <td>{row.residual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Across these 6 deliveries, the <strong>average gap</strong>—the
          average size of those vertical gaps, ignoring plus or minus signs so
          they do not cancel out—is <strong>1.3 min</strong>. Real deliveries
          vary because distance alone cannot capture red lights, hills, wind, or
          stairs at drop-off.
        </p>
        <p>
          The same holds outside delivery times: two apartments of the exact
          same size on the same street can sell for different prices because of
          floor level, sunlight, or recent renovations.
        </p>
        <figure className={styles.figure}>
          <Image
            src={estimateVsActual}
            alt="Schematic infographic titled Predicted vs. actual showing a straight fitted line with blue actual dots above and below it, a vertical rose dashed line and black bracket labelled Gap (error) between Predicted on the line and Actual above it, and a Possible causes card listing Traffic, Hills, and Wind, with a weather-forecast Analogy card and a Key takeaways card."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Schematic view of prediction gaps: real results can land on, above,
            or below the line because unmeasured factors create variation (see
            the table above for Sam’s exact 6 deliveries).
          </figcaption>
        </figure>
        <p>
          Sometimes one example sits far away from the rest of the pattern—for
          instance, a ride delayed by a flat tire. That extreme point is called
          an <strong>outlier</strong>, and you will test its effect next.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Drag the data points and watch the line move.</h2>
        <p>
          Notice two numbers above the chart: the{" "}
          <strong>Estimate at 3.5 km</strong> and the <strong>slope</strong>—how
          much the fitted line rises (or falls) for each extra kilometer.
          Clicking any preset button replaces the current points with that
          scenario. Try these steps in order:
        </p>
        <ol className={styles.steps}>
          <li>
            On <strong>Sam’s 6 deliveries</strong>, trace up from 3.5 km to the
            line and across to the time axis, then compare your reading with the{" "}
            <strong>Estimate at 3.5 km</strong> card (18.0 min).
          </li>
          <li>
            <strong>Drag any dot</strong> up or down on the chart (or pick a
            delivery below the chart and tap −2 min / +2 min) and watch the
            fitted line tilt.
          </li>
          <li>
            Click <strong>Delay outlier</strong> (replaces your edits with Sam’s
            6 deliveries, changing the existing 6 km ride from 27 min to 45
            min), trace 3.5 km up to the moved line, and check the 21.0 min
            estimate (up from 18.0 min on Sam’s original data).
          </li>
          <li>
            Click <strong>Reset</strong> to restore Sam’s original 6 deliveries.
          </li>
        </ol>
        <RegressionLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What a fitted line can and cannot tell you.</h2>
        <p>
          A straight fitted line is a useful summary, not a crystal ball. Two
          everyday traps can make its estimates unreliable:
        </p>
        <div className={styles.limitGrid}>
          <div className={styles.limitCard}>
            <h3>1. Outliers pull the line</h3>
            <p>
              Because ordinary least squares squares every vertical gap, one
              huge delay can tilt or flatten the whole straight line—for
              example, a 45-minute 6 km ride makes Sam’s line steeper and raises
              the estimate even for normal 3.5 km trips.
            </p>
          </div>
          <div className={styles.limitCard}>
            <h3>2. Extrapolation beyond the data</h3>
            <p>
              Predicting anywhere outside the observed input range (below 1 km
              or above 6 km) is called <strong>extrapolation</strong>. Using
              Sam’s line for a 25 km ride assumes each extra kilometer adds the
              same extra minutes even when fatigue, hills, or highways change
              everything.
            </p>
          </div>
        </div>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              If a new delivery misses the line by 2 minutes, is the model
              broken?
            </strong>
            <p>
              No. A regression line predicts a trend, not an exact outcome, so
              small gaps around the line are expected when other factors vary.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Does regression always use a straight line?</strong>
            <p>
              No. Simple linear regression fits one straight line from a single
              input, while nonlinear regression fits curves. Both linear and
              nonlinear models can also combine several inputs—such as distance,
              weather, and time of day—at once.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>How is regression different from classification?</strong>
            <p>
              Regression predicts a number along a scale (such as 18 minutes),
              whereas classification picks a category (such as “on time” or
              “late”), which you will practice in Lesson 4.3.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="Sam’s fitted line—built from past bike deliveries between 1 km and 6 km—estimates 18 minutes for a 3.5 km trip. A new 3.5 km delivery arrives in 21 minutes. What is the most accurate conclusion?"
        options={[
          "The fitted line was calculated wrong, because a valid regression line must pass through every real delivery time.",
          "A 3-minute gap does not mean the line is broken—regression gives an estimate, and real deliveries often differ from the line because of factors beyond distance alone.",
          "Sam should ignore the fitted line and always copy the time of the nearest past delivery instead.",
          "Because the 3-minute gap is small, the same line can reliably predict a 30 km delivery.",
        ]}
        correct={1}
        explanation="A regression line summarizes the overall trend to give an estimate, not a guarantee. Seeing a 3-minute difference on a real delivery is consistent with unmeasured factors such as lights, hills, or traffic."
        wrongFeedback={[
          "A straight fitted line summarizes the overall trend and does not have to pass through every data point; even Sam’s original 6 deliveries all had small gaps from the line.",
          "",
          "Copying a single past ride ignores the overall pattern and can be thrown off by one unusually fast or slow trip.",
          "Predicting a 30 km ride is far outside the observed 1–6 km range (extrapolation), where each extra kilometer may no longer add the same extra minutes.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Regression predicts a number as an estimate.</strong> A{" "}
            <strong>fitted line</strong> summarizes the trend in past examples
            so you can trace from a new input to an estimated output. Real
            results often fall above or below the line—and{" "}
            <strong>outliers</strong> or <strong>extrapolation</strong> beyond
            the observed data can make a simple line misleading.
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

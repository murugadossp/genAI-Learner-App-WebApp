import Image from "next/image";
import Link from "next/link";
import probabilityNotCertainty from "./images/probability-not-certainty.webp";
import calibrationCheck from "./images/calibration-check.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { CalibrationLab } from "./CalibrationLab";
import { TEN_DAY_EXAMPLE } from "./data";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Probability and uncertainty"
      lead="A 90% forecast is an estimated chance, not a promise. Checking how closely predicted probabilities match what actually happens across many cases tells you whether those numbers are well calibrated."
    >
      <section id="estimates-not-guarantees">
        <h2 tabIndex={-1}>90% is an estimate, not a promise.</h2>
        <p>
          Suppose your weather app says there is a{" "}
          <strong>90% chance of rain</strong> this afternoon, so you pack an
          umbrella—and it stays completely dry. It is tempting to conclude the
          app was broken, because people often read 90% as “basically certain.”
        </p>
        <p>
          In reality, a 90% forecast still leaves a{" "}
          <strong>10% chance of staying dry</strong>. One dry day does not prove
          a 90% probability was wrong; it is built into what 90% means.
        </p>
        <p>This lesson introduces five ideas in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Probability (predicted probability):</strong> an estimated
            chance of an outcome from 0% to 100% (or 0 to 1), not a guarantee.
          </li>
          <li>
            <strong>Uncertainty:</strong> the remaining room for a different
            outcome (for example, a 90% rain forecast leaves 10% uncertainty).
          </li>
          <li>
            <strong>Observed rate:</strong> how often an outcome actually
            happened across a group of similar past cases.
          </li>
          <li>
            <strong>Calibration:</strong> how closely a model’s predicted
            probabilities match the observed rate across many cases given the
            same forecast.
          </li>
          <li>
            <strong>Overconfident vs underconfident:</strong> whether a model’s
            predicted probabilities are more extreme than reality or more
            cautious than reality.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: The Riverside Weather App</strong>
          <p>
            To keep things concrete, we will follow an invented weather app for
            the town of Riverside. Each morning it predicts a probability of
            afternoon rain—such as <strong>20%</strong>, <strong>50%</strong>,{" "}
            <strong>70%</strong>, or <strong>90%</strong>—and we compare those
            forecasts with whether rain actually fell.
          </p>
        </div>
        <p>
          Look at an invented set of 10 days where Riverside’s app predicted a{" "}
          <strong>90% chance of rain</strong>:
        </p>
        <div className={styles.dayStrip} aria-label="Ten invented days at 90%">
          {TEN_DAY_EXAMPLE.map((item) => (
            <div key={item.day} className={styles.dayCell}>
              <span className={styles.dayLabel}>{item.day}</span>
              <span className={styles.dayForecast}>
                Forecast: {item.forecast}
              </span>
              <span
                className={`${styles.badge} ${
                  item.outcome === "Rain" ? styles.badgeGood : styles.badgeWarn
                }`}
              >
                {item.outcome}
              </span>
            </div>
          ))}
        </div>
        <p className="micro">
          Rain fell on 9 of the 10 days and Day 4 stayed dry. In real life, a
          small 10-day sample can vary by chance—a well-calibrated 90% forecast
          might produce 8, 9, or 10 rainy days in any given stretch of 10.
        </p>
        <p>
          The same idea applies outside weather. If a parcel tracker estimates
          an <strong>80% chance</strong> your package arrives today, roughly 2
          out of 10 similar deliveries will arrive later instead.
        </p>
        <figure className={styles.figure}>
          <Image
            src={probabilityNotCertainty}
            alt="Diagram titled 90% is not a guarantee with subtitle A probability estimates how often an outcome happens across similar cases. Left card shows 90% rain forecast across 10 similar days, flowing via an arrow labelled Typical split to Expected outcomes showing ~9 rainy days, ~1 dry day, and a chip 10% uncertainty remains. Bottom cards show Analogy (Like drawing from 9 blue and 1 yellow marble—yellow is rare, not impossible.) and Key takeaways (Probabilities are estimates, not guarantees; 90% still leaves 10% room to miss; One dry day does not break a 90% forecast)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A 90% estimate means rain is likely across similar days, while
            leaving 10% uncertainty for a dry outcome.
          </figcaption>
        </figure>
      </section>

      <section id="what-calibration-means">
        <h2 tabIndex={-1}>What makes a probability well calibrated.</h2>
        <p>
          Since a single outcome cannot tell you whether a 90% forecast was
          reliable, how do you check? You group <strong>many past cases</strong>{" "}
          that received the same forecast and compare the{" "}
          <strong>predicted probability</strong> against the{" "}
          <strong>observed rate</strong>—how often the event actually occurred
          in that group.
        </p>
        <p>
          A <strong>reliability bar</strong> places those two numbers side by
          side for a forecast group so you can see at a glance whether the
          model’s predictions match reality. Using that single comparison
          (predicted probability versus observed rate), three patterns stand
          out:
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Well calibrated</h3>
            <p>
              Predicted probabilities closely match observed rates across
              forecast groups.
            </p>
            <p className="micro">
              <strong>Example:</strong> on 100 days given an 80% forecast, rain
              actually falls on about 80 days (80%).
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Overconfident</h3>
            <p>
              Predicted probabilities sit further from 50% (more extreme) than
              observed outcomes support.
            </p>
            <p className="micro">
              <strong>Example:</strong> predicting a 90% chance when rain falls
              only 60% of the time—or predicting 20% when rain actually falls
              35% of the time.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Underconfident</h3>
            <p>
              Predicted probabilities sit closer to 50% (more cautious) than
              observed outcomes support.
            </p>
            <p className="micro">
              <strong>Example:</strong> predicting a 60% chance when rain
              actually falls 85% of the time—or predicting 20% when rain falls
              only 10% of the time.
            </p>
          </div>
        </div>
        <figure className={styles.figure}>
          <Image
            src={calibrationCheck}
            alt="Diagram titled Checking calibration with subtitle Compare predicted probability against the observed rate across many cases. Three side-by-side cards show horizontal reliability bars: Well calibrated (Predicted: 80%, Observed: 80%, Matches reality), Overconfident (Predicted: 90%, Observed: 60%, Too extreme), and Underconfident (Predicted: 60%, Observed: 85%, Too cautious). Bottom cards show Analogy (Like checking whether a thermometer matches the real room temperature.) and Key takeaways (Group many cases with the same forecast; Compare predicted % to observed %; Well-calibrated numbers match actual rates)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Calibration checks whether predicted percentages match actual
            observed rates across many cases given the same forecast.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try it: inspect the reliability bar.</h2>
        <p>
          Think of checking a kitchen scale by placing known weights on it and
          comparing the reading to the true weight. In a similar way, a
          reliability bar checks a model’s predicted probabilities against
          observed rates across many past cases (though real weather outcomes
          involve chance, unlike a fixed weight).
        </p>
        <div className={styles.example}>
          <strong>Worked trace: checking Riverside’s 90% forecast group</strong>
          <p>
            Take 100 invented past days where an app predicted a{" "}
            <strong>90%</strong> chance of rain. If rain actually fell on{" "}
            <strong>60 of those 100 days</strong> (60% observed), the observed
            bar falls 30 percentage points short of the predicted bar—showing
            the app is <strong>overconfident</strong>.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            Start on <strong>1. Compare weather apps</strong> with{" "}
            <strong>App A (Well calibrated)</strong> and notice how the
            predicted and observed bars match at 90%.
          </li>
          <li>
            Switch to <strong>App B (Overconfident)</strong> and inspect both
            the <strong>90% forecast</strong> and the{" "}
            <strong>20% forecast</strong> to see overconfidence at both ends.
          </li>
          <li>
            Switch to <strong>App C (Underconfident)</strong> and compare its
            bars against App B.
          </li>
          <li>
            Open <strong>2. Judge the forecast</strong> to classify three
            everyday scenarios, then click <strong>Reset lab</strong> to start
            fresh.
          </li>
        </ol>
        <CalibrationLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What calibration does—and does not—tell you.</h2>
        <p>
          Good calibration helps you read a model’s probability numbers more
          accurately on similar cases, yet it is only one part of evaluating a
          model. Keep four limits in mind:
        </p>
        <ul>
          <li>
            <strong>Calibration alone does not make a model useful:</strong> in
            a town where it rains on 30% of all days, a lazy app that predicts
            “30% chance of rain” every single day is well calibrated (it rains
            on 30% of the days it predicts 30%), yet it never separates rainy
            days from dry days.
          </li>
          <li>
            <strong>Small samples are noisy:</strong> checking only 5 or 10
            cases can make a well-calibrated model look off by chance, so teams
            check calibration across larger groups of past outcomes.
          </li>
          <li>
            <strong>Conditions shift over time:</strong> a model calibrated on
            summer weather or last year’s shoppers can drift out of calibration
            when seasons or habits change.
          </li>
          <li>
            <strong>Raw AI scores are not automatically calibrated:</strong>{" "}
            many models that sort cases into categories output raw scores
            between 0 and 1 that look like percentages (as noted in Lesson 4.3),
            so teams check whether those scores match observed rates on separate
            test examples and calibrate them if needed before treating them as
            real-world probabilities.
          </li>
        </ul>
        <p className="micro">
          This lesson focuses on reading and checking probability estimates.
          Lesson 5.4 covers how to update probabilities when new evidence
          arrives, and Lesson 5.8 covers turning scores into yes/no decisions
          with accuracy, precision, and recall.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              If a 90% rain forecast turns out dry, was the forecast broken?
            </strong>
            <p>
              No. A 90% estimate still leaves a 10% chance of a dry day. You can
              only judge calibration across many similar forecasts, not a single
              day.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Can a well-calibrated model still be unhelpful?</strong>
            <p>
              Yes. Predicting the same overall average (such as 30% every day)
              can match the long-run observed rate without helping you tell
              rainy days from dry days.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Does a model outputting 90% mean it has been calibrated?
            </strong>
            <p>
              No. Many models output raw scores that look like percentages (such
              as 0.90) without matching real-world observed rates until teams
              check and calibrate them.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="An invented parcel-delivery model predicts a 90% chance of same-day delivery for a group of 100 orders. When the team checks what actually happened, 62 of those 100 orders arrived the same day (62%) and 38 arrived late. What does this tell you about the model's 90% predictions?"
        options={[
          "The model is well calibrated, because more than half of the 100 orders arrived the same day.",
          "The model is underconfident, because 62% is lower than 90%.",
          "The model is overconfident, because it predicted a 90% chance when same-day delivery actually happened only 62% of the time.",
          "The model must be broken on every order, because a 90% probability means all 100 orders should have arrived the same day.",
        ]}
        correct={2}
        explanation="Across 100 orders predicted to have a 90% chance of same-day delivery, only 62 (62%) actually arrived the same day. Because the predicted probability (90%) is much more extreme than the observed rate (62%), the model is overconfident."
        wrongFeedback={[
          "Well calibrated means the observed rate closely matches the predicted 90%, not merely that it is above 50%. Here 62% is far below 90%.",
          "Underconfident means the model was too cautious (closer to 50% than reality). Here the model predicted a high 90% chance while only 62% arrived the same day.",
          "",
          "A 90% probability is an estimate, not a guarantee—even a well-calibrated 90% forecast expects roughly 10 of 100 orders to miss. The problem here is the large gap between 90% predicted and 62% observed.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Probabilities are estimates, not guarantees.</strong> A 90%
            forecast still leaves 10% <strong>uncertainty</strong>. To judge
            whether you can trust a model’s numbers, check{" "}
            <strong>calibration</strong> across many similar cases: compare the{" "}
            <strong>predicted probability</strong> to the{" "}
            <strong>observed rate</strong> to spot whether the model is well
            calibrated, <strong>overconfident</strong>, or{" "}
            <strong>underconfident</strong>—and remember that calibration alone
            does not guarantee a model is useful.
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

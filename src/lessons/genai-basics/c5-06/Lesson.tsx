import Image from "next/image";
import Link from "next/link";
import errorToLossImg from "./images/prediction-error.webp";
import maeVsMseImg from "./images/mae-vs-mse.webp";
import lossVsOutcomeImg from "./images/loss-vs-real-world.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { LossSliderLab } from "./LossSliderLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="06"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Loss: measuring prediction errors"
      lead="As a model learns from examples, it can try to reduce a score called loss. Yet a lower loss score does not automatically mean a more useful model in the real world."
    >
      <section id="what-is-loss">
        <h2 tabIndex={-1}>From a guess to an error score.</h2>
        <p>
          In supervised learning—learning from examples paired with known
          answers—<strong>training</strong> is the stage when a model adjusts
          learned settings. For each example, it predicts an output and compares
          it with the known value, called the <strong>target</strong>. A score
          can summarize how far its predictions miss.
        </p>
        <p>
          In this lesson, you will follow five ideas in order: one prediction
          error, one combined score, how averaging and squaring errors differ,
          sliding a line to change the score, and why a low score alone does not
          show real-world usefulness.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>Prediction error</h3>
            <p>
              The signed gap for one example: <em>actual − predicted</em>. A
              positive gap means the actual value is larger than the prediction.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>Loss function</h3>
            <p>
              A rule that scores each prediction error and combines the scores,
              often by averaging, into one number called <strong>loss</strong>.
            </p>
          </div>
        </div>
        <p>
          Think of a commute estimate: if you predict 25 minutes and the trip
          takes 35, the error is +10 minutes. A weekly loss score summarizes the
          five daily misses, much like one average for several quiz marks.
        </p>
        <div className={styles.example}>
          <strong>Running example: Rohan’s Neighborhood Courier</strong>
          <p>
            Rohan (an invented local courier for this lesson) predicts delivery
            time in minutes from distance in kilometers using a simple line:{" "}
            <em>10 minutes pickup base + 4 minutes per km</em>. The slope is the
            added minutes for each extra kilometer. Here are five invented
            recent trips: 1 km → 14 min, 2 km → 18 min, 3 km → 22 min, 4 km → 26
            min, and 5 km → 52 min after a bridge closure. That last time sits
            far from the others; such an unusually distant value is called an{" "}
            <strong>outlier</strong>.
          </p>
        </div>
        <p>
          With a slope of 4 minutes per km, Rohan’s line predicts 14, 18, 22,
          26, and 30 minutes. The first four trips have zero error, while the 5
          km bridge-delay trip is off by +22 minutes. Averaging the five error
          sizes without their signs gives a score of 4.4 minutes. This is the
          mean absolute error, or <strong>MAE</strong>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={errorToLossImg}
            alt="From errors to loss: Actual values 14, 18, 22, 26, and 52 pair with Predicted values 14, 18, 22, 26, and 30; their gaps flow into the Loss rule and One score of 4.4 min for Five trips. The Analogy card shows different-sized parcels, and Key takeaways lists three points."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Three pairs illustrate the pattern; the 4.4-minute MAE uses all five
            invented courier trips.
          </figcaption>
        </figure>
      </section>

      <section id="mae-vs-mse">
        <h2 tabIndex={-1}>
          Different loss functions punish mistakes differently.
        </h2>
        <p>
          Not every loss function treats a big miss the same way. Two common
          loss functions for numeric predictions are{" "}
          <strong>MAE (Mean Absolute Error)</strong> and{" "}
          <strong>MSE (Mean Squared Error)</strong>.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>MAE (Mean Absolute Error)</h3>
            <p>
              Drops the minus sign on each error and takes the average. Every
              extra minute of error adds the same penalty, whether the miss is 2
              minutes or 22 minutes.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>MSE (Mean Squared Error)</h3>
            <p>
              Squares each error before averaging. A 2-minute miss becomes 4,
              while a 22-minute miss becomes 484—over a hundred times larger.
            </p>
          </div>
        </div>
        <p>
          Because MSE squares large misses, it pulls Rohan’s line upward toward
          the 52-minute bridge-delay trip. On this dataset, MAE picks{" "}
          <strong>4.0 min/km</strong> (MAE = 4.4 min, MSE = 96.8), fitting the
          four typical trips cleanly. MSE picks <strong>6.0 min/km</strong> (MSE
          = 52.8, MAE = 6.4 min), shrinking the one huge squared error at the
          cost of overestimating every typical trip by 2 to 8 minutes.
        </p>
        <p>
          For an everyday comparison, imagine two weather apps: one is off by
          1°C every day, while another is exact four days a week and off by 15°C
          on Friday. Which feels worse depends on whether one huge surprise
          hurts you more than steady small misses.
        </p>
        <p>
          A scoring rule also affects what the model is encouraged to improve:
          the choice of loss defines how different prediction misses count.
        </p>
        <figure className={styles.figure}>
          <Image
            src={maeVsMseImg}
            alt="Two ways to score error: MAE keeps misses of 2, 4, and 22 minutes as 2, 4, and 22; MSE squares them to 4, 16, and 484. The Analogy card compares a heavy parcel, and Key takeaways lists three points."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            On the exact same five trips, MAE and MSE disagree on which line is
            best because MSE weights the single outlier much more heavily.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Slide a line and watch the loss change.</h2>
        <p>
          Try adjusting Rohan’s prediction line below. Like a ruler laid across
          five pins on a board, moving the slope changes every trip’s vertical
          error bar at once—and MAE and MSE score that trade-off differently.
        </p>
        <ol className={styles.steps}>
          <li>
            Start on <strong>MAE</strong> at <strong>4.0 min/km</strong>. Notice
            that four trips have 0 error while the 5 km bridge-delay trip has a
            +22 min error (MAE = 4.4 min, MSE = 96.8).
          </li>
          <li>
            Switch the highlight to <strong>MSE</strong>, then slide up to{" "}
            <strong>6.0 min/km</strong> (or click{" "}
            <strong>Best MSE (6.0)</strong>). Watch MSE drop from 96.8 to 52.8
            while MAE climbs from 4.4 to 6.4 min.
          </li>
          <li>
            Compare the table rows at 6.0 min/km: lowering MSE made all four
            typical trips less accurate just to shrink the single squared
            outlier error.
          </li>
          <li>
            Click <strong>Reset line</strong> to return to the starting setup.
          </li>
        </ol>
        <LossSliderLab />
      </section>

      <section id="loss-vs-outcome">
        <h2 tabIndex={-1}>Why low loss does not guarantee a useful model.</h2>
        <p>
          It is tempting to assume that whichever model has the lowest loss is
          automatically the most useful. A low loss score means predictions fit
          a chosen scoring rule on a chosen set of recorded targets. It does not
          by itself tell us whether people get a useful result.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>Different costs for different mistakes</h3>
            <p>
              MAE and MSE treat being 10 minutes early the same as being 10
              minutes late. In this invented courier scenario, arriving late
              leaves a customer waiting, while arriving early may be less
              costly.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>A measured target can be a proxy</h3>
            <p>
              A <strong>proxy target</strong> is a measurable stand-in for the
              real goal. Minimizing prediction error on watch-time, for example,
              could still recommend content that frustrates viewers.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>Past data vs. new conditions</h3>
            <p>
              A model can score well on familiar routes yet do poorly on new
              routes, seasons, or groups not well represented in its examples.
            </p>
          </div>
        </div>
        <p>
          Consider a fictional hospital scheduling operating rooms: predicting
          that a surgery will finish 20 minutes sooner than it actually does can
          delay every patient after it, whereas leaving a 20-minute buffer
          causes far less disruption. Equal numeric error does not mean equal
          real-world harm.
        </p>
        <figure className={styles.figure}>
          <Image
            src={lossVsOutcomeImg}
            alt="A low score is not the whole story: a Loss score summarizes past trips under a chosen error rule, while Real-world outcome shows different costs for Early and Late arrival. The Analogy card compares practice and a real match, and Key takeaways lists three points."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A loss score can guide training, while usefulness depends on the
            goal, the cost of mistakes, and performance on new cases.
          </figcaption>
        </figure>
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Limits and quick questions.</h2>
        <p>
          Keep three practical limits in mind whenever you read a loss score:
        </p>
        <ul className={styles.steps}>
          <li>
            <strong>Averages hide individual failures:</strong> One low average
            loss can still mask terrible predictions on a small but critical
            group of cases.
          </li>
          <li>
            <strong>The known values may be off:</strong> If recorded targets
            are noisy or biased, minimizing loss can reproduce those flaws.
          </li>
          <li>
            <strong>A training score is not a real-world check:</strong> A
            training loss is the score on examples used while a model learns.
            Teams also check separate examples and the effects of mistakes
            before relying on a model.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>Is zero loss always the goal?</strong>
            <p>
              No. Outcomes can include unpredictable events like a bridge
              closure. A zero training loss can reflect details of those
              examples that do not hold on new trips. This is called{" "}
              <strong>overfitting</strong>; the next lesson explores it further.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Can you compare an MAE of 4.4 directly to an MSE of 52.8?
            </strong>
            <p>
              No. MAE is measured in the original units (minutes), while MSE is
              measured in squared units (minutes²). Compare candidate models
              using the same loss function on the same dataset.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If low loss does not prove usefulness, why train with it at all?
            </strong>
            <p>
              Training algorithms need a fast, computable score to adjust model
              settings step by step. Loss serves as the training compass, while
              real-world evaluation checks whether the destination is actually
              helpful.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A courier team compares two delivery-time models on the same recorded trips. Model A has a lower mean absolute error (MAE = 4 min), but it often predicts an arrival 4 minutes before the courier actually arrives, leaving customers waiting. Model B has a slightly higher MAE (5 min) because it includes a small buffer and customers seldom wait. What does this show?"
        options={[
          "Model A is automatically the better choice for customers because a lower loss score always means a more useful model.",
          "A lower loss score reflects a closer average fit under one formula, not whether the model matches different real-world costs like late deliveries.",
          "Loss functions are not helpful during training because they never reflect prediction accuracy.",
          "Model B must have been scored with MSE instead of MAE, because MAE cannot be higher for a more useful model.",
        ]}
        correct={1}
        explanation="MAE penalizes early and late errors equally, so Model A has a lower average miss even though its late arrivals hurt customers. Real-world usefulness depends on the cost of different mistakes, not just one average score."
        wrongFeedback={[
          "A lower MAE only means a smaller average absolute gap; it treats an arrival predicted 4 minutes early the same as one predicted 4 minutes late, so it does not automatically show which model serves customers better.",
          "",
          "Loss functions are still essential for training because they give a computable signal of prediction error; the limit is that one numeric loss does not capture every real-world cost.",
          "Both models were scored with MAE on the same recorded trips. A protective buffer can increase MAE while still reducing customer waiting.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Loss is a training compass, not the final verdict.</strong>{" "}
            A <strong>loss function</strong> turns prediction errors from
            examples into one score—and choices like <strong>MAE</strong> vs.{" "}
            <strong>MSE</strong> decide how heavily outliers pull the model.
            Check real-world costs, whether the scored target matches the goal,
            and new examples before calling a low-loss model useful.
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

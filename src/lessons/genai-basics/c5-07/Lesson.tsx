import Image from "next/image";
import Link from "next/link";
import fitComparisonImg from "./images/fit-comparison.webp";
import errorGapImg from "./images/error-gap.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { CurveFitLab } from "./CurveFitLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="07"
      chapter={{ label: "Data and Evaluation", href: "/course/chapter-5" }}
      title="Overfitting and underfitting"
      lead="A curve can match past examples closely and still miss new ones. Compare how a model learns a pattern, misses it, or memorises random bumps."
    >
      <section id="pattern-and-fit">
        <h2 tabIndex={-1}>The pattern is more useful than every bump.</h2>
        <p>
          A <strong>pattern</strong> is a relationship that tends to repeat.
          <strong> Noise</strong> is variation that does not repeat reliably. A
          model learns from examples, so it can pick up the pattern, noise, or
          some of each.
        </p>
        <p>
          <strong>Generalisation</strong> means making useful predictions on
          examples the model has not learned from. Lesson 5.5 introduced{" "}
          <Link href="/learn/genai-basics/c5-05">
            training and validation sets
          </Link>
          : training examples teach the model; held-back validation examples
          help us check how well its predictions carry over.
        </p>
        <p>
          A prediction <strong>error</strong> is how far a prediction misses.
          <strong> Training error</strong> is the average miss on training
          examples; <strong>validation error</strong> is the average miss on
          held-back validation examples. <strong>Model flexibility</strong>{" "}
          describes how many different shapes a model can represent.
        </p>
        <div className={styles.example}>
          <strong>Running example: Sam’s ice-cream cart (invented)</strong>
          <p>
            Sam wants to predict daily scoops sold from afternoon temperature.
            Sales tend to rise on warmer days, then level off on very hot days.
            A passing shower or local event may shift one day’s sales; those
            one-day bumps are noise.
          </p>
        </div>
        <p>
          Imagine Sam keeps eight past days for training and six different days
          for validation. The useful pattern is the broad rise and plateau, not
          the exact sales count on every individual day.
        </p>
      </section>

      <section id="underfitting">
        <h2 tabIndex={-1}>Underfitting misses the pattern.</h2>
        <p>
          <strong>Underfitting</strong> happens when a model is too limited to
          capture the main relationship in its examples. It tends to make large
          errors on both training and validation examples.
        </p>
        <div className={styles.example}>
          <strong>Worked example: one flat prediction</strong>
          <p>
            If Sam’s model predicts 63 scoops on every day, it ignores
            temperature. It is too simple for the rise and plateau, so it misses
            cool and warm days in both sets. A more flexible curve could
            represent that shape.
          </p>
        </div>
        <p>
          Outside this example, a one-size-fits-all jacket is like an
          underfitting model: its simple shape may not fit many people well.
        </p>
      </section>

      <section id="overfitting">
        <h2 tabIndex={-1}>Overfitting memorises bumps.</h2>
        <p>
          <strong>Overfitting</strong> happens when a model follows details in
          its training examples that do not carry over to new examples. It can
          have very low training error and much higher validation error.
        </p>
        <div className={styles.example}>
          <strong>Worked example: Sam’s wiggly curve</strong>
          <p>
            A wiggly curve can pass through all eight training days, including a
            shower-day bump. If the wiggle swings away from the six validation
            days, the close training match was misleading. It memorised the
            training details instead of capturing only the pattern.
          </p>
        </div>
        <p>
          Think of an exam: memorising answers on one practice sheet may not
          help with new questions.
        </p>
      </section>

      <section id="good-fit">
        <h2 tabIndex={-1}>A good fit captures the trend.</h2>
        <p>
          A <strong>good fit</strong> captures the repeatable pattern without
          trying to match every noisy point. Its predictions tend to stay useful
          on held-back examples too. “Good” here means a useful balance for this
          data, not a guarantee about every future case.
        </p>
        <div className={styles.example}>
          <strong>Worked example: Sam’s smoother curve</strong>
          <p>
            A smoother curve follows the rise and plateau in Sam’s sales. It may
            miss a few noisy training points, but can predict the six held-back
            days better than a curve that chases each bump.
          </p>
        </div>
        <p>
          Learning the ideas behind exam questions is more likely to carry over
          than memorising one answer sheet, though no practice can cover every
          possible question.
        </p>
        <figure className={styles.figure}>
          <Image
            src={fitComparisonImg}
            alt="Fit the pattern, not every bump: the plots compare Training days with Unseen days. Underfit misses trend, Good fit captures trend, and Overfit chases noise. Analogy: memorising one sheet may miss new questions. Key takeaways explain how underfitting, overfitting, and a useful fit relate to the pattern."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The three curves see the same points: the smooth trend carries
            farther than a flat line or a curve that chases each bump.
          </figcaption>
        </figure>
      </section>

      <section id="diagnosing-the-gap">
        <h2 tabIndex={-1}>Compare both errors to diagnose the fit.</h2>
        <p>
          Recall that training error measures average misses on training
          examples, while validation error measures misses on held-back
          examples. “Low” depends on the task, so compare the two errors as well
          as their size.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.diagTable}>
            <thead>
              <tr>
                <th>What you see</th>
                <th>What it may suggest</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>High training and validation errors</td>
                <td>Underfitting: the main pattern may be missed.</td>
              </tr>
              <tr>
                <td>Low, similar errors</td>
                <td>A useful fit that may generalise to new examples.</td>
              </tr>
              <tr>
                <td>Very low training, much higher validation error</td>
                <td>Overfitting: training details may not carry over.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          As model flexibility increases, training error often falls. Validation
          error may fall at first, then rise if the model starts following
          training noise. These curves are a useful guide, not a rule that every
          real model follows exactly.
        </p>
        <figure className={styles.figure}>
          <Image
            src={errorGapImg}
            alt="Compare both errors: Training error alone can mislead. The chart plots Training error and Validation error as Model flexibility moves from Simple to Complex, with Underfit, Good fit, Overfit, and a Wider gap. Analogy: practice results can hide race-day misses. Key takeaways say high errors can suggest underfitting, low close errors a useful fit, and a wide gap overfitting."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A growing distance between training and validation error can warn
            that a model is fitting details that do not generalise.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the curves on Sam’s days.</h2>
        <p>
          Use the controls in order: inspect the training view, reveal the
          validation days, then compare all three curve shapes and their average
          errors.
        </p>
        <p>
          These six days are held out while each curve is fit. Because we
          compare curves using them, they guide a choice; they are not an
          untouched final test. In practice, reserve separate test data for a
          final check.
        </p>
        <CurveFitLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="In the invented ice-cream example, the wiggly curve has an average miss of 0 scoops on Sam’s eight training days and 21 scoops on the six held-back validation days. What does this most strongly suggest?"
        options={[
          "Underfitting: the curve is too simple to match even the training days.",
          "A good fit: matching every training day proves it learned the pattern.",
          "Overfitting: the training match did not carry over to held-back days.",
          "No conclusion: validation examples should be added to training first.",
        ]}
        correct={2}
        explanation="The curve matches training examples very closely but has much larger error on held-back examples. That gap suggests it followed details that did not carry over, which is overfitting."
        wrongFeedback={[
          "Underfitting would usually have large errors on training and validation examples. This curve has zero training error.",
          "A close training match alone does not prove generalisation. The 21-scoop validation error shows it misses held-back days.",
          "",
          "Adding validation examples to training removes this held-back check. Keep them separate while comparing the fit.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            A perfect training fit is not automatically best. Underfitting
            misses the pattern; overfitting follows training noise; a useful fit
            captures the pattern and carries over to unseen examples.
          </p>
          <p>
            Compare training error with validation error. High errors on both
            can suggest underfitting, low and similar errors can suggest a good
            fit, and a wide gap can suggest overfitting.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

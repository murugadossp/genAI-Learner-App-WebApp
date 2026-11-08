import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { FitLab } from "./FitLab";
import styles from "./lesson.module.css";
export default function Lesson() {
  return (
    <LessonFrame
      number="05"
      title="Parameters and model size"
      lead="Model sizes are quoted in billions of parameters. What is a parameter, what does a bigger count buy, and why is bigger not automatically better?"
    >
      <section id="idea">
        <h2 tabIndex={-1}>Parameters are learned numbers.</h2>
        <p>
          A model’s <strong>parameters</strong> are the adjustable numbers it
          uses to turn input into output. In a neural network most of them are
          the weights you met in the pretraining lesson. They start out
          arbitrary, and training nudges every one of them so the model’s
          predictions fit the data a little better. When training ends, they are
          frozen and the model answers using those fixed values.
        </p>
        <p>
          A “7 billion parameter model” therefore has seven billion such
          numbers. The count describes the model’s <strong>capacity</strong>:
          how many different patterns it could be adjusted to represent. It does
          not describe what the model actually learned, and it is not a score of
          how good it is.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> more parameters give a model more room to
          fit patterns. Whether it fits the <em>right</em> patterns depends on
          the data and the training.
        </div>
      </section>
      <section id="dial">
        <h2 tabIndex={-1}>Turn the size dial.</h2>
        <p>
          Real models are far too large to watch, so this lab uses a toy: a
          curve with a chosen number of adjustable numbers, fitted to noisy
          dots. Start small and raise the dial. Watch two errors: how well the
          curve matches the dots it was fitted to, and how well it predicts
          fresh dots it never saw (held-out). Then switch to more examples and
          repeat.
        </p>
        <FitLab />
      </section>
      <section id="mechanism">
        <h2 tabIndex={-1}>Capacity is not quality.</h2>
        <p>
          Follow one run of the toy with 12 examples through the three settings
          you saw.
        </p>
        <ol className={styles.flow}>
          <li>
            <strong>1. Too few numbers</strong>A single number can only draw a
            flat line. It misses the bend, so both errors are high. The model
            lacks capacity.
          </li>
          <li>
            <strong>2. Enough numbers</strong>
            With a handful, the curve follows the pattern and ignores most of
            the noise. The held-out error is at or near its lowest.
          </li>
          <li>
            <strong>3. Many numbers</strong>
            With as many numbers as examples the curve can pass through every
            dot, so the training error falls to about zero, yet it swings wildly
            between dots and the held-out error gets worse.
          </li>
        </ol>
        <p>
          The training error only ever improves as the dial goes up, which is
          why it is a poor judge of quality. The held-out error is the honest
          signal. With 40 examples, the extra numbers are mostly harmless, but
          they still did not beat a moderate size. Extra capacity needs enough
          data to constrain it, and even then it is not guaranteed to help.
        </p>
        <p>
          Real language models are not polynomial curves, and very large
          networks trained on very large datasets do not fail in exactly this
          way. The transferable lesson is narrower: parameter count measures
          capacity, and the data, the amount of training and the later tuning
          decide how well that capacity is used. A smaller model that is well
          trained can beat a larger one that is not.
        </p>
      </section>
      <section id="scale">
        <h2 tabIndex={-1}>What size costs.</h2>
        <p>
          Size has a concrete price even when it does not buy quality. Every
          parameter is a number that must be stored and used, so a bigger model
          needs more memory and more computation for each token it produces.
          Storing the weights alone takes the parameter count times the bytes
          per number. The sizes below are hypothetical examples.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="visually-hidden">
              Memory needed to store weights for example parameter counts
            </caption>
            <thead>
              <tr>
                <th scope="col">Parameters</th>
                <th scope="col">16-bit (2 bytes each)</th>
                <th scope="col">4-bit (0.5 bytes each)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1 billion</th>
                <td>2 GB</td>
                <td>0.5 GB</td>
              </tr>
              <tr>
                <th scope="row">7 billion</th>
                <td>14 GB</td>
                <td>3.5 GB</td>
              </tr>
              <tr>
                <th scope="row">70 billion</th>
                <td>140 GB</td>
                <td>35 GB</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="micro">
          Decimal gigabytes, weights only. Running a model needs extra memory on
          top of this, and real storage formats vary. Later lessons cover how
          cost, speed and quality trade off and how to choose a model for a
          task.
        </p>
      </section>
      <Check
        id="check"
        question="A team swaps a 7-billion-parameter model for a 70-billion-parameter one on the same task and sees little improvement. What is the best reading?"
        options={[
          "Something must be broken, because more parameters always give better results.",
          "Parameters are stored facts, so the extra ones only help if the task needs those facts.",
          "More parameters add capacity, but quality also depends on data, training and the task, so a bigger model is not guaranteed to be better.",
        ]}
        correct={2}
        wrongFeedback={[
          "Parameter count measures capacity, not quality. A bigger model can fail to improve without being broken.",
          "Parameters are learned numbers that encode patterns, not a list of stored facts. Size alone does not decide what a model knows.",
          "",
        ]}
        explanation="Parameters are learned numbers and their count sets capacity. How well that capacity is used depends on the data, the training and what the task needs, so bigger is not automatically better."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Parameters are the numbers a model learns, and their count is its
            capacity. More capacity can help, but it costs memory and
            computation and is only as good as the data and training behind it.
            Treat model size as one input to a choice, never as a quality score.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-03">
          Review: Where models learn: pretraining and data →
        </Link>
      </section>
    </LessonFrame>
  );
}

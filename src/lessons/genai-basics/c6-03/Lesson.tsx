import Link from "next/link";
import { Check } from "../../Check";
import { LessonFrame } from "../../LessonFrame";
import { GradientLab } from "./GradientLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      chapter={{
        label: "Neural Networks and Deep Learning",
        href: "/course/chapter-6",
      }}
      title="Gradient descent: improving predictions"
      lead="Training can improve a model through many small changes. Follow one simple update, then see how the step size affects what happens next."
    >
      <section id="idea">
        <h2 tabIndex={-1}>A guess can improve in steps.</h2>
        <p>
          Imagine a bead resting somewhere on the inside of a smooth bowl. It
          can move toward the low point a little at a time. In training, the
          “bowl” is a picture of how well different model settings perform; the
          model does not literally roll downhill.
        </p>
        <p>
          This lesson follows six ideas in order: prediction, error, loss,
          slope, learning rate, and update.
        </p>
        <p>
          Use one invented example: a tiny model predicts a package’s mass using
          a single adjustable number, <var>w</var>. The known target is 4 units,
          and the first prediction is <var>w</var> = 0. The{" "}
          <strong>error</strong> is prediction minus target, so it starts at −4
          units.
        </p>
        <p>
          A <strong>loss</strong> turns the mismatch into a score. For this
          example, use <var>L(w) = ½(w − 4)²</var>. Squaring makes the score
          non-negative, and a prediction nearer 4 has a lower score. The loss
          starts at 8; at the target, it is 0.
        </p>
        <div className="callout">
          <strong>Keep the example small:</strong> this toy has one adjustable
          number and one target. A real model can have many adjustable numbers
          and many training examples.
        </div>
      </section>

      <section id="step">
        <h2 tabIndex={-1}>Use the slope to choose a direction.</h2>
        <p>
          The <strong>gradient</strong> tells which way the loss rises most
          steeply at the current setting. For this one-number example, its slope
          rule is <var>dL/dw = w − 4</var>. This derivative is supplied as the
          rule for the toy; the optional math pathway explains derivatives in
          more depth.
        </p>
        <p>
          At <var>w</var> = 0, the slope is −4. A negative slope means the loss
          falls if <var>w</var> moves a little to the right. Gradient descent
          subtracts a portion of that slope from the current setting.
        </p>
        <div className={styles.updateRule}>
          <strong>
            New setting = current setting − learning rate × gradient
          </strong>
          <span>
            The <strong>learning rate</strong> scales the slope to set the
            amount of change in one update.
          </span>
        </div>
        <p>
          Work it through with a learning rate of 0.25. The first update is 0 −
          0.25 × (−4) = 1. The error shrinks, and the loss drops from 8 to 4.5.
          From there, the slope is 1 − 4 = −3, so another update gives 1 − 0.25
          × (−3) = 1.75, with loss about 2.53.
        </p>
        <p>
          An <strong>update</strong> is one calculated change to the adjustable
          setting. Training repeats updates; it does not usually jump straight
          from the first guess to a perfect answer.
        </p>
        <p className="micro">
          The steepest-descent direction and learning-rate update are standard
          optimization ideas. See Goodfellow, Bengio and Courville,{" "}
          <em>Deep Learning</em>, sections on{" "}
          <a href="https://www.deeplearningbook.org/contents/numerical.html">
            gradient-based optimization
          </a>{" "}
          and{" "}
          <a href="https://www.deeplearningbook.org/contents/optimization.html">
            optimization for training deep models
          </a>
          .
        </p>
      </section>

      <section id="explore">
        <h2 tabIndex={-1}>Change the step size.</h2>
        <p>
          In the example above, 0.25 takes a moderate step toward the target. A
          lower learning rate makes each step smaller; a high one can jump
          across the low point. Watch how the next setting and loss respond.
        </p>
        <ol className={styles.trySteps}>
          <li>Start with the selected rate, 0.25, and take one step.</li>
          <li>Reset, choose 0.05, and compare how far the marker moves.</li>
          <li>Reset, choose 2.2, and watch the marker cross the target.</li>
        </ol>
        <GradientLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What this bowl leaves out.</h2>
        <p>
          With this exact bowl starting at <var>w</var> = 0, a rate of 0.25
          steadily reduces the loss. A rate of 2.2 overshoots the target on the
          first update and raises the loss; later updates alternate across the
          target and move farther out. This is a result for the stated toy
          equation, not a rule that every large rate behaves the same way in
          every model.
        </p>
        <p>
          A real training run changes many parameters using examples and a
          chosen loss. Its loss surface can have more complicated shapes, so a
          rate that helps in one setting may be too small or too large in
          another. Gradient descent describes a repeated update process, not a
          promise of instant or perfect learning.
        </p>
        <p>
          This lesson showed a slope for one adjustable number. How error
          supplies gradients across multiple layers belongs in the next lesson
          on backpropagation. Batches, epochs and training settings come later.
        </p>
        <div className={styles.quickQuestions}>
          <h3>Quick questions</h3>
          <dl>
            <div>
              <dt>Does one update guarantee the best prediction?</dt>
              <dd>
                No. It changes the setting once; later steps may still be
                needed.
              </dd>
            </div>
            <div>
              <dt>Does a larger rate always help?</dt>
              <dd>
                No. It can make progress faster in some cases, but it can also
                overshoot.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Check
        id="check"
        title="Follow one update"
        question="A toy model starts at w = 0. Its target is 4, its loss is L(w) = ½(w − 4)², and its update rule is new w = current w − learning rate × (w − 4). With a learning rate of 0.25, what is w after one update?"
        options={[
          "w = 4 — it jumps directly to the target.",
          "w = −1 — the negative slope moves the setting left.",
          "w = 1 — subtracting one quarter of the negative slope moves it right.",
          "w = 0 — the setting stays fixed until all examples are seen.",
        ]}
        correct={2}
        wrongFeedback={[
          "The update uses one quarter of the slope, so it does not jump all the way to the target in this step.",
          "At w = 0 the slope is −4. The rule subtracts 0.25 × (−4), which increases w instead of decreasing it.",
          "",
          "The stated rule applies an update now. It does not wait for a whole dataset in this toy example.",
        ]}
        explanation="At w = 0, the slope is 0 − 4 = −4. The update is 0 − 0.25 × (−4), which equals 1."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>A direction, then a step.</h2>
          <p>
            Gradient descent uses the loss slope to choose a direction, then the
            learning rate sets the step size. Training repeats those updates,
            checking whether they improve the chosen loss.
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-6">
          Chapter 6 contents →
        </Link>
      </section>
    </LessonFrame>
  );
}

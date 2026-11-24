import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { BoundaryLab } from "./BoundaryLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{
        label: "Neural Networks and Deep Learning",
        href: "/course/chapter-6",
      }}
      title="Layers and activation functions"
      lead="A neural network passes values through layers of small calculations. An activation function changes what those layers can represent."
    >
      <section id="layers">
        <h2 tabIndex={-1}>A network passes values forward.</h2>
        <p>
          Picture a relay with several workstations. Each station receives
          values from the station before it, makes a few calculations, then
          passes new values along. A real network follows a similar forward
          path; the stations do not think or understand like people.
        </p>
        <p>
          A spreadsheet cell that uses another cell’s result is a familiar
          example of a staged calculation. It shows the handoff idea, though a
          spreadsheet is not thereby a neural network.
        </p>
        <p>
          In technical terms, a <strong>layer</strong> is a group of calculation
          units that work on the same incoming values. A <strong>unit</strong>{" "}
          commonly combines its inputs with <strong>weights</strong> and a
          <strong>bias</strong> to make one value. A hidden layer is an
          intermediate layer between a network’s input and output. Its outputs
          are a representation: a new set of values for the next layer to use.
        </p>
        <div className={styles.example}>
          <strong>Running example: an on-time window</strong>
          <p>
            A toy checker reads one number: an arrival offset from a target
            time. Negative means early; positive means late. It should mark
            arrivals close to the target as “inside the window.” The numbers and
            rules below are invented for this demonstration.
          </p>
        </div>
        <p>
          In this drawing, <strong>x</strong> labels the input.{" "}
          <strong>h₁</strong> and <strong>h₂</strong> label the two hidden
          outputs. The final <strong>score</strong> is the number the toy
          checker uses.
        </p>
        <figure className={styles.figure}>
          <svg
            viewBox="0 0 600 220"
            role="img"
            aria-label="Values flow from Input through a Hidden layer of two units to Output; arrows point forward between computations."
          >
            <defs>
              <marker
                id="forward-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
              </marker>
            </defs>
            <text className={styles.diagramLabel} x="28" y="38">
              Input
            </text>
            <text className={styles.diagramLabel} x="210" y="38">
              Hidden layer
            </text>
            <text className={styles.diagramLabel} x="488" y="38">
              Output
            </text>
            <circle className={styles.node} cx="72" cy="126" r="25" />
            <circle className={styles.node} cx="270" cy="88" r="25" />
            <circle className={styles.node} cx="270" cy="164" r="25" />
            <circle className={styles.node} cx="526" cy="126" r="25" />
            <path
              className={styles.flow}
              d="M 99 119 L 240 92 M 99 133 L 240 160 M 297 92 L 497 119 M 297 160 L 497 133"
              markerEnd="url(#forward-arrow)"
            />
            <text className={styles.nodeLabel} x="72" y="131">
              x
            </text>
            <text className={styles.nodeLabel} x="270" y="93">
              h₁
            </text>
            <text className={styles.nodeLabel} x="270" y="169">
              h₂
            </text>
            <text className={styles.nodeLabel} x="526" y="131">
              score
            </text>
          </svg>
          <figcaption className="micro">
            Arrows show values moving forward from one calculation to the next.
          </figcaption>
        </figure>
      </section>

      <section id="activation">
        <h2 tabIndex={-1}>An activation changes the rule.</h2>
        <p>
          Picture a one-way gate: it blocks negative readings but lets positive
          ones through. This is only an analogy for the shape of ReLU; a gate
          does not describe how a network learns or what its values mean.
        </p>
        <p>
          A layer first makes weighted sums and adds biases; together these form
          an <strong>affine transform</strong>, or a weighted calculation with
          an offset. An <strong>activation function</strong> then applies a rule
          to those values before they move onward. Call the value entering this
          rule <strong>z</strong>. A common example is ReLU, short for rectified
          linear unit: it returns zero for a negative input and keeps a positive
          input unchanged.
        </p>
        <p>
          For a worked example, if z is −2 then ReLU returns 0; if z is 2, it
          returns 2. A spreadsheet can use the same max(0, z) rule to keep a
          calculated amount from going below zero. That everyday use shows the
          rule, not how a neural network is trained.
        </p>
        <p>
          That small step matters. Several affine transforms—weighted sums with
          offsets—still combine into one affine transform if no nonlinear step
          sits between them. ReLU is nonlinear, even though its graph is made of
          two straight pieces.
        </p>
        <p>
          “Nonlinear” means the whole rule cannot be drawn as one straight line.
          ReLU changes slope at zero, so no single affine rule describes both
          sides of its graph.
        </p>
        <figure className={styles.figure}>
          <svg
            viewBox="0 0 600 260"
            role="img"
            aria-label="The ReLU activation graph has a flat zero output for negative input z and rises along a straight line for positive input z."
          >
            <text className={styles.diagramLabel} x="25" y="34">
              ReLU
            </text>
            <path
              className={styles.axis}
              d="M 75 205 L 530 205 M 302 225 L 302 54"
            />
            <path className={styles.graph} d="M 95 205 L 302 205 L 500 68" />
            <text className={styles.axisLabel} x="515" y="231">
              Input z
            </text>
            <text className={styles.axisLabel} x="315" y="62">
              Output
            </text>
            <text className={styles.axisLabel} x="309" y="222">
              Zero
            </text>
          </svg>
          <figcaption className="micro">
            ReLU applies max(0, z): negative values become zero, while positive
            values pass through.
          </figcaption>
        </figure>
        <div className={styles.callout}>
          <strong>Quick questions</strong>
          <ul>
            <li>
              <strong>Does another layer guarantee a better result?</strong> No;
              the useful shape depends on the task and evidence.
            </li>
            <li>
              <strong>Does ReLU make a unit understand its input?</strong> No;
              it applies a numerical rule to that value.
            </li>
          </ul>
        </div>
      </section>

      <section id="boundary">
        <h2 tabIndex={-1}>Make a window-shaped boundary.</h2>
        <p>
          Imagine a building that admits visitors only during a scheduled
          window: arrivals can be too early or too late. This everyday rule has
          two edges, but it is only an analogy for the pattern the toy network
          will represent.
        </p>
        <p>
          A <strong>score</strong> is the toy network’s output number. We call
          an arrival “inside” only when the score is above zero; the places
          where the score crosses zero are its{" "}
          <strong>decision boundary</strong>. In our baseline, the score crosses
          zero once. Stacking a second affine transform without an activation
          keeps the same straight-line shape.
        </p>
        <p>
          Here is a worked example before you explore: the two hidden units
          compute h₁ = max(0, x + 1) and h₂ = max(0, 1 − x). The output score is
          5 − 2h₁ − 2h₂. For x between −1 and 1, both units are active and the
          score is 1. Farther early or late, one unit grows and the score falls.
          It crosses zero at x = −1.5 and x = 1.5, leaving a middle window. The
          explorer’s linear stack is set so its two transforms combine to score
          = x.
        </p>
        <p>
          Outside this toy, a building might admit visitors only during an
          agreed arrival window. That policy has two edges too; the analogy
          illustrates the shape of the rule, not a neural model used by a
          building.
        </p>
        <div className={styles.callout}>
          <strong>Try it in this order:</strong>
          <ol>
            <li>Start with one affine transform and note its one boundary.</li>
            <li>Add a second affine transform without an activation.</li>
            <li>Choose the ReLU step and compare the two boundary edges.</li>
          </ol>
        </div>
        <p>
          Choose a network shape. The plotted scores and weights are fixed,
          invented values: this is a small mathematical example, not a trained
          model, performance measurement, or transit rule.
        </p>
        <BoundaryLab />
        <p>
          This shows why nonlinear steps can help represent more varied
          patterns. It does not show that extra depth automatically improves a
          model; this toy only compares what its fixed equations can express.
        </p>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A network stacks two affine transforms. In one version, it inserts ReLU between them. In this toy example, only the ReLU version marks a middle arrival window. What does this show?"
        options={[
          "Any added layer automatically improves accuracy.",
          "A hidden unit understands whether an arrival is sensible.",
          "The nonlinear step can change which input patterns the network can represent.",
        ]}
        correct={2}
        wrongFeedback={[
          "The example compares possible shapes only; it does not measure accuracy or guarantee improvement.",
          "The units perform fixed calculations in this example; they do not understand arrivals.",
          "",
        ]}
        explanation="Without a nonlinear step, stacked affine transforms still act as one affine transform. ReLU lets this toy network form a middle interval with two boundary edges."
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <p className={styles.takeaway}>
          Layers pass values through steps of calculation. An activation such as
          ReLU adds a nonlinear step, so the network can represent patterns that
          a single affine rule cannot. More layers create options; they do not
          guarantee a better result.
        </p>
        <Link className="text-link" href="/course/chapter-6">
          Explore Chapter 6: Neural Networks and Deep Learning →
        </Link>
      </section>
    </LessonFrame>
  );
}

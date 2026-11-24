import { LessonFrame } from "../../LessonFrame";
import { KnowledgeCheck } from "./KnowledgeCheck";
import { WeightLab } from "./WeightLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{
        label: "Neural Networks and Deep Learning",
        href: "/course/chapter-6",
      }}
      title="Neurons, weights and biases"
      lead="A neuron in a neural network is a small mathematical unit. It combines input numbers using weights and adds a bias; it is not a tiny brain."
    >
      <section id="idea">
        <h2 tabIndex={-1}>A neuron is a calculation.</h2>
        <p>
          A <strong>neuron</strong> is a name for one calculation inside a
          neural network. It receives numbers called <strong>inputs</strong>—
          values supplied to a calculation—combines them, and returns a number.
          Connected neurons can form a larger network, but one neuron does not
          think or understand on its own.
        </p>
        <p>
          This lesson follows four ideas in order: input signals, weights, a
          bias, then the score—the number the calculation returns.
        </p>
        <div className={styles.analogy}>
          <h3>A calculator with adjustable knobs</h3>
          <p>
            Imagine a small calculator that turns each clue up or down before
            adding them. The clue is an input; its knob is a weight. A separate
            starting amount is the bias. This is only a picture of the
            calculation—real neurons do not contain little knobs.
          </p>
        </div>
        <p>
          One common neural-network operation multiplies inputs by learned
          weights, adds the results, then adds a bias. For a single output, the
          shorthand is <strong>weighted inputs + bias = score</strong>.
          Frameworks such as PyTorch document the same operation in their{" "}
          <a
            href="https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html"
            target="_blank"
            rel="noreferrer"
          >
            linear layer
          </a>
          . This lesson studies that calculation before any later processing.
        </p>
      </section>

      <section id="weights">
        <h2 tabIndex={-1}>Inputs get multiplied by weights.</h2>
        <p>
          An <strong>input</strong> is a number supplied to the calculation. A
          <strong> weight</strong> is the number multiplied by that input. The
          product is that input’s contribution to the score: a larger positive
          weight pushes it up more, while a negative weight pushes it down.
        </p>
        <p>
          Think of two clues for a made-up umbrella reminder: a rain signal and
          a dark-cloud signal. Each signal is a 0-or-1 number that marks whether
          that clue is off or on. In this tiny example, if rain is 1 and dark
          clouds are 0, with weights 2 and −1, their weighted inputs are{" "}
          <strong>1 × 2 = 2</strong> and
          <strong> 0 × −1 = 0</strong>. The rain clue contributes 2; the off
          cloud clue contributes 0.
        </p>
        <figure
          className={styles.calculation}
          aria-label="Each input is multiplied by its weight"
        >
          <span>1 rain</span>
          <span aria-hidden="true">×</span>
          <span>2 weight</span>
          <span aria-hidden="true">→</span>
          <strong>2 contribution</strong>
          <span>0 clouds</span>
          <span aria-hidden="true">×</span>
          <span>−1 weight</span>
          <span aria-hidden="true">→</span>
          <strong>0 contribution</strong>
          <figcaption className="micro">
            Each input follows its own multiplication before the results are
            added.
          </figcaption>
        </figure>
        <p>
          A weight changes how much its own input contributes. In a trained
          model, weights are values adjusted during training—the process of
          fitting a model to examples. This lesson will not show how those
          values are adjusted.
        </p>
      </section>

      <section id="bias">
        <h2 tabIndex={-1}>Bias shifts the starting score.</h2>
        <p>
          A <strong>bias</strong> is an added value in this calculation. It
          shifts the score even when the input signals are zero. With both
          umbrella signals off, both weighted inputs add to zero. A bias of −1
          gives a score of −1; changing the bias to 0 gives a score of 0.
        </p>
        <figure
          className={styles.biasFlow}
          aria-label="Bias is added after the weighted inputs"
        >
          <span>Weighted inputs: 0</span>
          <span aria-hidden="true">+</span>
          <span>Bias: −1</span>
          <span aria-hidden="true">→</span>
          <strong>Starting score: −1</strong>
          <figcaption className="micro">
            The bias is added after the weighted inputs.
          </figcaption>
        </figure>
        <p>
          The bias is like an initial amount added to the running total. That
          analogy is about addition only: it is not a fixed human preference or
          a guarantee about a model’s answer. Some calculation designs leave
          bias out, so this lesson shows one common form rather than claiming
          every neuron has a bias.
        </p>
      </section>

      <section id="explore">
        <h2 tabIndex={-1}>Change the weights.</h2>
        <p>
          Try each signal by itself, then turn both on. Change one weight at a
          time and watch only that input’s contribution change. With both
          signals off, move either weight: the score stays at the bias, −1.
        </p>
        <ol className={styles.steps}>
          <li>Start with rain on and dark clouds off; note the score.</li>
          <li>Move the rain weight from 2 down to 0, then reset.</li>
          <li>Turn rain off and dark clouds on; compare the score.</li>
          <li>
            Turn both on, then both off. With both off, change either weight.
          </li>
        </ol>
        <WeightLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What this tiny model can and cannot show.</h2>
        <p>
          This example uses a made-up score and a made-up cutoff: its reminder
          turns on at 0 or above. A real neural network may combine many inputs,
          calculate many outputs, and apply other operations after a weighted
          sum. The next lesson looks at layers (groups of units) and activation
          functions (rules applied to scores).
        </p>
        <div className={styles.quickQuestions}>
          <h3>Quick questions</h3>
          <p>
            <strong>What changes when a weight changes?</strong> That input’s
            contribution changes; an input of 0 still contributes 0.
          </p>
          <p>
            <strong>What can bias change when inputs are off?</strong> It sets
            the score because the weighted inputs then add to 0.
          </p>
        </div>
        <p>
          This single calculation is a useful building block, not a miniature
          mind. A network gets its behavior from many connected calculations and
          values working together.
        </p>
      </section>

      <KnowledgeCheck />

      <section id="takeaway" className={styles.takeaway}>
        <h2 tabIndex={-1}>Keep this model in mind.</h2>
        <p>
          A neuron combines weighted inputs, adds a bias, and returns a score.
          Changing a weight changes how strongly its input contributes; bias
          shifts the score independently of those inputs.
        </p>
      </section>
    </LessonFrame>
  );
}

import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { DietLab } from "./DietLab";
import styles from "./lesson.module.css";
export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      title="Where models learn: pretraining and data"
      lead="A model’s knowledge and mistakes begin long before you type a question. What does it learn from, and when does that learning stop?"
    >
      <section id="idea">
        <h2 tabIndex={-1}>Learning happens before the question.</h2>
        <p>
          In the last lesson, a model chose the next token from a probability
          distribution. Those probabilities come from{" "}
          <strong>pretraining</strong>: a long training run in which the model
          reads a very large amount of text and repeatedly practices predicting
          what comes next. Each prediction is scored, and the model’s numerical
          weights are adjusted to do slightly better.
        </p>
        <p>
          A tempting picture is that the model stores documents and looks up the
          answer when you ask. That is not how a standard language model
          answers. At answer time it runs its fixed weights over your input.
          What a base model “knows” from pretraining was folded into those
          weights earlier.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> the data shapes the weights during
          training; at answer time the model uses the weights, not a search of
          the training set.
        </div>
      </section>
      <section id="diets">
        <h2 tabIndex={-1}>Same prompt, different data diets.</h2>
        <p>
          Below, a toy model learns what follows “The capital of Australia is”.
          Train it on casual posts, then on reference pages, and watch the same
          prompt give different answers. Then change the ticked documents
          without pressing Train and see what the model does about it.
        </p>
        <DietLab />
      </section>
      <section id="mechanism">
        <h2 tabIndex={-1}>What training leaves behind.</h2>
        <p>
          Follow the Australia example through the three stages. The toy used
          counts to keep the idea visible; a real model compresses patterns into
          weights, but the stages are the same.
        </p>
        <ol className={styles.flow}>
          <li>
            <strong>1. Data</strong>
            Documents say “Canberra” or “Sydney” after the same words, in
            different proportions.
          </li>
          <li>
            <strong>2. Training</strong>
            The model is adjusted until its next-token probabilities fit those
            patterns. In the toy, that was pressing Train.
          </li>
          <li>
            <strong>3. Answering</strong>
            The finished model turns your prompt into probabilities. The
            documents are not consulted, which is why un-trained changes did
            nothing.
          </li>
        </ol>
        <p>
          The pretraining objective is predicting text, not checking facts. When
          the data is mostly right, predictions tend to be right too, but
          nothing in the objective guarantees truth.
        </p>
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>What data shapes, and what it cannot fix.</h2>
        <p>
          Training data influences coverage (topics seen often are usually
          handled better than rare ones), style, and errors. A widely repeated
          mistake can be learned along with facts. Topics that are thin or
          missing leave the model guessing from nearby patterns.
        </p>
        <p>
          Training also stops. Information published afterwards is not in the
          weights. An application can supply it in the request (a later lesson
          covers context windows) or retrieve it from outside, but that is the
          app adding information, not the model having learned it. Later lessons
          cover how base models become assistants, why models make things up,
          and knowledge cutoffs.
        </p>
      </section>
      <Check
        id="check"
        question="A model finished pretraining last year. Today a reliable site publishes a correction. Asked with no extra tools or documents, what best describes the model?"
        options={[
          "It searches its training documents when asked, so it will find the correction.",
          "Its weights were set during training, so the correction is missing unless the model is retrained or the app supplies it in the request.",
          "It updates its weights as soon as the correction is published online.",
        ]}
        correct={1}
        wrongFeedback={[
          "A standard model does not search its training documents at answer time, and the correction did not exist during training anyway.",
          "",
          "Publishing something online does not change a deployed model’s weights. Weights change only through training.",
        ]}
        explanation="Pretraining fixes the weights. New information reaches the model only through more training or by being included in the request."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Pretraining turns a large body of text into weights. Whatever the
            data over- or under-represents, the model can echo, and it does not
            look anything up at answer time. If an answer is wrong or stale, ask
            what the training data contained and what the app supplied.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-02">
          Review: How a model predicts the next token →
        </Link>
      </section>
    </LessonFrame>
  );
}

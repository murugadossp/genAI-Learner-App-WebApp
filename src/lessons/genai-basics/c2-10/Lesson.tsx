import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ReasoningLab } from "./ReasoningLab";
import diagram from "./reasoning-diagram.png";
import styles from "./lesson.module.css";
export default function Lesson() {
  return (
    <LessonFrame
      number="10"
      title="Reasoning models"
      lead="Some models are built to spend effort on a problem before they reply. What changes when they do, and what can you trust about the steps they show?"
    >
      <section id="idea">
        <h2 tabIndex={-1}>Some models work first, then answer.</h2>
        <p>
          Think of a student sitting a test. One student writes the answer
          straight away. Another jots rough working first, spots a mistake, and
          fixes it. A <strong>reasoning model</strong> is the second student: it
          writes working text before it gives its final answer.
        </p>
        <p>
          It is still a language model writing one piece of text at a time, as
          in{" "}
          <Link className="text-link" href="/learn/genai-basics/c2-02">
            how a model predicts the next token
          </Link>
          . The difference is that it was trained to write useful working first.
        </p>
        <figure className={styles.figure}>
          <Image
            src={diagram}
            alt="Two lanes. Quick reply: a pet puzzle goes straight to the answer Asha cat, Ben dog, Chen fish, marked wrong, a first guess with no checking. Reasoning model: the same puzzle goes through working text (read the clues, make a guess, check and fix it, check again) to the answer Asha fish, Ben cat, Chen dog, marked right."
            sizes="(min-width: 760px) 720px, 100vw"
          />
          <figcaption className="micro">
            The same question, answered two ways. The example and its numbers
            are invented for this lesson.
          </figcaption>
        </figure>
        <div className="callout">
          <strong>Key idea:</strong> a reasoning model gives itself room to
          think in text before it commits to an answer, and it was trained to
          use that room well.
        </div>
      </section>
      <section id="example">
        <h2 tabIndex={-1}>Watch one question get worked through.</h2>
        <p>
          Here is a small puzzle. There is no maths in it, you only use the
          clues.
        </p>
        <blockquote className={styles.puzzle}>
          Asha, Ben and Chen each own a different pet: a cat, a dog or a fish.
          <br />
          Clue 1: Asha is allergic to fur, so she cannot have a pet with fur.
          <br />
          Clue 2: Chen does not have the cat.
          <br />
          Who has which pet?
        </blockquote>
        <h3>A quick reply</h3>
        <p>
          It answers at once: “Asha has the cat, Ben has the dog, Chen has the
          fish.” It just matched names to pets in the order they were listed.
          That breaks Clue 1, because a cat has fur. Nothing checked it.
        </p>
        <h3>A reasoning model</h3>
        <p>It writes its working first. In this lesson’s toy, it goes:</p>
        <ol>
          <li>
            <strong>Read the clues.</strong> Write down what we know.
          </li>
          <li>
            <strong>Make a guess.</strong> The same order as before.
          </li>
          <li>
            <strong>Check the guess.</strong> A cat has fur, so Asha cannot have
            it. The guess is wrong. Only the fish has no fur, so Asha gets the
            fish. Chen cannot have the cat, so Chen gets the dog. Ben gets the
            cat.
          </li>
          <li>
            <strong>Check again.</strong> Both clues now hold.
          </li>
        </ol>
        <p>
          That is the whole idea: guess, check, fix, check again. In the next
          section you can mix and match. Pick how the model answers, and change
          how much working it gets.
        </p>
        <div className="callout">
          <strong>Note:</strong> these steps are scripted for the lesson. A real
          reasoning model writes its own working, and it differs each time.
        </div>
      </section>
      <section id="compare">
        <h2 tabIndex={-1}>Compare a quick reply with reasoned work.</h2>
        <p>Try the lab in this order:</p>
        <ol>
          <li>
            Leave the pet puzzle and the quick model. It answers at once, and
            the answer breaks a clue.
          </li>
          <li>Switch to the ordinary model told to show its steps.</li>
          <li>
            Switch to the reasoning model and raise the work slider one step at
            a time. Watch the answer change at step 3, and the cost keep rising.
          </li>
          <li>
            Pick the one-step fact and see extra work add cost without changing
            the answer.
          </li>
        </ol>
        <ReasoningLab />
      </section>
      <section id="training">
        <h2 tabIndex={-1}>The difference is training, not a magic phrase.</h2>
        <p>
          You can ask any chat model to “think step by step”, and that often
          helps, because the written steps become context for the tokens that
          follow. But the model is still behaving the way its earlier training
          shaped it. Reasoning models get extra training aimed at this
          behaviour. Providers have described approaches that reward correct
          final answers on problems where the answer can be checked, such as
          maths and code, so the model learns which kinds of working tend to
          lead somewhere. Details differ between providers and are often not
          fully published.
        </p>
        <ul>
          <li>
            <strong>It costs more.</strong> Working text is generated text. It
            takes time and, with paid APIs, it is usually billed. The lab’s cost
            units are invented, but the direction is real.
          </li>
          <li>
            <strong>It helps most on multi-step problems.</strong> Maths,
            planning, tricky code and puzzles with a catch benefit. A simple
            lookup or rewrite usually does not, as the quick fact showed.
          </li>
          <li>
            <strong>It can still be wrong.</strong> More working tends to help
            on average, but how much depends on the model and the task, and it
            can be wasted. It does not turn a model into a checker of facts, and
            it can reason at length toward a wrong answer.
          </li>
          <li>
            <strong>Often there is a dial.</strong> Some products and APIs let
            you set how much the model may work, which is the idea behind the
            lab’s slider.
          </li>
        </ul>
      </section>
      <section id="visible">
        <h2 tabIndex={-1}>Shown steps are not a verified record.</h2>
        <p>
          When an app shows you reasoning, you are reading text. Some products
          show the model’s working, some show a shorter summary written for
          display, and some show nothing. In the lab, pick the pet puzzle, set
          the reasoning model to 3 or more steps, and compare “summary” with
          “full work”: the summary leaves out the discarded first attempt. That
          is a toy, but the caution is real. Research has found that written
          reasoning does not always reflect what actually drove the answer, so a
          clean explanation is not proof of how the answer was reached.
        </p>
        <p>
          Treat the steps as useful evidence you can check, not as a window into
          the model’s inner process. For work that matters, check the result
          itself, for example by recomputing it, running the code, or reading a
          trusted source, as covered in{" "}
          <Link className="text-link" href="/learn/genai-basics/c2-07">
            why models make things up
          </Link>
          .
        </p>
        <div className="callout">
          <strong>Habit:</strong> choose a reasoning setting for hard,
          multi-step tasks, skip it for simple ones, and verify the answer
          either way.
        </div>
      </section>
      <Check
        id="check"
        question="A teammate says that adding “think step by step” to any prompt turns an ordinary model into a reasoning model, and that the steps it prints prove how it got its answer. What is the best response?"
        options={[
          "Agree: the printed steps are a faithful log of the model’s process, so reading them is enough to trust the answer.",
          "Agree about the phrase: the model is then identical to one trained to reason, just with a longer reply.",
          "Partly: asking for steps can help an ordinary model, but a reasoning model is trained to work first, and printed steps are text to check, not proof of the internal process.",
          "Disagree: asking for steps never helps, and only reasoning models are able to write out working.",
        ]}
        correct={2}
        wrongFeedback={[
          "Written steps do not have to match what drove the answer. They are worth reading, but verify the result itself.",
          "A prompt changes the context, not the training. A model trained to work first has learned how to use that working, which a longer reply alone does not give.",
          "",
          "Asking for steps often does help an ordinary model, so “never” goes too far. The point is that it is not the same as a model trained to reason.",
        ]}
        explanation="Step prompting can help any model, reasoning models are trained to work before answering, and shown steps are text you check rather than a verified record."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Reasoning models are trained to work through a problem before they
            answer, which helps on multi-step tasks and costs time and money.
            Asking for steps is not the same thing, and the steps you see are
            text, not a verified record. Check the result.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-04">
          Review: From base model to assistant →
        </Link>
      </section>
    </LessonFrame>
  );
}

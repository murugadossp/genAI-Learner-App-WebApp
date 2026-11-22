import Image from "next/image";
import Link from "next/link";
import selfSupervisedTarget from "./images/self-supervised-target.webp";
import twoHidingTasks from "./images/two-hiding-tasks.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { HideAndGuessLab } from "./HideAndGuessLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="05"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Self-supervised learning"
      lead="People do not hand-label billions of sentences to train a language model. In self-supervised learning, the training setup derives targets from raw data itself—for example, by hiding part of a sentence and checking predictions against the hidden piece."
    >
      <section id="no-hand-labels">
        <h2 tabIndex={-1}>Why people do not label every sentence.</h2>
        <p>
          In <strong>supervised learning</strong> (Lesson 4.1), each training
          example comes with an outside answer—a <strong>target</strong>{" "}
          attached by people or an external record, such as tagging an email as
          “Spam” or “Not spam.” Hand-labelling billions of web pages that way
          would be far too slow and costly.
        </p>
        <p>
          <strong>Self-supervised learning</strong> solves that bottleneck by
          starting with <strong>unlabelled data</strong>—plain text, images, or
          audio with no outside tags attached—and deriving the{" "}
          <strong>target</strong> automatically from the data itself. A common
          way to do this with text is to hide one piece of a sentence and ask
          the model to predict what was hidden.
        </p>
        <p>
          Think of studying with a sticky note: you cover one word in a sentence
          you already have, try to guess it, and lift the sticky note to check.
          The sentence itself is the answer key.
        </p>
        <div className={styles.example}>
          <strong>Running example: a plain recipe sentence</strong>
          <p>
            Start with one unlabelled sentence: “Simmer the soup until the
            carrots feel soft.” Hide “carrots” to make the input (“Simmer the
            soup until the [____] feel soft.”) and keep “carrots” as the target
            to check the model’s guess.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={selfSupervisedTarget}
            alt="Diagram titled Self-supervised learning: raw unlabelled text 'Simmer the soup until the carrots feel soft.' splits into two paths—an Input 'Simmer the soup until the [____] feel soft.' sent to Model guesses ('potatoes') and a Target ('carrots') taken directly from the text—both meeting at Compare & adjust. Bottom cards show the sticky-note Analogy and three Key takeaways."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The hidden word comes straight from the raw sentence and goes to the
            comparison step, where checking the guess against the target guides
            training.
          </figcaption>
        </figure>
        <p>
          In this lesson, you will compare two common ways to hide text—
          <strong>fill-in-the-blank (masked) prediction</strong> and{" "}
          <strong>next-word prediction</strong>—try hiding words yourself, look
          at what self-supervised learning can and cannot guarantee, and check
          your understanding.
        </p>
      </section>

      <section id="two-hiding-tasks">
        <h2 tabIndex={-1}>Two ways to hide text and make targets.</h2>
        <p>
          Where the target comes from stays the same—it is carved out of the raw
          text itself—but different hiding rules change what context the model
          gets to see. Real language models usually work on{" "}
          <strong>tokens</strong> (words or word pieces, as in Lesson 2.2); we
          use whole words here to keep the examples easy to read.
        </p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <h3>1. Fill in the blank (masked prediction)</h3>
            <p>
              Hide a word in a sentence and let the model read the surrounding
              words—on <strong>both sides</strong> whenever words appear before
              and after the blank (or the available side at sentence edges).
            </p>
            <p className="micro">
              <strong>Recipe example:</strong> Input “Simmer the soup until the
              [____] feel soft.” → Target: “carrots”.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Reading a smudged weather note
              (“Bring a warm [____] for the mountain hike.”) and using the words
              before and after to guess “jacket”.
            </p>
          </div>
          <div className={styles.compareCard}>
            <h3>2. Predict the next word</h3>
            <p>
              Show only the <strong>earlier words</strong> and hide the very
              next word—the same next-token task you met in Lesson 2.2.
            </p>
            <p className="micro">
              <strong>Recipe example:</strong> Input “Simmer the soup until the”
              → Target: “carrots”.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Reading a story one line at a
              time and guessing the next word before turning the page.
            </p>
          </div>
        </div>
        <p>
          Notice how much training material a single sentence can supply. In an
          eight-word sentence, next-word prediction can create seven sequential
          input-and-target pairs (one for each word after the first), all
          without a human labelling a single example.
        </p>
        <figure className={styles.figure}>
          <Image
            src={twoHidingTasks}
            alt="Diagram titled Two ways to hide text: top row Fill in the blank shows 'Simmer the soup until the [____] feel soft.' tagged Before & after pointing to Target 'carrots'; bottom row Predict next word shows 'Simmer the soup until the' tagged Earlier words only pointing to Target 'carrots'. Bottom cards show an open-book Analogy and three Key takeaways."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            In this example, fill-in-the-blank gives context on both sides,
            while next-word prediction hides everything after the current
            position. Both take their target from the sentence itself.
          </figcaption>
        </figure>
        <p>
          The same idea works beyond text too: vision models can hide patches of
          an image and predict the missing region, and audio models can hide
          short slices of speech. In each case, the raw data supplies its own
          target.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>
          Hide a word and see how data makes its own target.
        </h2>
        <p>
          Remember the sticky-note analogy: hiding a word turns a plain sentence
          into an input and a target automatically. Try both hiding modes below
          and see how visible context changes what seems plausible.
        </p>
        <ol className={styles.steps}>
          <li>
            Start on <strong>Soup recipe</strong> in{" "}
            <strong>Fill in the blank</strong> mode, with “carrots” hidden, and
            pick <strong>potatoes</strong> to see what happens when a sensible
            guess differs from the sentence’s exact target.
          </li>
          <li>
            Switch to <strong>Predict next word</strong> and notice that “feel
            soft.” disappears from the model’s input.
          </li>
          <li>
            Click another highlighted word—or choose{" "}
            <strong>Weather note</strong>—to see a new target created
            automatically from the sentence.
          </li>
          <li>
            Click <strong>Reset lab</strong> to return to the starting setup.
          </li>
        </ol>
        <HideAndGuessLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What self-supervised learning can and cannot do.</h2>
        <p>
          Because raw text supplies its own targets, self-supervised pretraining
          scales to vast datasets. That helps a model pick up grammar, common
          phrasing, and broad patterns across many topics.
        </p>
        <p>
          Still, self-supervised learning has real limits. Predicting hidden
          text teaches patterns in the training data, not guaranteed truth—if
          the source text contains mistakes, outdated facts, or bias, those
          words become targets too.
        </p>
        <p>
          It also does not remove people from building an AI system. Teams still
          collect, clean, and filter training data, choose the hiding task, and
          often add later training steps—such as human-written examples or
          preference feedback—so a chat assistant follows instructions helpfully
          and safely.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does self-supervised learning mean zero human effort?
            </strong>
            <p>
              No. It removes the need for people to hand-label every pretraining
              example, not the human work of curating data, filtering
              low-quality text, and tuning models for specific tasks later.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              How is self-supervised learning different from unsupervised
              learning?
            </strong>
            <p>
              In clustering (Lesson 4.4), there is no target answer to predict—a
              system groups similar items. Self-supervised learning does predict
              a target, except the target is derived from the raw data itself.
              In everyday speech, people sometimes still group it under
              unsupervised learning because no outside labels are provided.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If “potatoes” misses the target “carrots”, does the model learn
              that “potatoes” is wrong?
            </strong>
            <p>
              On this single sentence, the target is “carrots”, so training
              nudges the model toward “carrots” for this example. That does not
              rule out “potatoes” permanently: other training examples can
              supply “potatoes” or “noodles” as targets in similar soup
              contexts.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A weather archive holds millions of daily forecast notes with no category tags attached. A researcher wants to pretrain a model on these notes using self-supervised learning. Which training setup matches self-supervised learning?"
        options={[
          "Group similar forecast notes into clusters without predicting any target, because any method without human tags is self-supervised.",
          "Mask one word in each forecast note and check the model’s prediction against the masked word from that same note.",
          "Ask meteorologists to tag each forecast note as “storm” or “clear” first, then let the model train automatically on those tags.",
          "Let the model read the forecast notes and automatically check which forecasts turned out to be factually accurate.",
        ]}
        correct={1}
        explanation="In self-supervised learning, the training setup derives its own targets directly from the unlabelled data—here, using the masked word from each forecast note as the answer key."
        wrongFeedback={[
          "Skipping human tags alone is not enough: grouping notes without predicting a target is clustering (Lesson 4.4), whereas self-supervised learning derives a target to predict.",
          "",
          "When meteorologists attach outside category tags like “storm” or “clear,” that is supervised learning (Lesson 4.1)—even if the training loop runs automatically afterward.",
          "Self-supervised learning checks predictions against the raw text itself, not against real-world weather outcomes or factual truth.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Data can supply its own targets.</strong> In{" "}
            <strong>self-supervised learning</strong>, the training setup
            derives targets automatically from unlabelled data—such as hiding a
            word in a sentence and checking the model’s guess against it. That
            lets models learn broad patterns at huge scale without people
            hand-labelling every example, though humans still curate the data
            and predicting text does not guarantee truth.
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

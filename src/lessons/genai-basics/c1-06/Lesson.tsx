import Image from "next/image";
import unverified from "./assets/unverified.jpg";
import reword from "./assets/reword.jpg";
import checkSource from "./assets/check-source.jpg";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { Grid } from "./Grid";
import { RateLab } from "./RateLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="06"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="What AI is good and bad at"
      lead="An AI assistant can sound sure of itself whether or not it is right. This lesson gives you two questions to ask before you rely on an answer."
    >
      <section id="fluent">
        <h2 tabIndex={-1}>Fluent is not the same as correct.</h2>
        <p>
          A confident speaker can sound sure whether or not they know the
          answer. An AI assistant can do the same: its reply can read smoothly
          and still be wrong.
        </p>
        <p>
          The reason is how the text is made. A model writes plausible-sounding
          text, and smooth wording is not a check that the content is true.
        </p>
        <div className={styles.example}>
          <strong>An invented example</strong>
          <p>
            Someone asks about the “Elm Lane Bakery”, a bakery made up for this
            lesson. Here are two possible replies.
          </p>
          <ul className={styles.replies}>
            <li className={styles.reply}>
              <strong>Reply A</strong>
              <p>“The Elm Lane Bakery opened in 1987.”</p>
            </li>
            <li className={styles.reply}>
              <strong>Reply B</strong>
              <p>“I don’t know when the Elm Lane Bakery opened.”</p>
            </li>
          </ul>
          <p className="micro">
            Neither reply is from a real model. Neither one’s style shows
            whether its claim is supported. Only a check against something
            reliable can do that.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={unverified}
            alt="The invented AI reply ‘Opened in 1987’ is marked Unverified with a question mark."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Reply A sounds sure, but its invented claim is unverified: we have
            not checked it against a reliable source.
          </figcaption>
        </figure>
        <p>
          This lesson covers, in order: where AI can often help, where it tends
          to slip, then two questions: how much a wrong answer would matter, and
          whether you can check it. Their names are <strong>stakes</strong> and{" "}
          <strong>checkability</strong>. Together they give a{" "}
          <strong>check level</strong>.
        </p>
        <div className={styles.example}>
          <strong>Running example: Sam</strong>
          <p>
            Sam is an invented person who uses a chat assistant for everyday
            jobs. You will rate six of her tasks.
          </p>
        </div>
      </section>
      <section id="strengths">
        <h2 tabIndex={-1}>Where AI can often help.</h2>
        <p>
          Assistants can often help with rewording, drafting, brainstorming and
          explaining common ideas. These are examples, not guarantees.
        </p>
        <p>
          A text you supply, such as a message or an article, also gives you
          something to compare the result with.
        </p>
        <p>
          For example, Sam asks an assistant to reword “The meeting starts at
          three.” Its draft says “The meeting begins at three.” Sam compares
          both texts: if the draft changed the time, she would need to correct
          it.
        </p>
        <figure className={styles.figure}>
          <Image
            src={reword}
            alt="Original text leads to a Reworded draft; a person holds both pages to Compare them."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Sam compares the reworded draft with the original text to see
            whether the meaning stayed the same.
          </figcaption>
        </figure>
        <p className="micro">
          Even in these jobs an assistant can slip, so a quick look is still
          worth it.
        </p>
      </section>
      <section id="weak-spots">
        <h2 tabIndex={-1}>Where AI tends to slip.</h2>
        <p>Three cases where slips tend to be more likely:</p>
        <ul>
          <li>
            <strong>Unfamiliar or rare cases.</strong> A little-known place or
            person may be a case it handles badly.
          </li>
          <li>
            <strong>Exact details.</strong> Word-for-word quotes, page numbers,
            dates and citations are easy to get slightly wrong or make up.
          </li>
          <li>
            <strong>Information it has not been given or cannot reach.</strong>{" "}
            It cannot reliably know specific facts that are missing from its
            training, from your conversation and from any sources it can access.
          </li>
        </ul>
        <p>
          If Sam asks when the invented Elm Lane Bakery opened, an exact year in
          the reply is still a claim. She can compare it with a reliable source
          if one is available; otherwise it remains unconfirmed.
        </p>
        <figure className={styles.figure}>
          <Image
            src={checkSource}
            alt="An Exact date on a page points to Check source, shown as a book and magnifying glass."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Check an exact date against a reliable source when one is available.
          </figcaption>
        </figure>
        <p className="micro">
          These are tendencies, not rules. Chapter 2 explains why models make
          things up and what a knowledge cutoff is.
        </p>
      </section>
      <section id="stakes">
        <h2 tabIndex={-1}>Question 1: how much would a wrong answer matter?</h2>
        <p>
          <strong>Stakes</strong> are how significant a wrong answer would be in
          this situation.
        </p>
        <ul>
          <li>
            <strong>Low:</strong> a small, easily fixed problem, such as a
            clumsy phrase or an average coffee.
          </li>
          <li>
            <strong>High:</strong> a serious cost, such as a lost place, a lot
            of money, or harm to health or safety.
          </li>
        </ul>
        <Grid focus="stakes" />
        <p className="micro">
          Real cases sit between these two. The lesson uses two groups to keep
          it simple.
        </p>
      </section>
      <section id="checkable">
        <h2 tabIndex={-1}>Question 2: can you check it?</h2>
        <p>
          <strong>Checkability</strong> is whether a straightforward, reliable
          check is available to you in this situation.
        </p>
        <ul>
          <li>
            <strong>Easy:</strong> something reliable is in front of you to
            compare with, or you can judge the result against your own wish
            right away.
          </li>
          <li>
            <strong>Hard:</strong> nothing reliable is available to compare
            with.
          </li>
        </ul>
        <Grid focus="checkable" />
        <div className={styles.example}>
          <strong>In Sam’s week</strong>
          <p>
            A reworded text is easy to check: Sam reads it. Five quotes from a
            book she cannot get are hard: she has nothing to compare them with.
          </p>
        </div>
      </section>
      <section id="levels">
        <h2 tabIndex={-1}>Put the two answers together.</h2>
        <Grid focus="levels" />
        <p>
          The two answers give a <strong>check level</strong>. No cell says
          “trust it with no checking”.
        </p>
        <p className="micro">
          Where a check is possible, do it. Where none exists, the level says
          what to do instead.
        </p>
      </section>
      <section id="rate">
        <h2 tabIndex={-1}>Rate six of Sam’s tasks.</h2>
        <RateLab />
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Where this picture is too tidy.</h2>
        <ul>
          <li>
            Stakes and checkability are scales. The lesson cuts each into two
            groups.
          </li>
          <li>
            The same task can move: with a reliable source in hand, a hard check
            becomes easy.
          </li>
          <li>
            An assistant’s confident tone is not a reliable signal that it is
            right.
          </li>
          <li>
            Protecting private information and who is responsible for the
            outcome belong to the next lesson.
          </li>
        </ul>
      </section>
      <Check
        id="check"
        question="Sam’s assistant gives a smooth, confident answer with an exact date for a small local fair. She finds nothing else about it online. She is about to pay a substantial amount for a trip that cannot be refunded, and the organisers have an official contact page. What should Sam do?"
        options={[
          "Trust the date: the answer is fluent and gives an exact date.",
          "Trust the date: small local events are easy for an AI to know about.",
          "Treat the date as unconfirmed and check with the organisers before paying.",
          "Ask the assistant “are you sure?” and trust the date if it says yes.",
        ]}
        correct={2}
        wrongFeedback={[
          "Smooth wording and an exact date do not show the date is supported. Exact details about little-known things are where slips tend to happen, and the trip cannot be refunded.",
          "The size of an event gives no reason to trust the date. Without a check, it stays unconfirmed, and the cost of being wrong is high.",
          "",
          "Another reply from the same assistant is not an independent check. It may repeat the same date or simply agree. Sam needs something reliable outside the assistant.",
        ]}
        explanation="The stakes are high, because the trip would cost Sam a substantial amount that she cannot get back. A check is available: the organisers can be asked through their official contact page. So Sam should contact the organisers and confirm the date before paying."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Fluent does not mean correct. Before relying on an answer, ask how
            much a wrong answer would matter and whether you can check it. Where
            the stakes are high, check against something reliable. If no check
            is possible, do not rely on the AI alone.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

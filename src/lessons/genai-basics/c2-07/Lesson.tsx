import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { BlankLab } from "./BlankLab";
import { SpotLab } from "./SpotLab";
import styles from "./lesson.module.css";
export default function Lesson() {
  return (
    <LessonFrame
      number="07"
      title="Why models make things up"
      lead="An assistant can state a wrong detail in the same smooth voice it uses for a right one. Why does that happen, and what actually helps?"
    >
      <section id="idea">
        <h2 tabIndex={-1}>A fluent sentence is not a checked sentence.</h2>
        <p>
          Earlier you saw that a model builds text one token at a time by
          choosing from likely continuations. Nothing in that process is a
          fact-checking step. When the training text covered a topic well, the
          likely continuation is often the right one. When it did not, the model
          still continues, because continuing is its job.
        </p>
        <p>
          People call the result <strong>hallucination</strong> or{" "}
          <strong>fabrication</strong>: a statement that reads as plausible but
          is not supported by the evidence. Throughout this lesson we use one
          invented place, the Lantern Bay Library, so that no real fact is at
          stake and you can check every claim against a short notice.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> how confident an answer sounds and how well
          supported it is are two different things.
        </div>
      </section>
      <section id="blank">
        <h2 tabIndex={-1}>Fill the blank, with or without evidence.</h2>
        <p>
          Ask a toy model when the Lantern Bay Library opened. Change how much
          its training text says about the library, and compare the sentence you
          would read.
        </p>
        <BlankLab />
      </section>
      <section id="mechanism">
        <h2 tabIndex={-1}>Why the wording never warns you.</h2>
        <p>Follow the library question through four steps.</p>
        <ol className={styles.flow}>
          <li>
            <strong>1. Pattern</strong>
            “opened in …” is followed by a year. The model has seen that shape
            countless times.
          </li>
          <li>
            <strong>2. Candidates</strong>
            Several years get scores. In the toy these are close together when
            evidence is thin; in a real model they may not be.
          </li>
          <li>
            <strong>3. Choice</strong>
            One year is picked. A different pick would be just as well formed.
          </li>
          <li>
            <strong>4. Sentence</strong>
            The year is written into a complete sentence. Nothing in the text
            records how weak the evidence was.
          </li>
        </ol>
        <p>
          Be careful with that toy detail: the flat scores in the lab are an
          invented assumption. A real model can give an unsupported answer a
          high score too, so a model being “sure” internally does not prove the
          claim is supported.
        </p>
        <p>
          This is why errors tend to be specific, such as dates, names, numbers,
          quotations and citations: these are slots whose <em>form</em> is easy
          to fill even when the <em>content</em> is not known. Other causes also
          matter, including gaps or errors in the training data, rare topics,
          and questions that contain a false assumption.
        </p>
        <p>
          Assistant tuning can teach a model to say “I am not sure” or to
          decline, and that helps. It is imperfect, so a model can still answer
          confidently where it should not, and can sometimes hedge on things it
          has right. Internal probabilities may carry some signal about
          uncertainty, but the words in a normal chat reply do not reliably
          expose it.
        </p>
      </section>
      <section id="spot">
        <h2 tabIndex={-1}>Spot the invented claim.</h2>
        <p>
          Now play the checker. Below are two scripted answers about the same
          library. Compare every claim with the notice and mark whether it
          matches, goes beyond it, or contradicts it. Then check your marks.
        </p>
        <SpotLab />
      </section>
      <section id="grounding">
        <h2 tabIndex={-1}>What grounding helps with, and what it does not.</h2>
        <p>
          <strong>Grounding</strong> means giving the model trustworthy material
          to work from, such as a pasted document or text retrieved by the app,
          and asking it to answer from that material. In the lab, Answer B was
          deliberately written to show the typical benefit: a notice in the
          request, in the context window you studied in the last lesson, gives
          the model something to stay close to. The two answers are scripted, so
          they illustrate the idea rather than prove how often it works.
        </p>
        <p>
          Grounding reduces unsupported answers, but it does not remove them.
          Answer B still changed a day of the week and added a flourish. In real
          systems, remaining problems include:
        </p>
        <ul>
          <li>paraphrasing a detail slightly wrong while summarising,</li>
          <li>mixing in remembered patterns that the source does not state,</li>
          <li>
            the app retrieving a passage that is irrelevant, outdated or itself
            wrong, which the model then repeats faithfully.
          </li>
        </ul>
        <div className="callout">
          <strong>Habit:</strong> for anything that matters, find the claim in a
          source you trust. Ask for quotes or links, then open them, because a
          citation can be invented too. Be most careful with precise details.
        </div>
      </section>
      <Check
        id="check"
        question="An assistant states, in clear and certain language, the exact date a small local library opened. What can you conclude from how it was worded?"
        options={[
          "The date is probably right, because a model without the fact would always say so.",
          "The date was looked up in a stored copy of the training documents, so it has been checked.",
          "Nothing reliable about accuracy: fluent wording is produced whether or not the date was well supported, so verify it against a trustworthy source.",
          "If a source document is included in the request, the date is guaranteed to be correct.",
        ]}
        correct={2}
        wrongFeedback={[
          "Tuning can make a model more willing to admit uncertainty, but it is not reliable. In the lab, the “nothing at all” case still produced a polished sentence.",
          "A standard model does not search a stored copy of its training documents when answering. It generates text from learned weights.",
          "",
          "A source in the request helps a lot, but the model can still misquote it or add details, as Answer B did. Check important claims against the source.",
        ]}
        explanation="Models produce fluent text whether or not a claim is supported. Grounding in a good source helps, but the safe habit is to verify important details."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            A model completes patterns; it does not check facts. Confident
            wording is not evidence, specific details are the riskiest part, and
            a good source in the request helps without making the answer
            automatically right. Verify what matters.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-02">
          Review: How a model predicts the next token →
        </Link>
      </section>
    </LessonFrame>
  );
}

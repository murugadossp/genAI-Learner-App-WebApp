import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { SamplingLab } from "./SamplingLab";
export default function Lesson() {
  return (
    <LessonFrame
      number="09"
      title="Temperature and sampling"
      lead="Ask the same question twice and you can get two different answers. A setting called temperature controls how much room the model gives to its less likely choices. It does not control whether the answer is right."
    >
      <section id="spread">
        <h2 tabIndex={-1}>The model scores choices; sampling picks one.</h2>
        <p>
          At each step, a language model produces a score for every possible
          next token, and those scores become a probability for each candidate,
          as in the lesson on predicting the next token. The model does not hand
          back one word. The application then has to <strong>choose</strong> a
          token from that spread, and that choice is called{" "}
          <strong>sampling</strong>.
        </p>
        <p>
          There are two simple ways to choose. <strong>Greedy</strong> decoding
          always takes the highest-probability token, so the same prompt tends
          to give the same text. <strong>Random sampling</strong> draws a token
          in proportion to its probability, so a 40 percent candidate is picked
          about four times in ten and a 2 percent candidate sometimes appears.
          Temperature is a dial between the two.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> temperature reshapes the spread of
          probabilities before a token is drawn. A lower value concentrates
          probability on the top choices, and a higher value flattens it. The
          model’s underlying scores are the same either way.
        </div>
      </section>
      <section id="lab">
        <h2 tabIndex={-1}>Turn the temperature dial.</h2>
        <p>
          Start with the story line and move the temperature from 0 to 2. Watch
          the bars and the twenty draws. Then switch to the factual prompt, drop
          the temperature to 0.2, and see which answer becomes nearly certain.
          Finally try the top-k and top-p options to see choices removed from
          the list.
        </p>
        <SamplingLab />
      </section>
      <section id="how">
        <h2 tabIndex={-1}>What the dial does to the scores.</h2>
        <ol>
          <li>
            <strong>Divide.</strong> Each candidate’s raw score is divided by
            the temperature. Below 1 this stretches the gaps between scores.
            Above 1 it shrinks them.
          </li>
          <li>
            <strong>Convert.</strong> A function called softmax turns the
            adjusted scores into probabilities that add up to 100 percent. The
            ranking never changes: the candidate with the top score stays on top
            at every temperature, and only the gaps change.
          </li>
          <li>
            <strong>Optionally trim.</strong> <em>Top-k</em> keeps only the k
            most likely candidates. <em>Top-p</em> (also called nucleus
            sampling) keeps the smallest group whose probabilities add up to p.
            The rest are dropped and the survivors are rescaled to add up to 100
            percent again.
          </li>
          <li>
            <strong>Draw.</strong> One token is picked at random using the
            remaining probabilities, then the process repeats for the next
            position.
          </li>
        </ol>
        <p>
          A temperature of exactly 0 cannot be divided by, so systems treat it
          as greedy decoding. In practice, low temperatures make output more
          consistent, though identical results on every run are often not
          guaranteed, because other details of how a service runs the model can
          differ. High temperatures give rarer tokens a real chance. Because
          each token is conditioned on the ones before it, one unlikely pick can
          send the rest of the text somewhere unusual, and an odd choice like
          “sandwich” in the lab is the kind that compounds.
        </p>
        <p>
          Which values are allowed, which defaults apply, and whether you can
          change these settings at all vary between providers and models, so
          read the documentation for the one you use.
        </p>
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Temperature is not a truth or safety setting.</h2>
        <p>
          The factual prompt in the lab shows the trap. When the model’s top
          choice is wrong, lowering the temperature makes it wrong more
          reliably. Raising the temperature gives the right answer more chances,
          but also gives poor ones more chances. Neither setting adds knowledge,
          which is why the previous lessons on making things up and on knowledge
          cutoffs point to sources and checks instead.
        </p>
        <ul>
          <li>
            <strong>Low is for consistency.</strong> Extraction, classification
            and formats that must be repeatable usually benefit, but the output
            can still be wrong, and wrong the same way each time.
          </li>
          <li>
            <strong>Higher is for variety.</strong> Brainstorming and creative
            drafts benefit from a wider spread. Very high values often produce
            incoherent text.
          </li>
          <li>
            <strong>Safety is separate.</strong> Temperature does not decide
            what a model is willing to say or whether an action is permitted.
            That comes from training and from the controls an application adds.
          </li>
        </ul>
        <div className="callout">
          <strong>Habit:</strong> choose temperature for the amount of variety
          you want, and verify facts by other means.
        </div>
      </section>
      <Check
        id="check"
        question="A team sets temperature to 0 for a question-answering feature because they want correct answers. What is the best description of what that achieves?"
        options={[
          "It guarantees that the answers are factually correct, since the model only uses what it knows best.",
          "It makes the model check its answers against reliable sources before replying.",
          "It makes the output more consistent by favouring the most likely token, but a likely answer can still be wrong, so they still need checks.",
          "It makes the model refuse to say anything unsafe, because low temperature removes risky options.",
        ]}
        correct={2}
        wrongFeedback={[
          "The top-scored token is the model’s most likely guess, not a verified fact. In the lab, the common mix-up became nearly certain at low temperature.",
          "Sampling happens after the model has produced its scores. Temperature does not trigger any lookup or checking step.",
          "",
          "Temperature only reshapes probabilities among candidates. What a model will or will not say comes from training and application controls, not from this dial.",
        ]}
        explanation="Temperature changes how the next-token choice is spread out, so low values are consistent and higher values are varied, but neither makes an answer true or safe."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Temperature divides the model’s scores to flatten or sharpen the
            spread of next-token choices, and top-k and top-p trim it before one
            token is drawn. Use lower values for consistency and higher values
            for variety. Neither one measures correctness, so check facts
            separately.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-02">
          Review: How a model predicts the next token →
        </Link>
      </section>
    </LessonFrame>
  );
}

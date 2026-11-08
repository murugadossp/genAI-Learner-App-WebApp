import Image from "next/image";
import Link from "next/link";
import styles from "./lesson.module.css";
import temperatureImg from "./images/temperature.png";
import topKImg from "./images/top-k.png";
import topPImg from "./images/top-p.png";
import pipelineImg from "./images/pipeline.png";
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
      <section id="settings">
        <h2 tabIndex={-1}>Three settings, three different jobs.</h2>
        <p>
          Picture the model’s next-token probabilities as a row of bars: the
          taller the bar, the more likely that token. Three common settings
          change how a token is picked from that row. One reshapes every bar,
          and the other two remove bars. The pictures are schematic, so the bars
          show the idea and are not real model data.
        </p>
        <h3>Temperature: reshape every bar</h3>
        <p>
          Think of a dial between cautious and adventurous. Turn it down and the
          tall bar gets taller while the short ones shrink, so the favourite
          wins almost every time. Turn it up and the bars even out, so underdogs
          get a real chance. Nothing is removed: at any setting above zero,
          every candidate keeps some probability, even if it is tiny.
        </p>
        <figure className={styles.figure}>
          <Image
            src={temperatureImg}
            alt="Three panels showing the same six probability bars. At low temperature one bar is very tall and the other five are tiny. At medium temperature the bars slope gently down from left to right. At high temperature all six bars are almost the same height."
            sizes="(min-width: 900px) 760px, 100vw"
          />
          <figcaption className="micro">
            Same candidates, three temperatures. Schematic, not real data.
          </figcaption>
        </figure>
        <h3>Top-k: keep a fixed number of candidates</h3>
        <p>
          Sort the candidates from most to least likely, keep the first{" "}
          <em>k</em>, drop the rest, and rescale the survivors so they add up to
          100 percent again. It cuts off the long tail of strange options.
          Because it counts by rank, k = 3 keeps three candidates even if the
          third is very unlikely, and even if the first is already close to
          certain.
        </p>
        <figure className={styles.figure}>
          <Image
            src={topKImg}
            alt="Eight probability bars sorted from tallest to shortest. The first three are solid and labelled kept. The last five are faded and labelled dropped. A dashed line between the third and fourth bars is tagged k equals 3."
            sizes="(min-width: 900px) 760px, 100vw"
          />
          <figcaption className="micro">
            Top-k with k = 3: the first three are kept, the rest are dropped.
            Schematic.
          </figcaption>
        </figure>
        <h3>Top-p: keep enough candidates to cover a share</h3>
        <p>
          Also called nucleus sampling. Start from the most likely candidate and
          keep adding candidates until their probabilities add up to at least{" "}
          <em>p</em>, for example 80 percent. Drop the rest and rescale. The
          number kept adapts to the situation: when the model is confident, a
          couple of candidates already cover 80 percent, and when it is unsure,
          many are needed. In the lab at temperature 1, an 80 percent top-p
          keeps 2 of 5 candidates for the factual prompt and 4 of 8 for the
          story line, while top-k with k = 3 keeps 3 either way.
        </p>
        <figure className={styles.figure}>
          <Image
            src={topPImg}
            alt="Eight probability bars sorted from tallest to shortest. A strip above fills from the left to a marker labelled 80 percent, reached after the fourth bar. The first four bars are solid and labelled kept. The last four are faded and labelled dropped, separated by a dashed line."
            sizes="(min-width: 900px) 760px, 100vw"
          />
          <figcaption className="micro">
            Top-p with p = 80%: bars are added until the running total reaches
            the target. Schematic.
          </figcaption>
        </figure>
        <div className="callout">
          <strong>Key idea:</strong> temperature changes how <em>big</em> each
          bar is. Top-k and top-p change <em>which</em> bars are allowed to be
          picked at all.
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
          send the rest of the text somewhere unusual. The lab draws single
          tokens, so it shows how a rare choice like “sandwich” becomes
          possible, not how it carries forward.
        </p>
        <p>
          Which values are allowed, which defaults apply, and whether you can
          change these settings at all vary between providers and models, so
          read the documentation for the one you use.
        </p>
      </section>
      <section id="mix">
        <h2 tabIndex={-1}>Real systems often mix them.</h2>
        <p>
          These settings are not alternatives you must pick between. Many
          libraries and APIs let you set temperature together with top-k, top-p,
          or both, and the steps then run one after another, roughly as in the
          picture: scores, then temperature, then the trims, then one random
          pick.
        </p>
        <figure className={styles.figure}>
          <Image
            src={pipelineImg}
            alt="A left-to-right pipeline of five cards joined by arrows: Scores, Temperature, Top-k, Top-p and Pick one. Each card shows a small bar chart. The temperature card flattens the bars, the top-k and top-p cards fade the right-hand bars, and the last card shows a die landing on one bar. A caption reads: Settings can be combined."
            sizes="(min-width: 900px) 760px, 100vw"
          />
          <figcaption className="micro">
            One possible pipeline. Real systems differ in which steps exist and
            in their order. Schematic.
          </figcaption>
        </figure>
        <ul>
          <li>
            <strong>Order matters.</strong> Top-p adds up probabilities, so
            applying temperature first changes how many candidates are needed to
            reach p: a lower temperature concentrates probability and keeps
            fewer. The lab applies temperature first and then the trim. That is
            a simplification, not any provider’s documented pipeline.
          </li>
          <li>
            <strong>Systems differ.</strong> Some offer top-p but not top-k, or
            the reverse. Defaults, allowed ranges and whether several settings
            can be used together vary, and some documentation suggests changing
            only one at a time because their effects overlap.
          </li>
          <li>
            <strong>Start simple.</strong> A reasonable habit is to change one
            dial, look at the output, and add a second only for a specific
            problem. For example, add a trim if rare odd words still slip in at
            a higher temperature.
          </li>
        </ul>
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Temperature is not a truth or safety setting.</h2>
        <p>
          The factual prompt in the lab shows the trap. When the model’s top
          choice is wrong, lowering the temperature makes it wrong more
          reliably. Raising it from near zero gives the right answer a real
          chance, but flattening also feeds the poorer choices: in this lab the
          chance of Canberra peaks around 0.8 to 1.0 and then slowly falls.
          Neither direction adds knowledge or reliably improves accuracy, which
          is why the previous lessons on making things up and on knowledge
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
          "It makes the model check its answers against reliable sources before it replies to the user.",
          "It makes the output more consistent by favouring the most likely token, but that answer can still be wrong.",
          "It makes the model refuse to say anything unsafe, because low temperature removes the risky options.",
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

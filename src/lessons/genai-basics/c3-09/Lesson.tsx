import Image from "next/image";
import leaderboardVsFit from "./assets/leaderboard-vs-fit.webp";
import tradeoffBalance from "./assets/tradeoff-balance.webp";
import hardLimitsFilter from "./assets/hard-limits-filter.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { MODEL_PROFILES } from "./models";
import { ScenarioMatcher } from "./ScenarioMatcher";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="09"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="Choosing the right model for a task"
      lead="The top-ranked model on a public scoreboard is not the right tool for every job. This lesson gives you five practical checks—and a two-step order—for picking a model that fits your own task."
    >
      <section id="leaderboard">
        <h2 tabIndex={-1}>Why “#1 on the leaderboard” is not enough.</h2>
        <p>
          A heavy delivery lorry can haul far more cargo than a bicycle. Even
          so, you would not drive a lorry to deliver one hot coffee three blocks
          away in rush-hour traffic.
        </p>
        <p>
          AI models work the same way. A <strong>leaderboard</strong> is a
          public scoreboard that ranks models on general test questions—not on
          your specific job, budget, waiting time, or data rules.
        </p>
        <p>
          A top-ranked model is often built for hard, open-ended problems, which
          tends to make it slower, pricier per request, or cloud-only. To pick
          well, check five factors in order:
        </p>
        <ul>
          <li>
            <strong>Capability:</strong> how reliably a model handles hard,
            multi-step, or nuanced tasks.
          </li>
          <li>
            <strong>Speed:</strong> how quickly a reply arrives.
          </li>
          <li>
            <strong>Cost:</strong> what it costs to run—especially when a task
            repeats hundreds or thousands of times.
          </li>
          <li>
            <strong>Context:</strong> the model’s{" "}
            <strong>context window</strong>
            —how much text it can hold in working memory in one request
            (including both your input and its reply).
          </li>
          <li>
            <strong>Privacy:</strong> where your text goes, and whether an
            external provider may store or train on it.
          </li>
        </ul>

        <figure className={styles.figure}>
          <Image
            src={leaderboardVsFit}
            alt="A #1 Leaderboard card labelled General tests connects by a right-pointing arrow labelled Check your task to a 5 Task Needs card showing Capability, Speed, Cost, Context, and Privacy. Bottom strip: Match the model to your task, not just a ranking."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A leaderboard measures general test performance. Choosing a model
            for your own work means checking all five task needs.
          </figcaption>
        </figure>

        <div className={styles.example}>
          <strong>Running example: Maya at Cedar Bookshop</strong>
          <p>
            Maya runs an invented neighbourhood bookstore called Cedar Bookshop.
            She chooses between four invented model profiles for her shop’s
            tasks—none of these are real commercial products or live prices.
          </p>
        </div>

        <div className={styles.profileGrid}>
          {MODEL_PROFILES.map((model) => (
            <div className={styles.profileCard} key={model.id}>
              <div className={styles.profileHead}>
                <h3>{model.name}</h3>
                <p className="micro">{model.tagline}</p>
              </div>
              <dl className={styles.profileSpecs}>
                <div>
                  <dt>Capability</dt>
                  <dd>{model.capability}</dd>
                </div>
                <div>
                  <dt>Speed</dt>
                  <dd>{model.speed}</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>{model.cost}</dd>
                </div>
                <div>
                  <dt>Context</dt>
                  <dd>{model.context}</dd>
                </div>
                <div>
                  <dt>Privacy</dt>
                  <dd>{model.privacy}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section id="capability-speed-cost">
        <h2 tabIndex={-1}>Capability, speed, and cost: the core trade-off.</h2>
        <p>
          More capable models typically do more computation for every reply. In
          practice, that tends to make them slower and more expensive per
          request than smaller, simpler models.
        </p>
        <p>
          That trade-off is why the same shop can need two very different
          models: one for high-volume routine jobs, and another for occasional
          hard thinking.
        </p>

        <div className={styles.example}>
          <strong>In Maya’s bookshop</strong>
          <p>
            <strong>Routine, high-volume:</strong> Cedar Bookshop’s website
            fixes typos in 5-word public searches thousands of times a day and
            must reply in under 1 second. Maya picks <strong>Quick-Lite</strong>
            —fast and cheap enough for high traffic.
          </p>
          <p>
            <strong>Hard, one-off:</strong> Maya needs one careful reply to a
            disputed supplier invoice with three conflicting discount rules, and
            a medium-capability model missed the conflict in a test. Waiting 15
            seconds is fine, so she picks <strong>Deep-Think</strong>.
          </p>
        </div>

        <figure className={styles.figure}>
          <Image
            src={tradeoffBalance}
            alt="Two left-to-right rows compare task trade-offs: Simple, high-volume points to Fast & Low-Cost with chip Quick-Lite; Complex, one-off points to High Capability with chip Deep-Think. Bottom strip: Start simple for routine work; save heavy models for hard tasks."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Routine, high-volume tasks usually favour speed and low cost;
            occasional complex tasks justify waiting longer for higher
            capability.
          </figcaption>
        </figure>

        <p>
          <strong>Outside the bookshop:</strong> A live typing-suggestion bar in
          a help centre needs speed and low cost, while planning a tricky
          multi-city travel schedule with strict rules benefits from higher
          capability.
        </p>
      </section>

      <section id="context-and-privacy">
        <h2 tabIndex={-1}>Context and privacy: the hard limits.</h2>
        <p>
          Some requirements are not trade-offs—they are{" "}
          <strong>hard limits</strong> that rule a model out before you even
          compare speed or price.
        </p>
        <p>
          If your input exceeds a model’s <strong>context window</strong>, the
          full material will not fit in one request. If a workplace or legal
          rule forbids sending sensitive records to external cloud servers, a
          cloud-only model is disqualified immediately.
        </p>

        <div className={styles.example}>
          <strong>In Maya’s bookshop</strong>
          <p>
            <strong>Length limit:</strong> Maya wants to spot every return-fee
            exception across a 200-page non-sensitive supplier packet in one
            request. Only <strong>Long-Read</strong> fits hundreds of pages at
            once.
          </p>
          <p>
            <strong>Privacy limit:</strong> Maya needs a summary of two pages of
            staff payroll and medical-leave notes, and shop policy forbids
            uploading staff records to external cloud services. Only{" "}
            <strong>Local-Safe</strong> keeps the text on-device.
          </p>
        </div>

        <figure className={styles.figure}>
          <Image
            src={hardLimitsFilter}
            alt="A three-step left-to-right pipeline: 1. Hard Limits with chips Privacy and Context points to 2. Trade-offs with chips Capability, Speed, and Cost, which points to Best Fit. Bottom strip: Check privacy and context before comparing speed or cost."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Apply hard limits first to rule out ineligible models, then compare
            capability, speed, and cost among the models that remain.
          </figcaption>
        </figure>

        <p>
          <strong>Outside the bookshop:</strong> Reviewing a 120-page commercial
          lease in one pass needs a large context window, while summarising
          confidential patient notes requires a setup allowed by privacy rules.
        </p>
      </section>

      <section id="how-to-pick">
        <h2 tabIndex={-1}>A two-step way to choose.</h2>
        <ol className={styles.stepsList}>
          <li>
            <strong>Filter hard limits first:</strong> Cross off any model that
            breaks your privacy rules or cannot hold your task’s context length.
          </li>
          <li>
            <strong>Balance trade-offs second:</strong> Among the remaining
            models, start with the simplest, fastest one that handles a few real
            examples from your own task well—and move up in capability only if
            it falls short.
          </li>
        </ol>

        <dl className={styles.quickList}>
          <div className={styles.quickItem}>
            <dt>Isn’t the #1 leaderboard model always the safest pick?</dt>
            <dd>
              No. A top general score does not guarantee the model meets your
              privacy rules, fits your document length, replies fast enough, or
              stays within budget on your actual task.
            </dd>
          </div>
          <div className={styles.quickItem}>
            <dt>Should I always pick the cheapest model?</dt>
            <dd>
              No. If a low-cost model makes frequent mistakes on a nuanced task,
              the time spent finding and fixing errors can cost more than using
              a stronger model.
            </dd>
          </div>
          <div className={styles.quickItem}>
            <dt>Can one workflow use more than one model?</dt>
            <dd>
              Yes. Many teams route simple steps (like sorting or tagging) to a
              fast, low-cost model and send only the hardest steps to a
              high-capability model.
            </dd>
          </div>
        </dl>
      </section>

      <section id="matcher">
        <h2 tabIndex={-1}>Try it: match six tasks to a model.</h2>
        <p>
          Use the two-step rule to pick the best-fitting invented model for each
          task below. Every task states the constraints you need.
        </p>
        <ScenarioMatcher />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where this guide is too tidy.</h2>
        <ul>
          <li>
            <strong>Models do not sit in four neat boxes.</strong> Real models
            span a wide range of sizes and strengths, and new releases shift
            these trade-offs regularly.
          </li>
          <li>
            <strong>Privacy is more than “local vs cloud”.</strong> Some hosted
            providers offer enterprise plans with zero-data-retention (the
            provider does not store your prompts after replying) or private
            hosting (servers reserved for one organisation) that satisfy
            specific policies, while on-device models still need careful
            hardware security and still cost money to buy and run.
          </li>
          <li>
            <strong>Big context windows have limits too.</strong> Fitting 200
            pages into a prompt does not guarantee a model will catch every
            detail buried in the middle; checking key facts still matters.
          </li>
          <li>
            <strong>Test on your own examples.</strong> Public leaderboards can
            help narrow a shortlist, but trying two or three candidates on a
            handful of your own real tasks is the most reliable check.
          </li>
          <li>
            <strong>Choosing a model comes after deciding to use AI.</strong>{" "}
            Whether a task should be handed to AI at all—based on stakes,
            checkability, and your own skill—is covered in Lesson 3.10.
          </li>
        </ul>
      </section>

      <Check
        id="check"
        question="A small legal aid office wants an AI tool to summarise two-page client intake notes. Office policy strictly forbids sending client details to external cloud servers. A colleague suggests using the #1 model on a public leaderboard, which is available only through an external cloud service. What should the office do?"
        options={[
          "Use the #1 leaderboard model anyway, because higher general test scores make cloud handling safer.",
          "Rule out the cloud-only model because it breaks the privacy rule, and test a local or policy-approved private model on sample notes.",
          "Pick the cheapest cloud model instead, since the notes are only two pages long.",
          "Switch to a long-context cloud model so all client notes can be processed in a single request.",
        ]}
        correct={1}
        wrongFeedback={[
          "A high leaderboard score measures performance on general test questions, not data privacy. It does not satisfy a policy that forbids sending client details to external cloud servers.",
          "",
          "Cost and context length only come in after a model passes your hard limits. A cheaper cloud model still sends client details to an external server, breaking the office policy.",
          "The notes are only two pages long, so context length is not the bottleneck—and a cloud-hosted model still violates the rule against sending client details to external servers.",
        ]}
        explanation="Privacy is a hard limit here. Because office policy forbids sending client details to external cloud servers, any cloud-only model is ruled out first—even the #1 model on a public leaderboard. The office should choose a local or policy-approved private model and test it on sample notes."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            The #1 model on a public leaderboard is not automatically the right
            model for your task. Filter out models that fail your hard
            limits—privacy and context size—first, then balance capability,
            speed, and cost on a few real examples from your own work.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

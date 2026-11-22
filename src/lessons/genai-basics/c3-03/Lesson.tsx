import Image from "next/image";
import systemVsUserImage from "./assets/system-vs-user.webp";
import roleLimitsImage from "./assets/role-steering-limits.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { InstructionLab } from "./InstructionLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      title="System instructions and roles"
      lead="You can shape how an AI assistant replies before a user even asks a question. System instructions set standing rules and roles guide perspective — but neither guarantees what the model will do."
    >
      <section id="why-instructions">
        <h2 tabIndex={-1}>Standing rules before the question.</h2>
        <p>
          A common assumption is that telling an AI “you are an expert” makes
          its answers expert-level, or that a strict rule in the setup locks its
          behaviour down. Neither is true.
        </p>
        <p>
          In this lesson you meet four ideas, in order: the{" "}
          <strong>system instruction</strong>, the <strong>user message</strong>
          , the <strong>role</strong>, and why all of them are{" "}
          <strong>soft steering</strong> rather than hard guarantees.
        </p>
        <div className={styles.example}>
          <strong>Running example: Harbor Bike Shop</strong>
          <p>
            Harbor Bike Shop is an invented neighborhood shop with a chat
            assistant called Harbor Helper. It has no live price list and cannot
            see a customer’s bike. It is not a real product.
          </p>
        </div>
      </section>

      <section id="system-instructions">
        <h2 tabIndex={-1}>System instructions set the standing rules.</h2>
        <p>
          Think of a briefing card taped beside a shop’s help desk. Before any
          customer walks in, the card lists standing rules for how to respond,
          while each customer’s question is a separate note handed across the
          counter.
        </p>
        <p className="micro">
          The analogy has limits. A language model is not a human clerk who
          understands safety or keeps promises.
        </p>
        <p>
          In an AI app, that briefing card is the{" "}
          <strong>system instruction</strong> (sometimes called a system prompt
          or custom instructions). Each question someone types is the{" "}
          <strong>user message</strong>.
        </p>
        <p>
          Behind the scenes, the app sends the system instruction ahead of the
          user message as input text. Many chat models are trained to give
          system instructions higher priority than user messages, yet both still
          work by steering which words the model predicts next.
        </p>
        <div className={styles.example}>
          <strong>In Harbor Bike Shop</strong>
          <p>
            Harbor Helper’s system instruction says: “Reply in 3 short steps.
            Never guess repair prices.” When a rider sends the user message “My
            chain slipped off while riding to work. What should I do?”, both
            pieces enter the model together.
          </p>
        </div>
        <p>
          Outside a bike shop, you see the same setup in everyday chat apps: for
          example, setting custom instructions so a study assistant explains
          ideas in plain words and ends with one short review question.
        </p>
        <figure className={styles.figure}>
          <Image
            src={systemVsUserImage}
            alt="Diagram titled System Instruction vs. User Message: System instruction (3 short steps, No price guesses) and User message (My chain slipped off) both flow right into the Language model, which outputs a Steered reply (Step 1, Step 2, Step 3). Bottom note: Sent ahead of each message to steer replies — not a guarantee."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            In a typical chat setup, the app sends the system instruction ahead
            of each user message; both enter the model as input text.
          </figcaption>
        </figure>
      </section>

      <section id="roles">
        <h2 tabIndex={-1}>Roles guide perspective, not expertise.</h2>
        <p>
          A <strong>role</strong> is a short framing line — often placed at the
          start of a system instruction — such as “You are a friendly bike
          mechanic.”
        </p>
        <p>
          Roles steer <strong>how</strong> a reply is framed: its tone,
          vocabulary, format, and which details it highlights. Compare two roles
          on the same slipped-chain question:
        </p>
        <ul className={styles.compareGrid}>
          <li className={styles.compareCard}>
            <h3>Friendly bike mechanic</h3>
            <p className={styles.roleQuote}>
              “You are a friendly bike mechanic. Use plain words.”
            </p>
            <p>
              Focuses on practical, hands-on steps: stop safely, rest the bike
              upright, hook the chain back onto the gear ring, and keep fingers
              and cloth clear while slowly turning the pedals to test it.
            </p>
          </li>
          <li className={styles.compareCard}>
            <h3>Cautious cycling safety coach</h3>
            <p className={styles.roleQuote}>
              “You are a cautious cycling safety coach. Put roadside safety
              first.”
            </p>
            <p>
              Focuses on moving out of traffic, keeping hands clear of moving
              gears, and checking brakes before riding again.
            </p>
          </li>
        </ul>
        <p>
          Notice what a role does <em>not</em> add. Writing “You are a master
          bicycle engineer with 30 years of experience” does not add new
          training, connect the model to Harbor Bike Shop’s price list, or turn
          it into a real expert.
        </p>
        <p>
          The same limit applies outside bike repair. Telling a chat model “You
          are a board-certified doctor” may make its reply sound more clinical
          and organized, but it does not give the model medical training or make
          its health advice reliable.
        </p>
        <figure className={styles.figure}>
          <Image
            src={roleLimitsImage}
            alt="Comparison diagram titled What a Role Does: a green Can shift card lists Tone, Focus, and Format; a red Does not add card lists New training, Live prices, and Hard guarantees. Bottom note: A role steers how a reply is framed — not new training or live data."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A role can shift tone, focus, and format, but it cannot supply new
            training, live data, or hard guarantees.
          </figcaption>
        </figure>
      </section>

      <section id="try-it">
        <h2 tabIndex={-1}>Same question, different instructions.</h2>
        <p>
          Test how Harbor Helper’s reply changes when you swap the system
          instruction or send a message that pushes against the rules.
        </p>
        <ol className={styles.tryList}>
          <li>
            Keep <strong>Normal question</strong> selected and switch between{" "}
            <strong>No shop instruction</strong>,{" "}
            <strong>Mechanic role + rules</strong>, and{" "}
            <strong>Safety coach role + rules</strong> to see tone and focus
            shift.
          </li>
          <li>
            With a system instruction active, switch to{" "}
            <strong>Rule-pushing message</strong> to see how soft steering can
            slip under a conflicting request.
          </li>
          <li>
            Use <strong>Reset</strong> to return to the unsteered starting
            point.
          </li>
        </ol>
        <InstructionLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Why instructions steer rather than guarantee.</h2>
        <p>
          System instructions are <strong>soft steering</strong>. They nudge
          next-word predictions strongly in typical chats, so they help most of
          the time — but they are not hard code locks.
        </p>
        <p>Three common situations can make a standing rule slip:</p>
        <ul>
          <li>
            <strong>Conflicting user messages.</strong> A user may ask the model
            to ignore earlier rules or push hard for forbidden details. Even
            when models are trained to prioritize system instructions, that
            priority can still fail.
          </li>
          <li>
            <strong>Crowded instructions.</strong> Packing dozens of rules into
            one system prompt makes it more likely that a detail — such as a
            3-step limit — gets dropped.
          </li>
          <li>
            <strong>Missing facts.</strong> Telling a model “Never guess repair
            prices” does not give it a real price list. Without real data or a
            check, it can still produce a plausible-looking number.
          </li>
        </ul>
        <p>
          When a rule must hold every time — such as hiding unverified prices or
          looking up real shop rates — the guarantee comes from ordinary app
          code and real data around the model, not from wording alone.
        </p>
        <h3>Quick questions</h3>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does a bigger title (“world-class expert”) make facts more
              accurate?
            </strong>
            <p>
              No. A role can guide framing and tone, which may help organize a
              reply, but it adds no new training or live facts.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If I put a rule in the system instruction, can I skip checking the
              reply?
            </strong>
            <p>
              No. Treat system instructions as helpful guidance, and still check
              important outputs or enforce strict rules in app code.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Where do everyday users set system instructions?</strong>
            <p>
              In many chat tools they appear as “custom instructions” or project
              instructions; in custom apps, developers set them behind the
              scenes.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        question="Harbor Bike Shop gives its chat assistant this system instruction: “You are a master bicycle mechanic with 20 years of experience. Always keep replies to three steps and never guess repair prices.” The assistant is not connected to the shop’s price list. A customer asks how much a chain repair costs, and the assistant replies with four steps and guesses “$20”. What does this show?"
        options={[
          "The system instruction never reached the model, because a working system instruction cannot be broken.",
          "The role needs a stronger title, such as “lead bicycle engineer”, so the model gains real pricing knowledge.",
          "System instructions and roles steer replies, but they do not guarantee rules are followed or supply missing shop prices.",
          "The customer’s question retrained the model to ignore the shop’s rules from now on.",
        ]}
        correct={2}
        wrongFeedback={[
          "System instructions are soft steering, not unbreakable locks. Even when the model receives them, it can still slip on length or guess a price.",
          "Changing the title only shifts framing and tone. A role cannot connect the model to a price list or add new factual training.",
          "",
          "A customer’s chat message does not retrain a model. The reply slipped during this turn because instructions steer predictions rather than enforcing hard rules.",
        ]}
        explanation="The assistant broke the three-step rule and guessed a repair price it did not have. That shows system instructions and roles steer how a reply is framed, but they do not guarantee compliance or add missing shop data."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Use a system instruction to set standing rules and a role to guide
            tone and perspective. Remember that both are soft steering: neither
            turns a model into a real expert, supplies missing facts, or
            guarantees every rule will hold. When a rule cannot fail, back it up
            with real data and checks around the model.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

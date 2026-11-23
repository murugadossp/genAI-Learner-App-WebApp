import Image from "next/image";
import Link from "next/link";
import ruleChainingImg from "./images/rule-chaining.webp";
import knowledgeGraphImg from "./images/knowledge-graph.webp";
import hybridSystemImg from "./images/hybrid-system.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { RuleChainLab } from "./RuleChainLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="08"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Knowledge, rules and reasoning"
      lead="Not every AI system learns from examples alone. Explicit facts and rules give systems traceable logic—and today they often work alongside learned models."
    >
      <section id="facts-and-rules">
        <h2 tabIndex={-1}>Facts, rules, and explicit reasoning.</h2>
        <p>
          Earlier in this chapter, you saw models that learn statistical
          patterns from data. Another branch of AI works differently: people
          store explicit statements and clear if-then instructions so a system
          can deduce answers step by step.
        </p>
        <p>
          In this lesson, you will follow five ideas in order: a{" "}
          <strong>fact</strong>, a <strong>rule</strong>,{" "}
          <strong>chaining</strong>, a <strong>knowledge graph</strong>, and a{" "}
          <strong>hybrid system</strong> that pairs rules with learned models.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>Stored fact</h3>
            <p>
              An explicit statement the system starts with—for example, a recipe
              record linking a pastry to an ingredient.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>Rule</h3>
            <p>
              An explicit if-then instruction: when its conditions match known
              facts, it produces a new statement or warning.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>Derived fact</h3>
            <p>
              A new statement produced by a rule rather than typed in directly,
              which another rule can then use.
            </p>
          </div>
        </div>
        <p>
          For an everyday example, consider a fictional bank rule: if a
          customer’s total transfers for the day—including a proposed new
          transfer—would exceed a stated threshold, require a second
          confirmation. The rule is explicit, repeatable, and easy to audit.
        </p>
        <div className={styles.example}>
          <strong>Running example: Mina’s Neighborhood Bakery</strong>
          <p>
            Mina (an invented bakery owner for this lesson) keeps a simple
            digital recipe record to help staff check pastries for tree nuts.
            For this exercise, the record lists almonds and walnuts as tree
            nuts, oats as a grain, and uses “made from” to record what a
            prepared ingredient contains.
          </p>
        </div>
        <p>
          Suppose Mina’s system starts with three stored facts for the Almond
          Croissant: <em>Almond Croissant contains Almond Paste</em>,{" "}
          <em>Almond Paste is made from Almonds</em>, and{" "}
          <em>Almonds is a Tree Nut</em>. Notice that no single stored fact says
          the croissant contains a tree nut.
        </p>
        <ul className={styles.ruleList}>
          <li className={styles.ruleItem}>
            <strong>Rule A (Unpack a prepared ingredient)</strong>
            Because Almond Croissant contains Almond Paste and Almond Paste is
            made from Almonds, Rule A applies and produces the derived fact:{" "}
            <em>Almond Croissant contains Almonds</em>. Written generally: if a
            pastry contains X and X is made from Y, then the pastry contains Y.
          </li>
          <li className={styles.ruleItem}>
            <strong>Rule B (Tree-nut warning)</strong>
            Because Almond Croissant contains Almonds (derived by Rule A) and
            Almonds is a Tree Nut (stored), Rule B applies (fires) and raises a
            warning (flag): <em>Contains tree nuts</em>.
          </li>
        </ul>
        <p>
          This step-by-step process is called <strong>forward chaining</strong>:
          the rule engine starts from available facts, applies any rule whose
          conditions match, adds the derived facts, and keeps checking until it
          can derive nothing new.
        </p>
        <figure className={styles.figure}>
          <Image
            src={ruleChainingImg}
            alt="Diagram titled Chaining facts with rules: Stored facts (Almond Croissant contains Almond Paste, Almond Paste made from Almonds, Almonds is a Tree Nut) flow into Forward chaining where Rule A produces Derived: contains Almonds and passes it to Rule B (Matches Tree Nut), leading to Result: Contains tree nuts with a Traceable path. Bottom cards show an allergy checklist analogy and three key takeaways."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Forward chaining links stored facts through explicit rules so this
            warning carries a step-by-step trace.
          </figcaption>
        </figure>
      </section>

      <section id="knowledge-graphs">
        <h2 tabIndex={-1}>Connecting facts in a knowledge graph.</h2>
        <p>
          As Mina adds more pastries, keeping facts as scattered sentences gets
          hard to maintain. A <strong>knowledge graph</strong> organizes
          information as a network of <strong>nodes</strong> (things such as{" "}
          <em>Almond Croissant</em>, <em>Almonds</em>, or <em>Tree Nut</em>)
          connected by labelled <strong>edges</strong> (relationships such as{" "}
          <em>contains</em>, <em>made from</em>, or <em>is a</em>). A{" "}
          <strong>fact</strong> in this graph is the full statement joining two
          nodes through a named relationship—for example,{" "}
          <em>Almond Paste — made from → Almonds</em>.
        </p>
        <p>
          Think of a movie catalog linking actors, films, and directors: once
          each person and film is a node, you can follow connections across
          several hops without repeating the same facts on every page.
        </p>
        <p>
          In Mina’s bakery graph, both <em>Almonds</em> and <em>Walnuts</em>{" "}
          point to the same shared <em>Tree Nut</em> node. Storing the links is
          separate from applying rules: the graph holds the recorded
          relationships, while Rule A authorizes the new{" "}
          <em>contains Almonds</em> link and Rule B checks whether any direct or
          derived ingredient connects to <em>Tree Nut</em>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={knowledgeGraphImg}
            alt="Diagram titled Knowledge graph: eight labelled edges connect pastries to categories. Almond Croissant contains Almond Paste; Almond Paste made from Almonds; Almonds is a Tree Nut; Walnut Brownie contains Walnuts; Walnuts is a Tree Nut (sharing the Tree Nut node); Oat Muffin contains Rolled Oats; Rolled Oats made from Oats; Oats is a Grain. Bottom cards show a transit-map analogy (stations are things, lines are links) and three key takeaways."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A knowledge graph stores reusable relationships; rules then walk
            those stored links to derive new facts or warnings.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Chain facts with rules in Mina’s bakery.</h2>
        <p>
          Try the toy rule engine below. Like a checklist that only knows what
          is written on the sheet, the engine recomputes its reasoning trace
          from scratch whenever you toggle a stored fact or a rule.
        </p>
        <ol className={styles.steps}>
          <li>
            Start on <strong>Almond Croissant</strong> and read how Rule A
            creates the derived fact <em>Almond Croissant contains Almonds</em>{" "}
            before Rule B raises the warning.
          </li>
          <li>
            Click <strong>Almond Paste — made from → Almonds</strong> to remove
            that stored fact and see where the chain stops.
          </li>
          <li>
            Turn that fact back on, then turn off <strong>Rule A</strong>.
            Notice that Almond Croissant loses its warning, while switching to{" "}
            <strong>Walnut Brownie</strong> still triggers Rule B directly.
          </li>
          <li>
            Switch to <strong>Oat Muffin</strong> with both rules on: Rule A
            derives <em>Oat Muffin contains Oats</em>, while Rule B finds no
            enabled <em>is a → Tree Nut</em> classification for its ingredients
            (even if you toggle <em>Oats — is a → Grain</em> off, the verdict
            stays the same).
          </li>
        </ol>
        <RuleChainLab />
      </section>

      <section id="hybrids">
        <h2 tabIndex={-1}>Why rules are not obsolete: hybrid AI systems.</h2>
        <p>
          Because modern neural networks can write essays and recognize images,
          it is easy to assume rule-based systems are obsolete. In practice,
          explicit rules remain widely used—sometimes on their own (like the
          bank transfer threshold above) and often paired with learned models in
          a <strong>hybrid system</strong>.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>Where learned models shine</h3>
            <p>
              Handling messy everyday language, typos, photos, and fuzzy
              patterns that are too varied to write down as hand-crafted rules.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>Where facts and rules shine</h3>
            <p>
              Enforcing strict policies, checking exact records, and acting as a{" "}
              <strong>rule gate</strong>—a required check before an action or
              reply proceeds—with a clear trace of why it applied.
            </p>
          </div>
        </div>
        <p>
          In real-world payment systems, for example,{" "}
          <strong>Stripe Radar</strong> combines machine-learning risk scoring
          with explicit merchant-defined rules that can block or review specific
          payments.
        </p>
        <div className={styles.example}>
          <strong>Mina’s bakery helper as a hybrid system</strong>
          <p>
            A customer selects the Almond Croissant in the ordering app and
            types: “Is this safe for my tree-nut allergy?” First, a learned
            language model reads the question and maps it to the selected item (
            <em>Almond Croissant</em>) and allergen category (<em>Tree Nut</em>
            ). Next, the knowledge graph and rules check the recipe record and
            flag <em>Contains tree nuts</em>. Finally, the app renders that
            finding in a fixed response template: “Contains tree nuts: the
            bakery’s recipe record shows that the almond paste in the Almond
            Croissant is made from almonds.”
          </p>
        </div>
        <p>
          Using a fixed template—or checking generated wording against the rule
          engine’s output—helps keep the final reply aligned with the checked
          record. Even so, the rule engine only shows what follows from the
          selected item, its enabled records, and its active rules.
        </p>
        <figure className={styles.figure}>
          <Image
            src={hybridSystemImg}
            alt="Diagram titled Hybrid AI system: four left-to-right cards show Question (Almond Croissant and tree nuts?) flowing to Learned model (Reads wording), then to Facts and rules (Checks record), then to Template reply (Contains tree nuts). Bottom cards show a clerk-with-recipe-binder analogy and three key takeaways."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A hybrid system lets a learned model handle natural language while
            explicit facts, rules, and templates keep the policy check
            traceable.
          </figcaption>
        </figure>
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Limits and quick questions.</h2>
        <p>
          Combining rules with learned models is powerful, yet every part still
          has clear limits:
        </p>
        <ul className={styles.steps}>
          <li>
            <strong>Missing or stale facts:</strong> If a supplier changes a
            recipe and nobody updates the knowledge graph, the rule engine can
            miss an allergen even when every rule works correctly.
          </li>
          <li>
            <strong>Fuzzy visual or judgment tasks:</strong> Explicit rules work
            well for precise conditions, such as a transfer threshold. Judging
            whether a croissant baked evenly from a photo is harder to capture
            in rules.
          </li>
          <li>
            <strong>Hybrid handoff errors:</strong> If a customer asks vaguely
            about “that flaky morning pastry” without selecting an item and the
            learned model guesses the wrong pastry, the rule engine checks the
            wrong record.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>Did deep learning replace rule-based systems?</strong>
            <p>
              No. Standalone rules still handle clear-cut policies like transfer
              thresholds, and hybrid systems pair learned models with explicit
              rules whenever strict checks and audit trails matter.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Is a knowledge graph the same thing as a table?</strong>
            <p>
              A knowledge graph organizes facts around named relationships, and
              those same relationships can also be stored as rows in a table.
              For example, the arrow <em>Almond Paste — made from → Almonds</em>{" "}
              can be written as a three-column row:
            </p>
            <div className={styles.tableWrap}>
              <table className={styles.factTable}>
                <thead>
                  <tr>
                    <th scope="col">Subject</th>
                    <th scope="col">Relation</th>
                    <th scope="col">Object</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Almond Paste</td>
                    <td>made from</td>
                    <td>Almonds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If no warning appears, does that guarantee a pastry is
              allergen-free?
            </strong>
            <p>
              No. A warning can be absent either because the check itself was
              disabled (Rule B off) or because the enabled facts did not match a
              tree-nut rule. Unrecorded ingredients or cross-contact (ingredient
              transfer through shared kitchen equipment) are outside what the
              rule engine knows.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A fictional clinic wants an assistant that lets patients request prescription refills in everyday language, but may submit a restricted-medication refill only when a current doctor approval is confirmed in the clinic’s records. Which design fits both requirements best?"
        options={[
          "A learned language model given instructions to follow the clinic’s refill policy and submit the refill directly, without a separate record-backed rule gate.",
          "A hybrid system where a learned model interprets the patient’s everyday request, a record-backed rule gate confirms current doctor approval before submission, and a fixed template confirms the outcome.",
          "A fixed-choice web form paired with a record-backed rule gate that checks current doctor approval before submission.",
          "A knowledge graph that stores medication names and submits a refill whenever the requested medicine matches a stored entry, without checking approval rules.",
        ]}
        correct={1}
        explanation="The hybrid design satisfies both requirements: the learned model handles everyday patient wording, while the record-backed rule gate strictly checks current doctor approval before any restricted refill can be submitted."
        wrongFeedback={[
          "A learned language model given instructions handles everyday language, but without a separate record-backed rule gate before submission, a missing or expired approval could still slip through.",
          "",
          "A fixed-choice form with a rule gate enforces the doctor-approval policy, but it misses the requirement to let patients make requests in everyday language.",
          "A knowledge graph stores structured facts, but matching a medication name alone neither understands everyday patient wording nor enforces the required doctor-approval rule.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Rules and learned models solve different halves.</strong>{" "}
            Explicit <strong>facts</strong>, <strong>rules</strong>, and{" "}
            <strong>knowledge graphs</strong> give you repeatable, traceable
            logic—and <strong>hybrid systems</strong> pair them with learned
            models so everyday language and strict policy checks work together.
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

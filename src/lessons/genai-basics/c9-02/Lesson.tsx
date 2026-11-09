import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import styles from "./lesson.module.css";
import workflowImg from "./images/workflow.png";
import agentLoopImg from "./images/agent-loop.png";
import combinedImg from "./images/combined.png";
import { WorkflowLab } from "./WorkflowLab";

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{ label: "Tools and agents", href: "/course/chapter-9" }}
      title="Workflows versus agents"
      lead="Some AI systems follow steps that code has already fixed. Others let a model choose the next step while the system runs. Knowing which one you are building changes how you test, limit and trust it."
    >
      <section id="two-ways">
        <h2 tabIndex={-1}>Who picks the next step?</h2>
        <p>
          This lesson uses three terms. They are defined here and used the same
          way throughout.
        </p>
        <ul>
          <li>
            <strong>Workflow:</strong> the code decides which steps run and in
            what order, using rules written in advance. A model may run inside a
            step.
          </li>
          <li>
            <strong>Agent loop:</strong> the model chooses the next action while
            the system runs. The action runs, the model reads the result, and it
            chooses again until it stops.
          </li>
          <li>
            <strong>Combination:</strong> fixed steps around one or more agent
            loops.
          </li>
        </ul>
        <div className="callout">
          <strong>Key question:</strong> at run time, does the code or the model
          choose the next step?
        </div>
        <p>
          Think of a recipe card. It lists the steps in order. A cook who tastes
          the dish and decides whether to add salt or simmer longer is making
          choices as they go. The comparison breaks down in one important way: a
          model&apos;s choice can be wrong, so an agent loop needs limits on how
          many steps it can take.
        </p>
      </section>

      <section id="workflow">
        <h2 tabIndex={-1}>A workflow: the code sets the order.</h2>
        <p>
          Take one support ticket: &ldquo;I was charged twice on my latest
          invoice.&rdquo; A workflow handles it with three fixed steps. Every
          ticket runs the same steps in the same order.
        </p>
        <ol>
          <li>Classify the ticket by topic. This one is billing.</li>
          <li>Check its urgency. This one is low.</li>
          <li>Route the ticket to the billing team.</li>
        </ol>
        <figure className={styles.figure}>
          <Image
            src={workflowImg}
            alt="Three boxes in a row, labelled Classify ticket, Check urgency and Route ticket, joined by arrows that point from left to right. A caption says the order is fixed and decided by code."
            sizes="(max-width: 760px) 100vw, 760px"
          />
          <figcaption className="micro">
            Each step runs in order. The code decides what comes next.
          </figcaption>
        </figure>
        <p>
          The steps can be keyword rules or model calls. What makes this a
          workflow is that the code decides what runs next.
        </p>
        <div className="callout">
          <strong>Outside the ticket:</strong> a library desk checks your card,
          then the due date, then prints the receipt. The clerk does not change
          that order based on which book you borrowed.
        </div>
      </section>

      <section id="agent-loop">
        <h2 tabIndex={-1}>An agent loop: the model picks each step.</h2>
        <p>
          Now a different ticket: &ldquo;My account is locked and I cannot log
          in.&rdquo; In an agent loop, the model chooses the next action. It
          might choose to look up the account. The system runs that lookup and
          returns the result. The model reads the result and chooses again.
        </p>
        <ol>
          <li>The model picks an action, such as looking up the account.</li>
          <li>The system runs the action and returns the result.</li>
          <li>
            The model reads the result, then either picks another action or
            stops.
          </li>
        </ol>
        <figure className={styles.figure}>
          <Image
            src={agentLoopImg}
            alt="Three boxes in a circle, labelled Model picks next step, Run a tool and Model reads result, with arrows that go clockwise around the circle. A caption says the model picks the next step each time."
            sizes="(max-width: 760px) 100vw, 760px"
          />
          <figcaption className="micro">
            The model chooses the next step after each result.
          </figcaption>
        </figure>
        <p>
          Because the model chooses, two runs on the same ticket can take
          different paths. A loop with no limit can keep going, so an agent loop
          needs a maximum number of steps and a way to stop.
        </p>
        <div className="callout">
          <strong>Outside the ticket:</strong> you call a courier about a late
          parcel. You read the answer, then decide whether to check the depot or
          wait another day. Each answer shapes the next choice.
        </div>
      </section>

      <section id="decision-point">
        <h2 tabIndex={-1}>A coded branch is still a workflow.</h2>
        <p>
          A workflow can branch. In one version of the ticket system, a rule
          checks the classification confidence after urgency is assessed. If the
          confidence is below 0.70, or the category is &ldquo;other&rdquo;, the
          ticket goes to an extra review step. Otherwise it goes straight to
          routing.
        </p>
        <p>
          The rule is written in code, so the code still picks the path. That
          keeps this a workflow. In this example, the classifier is a simple
          keyword scan, which keeps the rule easy to follow.
        </p>
        <div className="callout">
          <strong>Common mix-up:</strong> a model call inside a fixed step does
          not make the system an agent. The model writes or classifies, but the
          code still decides which step runs next.
        </div>
        <p>Quick questions:</p>
        <ul>
          <li>
            <strong>Does a branch make a system an agent?</strong> No. A branch
            chosen by a coded rule is still a workflow.
          </li>
          <li>
            <strong>Does calling a model make a system an agent?</strong> No,
            not by itself. The question is whether the model chooses the next
            step.
          </li>
          <li>
            <strong>
              If the model picks an action, then reads the result and picks
              again, is that a loop?
            </strong>{" "}
            Yes. That is an agent loop.
          </li>
        </ul>
      </section>

      <section id="combine">
        <h2 tabIndex={-1}>Most real systems mix the two.</h2>
        <p>
          A common design keeps most steps fixed and gives one step to an agent
          loop. For the locked-account ticket, the system might:
        </p>
        <ol>
          <li>
            <strong>Intake (fixed):</strong> save the ticket and record the
            customer&apos;s plan.
          </li>
          <li>
            <strong>Investigate (agent loop):</strong> the model looks up login
            records, asks for more detail if needed, and decides when it has
            enough.
          </li>
          <li>
            <strong>File ticket (fixed):</strong> write the summary and route
            the ticket.
          </li>
        </ol>
        <figure className={styles.figure}>
          <Image
            src={combinedImg}
            alt="Three boxes in a row, labelled Intake, Investigate and File ticket, with arrows from left to right. The Investigate box has a dashed outline to show it is the open-ended step. A caption says there are fixed steps around one open-ended step."
            sizes="(max-width: 760px) 100vw, 760px"
          />
          <figcaption className="micro">
            Keep the open-ended step small, and cap how many steps it can take.
          </figcaption>
        </figure>
        <p>
          The fixed steps are easy to test and audit. The open-ended step
          handles cases a rule cannot predict, and it is the hardest part to
          test. This is a common pattern, not a rule.
        </p>
      </section>

      <section id="try-it">
        <h2 tabIndex={-1}>Sort five systems.</h2>
        <p>Try it in this order:</p>
        <ol>
          <li>Read the description and note what the system does first.</li>
          <li>Ask: does the code or the model choose the next step?</li>
          <li>
            Choose workflow, agent loop or combination. You can change any
            answer.
          </li>
        </ol>
        <WorkflowLab />
      </section>

      <Check
        id="check"
        question="A support system always runs the same three steps. One step calls a model to write a summary. The code, not the model, decides what runs next. What is this system?"
        options={[
          "An agent loop, because it uses a model.",
          "A workflow, because the code sets the order of the steps.",
          "A combination, because it has a model call.",
        ]}
        correct={1}
        wrongFeedback={[
          "Using a model does not make this an agent loop here. The model does not choose the next step.",
          "",
          "A combination needs an agent loop inside the fixed steps. Here the model only writes a summary inside one fixed step.",
        ]}
        explanation="The code sets the order of every step. The model call sits inside one fixed step, so this is a workflow."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2>Take this with you.</h2>
          <p>
            Ask who picks the next step. If the code does, it is a workflow,
            even with a branch or a model call inside a step. If the model picks
            the next step and the system loops, it is an agent loop. Many real
            systems combine fixed steps with one open-ended part, and they keep
            that part limited.
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-9">
          Back to Chapter 9: Tools and agents →
        </Link>
      </section>
    </LessonFrame>
  );
}

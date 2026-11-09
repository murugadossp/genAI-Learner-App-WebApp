import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="07"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="Using AI responsibly"
      lead="An AI assistant can help you draft, but you still decide what to share, check and use."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Three habits for using AI with care.</h2>
        <p>
          In the last lesson you saw that fluent answers can be wrong. Here we
          will verify claims, protect sensitive information, and keep human
          responsibility for the result.
        </p>
        <p>
          A <strong>claim</strong> is a statement that can be checked.{" "}
          <strong>Sensitive information</strong> is information that could harm
          someone or reveal something private if shared inappropriately.{" "}
          <strong>Responsibility</strong> means people remain answerable for
          their choices and actions.
        </p>
        <div className={styles.example}>
          <strong>Our invented example</strong>
          <p>
            Maya is preparing a public notice for a volunteer event. The
            organizer has a current official schedule and a private attendee
            list. Maya is allowed to use an AI writing assistant for the notice.
          </p>
        </div>
      </section>
      <section id="verify">
        <h2 tabIndex={-1}>Verify claims before relying on them.</h2>
        <p>
          Think of checking a meeting time on the invitation, even if a friend
          sounds certain. To <strong>verify</strong> a claim, compare it with a
          relevant, reliable source outside the answer.
        </p>
        <div
          className={styles.diagram}
          aria-label="Compare the AI claim with the current official schedule, then correct the notice if needed."
        >
          <span>AI claim</span>
          <span>Compare with</span>
          <span>Current official schedule</span>
          <span>Correct notice if needed</span>
        </div>
        <p>
          The assistant drafts “Doors open at 9.” Maya compares that claim with
          the organizer’s current schedule, which says 10. She corrects the
          notice to 10; the polished sentence alone did not establish the time.
        </p>
        <p>
          For a bus trip, check the operator’s current timetable. If you cannot
          find a reliable check, treat the claim as unconfirmed instead of
          relying on it alone.
        </p>
      </section>
      <section id="protect">
        <h2 tabIndex={-1}>Protect information before you share it.</h2>
        <p>
          A prompt is the instruction or information you send to an assistant.
          Like checking what is on a document before handing it over, look at a
          prompt before sending it.
        </p>
        <div
          className={styles.diagram}
          aria-label="Keep the private attendee list out of the prompt; use only the public event details needed for the task."
        >
          <span>Private attendee list</span>
          <span>Keep out of prompt</span>
          <span>Use public details</span>
        </div>
        <p>
          Maya needs a public notice, not attendee names or contact details. She
          uses only the public event details needed for the draft and leaves the
          private list out.
        </p>
        <p>
          For a generic question about preparing for a doctor’s visit, you can
          leave out personal medical details. Removing names does not guarantee
          a person cannot be identified. Check the tool’s terms and your
          organization’s rules before sharing; ask if you are unsure.
        </p>
      </section>
      <Check
        id="practice"
        title="Choose what Maya shares."
        question="Maya may use this assistant for a notice. The event name and schedule are public; the attendee names and phone numbers are private. Which prompt uses only what is needed?"
        options={[
          "Write a notice using the public event name and schedule.",
          "Write a notice and include the private attendee names.",
          "Write a notice using the private attendee phone numbers.",
        ]}
        correct={0}
        wrongFeedback={[
          "",
          "The attendee names are private and are not needed for a public notice.",
          "The phone numbers are private and are not needed for the notice.",
        ]}
        explanation="The public event name and schedule are enough for this task. Maya keeps the private attendee list out of the prompt."
      />
      <section id="responsibility">
        <h2 tabIndex={-1}>Keep a person responsible.</h2>
        <p>
          A colleague may help draft an email, but you still check it before
          sending. AI can help make a draft; it does not take over your
          responsibility for what you choose to use or share.
        </p>
        <div
          className={styles.diagram}
          aria-label="Maya reviews the AI draft, then the organizer approves the public notice."
        >
          <span>AI draft</span>
          <span>Maya reviews</span>
          <span>Organizer approves</span>
        </div>
        <p>
          Maya checks the notice against the current schedule and asks the
          organizer to approve it before publication. In this example, Maya is
          responsible for her review and the organizer for their approval. Other
          people or organizations may also have responsibilities in real
          situations.
        </p>
        <p>
          Before sending an AI-drafted email, review its facts, tone and
          recipients yourself. For consequential decisions, involve the
          appropriate qualified person and follow applicable rules.
        </p>
        <h3>Quick questions</h3>
        <ul>
          <li>
            <strong>Does a confident answer prove a claim?</strong> No; check it
            against a reliable source.
          </li>
          <li>
            <strong>Does removing a name make a prompt anonymous?</strong> Not
            necessarily; other details can identify someone.
          </li>
          <li>
            <strong>
              Can the assistant accept responsibility for your choice?
            </strong>{" "}
            People remain responsible for their own actions.
          </li>
        </ul>
      </section>
      <Check
        id="check"
        question="Maya has an AI draft with an event time. The current official schedule is available, and the organizer must approve the notice. Who should make sure the time is checked before publication?"
        options={[
          "The assistant alone: it wrote the draft.",
          "Maya: she checks the time and obtains the organizer’s approval.",
          "Nobody: a fluent notice is ready to publish.",
        ]}
        correct={1}
        wrongFeedback={[
          "The assistant made the draft; Maya still needs to check it and obtain approval.",
          "",
          "Fluency does not establish the time, and the notice still needs the organizer’s approval.",
        ]}
        explanation="Maya checks the time against the current official schedule and asks the organizer to approve the notice. People retain responsibility for their actions."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Verify claims against a reliable source, share only appropriate
            information, and keep people responsible for decisions and actions.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { CutoffLab } from "./CutoffLab";
export default function Lesson() {
  return (
    <LessonFrame
      number="08"
      title="Knowledge cutoff and fresh information"
      lead="A model learns from text collected up to some date, and is then used long after. What does it know about recent events, and how does newer information reach an answer?"
    >
      <section id="cutoff">
        <h2 tabIndex={-1}>Training stops at a date.</h2>
        <p>
          Pretraining uses text gathered up to a point in time. Later stages
          such as instruction tuning and other post-training adjust the model,
          and they can add some newer information, but they do not rebuild its
          broad knowledge. The last date that the bulk of its training text
          covers is often called the model’s <strong>knowledge cutoff</strong>.
          Once training is finished and the model is deployed, its weights stay
          fixed until the provider releases a new version.
        </p>
        <p>
          The cutoff is only the start of the gap. A model is typically released
          some time after training ends, and then people keep using it for a
          long time. So when you ask a question, “today” is usually well past
          the cutoff. Providers publish cutoff information in different ways and
          some models cannot state their own cutoff reliably, so check the
          documentation for the model you use.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> the cutoff is a property of the training
          text. It does not move when someone chats with the model, and it says
          nothing about what has happened since.
        </div>
      </section>
      <section id="timeline">
        <h2 tabIndex={-1}>Move the cutoff on a toy timeline.</h2>
        <p>
          Slide the cutoff and watch which events fall before or after it. Then
          ask about a fact that changed over time and decide what goes into the
          request. Try the fare question with the cutoff at month 14, then at
          month 20, then with a current notice added.
        </p>
        <CutoffLab />
      </section>
      <section id="edges">
        <h2 tabIndex={-1}>The edge is blurry, and it is not a wall.</h2>
        <p>
          Two ideas are easy to overstate. “It knows everything before the
          cutoff” is wrong: coverage is uneven, and plenty of true facts were
          never well represented. “It knows nothing after the cutoff” is also
          too simple: a model can still produce a fluent answer about a later
          topic, and the answer may be a plausible guess, an outdated fact, or
          an extension of older patterns.
        </p>
        <p>
          Near the cutoff, coverage is often thinner, because writing about an
          event keeps piling up for a while afterward. In the lab, the month 14
          rename at a month 14 cutoff has almost no text behind it, so the toy
          cannot tell which name to give. That rule is invented for the toy, but
          the pattern, that the newest period is usually under-represented, is a
          reason not to assume a model knows its own final months well.
        </p>
        <p>
          The costly case is a stale answer in a confident tone. Fluency is not
          evidence of freshness, which links back to why models make things up.
        </p>
      </section>
      <section id="fresh">
        <h2 tabIndex={-1}>How newer facts reach an answer.</h2>
        <p>
          Newer information can enter in the request. An application can paste
          in a document, include the current date, call a search or lookup tool,
          or retrieve relevant passages, then ask the model to answer from them.
          The model can use that text because it is in its context, not because
          its weights changed.
        </p>
        <ul>
          <li>
            <strong>Quality travels through.</strong> An old notice produced an
            old answer in the lab. Check how current and trustworthy a source
            is.
          </li>
          <li>
            <strong>Space is limited.</strong> Supplied text uses the context
            window from the previous lesson.
          </li>
          <li>
            <strong>Tools need rules.</strong> The app decides when to search
            and what to send. A model might ignore or misread what it is given.
          </li>
          <li>
            <strong>Updating the model is separate.</strong> A provider can
            release a model trained on newer text, but that is not something a
            chat does.
          </li>
        </ul>
        <div className="callout">
          <strong>Habit:</strong> for prices, versions, laws, schedules, news
          and anything labelled “latest”, ask what source in the request carries
          the date, not what the model remembers.
        </div>
      </section>
      <Check
        id="check"
        question="A support bot states a refund policy confidently, but the policy changed after the model’s training cutoff. What explains it and what helps?"
        options={[
          "The model forgot the policy; chatting about the new policy will refresh its weights.",
          "The new policy was not in its training text. Supply the current policy in the request or let it use a trusted lookup, and check the answer against it.",
          "Everything before the cutoff is reliable, so the old policy it quoted must still be correct.",
          "A confident tone shows the model checked a live source.",
        ]}
        correct={1}
        wrongFeedback={[
          "A chat does not update the weights, and the model never held the new policy to forget. The fix is to supply it in the request.",
          "",
          "Coverage before the cutoff is uneven, and facts change. The policy it quoted may be older than today’s policy.",
          "Tone is not evidence. Unless the app supplied a source, nothing was checked.",
        ]}
        explanation="Training text ends at a cutoff and newer facts can only reach an answer through the request or a tool, so give it a current, trusted source and verify."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Training text ends at a cutoff, thins near it, and is never
            complete. Newer facts arrive through the request or a tool, only as
            good as their source. For date-sensitive questions, supply a current
            source.
          </p>
        </div>
        <Link className="text-link" href="/learn/genai-basics/c2-06">
          Review: The context window →
        </Link>
      </section>
    </LessonFrame>
  );
}

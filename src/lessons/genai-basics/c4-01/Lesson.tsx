import Image from "next/image";
import Link from "next/link";
import supervisedLoop from "./images/supervised-loop.webp";
import inputsVsTarget from "./images/inputs-vs-target.webp";
import beyondLabels from "./images/beyond-labels.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { SupervisedLab } from "./SupervisedLab";
import { TRAINING_EMAILS } from "./data";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Supervised learning"
      lead="In supervised learning, a model—a program shaped by data—learns patterns from examples that come with supplied answers, then uses what it learned to predict answers on new cases, though not all machine learning works this way."
    >
      <section id="what-it-is">
        <h2 tabIndex={-1}>Learning from examples with known answers.</h2>
        <p>
          Think of studying with a stack of practice quizzes that come with an
          answer key. After checking enough questions against their answers, you
          are ready to tackle a new test that has no answer key attached.
        </p>
        <p>
          <strong>Supervised learning</strong> works in a loosely similar way: a
          model learns from past examples that pair clues with supplied answers,
          then uses those patterns on new cases. It is only an analogy—a model
          does not read or understand questions like a student.
        </p>
        <p>This lesson covers five ideas in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Inputs:</strong> the clues supplied to a model when asking
            it for a guess.
          </li>
          <li>
            <strong>Target (or label):</strong> the recorded answer paired with
            each past example that we want the model to predict.
          </li>
          <li>
            <strong>Training:</strong> the step where the model learns patterns
            from past examples that include both inputs and targets.
          </li>
          <li>
            <strong>Prediction:</strong> the model’s estimate for the missing
            target on a new case (made at <strong>prediction time</strong>, when
            the model receives the supplied clues and makes its estimate).
          </li>
          <li>
            <strong>Other ML methods:</strong> why not all machine learning
            needs supplied labels.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: Sam’s community inbox</strong>
          <p>
            Sam (an invented character for this lesson) helps manage a local
            community centre’s email inbox. Volunteers sorted past emails as{" "}
            <strong>Spam</strong> or <strong>Not spam</strong> so a learned
            filter can train on them.
          </p>
        </div>
        <p>
          For each past email in this small invented dataset, the filter checks
          three clues: <strong>Known sender?</strong> (whether the address is in
          the centre’s address book), <strong>Unknown link?</strong> (whether it
          links to an unrecognised website), and{" "}
          <strong>Urgent payment?</strong> (whether it demands immediate money
          or gift cards).
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Past email</th>
                <th scope="col">Known sender?</th>
                <th scope="col">Unknown link?</th>
                <th scope="col">Urgent payment?</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              {TRAINING_EMAILS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                  </td>
                  <td>{row.knownSender ? "Yes" : "No"}</td>
                  <td>{row.unknownLink ? "Yes" : "No"}</td>
                  <td>{row.urgentPayment ? "Yes" : "No"}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.target === "Spam"
                          ? styles.badgeWarn
                          : styles.badgeGood
                      }`}
                    >
                      {row.target}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="micro">
          Notice Email 5: an unknown sender with no suspicious link or payment
          demand was marked <strong>Not spam</strong> (a local parent asking
          about room hire). Learned spam filters typically train on far more
          than six emails, while some filters rely on hand-written rules
          instead.
        </p>
        <figure className={styles.figure}>
          <Image
            src={supervisedLoop}
            alt="Diagram titled Supervised learning with subtitle Learn from supplied answers, then predict on new cases. Top row flows left to right: Labeled past emails (Inputs + target) to Training to Trained model. Bottom row flows left to right: New email clues (Inputs only) to Trained model to Prediction (Spam or Not spam). Bottom cards show Analogy (Like practising with an answer key before taking a new test.) and Key takeaways (Training uses past clues paired with answers; New cases arrive with clues only; The trained model predicts the missing answer)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Training uses past clues paired with recorded answers; once trained,
            the model takes clues from a new case and outputs a prediction.
          </figcaption>
        </figure>
      </section>

      <section id="inputs-and-targets">
        <h2 tabIndex={-1}>Telling inputs apart from targets.</h2>
        <p>
          In Lesson 1.3 you met <strong>features</strong> (clues) and{" "}
          <strong>labels</strong> (answers). In supervised learning, those same
          roles are often called <strong>inputs</strong> and the{" "}
          <strong>target</strong>.
        </p>
        <p>
          Use one simple test to tell them apart: <strong>inputs</strong> are
          the clues supplied to the model at prediction time, while the{" "}
          <strong>target</strong> is the recorded answer you want the model to
          predict. Not every column in a table is an input—for instance, an
          email ID such as “Email 1” only identifies the row.
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Predicting a category</h3>
            <p>
              Checking a bank-card charge as it happens to flag possible fraud.
            </p>
            <p className="micro">
              <strong>Inputs:</strong> amount, country, time of day.
            </p>
            <p className="micro">
              <strong>Target:</strong> Fraud or Legitimate recorded on past
              charges—the model outputs a prediction for each new charge (Lesson
              4.3 covers how models turn scores into categories).
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Predicting a number</h3>
            <p>Estimating a flat’s monthly rent before posting a listing.</p>
            <p className="micro">
              <strong>Inputs:</strong> floor area, number of rooms,
              neighbourhood.
            </p>
            <p className="micro">
              <strong>Target:</strong> monthly rent recorded in past
              listings—the model outputs a predicted rent for a new flat (Lesson
              4.2 covers predicting numbers).
            </p>
          </div>
        </div>
        <figure className={styles.figure}>
          <Image
            src={inputsVsTarget}
            alt="Diagram titled Inputs vs target with subtitle Clues go into the model; the prediction estimates the target. Flows left to right from Inputs (clues supplied) containing chips Known sender?, Unknown link?, and Urgent payment?, to Trained model (Learned from past clues + answers), to Prediction showing Spam or Not spam. Bottom cards show Analogy (Like checking symptoms before making a diagnosis.) and Key takeaways (Inputs are clues supplied at prediction time; The target is the answer to predict; A prediction is an estimate, not a guarantee)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            At prediction time, the model—trained on past clues paired with
            recorded answers—receives only the inputs and outputs a prediction.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Walk through Sam’s spam filter.</h2>
        <p>
          Many supervised models learn by adjusting internal numbers during
          training. To keep this walk-through easy to inspect, the lab below
          uses a simpler example of supervised learning: nearest-match voting.
        </p>
        <p>
          Here is the rule: compare a new email’s three clues to all six past
          emails, highlight every past email tied for the highest number of
          matching clues, let each highlighted past email cast one vote for its
          own recorded target (<strong>Spam</strong> or{" "}
          <strong>Not spam</strong>), and predict whichever category gets more
          votes. Each separate row gets one vote, even when two rows share
          identical clues.
        </p>
        <div className={styles.example}>
          <strong>
            Worked trace: a new neighbour asks about opening hours
          </strong>
          <p>
            A new neighbour emails asking when the centre opens on Saturday,
            with clues <strong>Known sender: No</strong>,{" "}
            <strong>Unknown link: No</strong>,{" "}
            <strong>Urgent payment: No</strong>. Email 5 matches all 3 clues
            (every other past email matches at most 2), so Email 5 casts the
            sole vote for its recorded target and the filter predicts{" "}
            <strong>Not spam</strong>.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            Start on <strong>1. Spot inputs &amp; target</strong> and pick the
            target for Sam’s spam filter, then try the apartment rent and parcel
            delivery tasks.
          </li>
          <li>
            Switch to <strong>2. Trace a new email</strong> and compare{" "}
            <strong>New neighbour asking hours</strong> with{" "}
            <strong>Fake urgent invoice</strong>.
          </li>
          <li>
            Click <strong>Club newsletter with unfamiliar link</strong> and
            notice how a 2–1 vote produces an estimate even when past examples
            disagree.
          </li>
          <li>
            Toggle individual clues yourself, then click{" "}
            <strong>Reset walk-through</strong> to start fresh.
          </li>
        </ol>
        <SupervisedLab />
      </section>

      <section id="not-all-ml">
        <h2 tabIndex={-1}>Does all machine learning need labels?</h2>
        <p>
          No. Supervised learning is widely used, so it is easy to assume every
          machine learning system needs a supplied answer key—but it is only one
          family of learning methods.
        </p>
        <p>
          Different methods are distinguished by their{" "}
          <strong>training signal</strong>—the kind of feedback or target the
          model learns from:
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Supervised learning</h3>
            <p>
              Learns from examples paired with supplied answers, whether written
              by people or recorded from past outcomes (like whether a parcel
              arrived late).
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Unsupervised learning</h3>
            <p>
              Looks for patterns or groups in inputs without supplied answers,
              such as grouping customers with similar habits (Lesson 4.4).
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Self-supervised learning</h3>
            <p>
              Derives its own targets directly from the data itself—for example,
              hiding part of a sentence and training the model to predict it
              (Lesson 4.5).
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Reinforcement learning</h3>
            <p>
              Learns which actions to take from reward or penalty feedback over
              time rather than a table of supplied answers (Lesson 4.6).
            </p>
          </div>
        </div>
        <figure className={styles.figure}>
          <Image
            src={beyondLabels}
            alt="Diagram titled Not all ML needs labels with subtitle Different learning methods get their training signal in different ways. Left card shows Supervised learning (Examples + supplied answers). Right card shows Other ML methods with three mini-cards: Unsupervised (No supplied answers), Self-supervised (Targets from data itself), and Reinforcement (Reward feedback). Bottom cards show Analogy (Like studying with an answer key vs exploring or trial and error.) and Key takeaways (Supervised learning uses supplied answers; Other methods learn without supplied answer keys; Match the method to the signal you have)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Supervised learning uses supplied answers, while unsupervised,
            self-supervised, and reinforcement learning learn from other kinds
            of training signals.
          </figcaption>
        </figure>
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>What supervised learning depends on.</h2>
        <p>
          Even when you have labeled examples, data quality strongly affects how
          reliable a supervised model can be.
        </p>
        <ul>
          <li>
            <strong>Label quality matters:</strong> if past emails were
            mislabeled by mistake, the model can learn misleading patterns.
          </li>
          <li>
            <strong>Unseen patterns can fool it:</strong> if scammers invent a
            tactic that never appeared in past examples, the filter may miss it.
          </li>
          <li>
            <strong>Predictions are estimates, not guarantees:</strong> a filter
            can still send a real message to spam or let spam slip through.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does “supervised” mean a person checks every prediction live?
            </strong>
            <p>
              No. “Supervised” refers to the supplied answers used during
              training, not a human approving every prediction afterward.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Can a target be a number instead of a category?</strong>
            <p>
              Yes. When trained on examples with supplied answers, supervised
              learning can predict either a number (such as monthly rent) or a
              category (such as Spam or Not spam).
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>What if I have lots of data, but no one labeled it?</strong>
            <p>
              You can still use machine learning—methods such as unsupervised
              learning and self-supervised learning do not require supplied
              answer keys for every example.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A neighbourhood clinic trained a model on past appointment records that paired booking details with the recorded outcome, Missed appointment (yes or no). One day before each upcoming appointment, the clinic supplies three clues to the model—Days booked in advance, Appointment time of day, and Text-message (SMS) reminder already sent at prediction time (yes or no)—to predict whether the patient will fail to show up. Which statement is right?"
        options={[
          "Text-message (SMS) reminder already sent at prediction time is the target, because it is a yes-or-no column recorded in past appointments.",
          "Missed appointment is the target and the other three columns are inputs—which makes this supervised learning, though other ML methods work without supplied answers.",
          "Days booked in advance is the target, because it is the only numeric column in the clinic's past records.",
          "Missed appointment is the target and the other three columns are inputs—which shows that all machine learning needs supplied labels to learn.",
        ]}
        correct={1}
        explanation="The clinic supplies the three columns known one day ahead (Days booked in advance, Appointment time of day, and Text-message (SMS) reminder already sent at prediction time) as inputs, while Missed appointment is the eventual outcome (target) to predict. That makes this supervised learning, while unsupervised, self-supervised, and reinforcement learning learn without supplied answer keys."
        wrongFeedback={[
          "Whether a text-message (SMS) reminder was already sent at prediction time is supplied to the model one day ahead as an input, not the outcome the clinic is predicting.",
          "",
          "Days booked in advance is already known one day before the appointment and supplied to the model as an input—being a number does not make a column the target.",
          "You identified the target and inputs correctly, but not all machine learning needs supplied labels—unsupervised, self-supervised, and reinforcement learning learn from other training signals.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Supervised learning learns from supplied answers.</strong>{" "}
            During training, the model sees <strong>inputs</strong> (clues
            supplied at prediction time) paired with a known{" "}
            <strong>target</strong> (the answer to predict). On a new case, it
            takes inputs alone and outputs a <strong>prediction</strong>—and
            remember that <strong>not all machine learning needs labels</strong>
            .
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

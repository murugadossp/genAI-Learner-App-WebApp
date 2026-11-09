import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { Sorter } from "./Sorter";
import { tasks } from "./tasks";
import styles from "./lesson.module.css";

const examples = [
  "Estimate tomorrow’s rainfall in millimetres.",
  "Mark a payment as normal or suspicious.",
  "Pick five videos you might want next.",
  "Write a new caption for your photo.",
  "Order eight delivery stops to finish soonest.",
];

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="AI in everyday products"
      lead="Many people picture AI as a chatbot. But a lot of everyday AI has no chat box at all. A better question than “is this AI?” is “what job is it doing?”"
    >
      <section id="not-just-chat">
        <h2 tabIndex={-1}>AI is a job, not a chat box.</h2>
        <p>
          Think of a helper in a shop. One helper checks your bag. Another
          points you to shelves you might like. Another writes your name on a
          card. They all help, but each does a different <em>job</em>.
        </p>
        <p>
          AI systems are like that. A chat window is one way to reach an AI
          system, which is an <strong>interface</strong>. The system behind it,
          or behind a button, a list or a warning, is doing a{" "}
          <strong>task</strong>. The same kinds of task show up in many
          products.
        </p>
        <div className="callout">
          <strong>Key idea:</strong> do not ask whether a product has a chatbot.
          Ask what the feature is for and what it gives back: a number, a label,
          a short list, new content or a set of steps.
        </div>
      </section>
      <section id="five-tasks">
        <h2 tabIndex={-1}>Five jobs an AI system can do.</h2>
        <p>
          Here are five common jobs. The quickest clue to each is the kind of
          answer it gives back. It is a clue, not a strict rule: what a feature
          is for matters too.
        </p>
        <ul className={styles.cards}>
          {tasks.map((t, i) => (
            <li className={styles.card} key={t.name}>
              <h3>{t.name}</h3>
              <p>
                <strong>Asks:</strong> {t.asks}
              </p>
              <p>
                <strong>Gives back:</strong> {t.gives}
              </p>
              <p>
                <strong>Example:</strong> {examples[i]}
              </p>
            </li>
          ))}
        </ul>
        <p>
          <strong>Worked example.</strong> A weather app and a photo app both
          “use AI”. Ask what each gives back. The weather app gives a number
          (rain in millimetres), so its job is to <em>predict</em>. The photo
          app gives one label per picture from a fixed list, so its job is to{" "}
          <em>classify</em>. Neither one chats.
        </p>
        <p>
          These jobs are about <em>what</em> a system does. Lesson 1 was about{" "}
          <em>how</em> it is built, with rules, learning or both. The same job
          can be done in different ways.
        </p>
      </section>
      <section id="sorter">
        <h2 tabIndex={-1}>Which job is it?</h2>
        <Sorter />
      </section>
      <section id="one-app">
        <h2 tabIndex={-1}>One product, several jobs.</h2>
        <p>
          Real products usually mix jobs. Take a made-up photo and music app. A
          single app like it could do all of this:
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.mix}>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Job</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Groups photos into Receipts and Screenshots</td>
                <td>Classify</td>
              </tr>
              <tr>
                <td>Suggests songs for your evening</td>
                <td>Recommend</td>
              </tr>
              <tr>
                <td>Estimates how much storage you will use this year</td>
                <td>Predict</td>
              </tr>
              <tr>
                <td>Writes a caption for a photo</td>
                <td>Generate</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Only the last one is the kind of thing most people call “generative
          AI”, and it may or may not be a chat. So “the AI” in a product is
          often several separate parts.
        </p>
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Where this picture is too tidy.</h2>
        <ul>
          <li>
            <strong>Features can blur.</strong> The jobs overlap. Predicting a
            yes/no outcome looks like classifying; the difference is whether the
            answer is still unknown (predict) or you are labelling something
            already there (classify). A recommender may use a guess about what
            you will like, and a feature may do two jobs, such as classifying a
            message and then generating a reply. Name each part by its purpose
            and what it gives back.
          </li>
          <li>
            <strong>The list is not complete.</strong> These five are common
            ones. Other jobs exist, such as turning speech into text.
          </li>
          <li>
            <strong>Labels are not guarantees.</strong> A product that says
            “AI-powered” may use learning, fixed rules or a mix. Naming the job
            tells you what it does, not how well, or how it was built.
          </li>
          <li>
            <strong>Any job can be wrong.</strong> Predictions miss, labels
            misfile, recommendations can miss your taste and generated text can
            be wrong. Check what matters.
          </li>
        </ul>
      </section>
      <Check
        id="check"
        question="A shopping app has no chat box. It shows a row called “You might also like”, with a few items picked from its catalogue to suit you. Which statement fits best?"
        options={[
          "It cannot be AI, because AI means a chatbot you talk to.",
          "It is generating, because the list did not exist before you opened the app.",
          "It is recommending: picking a few existing items to suit you. AI does not need a chat window.",
          "It is predicting, because every output of AI is a number.",
        ]}
        correct={2}
        wrongFeedback={[
          "A chat window is only one interface. The job here, picking items for you, is a common job for AI systems and needs no chat.",
          "Generating means making new content. This feature picks items that already exist in the catalogue, which is recommending.",
          "",
          "Not every output of an AI system is a number. Classifying gives labels and generating gives new content. This feature picks a few existing items to suit you, which is recommending.",
        ]}
        explanation="Use the output as a clue to the job. A short list picked from many existing items is recommending, and it can sit in a product with no chat at all."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            AI is not just a chatbot. A chat box is one interface. Behind
            everyday products are jobs such as predicting, classifying,
            recommending, generating and planning, and one product often mixes
            several. Ask what a feature is for and what it gives back, and name
            the job.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

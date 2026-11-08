import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { AssistantLab } from "./AssistantLab";

export default function Lesson() {
  return (
    <LessonFrame
      number="04"
      title="From base model to assistant"
      lead="A raw base model is trained to predict the next token on internet text, not to answer your questions. How does a predictor become a helpful assistant that follows instructions?"
    >
      <section id="two-jobs">
        <h2 tabIndex={-1}>A predictor is not an assistant.</h2>
        <p>
          In previous lessons, we saw that language models predict the next
          likely token based on patterns learned during pretraining. When a
          model finishes pretraining on massive web archives, it is known as a{" "}
          <strong>raw base model</strong> (or foundation model).
        </p>
        <p>
          Base models are capable pattern continuators, but they do not know
          they are chatbots. If you give a base model the prompt{" "}
          <em>“Write three reasons why honey doesn’t spoil,”</em> it might not
          answer you. Instead, it might generate:
        </p>
        <pre>
          <code>{`Write three reasons why honey doesn't spoil.\nWrite three reasons why bread goes stale.\nWrite three reasons why milk curdles.`}</code>
        </pre>
        <p>
          To the base model, your prompt looks like line 1 of a school study
          guide or a teacher’s quiz. Predicting more quiz questions is a
          statistically valid continuation of internet text. To turn a base
          model into a helpful tool, engineers must train it for a very
          different job: <strong>instruction following</strong>.
        </p>
        <div className="callout">
          <strong>Key insight:</strong> A base model asks:{" "}
          <em>“What text commonly follows this sequence online?”</em> An
          assistant asks:{" "}
          <em>“What is the most helpful answer to this user’s request?”</em>
        </div>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Guess which reply is base vs assistant.</h2>
        <p>
          Test your intuition with three realistic scenarios below. Each prompt
          was fed to both a raw base model and an instruction-tuned assistant.
          Inspect the completions, guess which one came from the assistant, and
          explore why each model responded the way it did.
        </p>
        <AssistantLab />
      </section>

      <section id="tuning">
        <h2 tabIndex={-1}>What instruction tuning changes.</h2>
        <p>
          The process that bridges the gap between a base model and an assistant
          is called <strong>Instruction Tuning</strong>, commonly implemented
          through <strong>Supervised Fine-Tuning (SFT)</strong>.
        </p>
        <p>
          Instead of reading raw web pages, the model is trained on hundreds of
          thousands of carefully authored demonstrations consisting of paired
          turns:
        </p>
        <pre>
          <code>{`User: Explain photosynthesis in simple terms for a 10-year-old.\nAssistant: Photosynthesis is how plants make their food using sunlight, water, and air...`}</code>
        </pre>
        <p>
          During fine-tuning, backpropagation updates the model’s weights. The
          network learns:
        </p>
        <ul>
          <li>
            <strong>Turn boundaries:</strong> Special delimiter tokens (such as{" "}
            <code>&lt;|im_start|&gt;user</code> and{" "}
            <code>&lt;|im_start|&gt;assistant</code>) teach the model when to
            stop listening and start answering.
          </li>
          <li>
            <strong>Instruction following:</strong> The weights adjust so that
            imperative verbs (<em>summarize</em>, <em>translate</em>,{" "}
            <em>compare</em>) increase the probability of an answer fulfilling
            the task, rather than echoing the prompt.
          </li>
          <li>
            <strong>Constraint handling:</strong> The model learns to respect
            length limits (<em>“in one sentence”</em>), format requirements (
            <em>“as a JSON object”</em>), and tone guidelines.
          </li>
        </ul>
        <p>
          Later stages, such as Reinforcement Learning from Human Feedback
          (RLHF) or Direct Preference Optimization (DPO), further align the
          model by rewarding helpful, safe, and honest completions while
          penalizing harmful or evasive ones.
        </p>
      </section>

      <section id="prompt-fallacy">
        <h2 tabIndex={-1}>Why a prompt wrapper is not enough.</h2>
        <p>
          A common misconception is that an assistant is just a raw base model
          with a hidden system prompt prepended, such as:
        </p>
        <pre>
          <code>
            {`"You are a helpful assistant. Please answer this query: " + user_input`}
          </code>
        </pre>
        <p>
          This does not work reliably on a raw base model. Because the weights
          have not been instruction-tuned, the model treats the entire
          string—wrapper included—as arbitrary text to continue. It might
          generate another prompt wrapper, pretend to be a user asking another
          question, or complete a dialogue script from a screenplay.
        </p>
        <div className="callout">
          <strong>The difference:</strong> A system prompt <em>steers</em> an
          assistant that already understands conversational roles. Instruction
          tuning <em>creates</em> the capability to follow roles in the first
          place.
        </div>
      </section>

      <Check
        id="check"
        question="Why can’t you turn a raw base model into a reliable assistant simply by prefixing every prompt with 'You are a helpful assistant'?"
        options={[
          "Because base models can only generate numbers and code, not natural conversational English.",
          "Because a prompt prefix only adds more context to complete; without instruction tuning, the model may still continue the text as a list, forum thread, or script rather than following the instruction.",
          "Because prompt wrappers only function if the user writes in the model’s native training language.",
          "Because base models automatically discard any text appearing before the first colon or question mark.",
        ]}
        correct={1}
        explanation="A raw base model is purely a pattern completer. Adding 'You are a helpful assistant' simply makes it predict what typically follows that phrase on the internet (e.g. continuing with more assistant descriptions, dialogues, or unrelated questions). Instruction tuning updates the actual model weights on thousands of instruction-response pairs so it learns to follow commands."
        wrongFeedback={[
          "Base models produce natural language fluently—in fact, they are trained on billions of pages of natural text. The limitation is that they complete text patterns rather than obeying instructions.",
          "",
          "Base models handle multiple languages depending on their pretraining data. Language is not the reason prompt prefixes fail to create an assistant persona.",
          "Base models process the entire context window. They do not discard text before punctuation.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className="callout">
          <p>
            <strong>
              Pretraining builds the knowledge; instruction tuning builds the
              assistant.
            </strong>
          </p>
          <p>
            A base model learns grammar, facts, and reasoning by predicting next
            tokens across the open web. Instruction tuning changes the model’s
            weights to treat user input as instructions to fulfill rather than
            patterns to continue. Prompting guides an assistant, but training
            makes one.
          </p>
        </div>
        <p>
          Next up: see how parameter count and model size affect a model’s
          capacity and performance.
        </p>
        <div className="end-lesson">
          <Link className="text-link" href="/learn/genai-basics/c2-05">
            Next lesson: Parameters and model size →
          </Link>
        </div>
      </section>
    </LessonFrame>
  );
}

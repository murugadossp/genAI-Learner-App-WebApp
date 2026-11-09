import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { StringPipelineVisual } from "./StringPipelineVisual";
import { StringLab } from "./StringLab";
import stringsDiagramImg from "./python-strings-model.jpg";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="03"
      title="Strings"
      lead="Building AI applications means transforming unstructured user queries, cleaning messy webhooks, interpolating variables into prompt templates, and parsing model outputs. Python strings provide the computational foundation to clean, structure, and format text reliably."
    >
      <section id="quotes-and-multiline">
        <h2 tabIndex={-1}>Quotes: Choosing boundaries for prompts and text.</h2>
        <p>
          In Python, text is represented as a <strong>string</strong> (type{" "}
          <code>str</code>). You create strings by wrapping characters in quote
          delimiters. Python offers single quotes (<code>&apos;...&apos;</code>
          ), double quotes (<code>&quot;...&quot;</code>), and triple quotes (
          <code>&quot;&quot;&quot;...&quot;&quot;&quot;</code>).
        </p>

        <p>
          While single and double quotes behave identically, choosing double
          quotes prevents common syntax errors when your text contains
          apostrophes:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # The apostrophe terminates a single-quoted string prematurely:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeBad}>
              bad_query = &apos;Don&apos;t hallucinate&apos;
            </span>{" "}
            <span className={styles.codeComment}>
              # SyntaxError: unterminated string
            </span>
          </p>
          <div className={styles.codeComment} style={{ marginTop: "0.5rem" }}>
            # Double quotes allow apostrophes to sit harmlessly inside:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>safe_query</span> ={" "}
            <span className={styles.codeString}>
              &quot;Don&apos;t hallucinate&quot;
            </span>{" "}
            <span className={styles.codeComment}># Clean and valid</span>
          </p>
        </div>

        <p>
          When you write long system instructions for an LLM that span multiple
          lines, use <strong>triple quotes</strong>. Triple quotes preserve all
          line breaks and formatting verbatim:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>system_prompt</span> ={" "}
            <span className={styles.codeString}>
              &quot;&quot;&quot;You are an AI support assistant.
              <br />
              Follow these rules:
              <br />
              1. Be concise and polite.
              <br />
              2. Cite reference order numbers.&quot;&quot;&quot;
            </span>
          </p>
        </div>

        <figure className={styles.figure}>
          <Image
            src={stringsDiagramImg}
            alt="Educational diagram illustrating Python string quotes, string immutability in memory, and f-string prompt variable interpolation"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
          <figcaption className="micro">
            Figure 1: The three mental models of Python strings in AI: quote
            delimiters for apostrophes and multiline prompts, string
            immutability across method calls, and f-string variable
            interpolation.
          </figcaption>
        </figure>
      </section>

      <section id="cleaning-and-immutability">
        <h2 tabIndex={-1}>
          Cleaning and immutability: Stripping whitespace and lowercasing.
        </h2>
        <p>
          Real user inputs arriving into an AI pipeline rarely arrive clean.
          Webhooks and chat boxes frequently introduce trailing spaces,
          irregular capitalization, and stray characters:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>raw_query</span> ={" "}
            <span className={styles.codeString}>
              &quot; RefunD for Order #881 &quot;
            </span>
          </p>
        </div>

        <p>
          Python provides string methods to clean this data before passing it to
          embeddings or intent classifiers:
        </p>

        <ul>
          <li>
            <code>.strip()</code>: Trims whitespace (spaces, tabs, newlines)
            from both the start and end of the string. It does <em>not</em>{" "}
            remove spaces between words.
          </li>
          <li>
            <code>.lower()</code>: Converts all uppercase letters to lowercase,
            preventing case discrepancies between user searches and database
            keys.
          </li>
        </ul>

        <p>
          You can chain these methods left-to-right to clean the query in a
          single concise line:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # .strip() runs first on raw_query, then .lower() runs on the
            stripped result:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>clean_query</span> ={" "}
            <span className={styles.codeVar}>raw_query</span>.strip().lower()
          </p>
          <div className={styles.codeComment}>
            # Result stored in clean_query: &quot;refund for order #881&quot;
          </div>
        </div>

        <div className="callout">
          <strong>Fundamental Concept: Strings are Immutable.</strong> In
          Python, strings cannot be changed after creation. String methods never
          modify the original object in memory; they return a <em>brand new</em>{" "}
          string. If you write <code>raw_query.strip()</code> without storing
          the return value (e.g. <code>clean = raw_query.strip()</code>), the
          cleaned text is discarded and <code>raw_query</code> remains
          completely unaltered.
        </div>

        <StringPipelineVisual />
      </section>

      <section id="replace-and-split">
        <h2 tabIndex={-1}>
          Transforming: Replacing tokens and splitting words.
        </h2>
        <p>
          Beyond trimming whitespace and adjusting casing, pipelines often need
          to sanitize punctuation or isolate individual words:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Replace target characters: replace(old, new)
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>clean_query</span> ={" "}
            <span className={styles.codeVar}>clean_query</span>.replace(
            <span className={styles.codeString}>&quot;#&quot;</span>,{" "}
            <span className={styles.codeString}>&quot;no. &quot;</span>)
          </p>
          <div className={styles.codeComment}>
            # clean_query is now: &quot;refund for order no. 881&quot;
          </div>
        </div>

        <p>
          Notice again that we reassigned <code>clean_query</code>! Because
          strings are immutable, calling <code>.replace()</code> without saving
          its return value leaves the string unchanged.
        </p>

        <p>
          When you want to count words or inspect tokens, use{" "}
          <code>.split()</code>. By default, <code>.split()</code> slices the
          string wherever whitespace occurs and returns the words grouped in
          brackets <code>[...]</code>:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>words</span> ={" "}
            <span className={styles.codeVar}>clean_query</span>.split()
          </p>
          <div className={styles.codeComment}>
            # words evaluates to: [&apos;refund&apos;, &apos;for&apos;,
            &apos;order&apos;, &apos;no.&apos;, &apos;881&apos;]
          </div>
        </div>

        <p className="micro" style={{ color: "var(--muted)" }}>
          Note: Python groups separated words into a <strong>list</strong> (
          <code>[...]</code>). We will explore list indexing, slicing, and list
          methods in depth in Lesson 04 (Lists).
        </p>
      </section>

      <section id="fstrings-and-prompts">
        <h2 tabIndex={-1}>F-strings: Interpolating dynamic prompts safely.</h2>
        <p>
          Modern LLM applications rarely send static text. Instead, you
          construct dynamic prompts combining system instructions, user names,
          and cleaned queries.
        </p>

        <p>
          In modern Python, you do this using <strong>f-strings</strong>{" "}
          (formatted string literals). Place the letter <code>f</code> directly
          before the opening quote, and place any Python variable or expression
          inside curly braces <code>&#123;...&#125;</code>:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>user_id</span> ={" "}
            <span className={styles.codeString}>&quot;Alex&quot;</span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>prompt</span> ={" "}
            <span className={styles.codeKeyword}>f</span>
            <span className={styles.codeString}>
              &quot;User: &#123;user_id&#125;\nQuery:
              &#123;clean_query&#125;&quot;
            </span>
          </p>
          <div className={styles.codeComment} style={{ marginTop: "0.35rem" }}>
            # Evaluates to:
            <br /># &quot;User: Alex\nQuery: refund for order no. 881&quot;
          </div>
        </div>

        <div className="callout">
          <strong>The Missing &apos;f&apos; Trap:</strong> If you omit the
          leading <code>f</code> and write{" "}
          <code>&quot;User: &#123;user_id&#125;&quot;</code>, Python treats the
          curly braces as literal characters. The AI model receives the text{" "}
          <code>&#123;user_id&#125;</code> rather than <code>Alex</code>. Always
          double-check that your prompt template begins with <code>f</code>.
        </div>

        <p>
          You can check the total character length of any string using the
          built-in <code>len()</code> function:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>prompt_chars</span> = len(
            <span className={styles.codeVar}>prompt</span>){" "}
            <span className={styles.codeComment}>
              # Returns integer count, e.g., 42
            </span>
          </p>
        </div>

        <p>
          Monitoring <code>len(prompt)</code> is an essential safeguard in AI
          systems to prevent queries from exceeding token limits and model
          context windows.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>
          Inspect string transformations in the AI prompt sandbox.
        </h2>
        <p>
          Experiment with how raw webhook text, whitespace trimming, casing,
          character replacements, and f-string interpolation interact in a live
          pipeline:
        </p>

        <StringLab />
      </section>

      <Check
        id="check"
        question="An AI engineer receives raw customer input and writes the following pipeline code:
raw_query = '   RefunD for Order #881   '
raw_query.strip().lower()
prompt = f'Process: {raw_query}'

What exact text is stored in prompt?"
        options={[
          "Process: refund for order #881",
          "Process: {raw_query}",
          "Process:    RefunD for Order #881   ",
          "Process: RefunDforOrder#881",
        ]}
        correct={2}
        wrongFeedback={[
          "Because strings in Python are immutable, calling raw_query.strip().lower() without assigning the result returns a new string and leaves raw_query completely unchanged in memory, retaining its original outer spaces and capital D.",
          'The f prefix in f"Process: {raw_query}" causes Python to evaluate the variable raw_query, rather than rendering the literal characters "{raw_query}".',
          "",
          "The .strip() method removes only leading and trailing whitespace, never spaces between words. Furthermore, because raw_query was not reassigned, it retained its original spacing.",
        ]}
        explanation="Strings in Python are immutable. Method calls like raw_query.strip().lower() do not modify raw_query in place; they return a brand new string. Because the return value was not stored under a name tag (such as clean = raw_query.strip().lower()), the cleaned string was discarded, and raw_query retained its original spaces and capital 'D'. When interpolated into the f-string, prompt receives the unmodified raw text: 'Process:    RefunD for Order #881   '."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Python strings (<code>str</code>) are the backbone of prompt
            engineering and AI data preparation. Use double quotes (
            <code>&quot;...&quot;</code>) to avoid apostrophe syntax bugs, and
            triple quotes (<code>&quot;&quot;&quot;...&quot;&quot;&quot;</code>)
            for multiline prompts. Remember that strings are{" "}
            <strong>immutable</strong>: methods like <code>.strip()</code> and{" "}
            <code>.lower()</code> return brand new strings and leave the
            original untouched. When building prompts, always prefix templates
            with <code>f</code> (<code>f&quot;...&#123;var&#125;...&quot;</code>
            ) so expressions evaluate to real values, and monitor prompt size
            with <code>len()</code>.
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-p1">
          Next up: Lists in Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

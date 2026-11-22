import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ValidationLab } from "./ValidationLab";
import formatRequestImg from "./format-request.webp";
import validateReplyImg from "./validate-reply.webp";
import styles from "./lesson.module.css";

function Code({ children, label }: { children: string; label: string }) {
  return (
    <pre
      className={styles.codePanel}
      tabIndex={0}
      role="region"
      aria-label={label}
    >
      <code>{children}</code>
    </pre>
  );
}

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{
        label: "Prompting and Working with AI",
        href: "/course/chapter-3",
      }}
      number="5"
      title="Requesting structured outputs"
      lead="Ask an AI model for tables or labeled fields so replies are easy to scan or reuse—and check both the shape and the facts before you rely on them."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Ask for a shape, then check it.</h2>
        <p>
          In Lesson 3.1, you practiced giving an AI a clear goal and audience.
          Often, you also need the answer in a predictable shape—such as a table
          for a spreadsheet or labeled fields for a tool—instead of a long
          paragraph.
        </p>
        <p>You will use four terms in this lesson, in order:</p>
        <ol>
          <li>
            <strong>Structured output:</strong> A reply organized into
            predictable parts, such as a table or labeled fields, instead of
            free-flowing prose.
          </li>
          <li>
            <strong>JSON (JavaScript Object Notation):</strong> A plain-text
            format that pairs field names with values inside curly braces{" "}
            <code>{`{ }`}</code>, commonly used when software reads the reply.
          </li>
          <li>
            <strong>Schema (field rules):</strong> Your list of required field
            names, allowed values, and what to write when a detail is missing.
          </li>
          <li>
            <strong>Validation:</strong> Checking a reply against your schema
            rules—and separately checking its values against your source text—
            before you use it.
          </li>
        </ol>
        <p>
          Every example in this lesson starts from the same illustrative event
          message:
        </p>
        <div className={styles.noteBox}>
          <span className={styles.noteLabel}>Illustrative source note</span>
          &ldquo;Hi! Our neighborhood bike repair clinic is on Saturday, May 16
          at Oak Park Shelter. It&apos;s free for all ages—no registration
          needed, just drop by!&rdquo;
        </div>
      </section>

      <section id="formats">
        <h2 tabIndex={-1}>Pick a format that fits who will use the reply.</h2>
        <p>
          Think of handing someone a blank sticky note versus a printed form
          with labeled boxes. Both hold the same information, but labeled boxes
          make every detail easy to find in the same spot.
        </p>
        <p>
          A practical way to choose a structured format is to ask{" "}
          <strong>who will read the reply next</strong>:
        </p>
        <ul>
          <li>
            <strong>Table (rows and columns):</strong> Typical choice when a{" "}
            <strong>person</strong> will scan, compare items, or paste into a
            spreadsheet.
          </li>
          <li>
            <strong>JSON (labeled key-value fields):</strong> Typical choice
            when <strong>software or an automation tool</strong> needs to read
            specific fields by name.
          </li>
        </ul>
        <p>
          These roles overlap in practice—people can read short JSON and tools
          can parse clean tables—so treat this as a practical guideline rather
          than a strict rule.
        </p>

        <figure className={styles.figure}>
          <Image
            src={formatRequestImg}
            alt="Diagram titled Requesting structured outputs: Turn a messy note into a predictable shape. Left to right flow: a blue Messy note card (Bike clinic, May 16, Oak Park, free) points to a lavender Prompt plus field rules card with chips event, date, location, and cost, which branches right into two green output cards: Table for people to scan and JSON for software to read. Bottom strip: Name the format and exact fields you need."
            sizes="(max-width: 768px) 100vw, 720px"
          />
          <figcaption className="micro">
            Start from the same source note, then request the format that fits
            the next step.
          </figcaption>
        </figure>

        <p>
          Here is the same bike repair clinic note turned into a table for a
          volunteer and into JSON for a calendar script:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">event</th>
                <th scope="col">date</th>
                <th scope="col">location</th>
                <th scope="col">cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bike repair clinic</td>
                <td>Saturday, May 16</td>
                <td>Oak Park Shelter</td>
                <td>free</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Code label="Illustrative JSON output for the bike repair clinic note">
          {`{
  "event": "Bike repair clinic",
  "date": "Saturday, May 16",
  "location": "Oak Park Shelter",
  "cost": "free"
}`}
        </Code>

        <p>
          Outside this example, you might ask for a <strong>table</strong> to
          compare three apartments side by side for yourself, while an online
          store sends an order receipt as <strong>JSON</strong> so a shipping
          system can read the address field automatically.
        </p>
      </section>

      <section id="schema">
        <h2 tabIndex={-1}>
          Spell out the fields, values, and missing-data rule.
        </h2>
        <p>
          A paper form works best when it tells you exactly how to fill each
          box—for instance, &ldquo;Write Yes, No, or Unknown.&rdquo; A
          structured-output prompt needs the same clarity.
        </p>
        <p>Include four details in your schema rules:</p>
        <ol>
          <li>
            <strong>Exact field names:</strong> Name every key (
            <code>event</code>, <code>date</code>, <code>location</code>,{" "}
            <code>cost</code>) so the model does not invent synonyms like{" "}
            <code>place</code>.
          </li>
          <li>
            <strong>Allowed values or types:</strong> State whether a field is
            short text or restricted to a fixed list—here, <code>cost</code>{" "}
            must be <code>&quot;free&quot;</code>, <code>&quot;paid&quot;</code>
            , or <code>&quot;unknown&quot;</code>.
          </li>
          <li>
            <strong>Missing-data rule:</strong> Say what to write when a detail
            is absent (such as <code>&quot;unknown&quot;</code>) so the model
            does not guess.
          </li>
          <li>
            <strong>Output boundary:</strong> Ask for only the table or JSON
            object, with no extra intro or closing sentences.
          </li>
        </ol>

        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <h3>Vague prompt</h3>
            <p className="micro">Leaves keys and values up to chance</p>
            <p>
              &ldquo;Turn this event message into JSON so I can save it.&rdquo;
            </p>
          </div>
          <div className={styles.compareCard}>
            <h3>Clear schema prompt</h3>
            <p className="micro">Names exact keys, values, and boundary</p>
            <p>
              &ldquo;Extract this note into a single JSON object with keys{" "}
              <code>event</code>, <code>date</code>, <code>location</code>, and{" "}
              <code>cost</code>. Set <code>cost</code> to{" "}
              <code>&quot;free&quot;</code>, <code>&quot;paid&quot;</code>, or{" "}
              <code>&quot;unknown&quot;</code>. Use{" "}
              <code>&quot;unknown&quot;</code> for any missing detail. Return
              only the JSON object.&rdquo;
            </p>
          </div>
        </div>

        <p>
          In everyday life, a restaurant allergen card uses the same idea: each
          ingredient is marked <code>yes</code>, <code>no</code>, or{" "}
          <code>unknown</code> so staff never have to interpret a blank line or
          a vague note.
        </p>
      </section>

      <section id="why-check">
        <h2 tabIndex={-1}>Asking for a format does not guarantee it.</h2>
        <p>
          A common misconception is that asking for JSON or a table guarantees a
          valid result. By default, a chat prompt asks a language model to
          predict text one token (small piece of text) at a time rather than
          locking it into a rigid form.
        </p>
        <p>
          Even with a clear schema prompt, a reply can still break in common
          ways. Check every structured reply in two layers:
        </p>
        <ol>
          <li>
            <strong>Valid JSON syntax:</strong> The reply parses cleanly as a
            JSON object, with no extra intro text, missing quotes, or broken
            braces.
          </li>
          <li>
            <strong>Exact required fields:</strong> Every requested key is
            present with the exact spelling—no missing <code>location</code> or
            renamed <code>place</code>.
          </li>
          <li>
            <strong>Allowed values:</strong> Every text field is non-empty, and{" "}
            <code>cost</code> is one of <code>&quot;free&quot;</code>,{" "}
            <code>&quot;paid&quot;</code>, or <code>&quot;unknown&quot;</code>.
          </li>
          <li>
            <strong>Source accuracy (separate check):</strong> Confirm the
            values match the original note. Valid JSON only proves the{" "}
            <em>shape</em>, not the <em>facts</em>.
          </li>
        </ol>

        <figure className={styles.figure}>
          <Image
            src={validateReplyImg}
            alt="Diagram titled Validating a JSON reply: Check the shape first, then check the facts. Left to right flow: a blue JSON reply card points to a lavender Format checks card listing 1. Valid syntax, 2. Required fields, and 3. Allowed values, which branches right into a green Valid shape card (Check facts next) and a red Format error card (Fix or retry). Bottom strip: Valid JSON proves the shape, not the facts."
            sizes="(max-width: 768px) 100vw, 720px"
          />
          <figcaption className="micro">
            Format checks catch broken structure; checking facts against the
            source is still a separate step.
          </figcaption>
        </figure>

        <p>
          In developer software, many AI services provide developer interfaces
          (APIs) with schema-constrained modes—settings that restrict the
          model&apos;s output to match a supplied schema—which strongly reduce
          syntax and field-name errors. Even then, those modes only enforce the
          shape; they cannot verify whether the values inside the fields are
          true.
        </p>

        <ul className={styles.qaList} aria-label="Quick questions">
          <li className={styles.qaItem}>
            <p className={styles.qaQuestion}>
              If a reply parses as valid JSON, can I trust the facts inside it?
            </p>
            <p className={styles.qaAnswer}>
              No. Valid JSON only means the punctuation and structure follow
              JSON rules; a model can still copy the wrong date or location.
            </p>
          </li>
          <li className={styles.qaItem}>
            <p className={styles.qaQuestion}>
              Why give a missing-data rule like &ldquo;unknown&rdquo;?
            </p>
            <p className={styles.qaAnswer}>
              Without an explicit fallback, a model may guess a plausible value
              just to fill every required field.
            </p>
          </li>
          <li className={styles.qaItem}>
            <p className={styles.qaQuestion}>
              Do I need to be a programmer to ask for structured output?
            </p>
            <p className={styles.qaAnswer}>
              No. Anyone can ask for a table with named columns or a short list
              of labeled fields and check them before reusing the result.
            </p>
          </li>
        </ul>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try it: Validate a JSON reply.</h2>
        <p className="micro">
          Illustrative simulation: these five replies are pre-written examples
          based on the bike repair clinic note, not live model calls. The
          validator runs fixed rules for this lesson&apos;s schema.
        </p>
        <p>Try the lab in this order:</p>
        <ol>
          <li>
            Start on <strong>Clean reply</strong> and confirm all three format
            checks pass.
          </li>
          <li>
            Select <strong>Wrapper text</strong>, <strong>Renamed field</strong>
            , and <strong>Unallowed value</strong> to see which specific check
            fails each time.
          </li>
          <li>
            Select <strong>Wrong fact</strong>: notice all three format checks
            pass, then compare <code>location</code> with the source note.
          </li>
          <li>
            Edit one broken reply in the text box—for example, remove the intro
            line in <strong>Wrapper text</strong>—to watch the checks turn green
            live, then use <strong>Reset lab</strong>.
          </li>
        </ol>

        <ValidationLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question='You ask an AI model to extract event details from an email into JSON with four required fields (event, date, location, cost), where every field must be non-empty text and cost must be "free", "paid", or "unknown". The reply parses as valid JSON, includes all four required fields with non-empty text values, and sets "cost": "free". What can you conclude?'
        options={[
          "The reply is completely accurate because valid JSON guarantees the model read the email correctly.",
          "You did not need to validate syntax because asking for JSON in the prompt guarantees valid JSON.",
          "The reply matches your format rules, and you still need to check that each field's value matches the original email.",
          "JSON only works for programmers, so you should switch to a paragraph reply to avoid mistakes.",
        ]}
        correct={2}
        explanation="Format validation confirms the reply is parseable JSON with the right field names and allowed values. Checking whether each value matches the source email is a separate step."
        wrongFeedback={[
          "Valid JSON only confirms the reply's structure and allowed values. A model can still copy the wrong date or location inside valid fields, so you still need to check the values against the email.",
          "Asking for JSON guides the model, but it does not guarantee valid syntax. By default, a model can still add extra wrapper text, drop a comma, or rename a field.",
          "",
          "Structured formats like tables and JSON help anyone inspect and reuse replies. Paragraph replies can still contain errors while being harder to check.",
        ]}
      />

      <section id="takeaway" className="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <ul>
          <li>
            Choose a <strong>table</strong> when people will scan the reply, or{" "}
            <strong>JSON</strong> when software will read labeled fields.
          </li>
          <li>
            Write clear <strong>schema rules</strong>: exact field names,
            allowed values, a missing-data rule like{" "}
            <code>&quot;unknown&quot;</code>, and an output boundary.
          </li>
          <li>
            Never assume asking guarantees the format: validate{" "}
            <strong>syntax</strong>, <strong>required fields</strong>, and{" "}
            <strong>allowed values</strong>, then check the{" "}
            <strong>facts</strong> against your source.
          </li>
        </ul>
      </section>
    </LessonFrame>
  );
}

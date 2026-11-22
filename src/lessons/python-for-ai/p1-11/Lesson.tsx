import Link from "next/link";
import Image from "next/image";
import parseImage from "./parse.webp";
import handleImage from "./handle.webp";
import validateImage from "./validate.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { ParsingLab } from "./ParsingLab";
import styles from "./lesson.module.css";

function Code({ children }: { children: string }) {
  return (
    <pre className={styles.code} tabIndex={0}>
      <code>{children}</code>
    </pre>
  );
}

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="11"
      title="Errors and safe parsing"
      lead="Turn text into a number, handle a conversion error, and check whether the number fits your task."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>From text to a usable number</h2>
        <p>
          Imagine a form asking how many documents to process. This example
          accepts whole numbers from 0 to 5, including both ends.
        </p>
        <ol>
          <li>
            <strong>Parsing:</strong> turn text into a value, such as the
            integer 3.
          </li>
          <li>
            <strong>Exception:</strong> a signal that an operation could not
            finish normally. We will handle a <code>ValueError</code> from
            conversion.
          </li>
          <li>
            <strong>Validation:</strong> check whether a converted value meets
            the form’s rule.
          </li>
        </ol>
        <p>
          These are separate steps: a number can parse successfully and still be
          outside the allowed range.
        </p>
      </section>
      <section id="parse">
        <h2 tabIndex={-1}>Parse the text first</h2>
        <p>
          A written label is not the object it describes. Similarly,{" "}
          <code>'3'</code> is text; <code>3</code> is an integer, a whole-number
          value.
        </p>
        <figure className={styles.figure}>
          <Image
            src={parseImage}
            alt="Text 3 goes through int and becomes number 3."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            The text 3 becomes the number 3.
          </figcaption>
        </figure>
        <Code>{"text = '3'\nnumber = int(text)  # number is 3"}</Code>
        <p>
          <code>int</code> converts this text to an integer. For example, a
          quantity typed into a shopping form also starts as text and may need
          conversion before arithmetic.
        </p>
        <p>
          Python accepts leading or trailing whitespace and an optional sign
          attached to the digits: <code>int(' -1 ')</code> returns{" "}
          <code>-1</code>. It does not accept every string;{" "}
          <code>int('three')</code> raises <code>ValueError</code>.
        </p>
      </section>
      <section id="handle">
        <h2 tabIndex={-1}>Handle a conversion error</h2>
        <p>
          Like a clerk setting aside an unreadable form, an exception handler
          gives the program a path for an expected problem. An exception
          interrupts the normal path; an unhandled one can stop the program.
        </p>
        <figure className={styles.figure}>
          <Image
            src={handleImage}
            alt="The text three enters int, which raises ValueError."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">
            This conversion raises ValueError.
          </figcaption>
        </figure>
        <Code>
          {
            "text = 'three'\ntry:\n    number = int(text)\nexcept ValueError:\n    print('Enter a whole number.')\nelse:\n    print('Converted:', number)"
          }
        </Code>
        <p>
          Python tries the conversion. For <code>'three'</code>, it jumps to the
          matching <code>except</code> and skips <code>else</code>; no number
          was assigned by that conversion. For <code>'3'</code>, conversion
          succeeds and <code>else</code> runs.
        </p>
        <p>
          Keep the <code>try</code> block narrow so the handler identifies this
          expected failure. Other exceptions are not handled by this{" "}
          <code>except ValueError</code>.
        </p>
        <p>
          For another example, a program reading an age can ask for a new entry
          when conversion fails instead of pretending the age was zero.
        </p>
      </section>
      <section id="validate">
        <h2 tabIndex={-1}>Validate the converted value</h2>
        <p>
          Parsing asks “is this a number?” Validation asks “is this number
          allowed here?” A successfully read ticket number can still be outside
          the event’s valid range.
        </p>
        <figure className={styles.figure}>
          <Image
            src={validateImage}
            alt="The number 7 is checked against 0–5 and rejected."
            sizes="(max-width: 720px) 100vw, 720px"
          />
          <figcaption className="micro">The range rule rejects 7.</figcaption>
        </figure>
        <Code>
          {
            "text = input('Documents (0–5): ')\ntry:\n    number = int(text)\nexcept ValueError:\n    print('Enter a whole number.')\nelse:\n    if 0 <= number <= 5:\n        print('Accepted:', number)\n    else:\n        print('Choose from 0 to 5.')"
          }
        </Code>
        <p>
          For <code>'7'</code>, conversion returns 7; the range check rejects
          it. For <code>'0'</code>, conversion returns 0 and the rule accepts
          it. Do not use zero as an error substitute: it is a valid answer here.
        </p>
        <p>
          The check sits in <code>else</code>, so a failed conversion never
          attempts to use <code>number</code>. This one attempt reports the
          problem; a caller or user can try again.
        </p>
        <h3>Quick questions</h3>
        <ul>
          <li>
            Does an exception prove the user entered zero? No, the conversion
            did not produce a number.
          </li>
          <li>
            Does successful conversion prove the value is allowed? No, the range
            rule is separate.
          </li>
        </ul>
      </section>
      <section id="lab">
        <h2 tabIndex={-1}>Trace the two steps</h2>
        <p>
          With <code>'3'</code>, conversion produces 3 and the range check
          accepts it. Now compare other examples.
        </p>
        <ol>
          <li>Select a sample text.</li>
          <li>Read the conversion result.</li>
          <li>Check whether validation runs and compare the outcome.</li>
        </ol>
        <p>
          This illustration uses fixed examples to expose each path; it is not a
          running Python interpreter or a complete parser.
        </p>
        <ParsingLab />
      </section>
      <Check
        id="check"
        question="A form accepts whole numbers from 0 to 5 inclusive. The text '7' is passed to int(). What happens in the example above?"
        options={[
          "Conversion raises ValueError, so the handler runs.",
          "Conversion returns 7, then the range check rejects it.",
          "Conversion returns 7, so the form must accept it.",
        ]}
        correct={1}
        explanation="int('7') returns 7, but 7 is outside the stated range."
        wrongFeedback={[
          "The text '7' can be converted to an integer; the handler does not run for this conversion.",
          "",
          "Conversion and the form’s range rule are separate checks.",
        ]}
      />
      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you</h2>
        <div className="callout">
          <p>
            Convert text, handle the expected conversion error, then validate
            the value against the task’s rule. Keep valid values such as zero
            distinct from failure.
          </p>
        </div>
        <p>
          <Link href="/course/chapter-p1">Return to Python for AI</Link>
        </p>
      </section>
    </LessonFrame>
  );
}

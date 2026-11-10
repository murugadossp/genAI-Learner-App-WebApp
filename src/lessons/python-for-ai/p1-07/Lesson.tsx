import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { IfLab } from "./IfLab";
import chainImage from "./chain.webp";
import orderImage from "./order.webp";
import boundaryImage from "./boundary.webp";
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
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="07"
      title="If-else statements"
      lead="A program often has to pick one path. An if statement runs a block of code only when a test is true, so the same program can react differently to different inputs."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>If-else statements: Choosing one path.</h2>
        <p>Each term is defined where it first appears, in this order:</p>
        <ol>
          <li>
            <strong>Comparison operators:</strong> symbols such as{" "}
            <code>&gt;=</code> (greater than or equal to) and <code>&gt;</code>{" "}
            (greater than) that build a condition.
          </li>
          <li>
            <strong>Condition:</strong> a test that gives <code>True</code> or{" "}
            <code>False</code>, such as <code>tokens_left &gt;= 1000</code>. (
            <code>True</code> and <code>False</code> are Python&apos;s two
            boolean values.)
          </li>
          <li>
            <strong>Branch:</strong> the block of lines under one{" "}
            <code>if</code>, <code>elif</code> or <code>else</code> line. Those
            lines are indented, as the section on colons explains.
          </li>
          <li>
            <strong>if, elif, else:</strong> a chain of tests that picks one
            branch to run. <code>elif</code> is short for &quot;else if&quot;.
          </li>
        </ol>
        <div className={styles.exampleBox}>
          <strong>Running example (invented numbers)</strong>
          <p>
            A chat has a limited <em>context window</em>, the amount of text a
            model can see at once. <code>tokens_left</code> counts how many
            tokens (pieces of text) are still free. The cut-offs 1000 and 200
            are made up for this lesson, and so is the rule that uses them. A
            real app would weigh more than one number. The cut-offs are not from
            any real model. For the window itself, see{" "}
            <Link className="text-link" href="/learn/genai-basics/c2-06">
              The context window
            </Link>
            .
          </p>
        </div>
      </section>

      <section id="first">
        <h2 tabIndex={-1}>One chain, one branch.</h2>
        <p>
          Python reads an if, elif, else chain from the top. It runs the first
          branch whose condition is <code>True</code>, then skips the rest. If
          no condition is <code>True</code>, the <code>else</code> branch runs.
          This example ends with an <code>else</code>. A chain without one can
          run no branch at all when every test is <code>False</code>.
        </p>
        <Code label="A three-branch chain with tokens_left set to 500">{`tokens_left = 500
if tokens_left >= 1000:
    action = "send_full_history"
elif tokens_left >= 200:
    action = "send_summary"
else:
    action = "start_new_chat"
print(action)
# send_summary`}</Code>
        <p>
          The first test, <code>500 &gt;= 1000</code>, is <code>False</code>, so
          Python moves to the <code>elif</code>. That test is <code>True</code>,
          so <code>action</code> becomes <code>&quot;send_summary&quot;</code>.
          The <code>else</code> line is skipped.
        </p>
        <figure className={styles.figure}>
          <Image
            src={chainImage}
            alt="Flowchart of the chain with two tests and three branches: Start leads to the test 1000 or more. Yes goes to Full history. No goes to the test 200 or more, where Yes goes to Summary and No goes to New chat."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Read the chain left to right. A later test is reached only when the
            test before it was <code>False</code>.
          </figcaption>
        </figure>
        <p>
          Everyday analogy: packing a bag for a day out. If it is raining, take
          an umbrella. Else, if it is hot, take water. Else, take a jacket. You
          follow one rule and stop, and the rules below it wait their turn.
        </p>
        <h3>How to read each line</h3>
        <ul>
          <li>
            <strong>The colon:</strong> <code>if</code>, <code>elif</code> and{" "}
            <code>else</code> lines end with a colon (<code>:</code>).
          </li>
          <li>
            <strong>The indent:</strong> the lines under a line with a colon are
            indented by four spaces. The examples use four spaces. Lines in one
            block must share the same indent.
          </li>
          <li>
            <strong>elif:</strong> a second test. Python checks it only when the
            first test was <code>False</code>.
          </li>
          <li>
            <strong>else:</strong> has no condition. It runs when every test
            above it was <code>False</code>.
          </li>
        </ul>
      </section>

      <section id="order">
        <h2 tabIndex={-1}>The first true test wins.</h2>
        <p>
          Only one branch runs, so the order of overlapping tests changes the
          answer. When the tests are thresholds like these (1000 or more, then
          200 or more), put the highest threshold first. A lower threshold
          placed above it catches values the higher one should handle. The order
          should follow the priority you want. It is not a general rule for
          every chain.
        </p>
        <Code label="Strictest test first, with tokens_left set to 1500">{`tokens_left = 1500
if tokens_left >= 1000:
    action = "send_full_history"
elif tokens_left >= 200:
    action = "send_summary"
else:
    action = "start_new_chat"
print(action)
# send_full_history`}</Code>
        <Code label="Loosest test first, with tokens_left set to 1500">{`tokens_left = 1500
if tokens_left >= 200:
    action = "send_summary"
elif tokens_left >= 1000:
    action = "send_full_history"
else:
    action = "start_new_chat"
print(action)
# send_summary`}</Code>
        <p>
          In the second version, the first test is <code>True</code> for 1500.
          The <code>elif</code> is never reached, so the output is{" "}
          <code>send_summary</code>, even though 1500 also meets the 1000 rule.
        </p>
        <figure className={styles.figure}>
          <Image
            src={orderImage}
            alt="Flowchart with the input 1500 entering the first test 1000 or more, a highlighted path to Full history, and the lower test 200 or more and Summary greyed out as skipped."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Once a test is <code>True</code>, the tests below it are skipped.
          </figcaption>
        </figure>
      </section>

      <section id="boundary">
        <h2 tabIndex={-1}>Including the boundary: &gt;= and &gt;.</h2>
        <p>
          A boundary is the exact number where a rule changes. The operator{" "}
          <code>&gt;=</code> means greater than or equal to, so it is{" "}
          <code>True</code> at the boundary itself. The operator{" "}
          <code>&gt;</code> means strictly greater than, so it is{" "}
          <code>False</code> at the boundary.
        </p>
        <Code label="Comparing values at the boundary 200">{`print(200 >= 200)   # True
print(200 > 200)    # False
print(199 >= 200)   # False`}</Code>
        <figure className={styles.figure}>
          <Image
            src={boundaryImage}
            alt="Number line with a hollow dot at 199 inside the New chat region and a filled dot at 200 at the start of the Summary region."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The rule <code>200 or more</code> includes the value 200 itself.
          </figcaption>
        </figure>
        <h3>Quick check</h3>
        <Check
          id="practice"
          title="Practice: Reading the boundary."
          question={`tokens_left = 200
if tokens_left >= 1000:
    action = "send_full_history"
elif tokens_left >= 200:
    action = "send_summary"
else:
    action = "start_new_chat"
print(action)

What does the program print?`}
          options={[
            "send_full_history",
            "send_summary",
            "start_new_chat",
            "Nothing is printed",
          ]}
          correct={1}
          wrongFeedback={[
            "The first test needs 1000 or more. 200 is below 1000, so that test is False.",
            "",
            "The elif test is 200 or more. 200 meets it, because >= includes 200, so the else branch is skipped.",
            "print(action) runs after the chain on every path, so something always prints.",
          ]}
          explanation={`200 >= 1000 is False, so Python checks the elif. 200 >= 200 is True, so action is "send_summary" and that is what prints.`}
        />
      </section>

      <section id="blocks">
        <h2 tabIndex={-1}>Colons, indentation and else.</h2>
        <p>
          Three details often trip up beginners. Each one is shown in the chain
          above.
        </p>
        <ul>
          <li>
            A missing colon at the end of an <code>if</code> line raises a{" "}
            <code>SyntaxError</code>.
          </li>
          <li>
            A branch that is not indented raises an{" "}
            <code>IndentationError</code>, because Python cannot tell which
            lines belong to the branch.
          </li>
          <li>
            <code>=</code> assigns a value, as in{" "}
            <code>action = &quot;x&quot;</code>. <code>==</code> compares two
            values and gives <code>True</code> or <code>False</code>, as in{" "}
            <code>200 == 200</code>. Use <code>==</code> on an <code>if</code>{" "}
            line.
          </li>
        </ul>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>In an if line, which symbol checks equality: = or ==?</dt>
          <dd>
            <code>==</code>. A single <code>=</code> assigns a value instead.
          </dd>
          <dt>Does an else line have a condition?</dt>
          <dd>
            No. It runs when every test above it was <code>False</code>.
          </dd>
          <dt>What happens when the lines under an if are not indented?</dt>
          <dd>
            Python raises <code>IndentationError</code>, because the branch is
            not marked.
          </dd>
        </dl>
      </section>

      <Check
        id="complete"
        title="Practice: Complete the chain."
        question={`tokens_left = 350
if tokens_left >= 1000:
    action = "send_full_history"
elif ______:
    action = "send_summary"
else:
    action = "start_new_chat"

Which test goes in place of ______ so that values from 200 to 999 give send_summary?`}
        options={[
          "tokens_left > 200",
          "tokens_left >= 200",
          "tokens_left == 200",
          "tokens_left < 200",
        ]}
        correct={1}
        wrongFeedback={[
          "> excludes 200 itself. With tokens_left = 200, this test is False and action is set to start_new_chat.",
          "",
          "== matches only the exact value 200. With 350, this test is False and action is set to start_new_chat.",
          "< 200 selects the values below 200, the opposite of the rule. With 350, this test is False and action is set to start_new_chat.",
        ]}
        explanation={`The rule is 200 or more, so the test is >= 200. The first test catches 1000 and above, so the elif covers 200 through 999.`}
      />

      <section id="lab">
        <h2 tabIndex={-1}>Try the token budget router.</h2>
        <p>
          The slider sets <code>tokens_left</code>. Highlighted lines are the
          assignment, the print, the tests Python checked, and the branch that
          ran. Dimmed lines were skipped.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>Set the slider to 500 and read which branch is highlighted.</li>
          <li>
            Press <code>1000</code>, then <code>999</code>. Watch the branch
            change at the boundary.
          </li>
          <li>
            Press <code>200</code>, then <code>199</code>, and note the change
            from Summary to New chat.
          </li>
          <li>
            Press <code>0</code>. Only the else branch runs.
          </li>
        </ol>
        <IfLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question={`tokens_left = 1500
if tokens_left >= 200:
    action = "send_summary"
elif tokens_left >= 1000:
    action = "send_full_history"
else:
    action = "start_new_chat"
print(action)

Which line does the program print?`}
        options={[
          "start_new_chat",
          "send_full_history",
          "send_summary",
          "send_summary and send_full_history",
        ]}
        correct={2}
        wrongFeedback={[
          "The else branch runs only when every test above it is False. Here the first test is True.",
          "The elif test is never reached, because the first test was True. Its line is skipped.",
          "",
          "Python runs one branch, so only one action is set and printed.",
        ]}
        explanation={`1500 >= 200 is True, so action is "send_summary". The elif is skipped, so the output is send_summary.`}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <ul>
            <li>
              <strong>One branch:</strong> Python runs the first branch whose
              condition is <code>True</code>. <code>else</code> runs when none
              is. Without an <code>else</code>, a chain can run nothing.
            </li>
            <li>
              <strong>Order:</strong> put the strictest test first, or a looser
              test above it will catch the values it should not.
            </li>
            <li>
              <strong>Boundaries:</strong> <code>&gt;=</code> includes the
              number itself. <code>&gt;</code> does not.
            </li>
            <li>
              <strong>Syntax:</strong> end the line with a colon, indent the
              branch, and use <code>==</code> to compare.
            </li>
          </ul>
        </div>
        <Link className="text-link" href="/course/chapter-p1">
          Back to Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

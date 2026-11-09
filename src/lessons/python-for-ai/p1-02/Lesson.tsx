import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { TokenChunkVisual } from "./TokenChunkVisual";
import { OperatorLab } from "./OperatorLab";
import operatorsDiagramImg from "./python-operators-model.jpg";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="02"
      title="Operators"
      lead="Building reliable AI applications requires computing metrics, partitioning prompt tokens, verifying budgets, and combining logic guards. Python operators are the computational machinery that drives these decisions."
    >
      <section id="arithmetic-and-chunks">
        <h2 tabIndex={-1}>Arithmetic: Chunks, remainders, and powers.</h2>
        <p>
          In AI engineering, you constantly compute token counts, divide long
          documents into chunks for embedding, and scale model architecture
          parameters. Python provides a dedicated set of arithmetic operators to
          handle each scenario.
        </p>

        <p>
          While addition (<code>+</code>), subtraction (<code>-</code>), and
          multiplication (<code>*</code>) behave like standard calculator math,
          division has three distinct forms that every AI practitioner must
          master:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # The three division operators in Python:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>ratio</span> = 1350 / 500{" "}
            <span className={styles.codeComment}>
              # True division: always float 2.7
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>chunks</span> = 1350 // 500{" "}
            <span className={styles.codeComment}>
              # Floor division: integer 2 full chunks
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>leftover</span> = 1350 % 500{" "}
            <span className={styles.codeComment}>
              # Modulo: integer 350 tokens remaining
            </span>
          </p>
        </div>

        <div className="callout">
          <strong>
            Key misconception — True division always produces a float:
          </strong>{" "}
          Even when numbers divide evenly without a remainder, single slash (
          <code>/</code>) returns a <code>float</code>. For example,{" "}
          <code>10 / 2</code> evaluates to <code>5.0</code>, not the integer{" "}
          <code>5</code>.
        </div>

        <p>
          When partitioning a 1,350-token document into 500-token chunks for a
          RAG pipeline, <strong>floor division</strong> (<code>//</code>) tells
          you how many full chunks you have, and <strong>modulo</strong> (
          <code>%</code>) tells you how many leftover tokens must go into the
          final tail chunk:
        </p>

        <TokenChunkVisual />

        <p>Notice how floor division and modulo complement each other:</p>
        <ul>
          <li>
            <code>//</code> gives the integer quotient (rounds towards negative
            infinity). If both operands are integers, the result is an{" "}
            <code>int</code>. If either operand is a <code>float</code> (e.g.{" "}
            <code>1350.0 // 500</code>), Python returns a float (
            <code>2.0</code>).
          </li>
          <li>
            <code>%</code> gives the integer remainder left over after all full
            chunks are accounted for.
          </li>
          <li>
            <code>(chunks * chunk_size) + leftover == total</code> is an exact
            identity that reconstructs the original document length.
          </li>
        </ul>

        <h3>Powers and dimensions: ** versus ^</h3>
        <p>
          In AI, model dimensions, vocabulary sizes, and context limits are
          routinely powers of two (e.g. 2<sup>8</sup> = 256, 2<sup>10</sup> =
          1,024, 2<sup>12</sup> = 4,096).
        </p>

        <p>
          In Python, the exponentiation operator is double asterisk (
          <code>**</code>):
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Compute a 1024-token context window
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>context_limit</span> = 2 ** 10{" "}
            <span className={styles.codeComment}># 1024</span>
          </p>
        </div>

        <div className="callout">
          <strong>Warning — The caret (^) is NOT power in Python:</strong> In
          mathematics, people write <code>2^10</code>. In Python, the caret{" "}
          <code>^</code> is the <strong>bitwise XOR operator</strong>. Running{" "}
          <code>2 ^ 10</code> evaluates to <code>8</code>, not <code>1024</code>
          ! Always use <code>**</code> for exponentiation.
        </div>

        <figure className={styles.figure}>
          <Image
            src={operatorsDiagramImg}
            alt="Infographic illustrating Python operators for AI pipelines in three panels: Division trio showing 1350 tokens partitioned into two 500-token chunks and 350 remainder tokens; Powers versus XOR showing 2 ** 10 = 1024 contrasted with bitwise 2 ^ 10 = 8; and Assignment versus Equality showing count = 500 assigning a value and count == 500 evaluating to True."
            sizes="(min-width: 900px) 760px, 100vw"
            priority
          />
          <figcaption className="micro">
            Core operator mental model: true division produces floats, floor
            division and modulo partition chunks and remainders, <code>**</code>{" "}
            scales powers (while <code>^</code> is bitwise XOR), and{" "}
            <code>==</code> compares values without mutating variables.
          </figcaption>
        </figure>
      </section>

      <section id="comparisons">
        <h2 tabIndex={-1}>Comparisons: Evaluating truth and thresholds.</h2>
        <p>
          AI scripts constantly evaluate thresholds before calling an API: Does
          the prompt fit in our token budget? Did the model return high
          confidence? Is the finish reason valid?
        </p>

        <p>
          Comparison operators inspect values and return a <code>bool</code> (
          <code>True</code> or <code>False</code>):
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Threshold comparisons in AI workflows
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>within_budget</span> = 1350 &lt;=
            1024 <span className={styles.codeComment}># False</span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>has_tail</span> = 350 &gt; 0{" "}
            <span className={styles.codeComment}># True</span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>is_standard</span> = 500 == 500{" "}
            <span className={styles.codeComment}># True</span>
          </p>
        </div>

        <div className="callout">
          <strong>
            Key misconception — Assignment (=) versus Equality (==):
          </strong>{" "}
          A single equals sign (<code>=</code>) <em>assigns</em> a value to a
          variable name. A double equals sign (<code>==</code>){" "}
          <em>compares</em> two values and returns <code>True</code> or{" "}
          <code>False</code>. Writing <code>chunk_size = 500</code> overwrites
          the variable, while <code>chunk_size == 500</code> inspects it without
          changing it.
        </div>

        <p>Python provides six core comparison operators:</p>
        <ul>
          <li>
            <code>==</code> (equal to) and <code>!=</code> (not equal to)
          </li>
          <li>
            <code>&lt;</code> (strictly less than) and <code>&lt;=</code> (less
            than or equal to)
          </li>
          <li>
            <code>&gt;</code> (strictly greater than) and <code>&gt;=</code>{" "}
            (greater than or equal to)
          </li>
        </ul>
      </section>

      <section id="logic-and-precedence">
        <h2 tabIndex={-1}>
          Boolean logic: Combining guards with and, or, not.
        </h2>
        <p>
          Real-world AI pipelines often require multiple conditions to be met
          simultaneously before making a costly LLM call. Python provides three
          logical operators: <code>and</code>, <code>or</code>, and{" "}
          <code>not</code>.
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Combining pipeline safety checks
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>can_process_directly</span> = (
            <span className={styles.codeVar}>total_tokens</span> &lt;= 1024) and
            (<span className={styles.codeVar}>total_tokens</span> &gt; 0)
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>needs_warning</span> = (
            <span className={styles.codeVar}>total_tokens</span> &gt; 1024) or (
            <span className={styles.codeVar}>total_tokens</span> &lt;= 0)
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>is_safe</span> = not (
            <span className={styles.codeVar}>total_tokens</span> &gt; 1024)
          </p>
        </div>

        <p>
          Python evaluates logical operators using two fundamental principles:
        </p>
        <ul>
          <li>
            <strong>Short-circuit evaluation:</strong> In an <code>and</code>{" "}
            expression, if the left operand is <code>False</code>, Python
            immediately returns <code>False</code> without evaluating the right
            operand. In an <code>or</code> expression, if the left operand is{" "}
            <code>True</code>, Python immediately returns <code>True</code>.
          </li>
          <li>
            <strong>Grouping with parentheses:</strong> While Python has
            built-in precedence (<code>not</code> binds tighter than{" "}
            <code>and</code>, which binds tighter than <code>or</code>),
            production AI teams do not rely on memorizing precedence tables.
            Wrap each comparison in parentheses <code>(...)</code> so the logic
            is unambiguous to readers and debuggers.
          </li>
        </ul>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Inspect operators in the AI pipeline sandbox.</h2>
        <p>
          Test different document sizes and observe how arithmetic, comparisons,
          and boolean guards behave interactively.
        </p>

        <div className="callout">
          <strong>Try it in this order:</strong>
          <ol>
            <li>
              Select the <strong>Division & Chunks</strong> tab. Observe that{" "}
              <code>1350 / 500</code> gives <code>2.7</code> (float),{" "}
              <code>1350 // 500</code> gives <code>2</code> (int), and{" "}
              <code>1350 % 500</code> gives <code>350</code> (int).
            </li>
            <li>
              Toggle <strong>Type: float</strong> to see how <code>//</code>{" "}
              produces <code>2.0</code> (float) when given float operands.
            </li>
            <li>
              Switch to <strong>Powers vs XOR</strong>. Compare{" "}
              <code>2 ** 10</code> (1024) with <code>2 ^ 10</code> (8) to see
              why the caret is not a power operator.
            </li>
            <li>
              Switch to <strong>Thresholds & Equality</strong> and verify that
              comparisons evaluate to <code>bool</code>.
            </li>
            <li>
              Switch to <strong>Boolean Guards</strong> to trace how
              step-by-step short-circuiting works with <code>and</code>,{" "}
              <code>or</code>, and <code>not</code>.
            </li>
          </ol>
        </div>

        <OperatorLab />
      </section>

      <Check
        id="check"
        question="An AI document chunker receives a document of 1350 tokens and splits it into chunks of 500 tokens. Which Python expression correctly calculates the number of leftover tokens in the final incomplete chunk?"
        options={[
          "leftover = 1350 / 500",
          "leftover = 1350 // 500",
          "leftover = 1350 % 500",
          "leftover = 1350 ^ 500",
        ]}
        correct={2}
        wrongFeedback={[
          "True division (/) produces the floating-point ratio 2.7, not the integer count of leftover tokens.",
          "Floor division (//) computes the number of complete chunks (2), not the remainder left over.",
          "",
          "The caret (^) is bitwise XOR in Python, which computes 1202 for these inputs, not a remainder or power.",
        ]}
        explanation="The modulo operator (%) computes the remainder after integer division. For 1350 and 500, 1350 // 500 gives 2 complete chunks, leaving 1350 % 500 = 350 leftover tokens. The total is reconstructed as (2 * 500) + 350 == 1350."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Division in Python has three distinct tools: true division (
            <code>/</code>) always returns a <code>float</code>, floor division
            (<code>//</code>) calculates completed integer chunks, and modulo (
            <code>%</code>) isolates leftover remainders. For powers, always use{" "}
            <code>**</code>; never use <code>^</code> (which is bitwise XOR).
            Comparisons (<code>==</code>, <code>!=</code>, <code>&lt;=</code>,
            etc.) produce booleans, and double equals (<code>==</code>) tests
            equality without modifying the variable. Group boolean guards with
            explicit parentheses <code>(...)</code> for readable and reliable
            code.
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-p1">
          Next up: Strings in Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { TypeLab } from "./TypeLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      chapterLabel="Python for AI"
      courseHref="/course?chapter=P1"
      courseLabel="Python for AI"
      number="01"
      title="Variables and Data Types"
      lead="Every prompt, temperature setting, and model response in Python is stored under a name and shaped by its data type. Understanding how Python names values and checks types is the first step in building reliable AI systems."
    >
      <section id="names-and-values">
        <h2 tabIndex={-1}>Names point to values in memory.</h2>
        <p>
          When you write Python code to interact with an AI model, you
          frequently work with configuration parameters: token limits,
          temperatures, and system prompts. To keep track of these values,
          Python uses <strong>variables</strong>.
        </p>
        <p>
          A variable in Python is not a permanent box that can only hold one
          kind of data. Instead, think of a variable as a sticky note or{" "}
          <strong>name tag</strong> attached to an object in your
          computer&apos;s memory. You assign a name using the single equals sign
          (<code>=</code>):
        </p>
        <div className="callout">
          <strong>Assignment mechanism:</strong> The single <code>=</code>{" "}
          operator evaluates the expression on its right-hand side first,
          creates that value in memory, and then attaches the name on the left
          to it.
        </div>
        <p>
          This is fundamentally different from mathematical equality. In
          algebra, the statement <code>count = count + 1</code> is an impossible
          equation. In Python, it is a routine operation:
        </p>
        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # 1. Look up current value (3), compute 3 + 1 = 4
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>count</span> = 3
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>count</span> ={" "}
            <span className={styles.codeVar}>count</span> + 1{" "}
            <span className={styles.codeComment}># count now points to 4</span>
          </p>
        </div>
        <p>
          Reassigning a variable does not overwrite the number 3 in memory; it
          simply moves the name tag <code>count</code> to point to the new
          number 4.
        </p>
      </section>

      <section id="core-types">
        <h2 tabIndex={-1}>Four primitive types power AI code.</h2>
        <p>
          Every object in Python has a <strong>type</strong>. The type tells
          Python what the data represents, how much memory it occupies, and what
          operations (such as addition or concatenation) are allowed. Four
          primitive types appear in nearly every AI script:
        </p>

        <div className={styles.typeGrid}>
          <div className={styles.typeCard}>
            <div className={styles.typeHeader}>
              <span className={styles.typeName}>str</span>
              <span className={styles.typeRole}>Text / Strings</span>
            </div>
            <code className={styles.typeExample}>
              prompt = &quot;Summarize this&quot;
            </code>
            <p className={styles.typeDesc}>
              Sequences of characters wrapped in quotes. Used for user prompts,
              system instructions, and raw model completions.
            </p>
          </div>

          <div className={styles.typeCard}>
            <div className={styles.typeHeader}>
              <span className={styles.typeName}>int</span>
              <span className={styles.typeRole}>Integers</span>
            </div>
            <code className={styles.typeExample}>max_tokens = 500</code>
            <p className={styles.typeDesc}>
              Whole numbers without decimal points. Used for discrete counts,
              token budgets, retry limits, and batch sizes.
            </p>
          </div>

          <div className={styles.typeCard}>
            <div className={styles.typeHeader}>
              <span className={styles.typeName}>float</span>
              <span className={styles.typeRole}>Decimals</span>
            </div>
            <code className={styles.typeExample}>temperature = 0.7</code>
            <p className={styles.typeDesc}>
              Numbers with decimal points. Used for model sampling parameters,
              probability scores, loss metrics, and embeddings.
            </p>
          </div>

          <div className={styles.typeCard}>
            <div className={styles.typeHeader}>
              <span className={styles.typeName}>bool</span>
              <span className={styles.typeRole}>Booleans</span>
            </div>
            <code className={styles.typeExample}>stream = True</code>
            <p className={styles.typeDesc}>
              Logical truth values: either <code>True</code> or{" "}
              <code>False</code> (capitalized, without quotes). Used for feature
              flags, safety checks, and API switches.
            </p>
          </div>
        </div>

        <p>
          You can inspect the type of any variable at runtime using
          Python&apos;s built-in <code>type()</code> function:
        </p>
        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>type</span>(500){" "}
            <span className={styles.codeComment}>
              # returns &lt;class &apos;int&apos;&gt;
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>type</span>(0.7){" "}
            <span className={styles.codeComment}>
              # returns &lt;class &apos;float&apos;&gt;
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>type</span>(&quot;gemini&quot;){" "}
            <span className={styles.codeComment}>
              # returns &lt;class &apos;str&apos;&gt;
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>type</span>(True){" "}
            <span className={styles.codeComment}>
              # returns &lt;class &apos;bool&apos;&gt;
            </span>
          </p>
        </div>
      </section>

      <section id="sandbox">
        <h2 tabIndex={-1}>Inspect variables and types in the sandbox.</h2>
        <p>
          Use the interactive sandbox below to explore how Python assigns and
          inspects AI configuration parameters. Select different parameters,
          test what happens when a number is accidentally wrapped in quotes, and
          test operations like addition and API validation.
        </p>
        <TypeLab />
      </section>

      <section id="quotes-matter">
        <h2 tabIndex={-1}>Quotes create text, not numbers.</h2>
        <p>
          One of the most frequent bugs in AI applications involves confusing a
          number with a string of digits:
        </p>
        <ul>
          <li>
            <code>500</code> is an <strong>int</strong>. Python treats it as a
            mathematical quantity and can add, subtract, and compare it.
          </li>
          <li>
            <code>&quot;500&quot;</code> is a <strong>str</strong>. Python
            treats it as a sequence of text characters (the character
            &apos;5&apos; followed by two zeros).
          </li>
        </ul>
        <p>Python behaves differently depending on the types involved:</p>
        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Adding two integers does arithmetic
          </div>
          <p className={styles.codeLine}>500 + 100 # 600</p>
          <div className={styles.codeComment}>
            # Adding two strings concatenates (glues) text together
          </div>
          <p className={styles.codeLine}>
            &quot;500&quot; + &quot;100&quot; # &quot;500100&quot;
          </p>
          <div className={styles.codeComment}>
            # Adding a string to an integer is forbidden in Python!
          </div>
          <p className={styles.codeLine}>
            &quot;500&quot; + 100 # TypeError: can only concatenate str (not
            &quot;int&quot;) to str
          </p>
        </div>
        <p>
          Unlike some programming languages (like JavaScript) that quietly
          convert strings to numbers on the fly, Python is{" "}
          <strong>strongly typed</strong>. It refuses to guess your intention
          and raises a <code>TypeError</code> if you try to combine incompatible
          types.
        </p>
        <div className="callout">
          <strong>The boolean quote trap:</strong> In Python, <code>True</code>{" "}
          is a boolean truth value, while <code>&quot;True&quot;</code> and{" "}
          <code>&quot;False&quot;</code> are text strings. Because Python treats
          any non-empty string as &quot;truthy&quot;, running{" "}
          <code>bool(&quot;False&quot;)</code> evaluates to <code>True</code>!
          Always use the unquoted keywords <code>True</code> and{" "}
          <code>False</code> for boolean flags.
        </div>
      </section>

      <section id="conversions">
        <h2 tabIndex={-1}>Converting types safely for model inputs.</h2>
        <p>
          When you read configuration values from environment variables (such as{" "}
          <code>os.getenv(&quot;MAX_TOKENS&quot;)</code>) or receive user inputs
          from web forms, the data almost always arrives as a{" "}
          <strong>str</strong>.
        </p>
        <p>
          Before passing these values to an AI SDK or model API that expects
          numeric parameters, you must explicitly convert (or &quot;cast&quot;)
          them:
        </p>
        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Provide a fallback default string if unset
          </div>
          <p className={styles.codeLine}>
            raw_limit = os.getenv(&quot;MAX_TOKENS&quot;, &quot;1000&quot;){" "}
            <span className={styles.codeComment}># type is str</span>
          </p>
          <div className={styles.codeComment}>
            # Explicitly cast to integer for the model API
          </div>
          <p className={styles.codeLine}>
            max_tokens = int(raw_limit){" "}
            <span className={styles.codeComment}># type is int (1000)</span>
          </p>
          <div className={styles.codeComment}>
            # Convert decimal strings to float
          </div>
          <p className={styles.codeLine}>
            temperature = float(&quot;0.7&quot;){" "}
            <span className={styles.codeComment}># type is float (0.7)</span>
          </p>
        </div>
        <p>Two different errors can occur during configuration loading:</p>
        <ul>
          <li>
            <strong>
              Missing variables (<code>TypeError</code>):
            </strong>{" "}
            If <code>os.getenv(&quot;MAX_TOKENS&quot;)</code> is unset without a
            default, it returns <code>None</code>. Passing <code>None</code> to{" "}
            <code>int()</code> raises a <code>TypeError</code>. Setting a
            fallback default string prevents this.
          </li>
          <li>
            <strong>
              Invalid text (<code>ValueError</code>):
            </strong>{" "}
            If the string cannot be parsed as a number (such as{" "}
            <code>int(&quot;unlimited&quot;)</code>), Python raises a{" "}
            <code>ValueError</code>.
          </li>
        </ul>
        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            int(&quot;unlimited&quot;){" "}
            <span className={styles.codeComment}>
              # ValueError: invalid literal for int() with base 10
            </span>
          </p>
        </div>
        <p>
          In production AI pipelines, converting and validating types early
          prevents malformed requests from reaching your model provider.
        </p>
      </section>

      <Check
        id="check"
        question='An AI assistant script has the line: max_tokens = "250". Later in the script, the code executes: total_tokens = max_tokens + 50. What happens in Python, and why?'
        options={[
          "total_tokens becomes 300, because Python automatically converts numeric strings into integers during addition.",
          "Python raises a TypeError, because it does not allow adding an integer directly to a string without explicit conversion.",
          'total_tokens becomes "25050", because the integer 50 is automatically converted into text.',
          "max_tokens is permanently modified into an integer, and total_tokens becomes 300.",
        ]}
        correct={1}
        wrongFeedback={[
          "Python is strongly typed and will never implicitly coerce a string into a number during arithmetic.",
          "",
          "Python does not automatically convert numbers into strings with the + operator; it raises an error when types are incompatible.",
          "Assignment and addition never retroactively change the type of an existing variable in memory.",
        ]}
        explanation='In Python, "250" is a str and 50 is an int. Python refuses to guess whether you meant arithmetic or string concatenation, and raises a TypeError. To add them, you must explicitly convert the string first: int(max_tokens) + 50.'
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Variables are name tags that point to typed objects in memory, not
            fixed storage boxes. Python&apos;s four core primitive types (
            <code>str</code>, <code>int</code>, <code>float</code>, and{" "}
            <code>bool</code>) govern what operations are valid. Quotes turn
            numbers into text, and Python requires explicit conversion (such as{" "}
            <code>int()</code> or <code>float()</code>) when passing string
            inputs to numeric AI APIs.
          </p>
        </div>
        <Link className="text-link" href="/course?chapter=P1">
          Next up: Operators in Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { PandasLab } from "./PandasLab";
import dataframeImage from "./dataframe-structure.webp";
import seriesImage from "./column-series.webp";
import loopVsPandasImage from "./loop-vs-pandas.webp";
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
      number="12"
      title="Introduction to pandas"
      lead="pandas organizes structured data into a 2D table of rows and columns called a DataFrame, letting you calculate whole-column totals and averages in one call without writing manual for loops."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>
          pandas: Turning structured data into tables for instant analysis.
        </h2>
        <p>
          In AI work, you often inspect batches of prompts, model names, and
          token counts. Plain Python lists and dictionaries can store those
          values, but summarizing them usually means writing a <code>for</code>{" "}
          loop by hand.
        </p>
        <p>
          The <strong>pandas</strong> library adds table structures so you can
          select and summarize a whole column in one line. In this lesson, you
          will meet these terms in order:
        </p>
        <ol>
          <li>
            <strong>DataFrame:</strong> A two-dimensional table in pandas with
            labeled rows (its <strong>index</strong>) and named columns.
          </li>
          <li>
            <strong>Series:</strong> A one-dimensional labeled sequence, such as
            a single column taken from a DataFrame.
          </li>
          <li>
            <strong>
              Column lookup (<code>df[&quot;col&quot;]</code>):
            </strong>{" "}
            Selecting a column by its string <strong>label</strong> (column
            name) inside square brackets.
          </li>
          <li>
            <strong>Column aggregation method:</strong> A built-in{" "}
            <strong>method</strong> (a function attached to an object, called
            with a dot) such as <code>.sum()</code> or <code>.mean()</code> that
            summarizes a column&apos;s values.
          </li>
          <li>
            <strong>Accumulator loop:</strong> A Python <code>for</code> loop
            that visits values one by one to build a running total in a
            variable.
          </li>
        </ol>
        <p className="micro" style={{ color: "var(--muted)" }}>
          Note: pandas is a third-party library, not part of Python&apos;s
          standard library. On your own machine or notebook, install it once
          with <code>pip install pandas</code> before importing it.
        </p>
      </section>

      <section id="table">
        <h2 tabIndex={-1}>
          A DataFrame organizes records into rows and columns.
        </h2>
        <p>
          Think of a spreadsheet of customer orders: each horizontal row is one
          order, and each vertical column is one field such as Customer, Size,
          or Price. A pandas <strong>DataFrame</strong> organizes data the same
          way, except it lives in Python memory rather than creating a
          spreadsheet file on disk.
        </p>
        <p>
          To build one, import pandas (by wide convention aliased as{" "}
          <code>pd</code>) and pass a dictionary of equal-length lists to{" "}
          <code>pd.DataFrame()</code>. In this illustrative 5-row prompt log,
          each dictionary key becomes a column name and each list provides the
          row values:
        </p>

        <Code label="Creating a DataFrame from a dictionary">
          {`import pandas as pd

data = {
    "prompt_id": ["p1", "p2", "p3", "p4", "p5"],
    "model": ["gemini", "gemini", "claude", "gpt", "claude"],
    "tokens": [10, 20, 30, 15, 25],
}

df = pd.DataFrame(data)
print(df)`}
        </Code>

        <p>
          Printing <code>df</code> displays the 2D table with default row labels
          (<code>0</code> through <code>4</code>) on the left — called the{" "}
          <strong>index</strong>:
        </p>

        <Code label="Output of printing the DataFrame">
          {`  prompt_id   model  tokens
0        p1  gemini      10
1        p2  gemini      20
2        p3  claude      30
3        p4     gpt      15
4        p5  claude      25`}
        </Code>

        <figure className={styles.figure}>
          <Image
            src={dataframeImage}
            alt="Educational illustration showing the anatomy of a pandas DataFrame. An outer container is labeled DataFrame with Columns at the top and Rows on the left. The columns are prompt_id, model, and tokens. Row index labels 0 through 4 align with five records: p1 gemini 10, p2 gemini 20, p3 claude 30, p4 gpt 15, and p5 claude 25."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            A DataFrame aligns named vertical columns with numbered horizontal
            row labels (0 to 4 in this example).
          </figcaption>
        </figure>

        <Check
          title="Quick check: Understanding the DataFrame structure"
          question="In the example above, what does pd.DataFrame(data) create in memory?"
          options={[
            "A single Python list containing 100 tokens.",
            "A 2D table with rows indexed 0 to 4 and columns named 'prompt_id', 'model', and 'tokens'.",
            "A raw Python dictionary with no row index.",
            "A CSV file saved to your local hard drive.",
          ]}
          correct={1}
          explanation="pd.DataFrame(data) turns the dictionary of 5-item lists into a 2D table in memory with row labels 0 to 4 and columns named 'prompt_id', 'model', and 'tokens'."
          wrongFeedback={[
            "A DataFrame is a 2D table of rows and columns, not a single Python list.",
            "Correct! pd.DataFrame turns the dictionary into a 2D table with row index labels 0 to 4 and the three named columns.",
            "Unlike a raw dictionary, a DataFrame aligns the lists into indexed rows (0 to 4) and supports table operations.",
            "pd.DataFrame creates an object in Python memory; it does not write a CSV file to disk.",
          ]}
        />
      </section>

      <section id="column">
        <h2 tabIndex={-1}>Selecting a column gives you a pandas Series.</h2>
        <p>
          To work with one field across all rows, put its string label inside
          square brackets: <code>df[&quot;tokens&quot;]</code>.
        </p>
        <p>
          In a DataFrame with unique column names like this one, selecting one
          column returns a pandas <strong>Series</strong> — a 1D labeled
          sequence that keeps each value paired with its row index:
        </p>

        <Code label="Selecting a column as a Series">
          {`tokens_series = df["tokens"]
print(tokens_series)`}
        </Code>

        <Code label="Example output of printing the Series">
          {`0    10
1    20
2    30
3    15
4    25
Name: tokens, dtype: int64`}
        </Code>

        <p>
          The footer shows the column&apos;s name and its <strong>dtype</strong>{" "}
          (data type — here <code>int64</code>, a 64-bit integer; the exact
          integer dtype can vary by platform or pandas version).
        </p>
        <p>
          Quotes matter here: <code>df[&quot;tokens&quot;]</code> passes the
          string label <code>&quot;tokens&quot;</code>. If you write{" "}
          <code>df[tokens]</code> without quotes in a fresh script where no
          variable named <code>tokens</code> exists, Python raises a{" "}
          <code>NameError</code>.
        </p>
        <p>
          Everyday analogy: if a restaurant ledger lists Order Number, Server,
          and Amount, selecting <code>df[&quot;Amount&quot;]</code> pulls out
          just the Amount column while keeping each row&apos;s position lined
          up.
        </p>

        <figure className={styles.figure}>
          <Image
            src={seriesImage}
            alt="Educational illustration showing column extraction from a pandas DataFrame to a Series. On the left is the DataFrame with columns prompt_id, model, and tokens highlighted. A rightward arrow labeled df['tokens'] points to a 1D Series panel showing Index 0 to 4 paired with Values 10, 20, 30, 15, and 25."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Selecting df[&quot;tokens&quot;] extracts the column as a 1D Series
            with its row index intact.
          </figcaption>
        </figure>

        <Check
          title="Quick check: Column selection syntax"
          question="In a fresh script with no variable named tokens, which expression selects the 'tokens' column from df?"
          options={["df(tokens)", "df[tokens]", 'df["tokens"]', 'df{"tokens"}']}
          correct={2}
          explanation="Square brackets with the column's string label, df['tokens'], select the column as a pandas Series."
          wrongFeedback={[
            "Parentheses call a function or method, not a column lookup.",
            "Without quotes, Python looks for a variable named tokens rather than the column label, raising NameError in a fresh script.",
            "Correct! Square brackets with the quoted column label df['tokens'] select the column.",
            "Curly braces are not valid syntax for selecting a column.",
          ]}
        />
      </section>

      <section id="summary">
        <h2 tabIndex={-1}>Column methods replace manual for loops.</h2>
        <p>
          Once you select a numeric column like{" "}
          <code>df[&quot;tokens&quot;]</code>, you can call built-in aggregation
          methods such as <code>.sum()</code> and <code>.mean()</code> directly
          on it.
        </p>
        <p>
          Compare a manual Python accumulator loop (which totals the five values
          and then divides by the row count for the average) with pandas:
        </p>

        <Code label="Approach A: Manual for loop with an accumulator">
          {`# Approach A: Manual for loop + division for the mean
total = 0
for t in data["tokens"]:
    total += t

average = total / len(data["tokens"])
print(total)    # 100
print(average)  # 20.0`}
        </Code>

        <Code label="Approach B: pandas column aggregation methods">
          {`# Approach B: pandas column methods
print(df["tokens"].sum())   # 100
print(df["tokens"].mean())  # 20.0`}
        </Code>

        <p>
          Both approaches compute the same numbers (<code>100</code> and{" "}
          <code>20.0</code>). With pandas, you state what summary you want in
          one call instead of initializing and updating a running total
          variable.
        </p>
        <p>
          Everyday analogy: it is like clicking AutoSum on a spreadsheet column
          instead of tapping each cell into a pocket calculator — the math is
          the same, with less manual bookkeeping.
        </p>

        <figure className={styles.figure}>
          <Image
            src={loopVsPandasImage}
            alt="Educational diagram comparing a manual loop with pandas. The top panel labeled Manual loop flows left to right from the tokens column through total = 0 and Add each value to 100. The bottom panel labeled pandas flows left to right from the tokens column through df['tokens'].sum() to Result: 100."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Calling df[&quot;tokens&quot;].sum() replaces manual accumulator
            bookkeeping with a single column method call.
          </figcaption>
        </figure>

        <div className={styles.quickQuestions}>
          <h3>Quick Questions</h3>
          <dl>
            <dt>Does df[&quot;tokens&quot;].sum() modify df?</dt>
            <dd>
              No. On this numeric Series, it returns a single summary number (
              <code>100</code>) and leaves the DataFrame unchanged.
            </dd>
            <dt>What does df[&quot;tokens&quot;].mean() calculate?</dt>
            <dd>
              In this example, it returns the arithmetic average: the sum of the
              five values divided by the count (<code>100 / 5 = 20.0</code>).
            </dd>
            <dt>Can you still write a Python for loop when using pandas?</dt>
            <dd>
              Yes, normal Python loops still work, though built-in column
              methods are usually clearer and often faster on larger tables.
            </dd>
          </dl>
        </div>
      </section>

      <section id="practice">
        <h2 tabIndex={-1}>Practice: Predict the column calculation.</h2>
        <p>Use our 5-row prompt log to predict what this line prints.</p>

        <Code label="Practice snippet">
          {`# df has 5 rows with tokens: [10, 20, 30, 15, 25]
print(df["tokens"].mean())`}
        </Code>

        <Check
          title="Practice: What does this line print?"
          question="Given tokens [10, 20, 30, 15, 25], what does print(df['tokens'].mean()) output?"
          options={["20.0", "100", "30", "5"]}
          correct={0}
          explanation="The five token values sum to 100 (10 + 20 + 30 + 15 + 25), and dividing by 5 rows gives the mean 20.0."
          wrongFeedback={[
            "Correct! 100 divided by 5 rows gives the mean 20.0.",
            "100 is the total from df['tokens'].sum(), not the mean.",
            "30 is the largest single value in the column, not the average.",
            "5 is the number of rows, not the average token count.",
          ]}
        />
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the Prompt Log Analyzer.</h2>
        <p>
          Use this toy simulator to compare a single pandas column call against
          stepping through the same 5 rows with a manual accumulator loop.
        </p>
        <PandasLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="Why do AI engineers often use df['tokens'].sum() instead of writing a manual for loop to total a column?"
        options={[
          "A for loop cannot add numbers in Python.",
          "A for loop always calculates the mean instead of the total.",
          "df['tokens'].sum() overwrites the original numbers in the table.",
          "It expresses the whole-column total in one concise call without writing loop and accumulator boilerplate.",
        ]}
        correct={3}
        explanation="Column aggregation methods like .sum() compute the summary in one clear call and avoid manual loop and accumulator boilerplate."
        wrongFeedback={[
          "A Python for loop can add numbers; it just takes extra loop and accumulator setup.",
          "A loop computes whatever you write inside it; it does not automatically compute a mean.",
          "Calling .sum() returns a new summary value and leaves the DataFrame unchanged.",
          "Correct! Built-in column methods express whole-column summaries in one concise call.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className="card" style={{ padding: "1.25rem", margin: "1rem 0" }}>
          <h3 style={{ marginTop: 0 }}>Summary Cheat-Sheet</h3>
          <ul>
            <li>
              <strong>Common convention:</strong> Import pandas as{" "}
              <code>import pandas as pd</code>.
            </li>
            <li>
              <strong>DataFrame:</strong> A 2D in-memory table created with{" "}
              <code>pd.DataFrame(data)</code> from a dictionary of equal-length
              lists, with row index labels starting at <code>0</code> by
              default.
            </li>
            <li>
              <strong>Column lookup:</strong>{" "}
              <code>df[&quot;column_name&quot;]</code> selects one column (as a
              1D pandas <strong>Series</strong> when column names are unique).
            </li>
            <li>
              <strong>Column summaries:</strong> On a numeric Series,{" "}
              <code>df[&quot;col&quot;].sum()</code> and{" "}
              <code>df[&quot;col&quot;].mean()</code> return a summary number
              without modifying <code>df</code>.
            </li>
            <li>
              <strong>Less boilerplate:</strong> Column methods replace manual
              accumulator <code>for</code> loops with a single readable call.
            </li>
          </ul>
        </div>
        <p>
          In the next lesson (<strong>P1.13 Columns and tables</strong>), you
          will build on DataFrames and Series to inspect and work with multiple
          columns.
        </p>
      </section>
    </LessonFrame>
  );
}

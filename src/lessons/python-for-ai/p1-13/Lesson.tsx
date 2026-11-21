import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { TableWorkbench } from "./TableWorkbench";
import inspectTableImage from "./inspect-table.webp";
import selectColumnsImage from "./select-columns.webp";
import derivedColumnImage from "./derived-column.webp";
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
      number="13"
      title="Columns and tables"
      lead="Inspect a DataFrame's shape, columns, and first rows, select multiple columns as a 2D table, and create new derived columns without writing a manual loop."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>
          Working with columns and table structure in pandas.
        </h2>
        <p>
          In Lesson 12, you built a pandas <strong>DataFrame</strong> and
          summarized a single column. In real AI logs, you first check a
          table&apos;s size and headers, pull out the subset of columns you
          need, and compute new columns such as total tokens.
        </p>
        <p>In this lesson, you will meet five ideas in order:</p>
        <ol>
          <li>
            <strong>Attribute vs. method:</strong> An <strong>attribute</strong>{" "}
            (such as <code>df.shape</code> or <code>df.columns</code>) is a
            stored property accessed without parentheses; a{" "}
            <strong>method</strong> (such as <code>df.head(2)</code>) is an
            action called with parentheses.
          </li>
          <li>
            <strong>
              Table shape (<code>df.shape</code>):
            </strong>{" "}
            A <code>(rows, columns)</code> pair telling you how many rows and
            columns a DataFrame has.
          </li>
          <li>
            <strong>
              Multi-column selection (
              <code>df[[&quot;col1&quot;, &quot;col2&quot;]]</code>):
            </strong>{" "}
            Passing a Python list of column names inside <code>df[...]</code> to
            get a new 2D DataFrame containing only those columns.
          </li>
          <li>
            <strong>Derived column:</strong> A new column calculated row by row
            from existing columns (for example, adding input and output tokens).
          </li>
          <li>
            <strong>In-place assignment:</strong> Assigning to{" "}
            <code>df[&quot;new_col&quot;] = ...</code> modifies <code>df</code>{" "}
            directly by adding (or overwriting) that column, whereas selecting
            columns leaves <code>df</code> unchanged.
          </li>
        </ol>
      </section>

      <section id="inspect">
        <h2 tabIndex={-1}>
          Inspect a table&apos;s shape, columns, and first rows.
        </h2>
        <p>
          Everyday analogy: before editing a printed expense ledger, you glance
          at how many rows and columns it has, read the column headers, and peek
          at the top two lines. In pandas, three quick checks do the same job.
        </p>
        <p>
          We will use this illustrative 5-row AI API log throughout the lesson:
        </p>

        <Code label="Creating the 5-row AI API usage DataFrame">
          {`import pandas as pd

data = {
    "model": ["gemini", "claude", "gpt", "gemini", "claude"],
    "in_tokens": [100, 200, 150, 300, 250],
    "out_tokens": [50, 100, 50, 100, 50],
}

df = pd.DataFrame(data)`}
        </Code>

        <p>
          Check the table&apos;s dimensions with <code>df.shape</code>, its
          column labels with <code>df.columns</code>, and a top-row preview with{" "}
          <code>df.head(2)</code>:
        </p>

        <Code label="Inspecting shape, columns, and top rows">
          {`print(df.shape)    # (5, 3)  -> 5 rows, 3 columns
print(df.columns)  # Index(['model', 'in_tokens', 'out_tokens'], ...)
print(df.head(2))  # First 2 rows (index 0 and 1)`}
        </Code>

        <p>
          Notice the parentheses rule. Both <code>df.shape</code> and{" "}
          <code>df.columns</code> are <strong>attributes</strong> (no{" "}
          <code>()</code>): writing <code>df.shape()</code> raises a{" "}
          <code>TypeError</code> because a tuple is not callable. By contrast,{" "}
          <code>df.head(2)</code> is a <strong>method</strong> (uses{" "}
          <code>()</code>; calling <code>df.head()</code> with no argument
          returns up to the first 5 rows).
        </p>
        <p>
          Note that <code>df.columns</code> returns a pandas <code>Index</code>{" "}
          object rather than a plain Python <code>list</code> (and its printed{" "}
          <code>dtype</code> label can vary by pandas version). If you need a
          plain Python list of names, wrap it with <code>list(df.columns)</code>
          .
        </p>

        <figure className={styles.figure}>
          <Image
            src={inspectTableImage}
            alt="Infographic titled Inspecting a DataFrame: Check size, column names, and a quick preview. A 5-row DataFrame (df) with Index 0 to 4 and columns model, in_tokens, and out_tokens flows right to three cards: df.shape showing (5, 3), df.columns showing model, in_tokens, out_tokens, and df.head(2) showing Rows 0 and 1. Bottom strip reads Attribute vs. method: No () for shape and columns, Use () for head(2)."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Use attributes (df.shape, df.columns) without parentheses and the
            df.head(n) method with parentheses to inspect a table before
            changing it.
          </figcaption>
        </figure>

        <Check
          title="Quick check: Reading df.shape"
          question="For a DataFrame with 5 rows and 3 columns, what does df.shape return?"
          options={["(3, 5)", "(5, 3)", "15", "TypeError"]}
          correct={1}
          explanation="df.shape returns a (rows, columns) tuple — rows first, columns second — so 5 rows and 3 columns gives (5, 3)."
          wrongFeedback={[
            "(3, 5) reverses the order. df.shape puts rows first and columns second.",
            "Correct! df.shape returns (rows, columns), which is (5, 3).",
            "15 is the total cell count (df.size), not the (rows, columns) tuple returned by df.shape.",
            "Accessing df.shape without parentheses works cleanly; calling this tuple-valued attribute as df.shape() raises TypeError.",
          ]}
        />
      </section>

      <section id="select">
        <h2 tabIndex={-1}>
          Select one column for a Series, or a list for a DataFrame.
        </h2>
        <p>
          Everyday analogy: pulling a single receipt slip out of a folder gives
          you one 1D strip of numbers, whereas photocopying two columns onto a
          smaller sheet still gives you a 2D table.
        </p>
        <p>
          In pandas (when column names are unique, as in our table), passing one
          string label returns a 1D <strong>Series</strong>, while passing a
          Python list of column labels returns a 2D <strong>DataFrame</strong>:
        </p>

        <Code label="Single-column Series vs multi-column DataFrame">
          {`# One string label -> 1D Series (shape: (5,))
in_only = df["in_tokens"]

# A Python list of labels -> 2D DataFrame (shape: (5, 2))
subset = df[["model", "in_tokens"]]
print(subset)`}
        </Code>

        <Code label="Output of selecting two columns">
          {`    model  in_tokens
0  gemini        100
1  claude        200
2     gpt        150
3  gemini        300
4  claude        250`}
        </Code>

        <p>
          Look closely at the double square brackets in{" "}
          <code>df[[&quot;model&quot;, &quot;in_tokens&quot;]]</code>. The outer
          brackets belong to <code>df[...]</code>; the inner brackets are a
          normal Python list{" "}
          <code>[&quot;model&quot;, &quot;in_tokens&quot;]</code>. Even a 1-item
          list like <code>df[[&quot;in_tokens&quot;]]</code> returns a 2D
          DataFrame with shape <code>(5, 1)</code> rather than a 1D Series.
        </p>
        <p>
          A common beginner mistake is dropping the inner brackets and writing{" "}
          <code>df[&quot;model&quot;, &quot;in_tokens&quot;]</code>. Python
          treats the comma-separated strings as a single tuple key{" "}
          <code>(&quot;model&quot;, &quot;in_tokens&quot;)</code>, and because
          no column in <code>df</code> has that tuple label, pandas raises a{" "}
          <code>KeyError</code>.
        </p>
        <p>
          Selecting columns returns a new DataFrame selection in the column
          order you list and leaves the original <code>df</code> unchanged.
        </p>

        <figure className={styles.figure}>
          <Image
            src={selectColumnsImage}
            alt="Infographic titled One column vs. multiple columns: Single brackets return a Series; a list returns a DataFrame. The center 5-row DataFrame (df) points left to a 1D Series card for df['in_tokens'] (100, 200, 150, 300, 250) and right to a 2D DataFrame card for df[['model', 'in_tokens']]. Bottom strip contrasts df[['model', 'in_tokens']] — Valid list against df['model', 'in_tokens'] — KeyError."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Single brackets with one label return a 1D Series; double brackets
            pass a Python list and return a 2D DataFrame.
          </figcaption>
        </figure>

        <Check
          title="Quick check: Multi-column selection syntax"
          question="You want a new 2D DataFrame containing only 'model' and 'out_tokens' from df. Which expression works?"
          options={[
            'df["model", "out_tokens"]',
            'df("model", "out_tokens")',
            'df[["model", "out_tokens"]]',
            'df["model"] + df["out_tokens"]',
          ]}
          correct={2}
          explanation='Passing a Python list of column names inside df[...], df[["model", "out_tokens"]], returns a 2D DataFrame with those two columns.'
          wrongFeedback={[
            "Without inner brackets, pandas looks for one column labeled ('model', 'out_tokens') and raises KeyError in this DataFrame.",
            "Parentheses try to call df as a function, which raises TypeError.",
            "Correct! Double brackets pass a list of column names and return a 2D DataFrame.",
            "The + operator tries to combine values element by element (and fails between strings and integers here) rather than selecting two columns.",
          ]}
        />
      </section>

      <section id="derive">
        <h2 tabIndex={-1}>Create a derived column from existing columns.</h2>
        <p>
          Everyday analogy: on an invoice sheet with Subtotal and Tax columns,
          you add a Total column at the right edge where each row equals
          Subtotal plus Tax on that same line.
        </p>
        <p>
          In pandas, you can add two numeric columns in one expression and
          assign the result to a new column name on <code>df</code>:
        </p>

        <Code label="Creating a derived total_tokens column">
          {`df["total_tokens"] = df["in_tokens"] + df["out_tokens"]
print(df)
print(df.shape)  # (5, 4)`}
        </Code>

        <Code label="Output after adding total_tokens">
          {`    model  in_tokens  out_tokens  total_tokens
0  gemini        100          50           150
1  claude        200         100           300
2     gpt        150          50           200
3  gemini        300         100           400
4  claude        250          50           300`}
        </Code>

        <p>
          pandas pairs values row by row using their matching row index (row 0:{" "}
          <code>100 + 50 = 150</code>, row 1: <code>200 + 100 = 300</code>, and
          so on) with no manual <code>for</code> loop.
        </p>
        <p>
          Unlike selecting columns, assigning to{" "}
          <code>df[&quot;total_tokens&quot;] = ...</code>{" "}
          <strong>
            modifies <code>df</code> in place
          </strong>
          : it attaches <code>total_tokens</code> to the table so{" "}
          <code>df.shape</code> grows from <code>(5, 3)</code> to{" "}
          <code>(5, 4)</code>. If you assign to a column name that already
          exists, pandas overwrites that column&apos;s values.
        </p>

        <figure className={styles.figure}>
          <Image
            src={derivedColumnImage}
            alt="Infographic titled Creating a derived column: Add two columns row by row and attach the result to df. Existing columns in_tokens (100, 200, 150, 300, 250) plus out_tokens (50, 100, 50, 100, 50) flow right through df['total_tokens'] = df['in_tokens'] + df['out_tokens'] into the Updated DataFrame (df) with a highlighted total_tokens column (150, 300, 200, 400, 300). Bottom strip reads In-place update: df.shape changes from (5, 3) to (5, 4)."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Column arithmetic aligns rows automatically by index, and column
            assignment adds the new column to df in place.
          </figcaption>
        </figure>

        <div className={styles.quickQuestions}>
          <h3>Quick Questions</h3>
          <dl>
            <dt>
              Does <code>df[[&quot;model&quot;, &quot;in_tokens&quot;]]</code>{" "}
              remove the other columns from <code>df</code>?
            </dt>
            <dd>
              No. Selecting columns returns a new 2D DataFrame with just those
              columns and leaves <code>df</code> unchanged.
            </dd>
            <dt>
              What happens if you assign to an existing column name, like{" "}
              <code>df[&quot;out_tokens&quot;] = ...</code>?
            </dt>
            <dd>
              pandas replaces the values in <code>out_tokens</code> in place
              instead of creating a second column with the same name.
            </dd>
            <dt>
              What does <code>df[[&quot;in_tokens&quot;]]</code> (a 1-item list)
              return?
            </dt>
            <dd>
              A 2D DataFrame with shape <code>(5, 1)</code>, because passing a
              list inside <code>df[...]</code> returns a DataFrame rather than a
              1D Series.
            </dd>
          </dl>
        </div>
      </section>

      <section id="practice">
        <h2 tabIndex={-1}>Practice: Predict the shape and result.</h2>
        <p>
          Trace these three lines starting from the 5-row, 3-column{" "}
          <code>df</code> (<code>model</code>, <code>in_tokens</code>,{" "}
          <code>out_tokens</code>).
        </p>

        <Code label="Practice snippet for derived column and selection">
          {`# Starting from the 5-row, 3-column df
df["total_tokens"] = df["in_tokens"] + df["out_tokens"]
subset = df[["model", "total_tokens"]]
print(subset.shape)`}
        </Code>

        <Check
          title="Practice: What does print(subset.shape) output?"
          question="Starting from the 5-row, 3-column df above, what does print(subset.shape) output?"
          options={["(5, 2)", "(5, 4)", "(5, 3)", "(2, 5)"]}
          correct={0}
          explanation="Adding total_tokens grows df to (5, 4), and then selecting the 2-column list ['model', 'total_tokens'] produces subset with 5 rows and 2 columns: (5, 2)."
          wrongFeedback={[
            "Correct! subset keeps all 5 rows and only the 2 selected columns, so subset.shape is (5, 2).",
            "(5, 4) is df.shape after adding total_tokens, not subset.shape after selecting 2 columns.",
            "(5, 3) was df's original shape before total_tokens was added.",
            "(2, 5) reverses rows and columns; for a 2D DataFrame, shape reports (rows, columns).",
          ]}
        />
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the Column &amp; Table Workbench.</h2>
        <p>
          Explore how selecting one column, selecting a list of columns, and
          assigning a derived column affect the returned object and{" "}
          <code>df.shape</code>.
        </p>
        <TableWorkbench />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question='You have a DataFrame df with columns "model", "in_tokens", and "out_tokens". What happens when you run df["model", "in_tokens"]?'
        options={[
          "It returns a 2D DataFrame with just model and in_tokens.",
          "It returns a 1D Series combining both columns into one.",
          "It permanently deletes the out_tokens column from df.",
          "It raises a KeyError because pandas looks for a single column labeled ('model', 'in_tokens') instead of a list of two column names.",
        ]}
        correct={3}
        explanation='Multi-column selection requires a list inside the brackets: df[["model", "in_tokens"]]. Without the inner brackets, pandas looks for one column whose label is the tuple ("model", "in_tokens") and raises KeyError in this table.'
        wrongFeedback={[
          'Returning a 2D DataFrame of two columns requires a list inside brackets: df[["model", "in_tokens"]].',
          "pandas does not merge two columns into a Series when given two labels separated by a comma.",
          "Column lookup does not delete columns from df; here it raises an error instead.",
          "Correct! Without the inner list brackets, pandas treats the two strings as a single tuple key and raises KeyError.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className="card" style={{ padding: "1.25rem", margin: "1rem 0" }}>
          <h3 style={{ marginTop: 0 }}>Summary Cheat-Sheet</h3>
          <ul>
            <li>
              <strong>Inspect first:</strong> <code>df.shape</code> returns{" "}
              <code>(rows, columns)</code> and <code>df.columns</code> lists
              column labels (both attributes, no <code>()</code>);{" "}
              <code>df.head(n)</code> is a method (uses <code>()</code>) that
              previews the first <code>n</code> rows.
            </li>
            <li>
              <strong>One column vs. list:</strong>{" "}
              <code>df[&quot;col&quot;]</code> returns a 1D{" "}
              <strong>Series</strong> (for unique column names);{" "}
              <code>df[[&quot;col1&quot;, &quot;col2&quot;]]</code> passes a
              Python list and returns a 2D <strong>DataFrame</strong> without
              modifying <code>df</code>.
            </li>
            <li>
              <strong>Derived columns:</strong>{" "}
              <code>
                df[&quot;total_tokens&quot;] = df[&quot;in_tokens&quot;] +
                df[&quot;out_tokens&quot;]
              </code>{" "}
              computes row-by-row values by index and updates <code>df</code> in
              place.
            </li>
          </ul>
        </div>
        <p>
          In the next lesson (<strong>P1.14 Filtering rows</strong>), you will
          use conditions to keep only the rows that match your criteria.
        </p>
      </section>
    </LessonFrame>
  );
}

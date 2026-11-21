import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { FilterLab } from "./FilterLab";
import booleanMaskImage from "./boolean-mask.webp";
import rowFilteringImage from "./row-filtering.webp";
import combineConditionsImage from "./combine-conditions.webp";
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
      number="14"
      title="Filtering rows"
      lead="Use a column comparison to build a True/False boolean mask, pass that mask to df[...] to keep matching rows, and combine conditions with & and parentheses without changing the original DataFrame."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>
          Filtering rows: Keeping only the records that match your rule.
        </h2>
        <p>
          In <strong>P1.12</strong> and <strong>P1.13</strong>, you built
          DataFrames, inspected table size and columns, and selected one or more
          columns. Real AI logs often hold thousands of rows, and you usually
          want only a slice — such as long prompts or timed-out calls.
        </p>
        <p>
          In pandas, row filtering happens in two clear steps. You will meet
          these terms in order:
        </p>
        <ol>
          <li>
            <strong>Comparison condition:</strong> Testing a column against a
            rule such as <code>df[&quot;tokens&quot;] &gt; 20</code> or{" "}
            <code>df[&quot;status&quot;] == &quot;ok&quot;</code>.
          </li>
          <li>
            <strong>Boolean mask:</strong> The pandas <code>Series</code> (a
            one-dimensional labeled sequence of values) of <code>True</code> and{" "}
            <code>False</code> results returned by a comparison, aligned with
            the DataFrame&apos;s row index.
          </li>
          <li>
            <strong>
              Row filtering (<code>df[mask]</code>):
            </strong>{" "}
            Passing a boolean mask into <code>df[...]</code> to return a new
            DataFrame containing only the <code>True</code> rows.
          </li>
          <li>
            <strong>
              Combined condition (<code>(cond1) &amp; (cond2)</code>):
            </strong>{" "}
            Joining two boolean masks row by row with <code>&amp;</code> (both
            must be <code>True</code>) and parentheses around each comparison.
          </li>
        </ol>
        <p>
          Every example in this lesson uses the same illustrative 5-row AI
          prompt log <code>df</code>:
        </p>
        <Code label="Illustrative 5-row prompt log DataFrame">
          {`  prompt_id   model  tokens   status
0        p1  gemini      12       ok
1        p2  claude      28       ok
2        p3     gpt      18  timeout
3        p4  gemini      35       ok
4        p5  claude      40  timeout`}
        </Code>
      </section>

      <section id="mask">
        <h2 tabIndex={-1}>A comparison on a column builds a boolean mask.</h2>
        <p>
          Everyday analogy: imagine scanning a 5-line guest list with a pencil
          and marking <strong>Yes</strong> or <strong>No</strong> next to each
          name before copying anyone onto a new sheet. A column comparison in
          pandas does that marking step first.
        </p>
        <p>
          When you write <code>df[&quot;tokens&quot;] &gt; 20</code>, pandas
          checks every value in the <code>tokens</code> column and returns a{" "}
          <strong>boolean mask</strong> — a 1D <code>Series</code> of{" "}
          <code>True</code> and <code>False</code> values with the same row
          index:
        </p>

        <Code label="Building a boolean mask from a column comparison">
          {`mask = df["tokens"] > 20
print(mask)`}
        </Code>

        <Code label="Output of printing the boolean mask Series">
          {`0    False
1     True
2    False
3     True
4     True
Name: tokens, dtype: bool`}
        </Code>

        <p>
          Notice that <code>df[&quot;tokens&quot;] &gt; 20</code> does{" "}
          <strong>not</strong> return the matching rows yet — it only produces
          the <code>True</code>/<code>False</code> checklist showing which rows
          pass (rows <code>1</code>, <code>3</code>, and <code>4</code>).
        </p>

        <figure className={styles.figure}>
          <Image
            src={booleanMaskImage}
            alt="Infographic titled From column to boolean mask: A comparison tests every row and returns True or False. A tokens column card with Index 0 to 4 and values 12, 28, 18, 35, and 40 flows right through df['tokens'] > 20 into a Boolean mask card with Index 0 to 4 and results False, True, False, True, and True. Bottom strip reads Everyday analogy: Like marking each row on a checklist with Yes or No."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            Comparing a column against a rule creates a boolean Series aligned
            with each row&apos;s index.
          </figcaption>
        </figure>

        <Check
          title="Quick check: What does a column comparison return?"
          question='On our 5-row prompt log df, what does df["tokens"] > 20 return?'
          options={[
            "A pandas Series of True and False values (one per row).",
            "A filtered DataFrame containing only rows 1, 3, and 4.",
            "A single True or False value for the whole table.",
            "The number 3, counting how many rows are above 20.",
          ]}
          correct={0}
          explanation='df["tokens"] > 20 compares each row and returns a 1D boolean Series (mask) of True and False values.'
          wrongFeedback={[
            'Correct! df["tokens"] > 20 returns a boolean Series with one True or False value per row.',
            "To get a filtered DataFrame of rows 1, 3, and 4, you must pass the mask into df[...].",
            "pandas evaluates the comparison element by element, producing one boolean per row rather than one value for the whole table.",
            "The comparison returns booleans, not a row count.",
          ]}
        />
      </section>

      <section id="filter">
        <h2 tabIndex={-1}>
          Pass the mask into df[...] to keep only True rows.
        </h2>
        <p>
          Everyday analogy: lay a cutout stencil over a printed sheet so only
          the open slots show through onto a fresh copy. The original sheet
          underneath stays intact.
        </p>
        <p>
          In pandas, pass your boolean mask inside <code>df[...]</code>. You can
          store the mask in a variable first or write the comparison inline:
        </p>

        <Code label="Applying a boolean mask to filter rows">
          {`# Two-step form
mask = df["tokens"] > 20
long_prompts = df[mask]

# Common one-line form (same result)
long_prompts = df[df["tokens"] > 20]
print(long_prompts)`}
        </Code>

        <Code label="Output of the filtered DataFrame">
          {`  prompt_id   model  tokens   status
1        p2  claude      28       ok
3        p4  gemini      35       ok
4        p5  claude      40  timeout`}
        </Code>

        <p>Two details are worth noticing right away:</p>
        <ul>
          <li>
            <strong>
              Original <code>df</code> is unchanged:
            </strong>{" "}
            <code>df[mask]</code> returns a new filtered DataFrame, so{" "}
            <code>df</code> still holds all 5 rows.
          </li>
          <li>
            <strong>Original row index labels stay attached:</strong> the kept
            rows still show index labels <code>1</code>, <code>3</code>, and{" "}
            <code>4</code> (rather than renumbering to <code>0, 1, 2</code>),
            which lets you trace each row back to <code>df</code>.
          </li>
        </ul>

        <figure className={styles.figure}>
          <Image
            src={rowFilteringImage}
            alt="Infographic titled Filtering rows with a mask: df[mask] keeps True rows and leaves df unchanged. An Original df card with Index 0 to 4, prompt_id p1 to p5, and Mask False, True, False, True, True flows right through df[mask] into a Filtered DataFrame card with Index 1 p2, 3 p4, and 4 p5. Bottom strip reads Key takeaway: Original df stays 5 rows; kept rows keep index 1, 3, 4."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            df[mask] keeps only rows where the mask is True, preserves their
            original index labels, and leaves df untouched.
          </figcaption>
        </figure>

        <Check
          title="Quick check: Does filtering change the original DataFrame?"
          question='After running long_prompts = df[df["tokens"] > 20] on our 5-row df, how many rows are in the original df?'
          options={[
            "3 rows, because the False rows were deleted from df.",
            "0 rows, because all rows moved into long_prompts.",
            "5 rows, because df[...] returns a new DataFrame and leaves df unchanged.",
            "2 rows, containing only the rows that did not match.",
          ]}
          correct={2}
          explanation="Filtering with df[...] returns a new DataFrame with the 3 matching rows and leaves the original 5-row df unchanged."
          wrongFeedback={[
            "df[...] does not delete rows from df; it returns a new filtered DataFrame.",
            "Rows are not removed from df when you assign a filtered result to a new variable.",
            "Correct! long_prompts has 3 rows, while the original df still has all 5 rows.",
            "The original df keeps all 5 rows, not just the unmatched ones.",
          ]}
        />
      </section>

      <section id="combine">
        <h2 tabIndex={-1}>
          Combine two conditions with &amp; and parentheses.
        </h2>
        <p>
          Everyday analogy: at an airport gate, a passenger boards only when{" "}
          <strong>both</strong> checks pass — a valid boarding pass{" "}
          <strong>and</strong> a matching ID. Each check gives a Yes/No first,
          and both must be Yes.
        </p>
        <p>
          To keep rows in <code>df</code> that have more than 20 tokens{" "}
          <strong>and</strong> status <code>&quot;ok&quot;</code>, wrap each
          comparison in parentheses and join them with <code>&amp;</code>:
        </p>

        <Code label="Combining two conditions with & and parentheses">
          {`ok_long = df[(df["tokens"] > 20) & (df["status"] == "ok")]
print(ok_long)`}
        </Code>

        <Code label="Output of combining two conditions">
          {`  prompt_id   model  tokens status
1        p2  claude      28     ok
3        p4  gemini      35     ok`}
        </Code>

        <p>
          Notice why row <code>4</code> (<code>p5</code>) was dropped: its{" "}
          <code>tokens</code> value is <code>40</code> (<code>True</code>), but
          its <code>status</code> is <code>&quot;timeout&quot;</code> (
          <code>False</code>), so <code>True &amp; False</code> evaluates to{" "}
          <code>False</code>.
        </p>
        <p>Two common syntax mistakes to watch for:</p>
        <ul>
          <li>
            <strong>
              Use <code>&amp;</code>, not Python <code>and</code>:
            </strong>{" "}
            Python&apos;s <code>and</code> expects a single <code>True</code>/
            <code>False</code> value, not a whole Series of booleans, so pandas
            raises a <code>ValueError</code>.
          </li>
          <li>
            <strong>Wrap each comparison in parentheses:</strong> In Python,{" "}
            <code>&amp;</code> binds tighter than <code>&gt;</code> and{" "}
            <code>==</code>. Without parentheses,{" "}
            <code>
              df[&quot;tokens&quot;] &gt; 20 &amp; df[&quot;status&quot;] ==
              &quot;ok&quot;
            </code>{" "}
            tries to evaluate <code>20 &amp; df[&quot;status&quot;]</code> first
            and raises a <code>TypeError</code>.
          </li>
        </ul>

        <figure className={styles.figure}>
          <Image
            src={combineConditionsImage}
            alt="Infographic titled Combining masks with &: A row is True only when both masks are True. Two stacked left cards for tokens > 20 (0 False, 1 True, 2 False, 3 True, 4 True) and status == 'ok' (0 True, 1 True, 2 False, 3 True, 4 False) flow right through an & badge into a Combined mask card (0 False, 1 True, 2 False, 3 True, 4 False). Bottom strip reads Syntax rule: Wrap each condition: (cond1) & (cond2)."
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <figcaption className="micro">
            &amp; compares two boolean masks row by row; parentheses ensure each
            comparison finishes before &amp; runs.
          </figcaption>
        </figure>

        <div className={styles.quickQuestions}>
          <h3>Quick Questions</h3>
          <dl>
            <dt>
              Why can&apos;t I write{" "}
              <code>
                df[&quot;tokens&quot;] &gt; 20 and df[&quot;status&quot;] ==
                &quot;ok&quot;
              </code>
              ?
            </dt>
            <dd>
              Python&apos;s <code>and</code> expects one single truth value, not
              a Series of five booleans, so pandas raises a{" "}
              <code>ValueError</code>. Use <code>&amp;</code> with parentheses
              instead.
            </dd>
            <dt>
              Why do the filtered rows show index <code>1</code> and{" "}
              <code>3</code> instead of <code>0</code> and <code>1</code>?
            </dt>
            <dd>
              pandas preserves each kept row&apos;s original index label so you
              can still tell which rows of <code>df</code> matched your rule.
            </dd>
            <dt>
              Does <code>df[&quot;tokens&quot;] &gt; 20</code> include a row
              with exactly 20 tokens?
            </dt>
            <dd>
              No. <code>&gt;</code> means strictly greater than 20; use{" "}
              <code>&gt;=</code> when you want to include 20 as well.
            </dd>
          </dl>
        </div>
      </section>

      <section id="practice">
        <h2 tabIndex={-1}>Practice: Predict the filtered rows.</h2>
        <p>
          Trace both conditions on our 5-row prompt log before running the
          filter in your head.
        </p>

        <Code label="Practice filter snippet">
          {`# df rows:
# 0: p1 (gemini, 12, ok)       1: p2 (claude, 28, ok)
# 2: p3 (gpt, 18, timeout)     3: p4 (gemini, 35, ok)
# 4: p5 (claude, 40, timeout)

result = df[(df["model"] == "claude") & (df["status"] == "timeout")]`}
        </Code>

        <Check
          title="Practice: Which row(s) are in result?"
          question='Which row(s) match both df["model"] == "claude" and df["status"] == "timeout"?'
          options={[
            "p2 and p5 (rows 1 and 4)",
            "p5 only (row 4)",
            "p3 and p5 (rows 2 and 4)",
            "p2, p3, and p5 (rows 1, 2, and 4)",
          ]}
          correct={1}
          explanation='Only row 4 (p5) has both model == "claude" and status == "timeout". Row 1 (p2) has status "ok", and row 2 (p3) uses model "gpt".'
          wrongFeedback={[
            'Row 1 (p2) uses model "claude", but its status is "ok", so it fails the second condition.',
            'Correct! Only row 4 (p5) satisfies both model == "claude" and status == "timeout".',
            'Row 2 (p3) has status "timeout", but its model is "gpt", not "claude".',
            "That set includes rows that match only one of the two rules; & requires both to be True on the same row.",
          ]}
        />
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the Row Filter Lab.</h2>
        <p>
          Explore how single and combined boolean masks select rows from our
          illustrative 5-row prompt log.
        </p>
        <FilterLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question='Which expression filters df to return a DataFrame of rows where tokens is above 20 AND status is "ok" without raising a Python error?'
        options={[
          'df[df["tokens"] > 20 and df["status"] == "ok"]',
          'df[df["tokens"] > 20 & df["status"] == "ok"]',
          '(df["tokens"] > 20) & (df["status"] == "ok")',
          'df[(df["tokens"] > 20) & (df["status"] == "ok")]',
        ]}
        correct={3}
        explanation="Wrap each comparison in parentheses, join the two boolean masks with &, and pass the combined mask into df[...]."
        wrongFeedback={[
          "Using Python's 'and' between two pandas Series raises a ValueError because a Series's truth value is ambiguous.",
          'Without parentheses, & binds tighter than > and ==, causing Python to evaluate 20 & df["status"] and raise a TypeError.',
          "That expression returns the combined boolean mask Series (True/False values), not the filtered DataFrame.",
          "Correct! Each comparison is wrapped in parentheses, joined with &, and passed into df[...] to filter the rows.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className="card" style={{ padding: "1.25rem", margin: "1rem 0" }}>
          <h3 style={{ marginTop: 0 }}>Summary Cheat-Sheet</h3>
          <ul>
            <li>
              <strong>Boolean mask:</strong>{" "}
              <code>df[&quot;tokens&quot;] &gt; 20</code> tests each row and
              returns a 1D <code>True</code>/<code>False</code> Series.
            </li>
            <li>
              <strong>Filter rows:</strong> <code>df[mask]</code> or{" "}
              <code>df[df[&quot;tokens&quot;] &gt; 20]</code> keeps only the{" "}
              <code>True</code> rows.
            </li>
            <li>
              <strong>Original table stays intact:</strong> Filtering returns a
              new DataFrame and preserves original row index labels.
            </li>
            <li>
              <strong>Combine conditions with &amp;:</strong> Write{" "}
              <code>df[(cond1) &amp; (cond2)]</code> so a row is kept only when
              both masks are <code>True</code>.
            </li>
            <li>
              <strong>Avoid two common errors:</strong> Use <code>&amp;</code>{" "}
              (not Python <code>and</code>) on Series, and always wrap each
              comparison in parentheses.
            </li>
          </ul>
        </div>
        <p>
          That wraps up <strong>Python for AI</strong> — you now have the core
          Python building blocks, safe parsing habits, and pandas table skills
          to inspect and filter structured AI data.
        </p>
      </section>
    </LessonFrame>
  );
}

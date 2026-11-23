import Image from "next/image";
import Link from "next/link";
import messyTableIssues from "./images/messy-table-issues.webp";
import cleaningChoicesShiftResults from "./images/cleaning-choices-shift-results.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { CleaningLab } from "./CleaningLab";
import { RAW_DELIVERIES } from "./data";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="02"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Cleaning data and missing values"
      lead="Real-world tables rarely arrive ready for a model. Inspecting formats, errors, and gaps—and knowing that every cleaning choice carries an assumption—helps you judge whether a result can be trusted."
    >
      <section id="what-cleaning-is">
        <h2 tabIndex={-1}>Inspecting messy data before a model sees it.</h2>
        <p>
          Think of checking ingredients before cooking: you read mismatched jar
          labels, set aside anything spoiled, and notice what is missing from
          the pantry. <strong>Data cleaning</strong> is the step where you
          inspect and repair a dataset before summarising it or training a
          model.
        </p>
        <p>
          The kitchen analogy only goes so far: in data work, deciding what to
          drop, replace, or keep visible can change the numbers and conclusions
          you get at the end.
        </p>
        <p>This lesson covers four ideas in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Format mismatches:</strong> the same real value written in
            inconsistent ways.
          </li>
          <li>
            <strong>Data errors:</strong> recorded values that are wrong or
            impossible.
          </li>
          <li>
            <strong>Missing values (gaps):</strong> cells where no value was
            recorded.
          </li>
          <li>
            <strong>Cleaning choices:</strong> deciding whether to fix, drop,
            fill, or flag problems—and how each choice changes the result.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: Nadia’s community meal-delivery log</strong>
          <p>
            Nadia (an invented character for this lesson) helps run a volunteer
            meal-delivery co-op serving two areas—<strong>Town Centre</strong>{" "}
            and <strong>Hilltop</strong>. She checks six recent deliveries (an
            invented table) to see whether the co-op’s{" "}
            <strong>overall average delivery time</strong> stays under a{" "}
            <strong>30-minute target</strong>, and whether Hilltop looks slower
            than Town Centre.
          </p>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Row</th>
                <th scope="col">Area</th>
                <th scope="col">Time (mins)</th>
                <th scope="col">Problem spotted</th>
              </tr>
            </thead>
            <tbody>
              {RAW_DELIVERIES.map((row) => (
                <tr key={row.id}>
                  <td>
                    <strong>{row.id}</strong>
                  </td>
                  <td>{row.rawArea}</td>
                  <td>{row.rawTime}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.issueKind === "clean"
                          ? styles.badgeGood
                          : row.issueKind === "error"
                            ? styles.badgeWarn
                            : styles.badgeAccent
                      }`}
                    >
                      {row.issueLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="micro">
          If Nadia runs a plain numeric average on this raw table without
          cleaning it first, software skips <code>20 mins</code> (text) and{" "}
          <code>(blank)</code>, averages <code>18, 22, -15, 44</code>, and
          reports an overall average of <strong>17.3 min</strong>—artificially
          low because of <code>-15</code>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={messyTableIssues}
            alt="Diagram titled Three common data problems with subtitle Check formats, errors, and gaps before training. Left card shows Raw delivery log with rows D2 (town centre, 22), D3 (Town Centre, 20 mins), D4 (Hilltop, -15), and D5 (Hilltop, blank). Arrows flow left to right to three cards: Format mismatch (town centre / 20 mins), Data error (-15 impossible), and Missing value (blank gap). Bottom cards show Analogy (Like checking ingredients for bad labels, spoiled items, or missing stock.) and Key takeaways (Formats: same value written differently; Errors: wrong or impossible readings; Gaps: values never recorded)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Sorting problems by what is wrong in a cell—format mismatch, data
            error, or missing value—helps you decide what to do next.
          </figcaption>
        </figure>
      </section>

      <section id="formats-and-errors">
        <h2 tabIndex={-1}>Spotting format mismatches and errors.</h2>
        <p>
          In this lesson, we sort cell defects by one simple test: what went
          wrong in that cell. Real tables can mix more than one problem in the
          same row, so inspecting columns carefully matters.
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Format mismatch</h3>
            <p>
              The real value is valid, but written inconsistently so software
              treats matching records differently.
            </p>
            <p className="micro">
              <strong>In Nadia’s log:</strong> <code>town centre</code> in D2
              creates a separate area label from <code>Town Centre</code>, and{" "}
              <code>20 mins</code> in D3 mixes text into a number column.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> writing a date as{" "}
              <code>03/04/2026</code> means 3 April in DD/MM/YYYY format but 4
              March in MM/DD/YYYY format.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Data error</h3>
            <p>
              A recorded value is wrong or impossible—often from a typo, a
              broken sensor, or a unit mix-up.
            </p>
            <p className="micro">
              <strong>In Nadia’s log:</strong> <code>-15</code> in D4 is an
              impossible negative delivery time. Without a paper receipt to
              verify the true time, Nadia marks D4 as missing instead of
              guessing.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> a fitness watch slipping off a
              live wearer’s wrist and logging a heart rate of <code>0</code>{" "}
              beats per minute—an impossible live reading (even though{" "}
              <code>0</code> can be a genuine measurement in other datasets).
            </p>
          </div>
        </div>
        <p>
          Impossible errors like <code>-15</code> minutes stand out quickly.
          Plausible typos—such as typing <code>24</code> instead of{" "}
          <code>42</code>—are much harder to spot unless you check the original
          source, and some older systems store placeholder codes like{" "}
          <code>-999</code> to stand in for missing data.
        </p>
      </section>

      <section id="missing-values">
        <h2 tabIndex={-1}>Missing values—and why cleaning is not neutral.</h2>
        <p>
          A <strong>missing value</strong> (or <strong>gap</strong>) is a cell
          where no measurement was recorded—shown as a blank cell,{" "}
          <code>N/A</code>, or <code>null</code>. Gaps can happen at random, or
          they can follow a pattern tied to a specific group or situation.
        </p>
        <p>
          Once Nadia fixes the format mismatches (D2 and D3) and marks the
          impossible <code>-15</code> (D4) as missing, Town Centre has three
          valid times (<code>18, 22, 20</code>—average <strong>20 min</strong>)
          while Hilltop has one valid time (<code>44</code>) and two missing
          times (D4 and D5). Look at how different missing-value choices change
          her numbers:
        </p>
        <ul>
          <li>
            <strong>Drop incomplete rows:</strong> overall average is{" "}
            <strong>26 min</strong> (under the 30-min target), but Hilltop drops
            from half the log (3 of 6) to 1 of 4 rows—under-counting Hilltop.
          </li>
          <li>
            <strong>Fill with the overall average (26 min):</strong> keeps 6
            rows and an overall average of <strong>26 min</strong>, but borrows
            faster Town Centre times and pulls Hilltop’s average down to{" "}
            <strong>32 min</strong>.
          </li>
          <li>
            <strong>Fill with Hilltop’s known average (44 min):</strong> pushes
            the overall average to <strong>32 min</strong> (over the 30-min
            target), but assumes a single recorded Hilltop trip represents all
            Hilltop deliveries.
          </li>
          <li>
            <strong>Fill with 0 (a common spreadsheet pitfall):</strong> treats
            missing deliveries as 0-minute trips, collapsing the overall average
            to <strong>17.3 min</strong> and making Hilltop (
            <strong>14.7 min</strong>) look faster than Town Centre.
          </li>
          <li>
            <strong>Keep visible and flag missing:</strong> adds a{" "}
            <code>Missing flag</code> column, averages valid times only (
            <strong>26 min</strong> across 4 rows), and makes it obvious that
            both gaps are in Hilltop—pointing Nadia to investigate weak mobile
            signal on the hill.
          </li>
        </ul>
        <p className="micro">
          Even after cleaning, one valid Hilltop delivery (<code>44 min</code>)
          is far too little evidence to decide staffing on its own—Nadia needs
          more complete Hilltop records first.
        </p>
        <div className={styles.example}>
          <strong>Everyday example: a clinic feedback form</strong>
          <p>
            Suppose a clinic sends an online follow-up survey, and older
            patients are more likely to leave an app-usability question blank.
            Dropping every row with a blank answer does not stay neutral—it
            silently removes older patients’ feedback from the results.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={cleaningChoicesShiftResults}
            alt="Diagram titled Cleaning choices change results with subtitle Three ways to handle the same two Hilltop gaps. Left card shows Same table (2 Hilltop gaps) with Town Centre: 18, 22, 20 and Hilltop: 44, ?, ?. Three branching arrows point right to three alternative strategy cards: Drop blank rows (Overall avg: 26 min, Hilltop under-counted), Fill gaps with 0 (Overall avg: 17.3 min, Falsely looks fast), and Fill with Hilltop avg (Overall avg: 32 min, Over 30-min target). Bottom cards show Analogy (Like deciding whether to skip or estimate missing scores on a test.) and Key takeaways (Cleaning is a choice, not neutral; Different fixes shift the overall average; Record every rule you apply)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The same cleaned table and the same two Hilltop gaps can yield three
            different overall averages depending on how you handle missing
            values.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Fix Nadia’s messy table yourself.</h2>
        <div className={styles.example}>
          <strong>Worked trace before you try it</strong>
          <p>
            Start with the raw log: <code>-15</code> pulls the raw average down
            to <strong>17.3 min</strong> and <code>town centre</code> splits
            Town Centre into two labels. Fixing D2 and D3 standardises formats,
            and marking D4 (<code>-15</code>) as missing clears the impossible
            value—then switching missing-value strategies shows how the overall
            average moves from <strong>17.3 min</strong> to{" "}
            <strong>26 min</strong> to <strong>32 min</strong>.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            Notice the starting raw summary: <strong>3 area labels</strong> and
            a distorted <strong>17.3 min</strong> overall average.
          </li>
          <li>
            Click <strong>Fix all formats &amp; errors</strong> (or toggle D2,
            D3, and D4 one by one) so formats match and <code>-15</code> is
            marked missing.
          </li>
          <li>
            Compare <strong>Drop incomplete rows</strong>,{" "}
            <strong>Fill with Hilltop average</strong>, and{" "}
            <strong>Fill with 0 (pitfall)</strong>—watch both the overall
            average and Hilltop’s share of rows change.
          </li>
          <li>
            Click <strong>Keep visible &amp; flag missing</strong>, then click{" "}
            <strong>Reset table</strong> to start over.
          </li>
        </ol>
        <CleaningLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Good habits and limits of data cleaning.</h2>
        <p>
          Because cleaning changes what a dataset says, reliable teams treat
          cleaning choices as part of the evidence—not invisible housekeeping.
        </p>
        <ul>
          <li>
            <strong>Keep an untouched raw copy:</strong> never overwrite the
            original file so any cleaning step can be audited or reversed.
          </li>
          <li>
            <strong>Record every rule:</strong> write down what you
            standardised, dropped, or filled—and why—so others can judge the
            result.
          </li>
          <li>
            <strong>Ask why values are missing:</strong> checking who or what is
            missing connects directly to collecting representative data (Lesson
            5.1).
          </li>
          <li>
            <strong>Avoid peeking at test data:</strong> when filling gaps for a
            machine learning model, calculate fill values using the training
            split only so test data does not leak into training (Lesson 5.9).
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Is dropping rows with missing values the safest default?
            </strong>
            <p>
              Not necessarily. When one group has more missing values, dropping
              incomplete rows shrinks that group’s representation and can bias
              the results.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Should I replace blank numbers with 0 so formulas do not break?
            </strong>
            <p>
              Usually no. Zero is a real measurement, so replacing a blank cell
              with 0 can pull averages and model predictions in the wrong
              direction.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Does clean data guarantee an accurate model?</strong>
            <p>
              No. Cleaning repairs format mismatches, errors, and gaps in the
              records you have, but it cannot fix a sample that left out whole
              groups (Lesson 5.1) or guarantee future predictions are right.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A town library keeps a daily visitor table where each row records one branch on one day (Branch, Date, Visitors) for its Central and Westside branches, to estimate each branch's monthly total visits and decide whether Westside needs longer evening hours. On two rainy Fridays, Westside's door counter lost power while the branch stayed open and recorded blank cells instead of visitor counts. The analyst drops all rows with blank cells and adds up the remaining rows as each branch's monthly total. Which statement is right?"
        options={[
          "Dropping blank rows is a neutral step because it only removes incomplete records and leaves the remaining numbers untouched.",
          "Replacing the two blank cells with 0 is better than dropping them, because it keeps every Friday in the table without lowering Westside's average daily visitors.",
          "Dropping the blank rows is not neutral—it leaves two open Westside Fridays out of Westside's total while keeping every Central day, which can under-count Westside's monthly visits and skew the decision on evening hours.",
          "Because the door counter lost power, those blank cells are format mismatches rather than missing values.",
        ]}
        correct={2}
        explanation="Because each row is one branch-day and Westside stayed open while its counter was out, dropping blank rows leaves two Westside days out of the sum while keeping all Central days—which can under-count Westside's estimated monthly visits and skew the decision on evening hours. Cleaning choices carry assumptions and are not neutral."
        wrongFeedback={[
          "Dropping rows omits two open Westside Fridays while keeping every Central day, which can under-count Westside's estimated monthly visits—so the step is not neutral.",
          "Putting 0 into a blank cell treats an open day with a power outage as zero visitors, which pulls Westside's average daily visitors down.",
          "",
          "A format mismatch is a real value written inconsistently (such as 'westside' vs 'Westside'). A blank cell with no recorded count is a missing value.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Data cleaning is not neutral.</strong> Before training or
            summarising, inspect your table for{" "}
            <strong>format mismatches</strong>, <strong>data errors</strong>,
            and <strong>missing values</strong>. Every choice to drop, fill, or
            flag a gap carries an assumption that can shift averages, shrink a
            group’s representation, and change the decision you make—so inspect
            why values are missing and record every rule you apply.
          </p>
          <p className="micro">
            Ready to continue? Return to{" "}
            <Link className="text-link" href="/course/chapter-5">
              Data and Evaluation
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

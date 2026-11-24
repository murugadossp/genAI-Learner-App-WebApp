import Image from "next/image";
import Link from "next/link";
import overallVsSubgroupsImg from "./images/overall-vs-subgroups.webp";
import errorDisparityImg from "./images/error-disparity.webp";
import intersectionalImg from "./images/intersectional-subgroups.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { SubgroupLab } from "./SubgroupLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="10"
      chapter={{ label: "Data and Evaluation", href: "/course/chapter-5" }}
      title="Performance across different groups"
      lead="Compare results across groups, not just averages. A strong overall accuracy score can still hide a weaker result for some people."
    >
      <section id="why-averages-hide">
        <h2 tabIndex={-1}>One average can hide a group gap.</h2>
        <p>
          A common misconception is that average accuracy shows fairness.
          Accuracy is the share of test cases predicted correctly, while an
          overall score combines all groups in one number. That number alone
          cannot show whether performance is similar across groups.
        </p>
        <p>
          A <strong>subgroup</strong> is a defined slice of test cases, such as
          calls from speakers with a particular accent.{" "}
          <strong>Disaggregated evaluation</strong> means reporting a result
          separately for each subgroup. This lesson uses accuracy first, then
          checks specific errors and combinations of traits.
        </p>
        <div className={styles.example}>
          <strong>Worked example: CityBus Voice Desk (invented)</strong>
          <p>
            This fictional phone helper classifies rider calls as{" "}
            <strong>Urgent</strong> (send to a dispatcher) or{" "}
            <strong>Routine</strong> (answer a timetable question). On 200 test
            calls, it gets 172 right, so overall accuracy is 86%.
          </p>
        </div>
        <p>
          Now split those same test calls by accent. Local accent calls are 160
          of 200 and score 90%; Regional accent calls are 40 and score 70%. The
          larger group contributes more calls to the combined score, so its
          stronger result carries more weight. These illustrative values add up
          to the same 86% overall accuracy.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Test group</th>
                <th scope="col">Calls</th>
                <th scope="col">Correct</th>
                <th scope="col">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All calls</td>
                <td>200</td>
                <td>172</td>
                <td>86%</td>
              </tr>
              <tr>
                <td>Local accent</td>
                <td>160</td>
                <td>144</td>
                <td>90%</td>
              </tr>
              <tr>
                <td>Regional accent</td>
                <td>40</td>
                <td>28</td>
                <td>70%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <figure className={styles.figure}>
          <Image
            src={overallVsSubgroupsImg}
            alt="One average, two group scores: 200 calls score 86% overall, splitting into Local accent (160 calls, 90%) and Regional accent (40 calls, 70%). The Analogy card says many dinner reviews weigh more; Key takeaways say one average can hide a gap, compare each group’s score, and group size affects the average."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The overall score summarizes both groups, while the split makes the
            20-point difference visible.
          </figcaption>
        </figure>
      </section>

      <section id="error-types">
        <h2 tabIndex={-1}>The same accuracy can hide different errors.</h2>
        <p>
          Accuracy counts every correct call together. A{" "}
          <strong>false negative</strong> is an urgent call marked Routine; a{" "}
          <strong>false positive</strong> is a routine call marked Urgent. The
          rate for each error divides that error count by the calls that truly
          belonged in its category.
        </p>
        <p>
          An <strong>error disparity</strong> is a difference between groups in
          accuracy or in a specific error rate. For example, two groups can each
          have 20 calls and 80% accuracy while one has four false alarms and the
          other has four missed urgent calls. Their accuracy matches, but the
          kinds of mistakes differ.
        </p>
        <figure className={styles.figure}>
          <Image
            src={errorDisparityImg}
            alt="Same score, different errors: Group A and Group B each have 20 calls and 80% accuracy; Group A has 0 missed urgent and 4 false alarms, while Group B has 4 missed urgent and 0 false alarms. The Analogy card says same count wrong, different items; Key takeaways say accuracy counts all mistakes alike, check errors that matter here, and compare groups by error type."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Which error matters more depends on what the system is meant to do
            and who may be harmed.
          </figcaption>
        </figure>
      </section>

      <section id="intersectional">
        <h2 tabIndex={-1}>Combine traits to check more specific groups.</h2>
        <p>
          An <strong>intersectional subgroup</strong> combines two or more
          attributes. Here, we combine speaker accent with phone line quality:
          Quiet or Noisy. This can reveal a pattern that either attribute alone
          might blur.
        </p>
        <p>
          In the same fictional 200-call test, accuracy is 95% for Local +
          Quiet, 90% for Regional + Quiet, 85% for Local + Noisy, and 50% for
          Regional + Noisy. The 50% result is a signal to investigate, not proof
          of why the system struggled.
        </p>
        <figure className={styles.figure}>
          <Image
            src={intersectionalImg}
            alt="Two traits reveal a gap: a grid combines Quiet and Noisy phone lines with Local and Regional accents; accuracy is 95%, 85%, 90%, and 50%, with Regional plus Noisy lowest. The Analogy card says two conditions can compound; Key takeaways say check combinations of traits, one slice may reveal more, and small groups need caution."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The lowest cell is worth checking, but the score alone does not
            identify a cause.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Explore the same calls by group.</h2>
        <p>
          This lab uses the same invented 200 calls. A metric is the particular
          measurement being compared; here you can choose accuracy, missed
          urgent rate, or false alarm rate. Each view regroups the test results
          without changing the calls.
        </p>
        <ol className={styles.steps}>
          <li>Start with the combined accuracy score.</li>
          <li>Choose By accent to compare the two subgroup scores.</li>
          <li>
            Select Missed urgent (FN rate) to compare that error rate by accent.
          </li>
          <li>
            Choose Accent + line quality and notice both the result and the
            small-sample note.
          </li>
        </ol>
        <SubgroupLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Read subgroup results with care.</h2>
        <ul className={styles.steps}>
          <li>
            <strong>Small groups make estimates less steady.</strong> In the
            Regional + Noisy slice, there are only 10 urgent calls. One
            additional missed call changes that rate by 10 percentage points.
          </li>
          <li>
            <strong>A gap is a clue, not a diagnosis.</strong> The scores do not
            tell us whether the cause is training examples, recording quality,
            labels, or another factor.
          </li>
          <li>
            <strong>Groups depend on available data.</strong> Teams should only
            compare attributes that are recorded appropriately and can be used
            responsibly; real people may not fit neatly into a category.
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A fictional clinic’s triage tool has 91% overall accuracy across 1,000 cases: 850 younger adults and 150 older adults. What is the best next evaluation step?"
        options={[
          "Approve the tool because 91% accuracy across 1,000 cases is strong.",
          "Remove age from the input and assume performance will become equal.",
          "Compare accuracy and important error rates separately for younger and older adults, then inspect relevant combinations where sample sizes allow.",
          "Compare only whether both groups have the same accuracy.",
        ]}
        correct={2}
        explanation="Separate subgroup results can reveal a gap hidden by the overall score; checking relevant error types adds context that accuracy alone leaves out."
        wrongFeedback={[
          "The larger younger-adult group makes up 85% of these cases, so its results can dominate the combined score.",
          "Removing age does not establish equal performance, and other inputs may still relate to age.",
          "",
          "Matching accuracy can still hide a difference in missed urgent cases or false alarms.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            Compare subgroup results alongside the overall average. Check the
            accuracy and error types that matter for the task, and examine
            combinations of traits when the data supports a useful comparison. A
            gap points to a question worth investigating; it does not prove a
            cause by itself.
          </p>
          <p className="micro">
            Return to the{" "}
            <Link className="text-link" href="/course/chapter-5">
              Data and Evaluation learning path
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

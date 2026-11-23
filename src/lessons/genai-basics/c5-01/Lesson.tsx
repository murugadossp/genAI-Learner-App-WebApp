import Image from "next/image";
import Link from "next/link";
import populationVsSample from "./images/population-vs-sample.webp";
import moreDataVsCoverage from "./images/more-data-vs-coverage.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { SampleAuditLab } from "./SampleAuditLab";
import { INITIAL_BUS_SETTINGS } from "./data";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="01"
      chapter={{
        label: "Data and Evaluation",
        href: "/course/chapter-5",
      }}
      title="Collecting representative data"
      lead="A model learns patterns only from the examples it sees. Collecting representative data starts with defining who and what a model serves, then checking which people or conditions your sample leaves out—because more data alone does not fix a blind spot."
    >
      <section id="who-it-serves">
        <h2 tabIndex={-1}>Start with who and what the model serves.</h2>
        <p>
          Think of tasting a pot of soup by skimming only the top layer of
          broth. You miss the vegetables and spices settled at the bottom, no
          matter how many spoonfuls you take from the top.
        </p>
        <p>
          Data collection works in a loosely similar way: before gathering
          examples, you need to define both <strong>who</strong> will use the
          model and <strong>what real-world conditions</strong> it must handle.
          It is only an analogy—real datasets often span many overlapping people
          and environments.
        </p>
        <p>This lesson introduces five ideas in order:</p>
        <ol className={styles.roadmap}>
          <li>
            <strong>Target population:</strong> the full set of people, items,
            or situations a model is meant to serve in real use.
          </li>
          <li>
            <strong>Sample:</strong> the subset of examples you actually collect
            to train or check the model.
          </li>
          <li>
            <strong>Representative sample:</strong> a sample that covers the key
            groups and conditions in the target population well enough for the
            model to learn patterns across them.
          </li>
          <li>
            <strong>Coverage gap:</strong> a group or condition that exists in
            the target population but is missing or too scarce in the sample.
          </li>
          <li>
            <strong>Sampling bias:</strong> a systematic skew in how examples
            are collected that makes some groups or conditions far more likely
            to appear in the sample than others.
          </li>
        </ol>
        <div className={styles.example}>
          <strong>Running example: Metro Bus Voice Helper</strong>
          <p>
            Imagine an invented city transit team building a voice assistant
            that answers spoken bus-route and arrival questions. To get started
            quickly, they collect <strong>1,000 voice clips</strong> from office
            staff in a quiet downtown building—standing in for quiet indoor hall
            speech—during lunch.
          </p>
        </div>
        <p>
          To keep the comparison clear, each clip is assigned to one of four
          non-overlapping <strong>primary recording settings</strong>: quiet
          indoor speech, a dry busy roadside stop, inside a moving bus, or a
          rainy outdoor stop.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th scope="col">Recording setting</th>
                <th scope="col">Initial sample</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_BUS_SETTINGS.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className={styles.settingName}>{row.setting}</span>
                    <span className={`micro ${styles.settingSub}`}>
                      {row.realUse}
                    </span>
                  </td>
                  <td>{row.initialClips.toLocaleString()} clips</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.status === "Covered"
                          ? styles.badgeGood
                          : styles.badgeWarn
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="micro">
          Illustrative counts: here “Covered” means examples of that setting
          appear in the sample (not a guarantee of production accuracy). The
          initial 1,000 quiet-office clips leave dry roadside stops, moving
          buses, and rainy stops completely missing.
        </p>
        <figure className={styles.figure}>
          <Image
            src={populationVsSample}
            alt="Diagram titled Target population vs sample with subtitle Narrow collection leaves real-world settings out. Flows left to right from Target population (Quiet indoor hall, Busy roadside stop, Inside moving bus, Rainy outdoor stop) through Narrow collection (Quiet office only) to Collected sample showing Quiet indoor hall as Covered and the other three settings as Missing. Bottom cards show Analogy (Like tasting only the top broth of a soup pot.) and Key takeaways (Define who and what the model serves; Check which settings your sample leaves out; Narrow collection creates blind spots)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            When collection reaches only one easy-to-access setting, the sample
            misses the rest of the target population.
          </figcaption>
        </figure>
      </section>

      <section id="more-data-myth">
        <h2 tabIndex={-1}>Why more data is not always better data.</h2>
        <p>
          A common assumption is that{" "}
          <strong>more data is always better</strong>. In practice, adding more
          examples from the same narrow source only makes a skewed sample
          bigger—it does not fix a <strong>coverage gap</strong>.
        </p>
        <p>
          Suppose the transit team gathers <strong>9,000 more clips</strong>{" "}
          from the exact same quiet office, growing the sample to{" "}
          <strong>10,000 clips</strong>. Because of{" "}
          <strong>sampling bias</strong>—collecting whoever is easiest to reach
          rather than where riders actually speak—the dataset is ten times
          larger yet still has zero clips from roadside stops, moving buses, or
          rainy weather.
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>10,000 narrow office clips</h3>
            <p>
              <strong>1,000 → 10,000 clips</strong>, all recorded in a quiet
              office.
            </p>
            <p className="micro">
              Coverage stays at <strong>1 of 4 settings</strong>. Three blind
              spots remain untouched.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>1,600 varied clips</h3>
            <p>
              <strong>1,000 quiet clips + 200 clips</strong> in each of the
              three missing settings.
            </p>
            <p className="micro">
              Far smaller than 10,000, yet all <strong>4 of 4 settings</strong>{" "}
              now appear in the sample.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <strong>
            Outside the bus example: a skin-condition photo helper
          </strong>
          <p>
            Consider an illustrative health app trained on 50,000 clinic photos
            taken mostly on light skin tones under bright exam lights. Adding
            50,000 more photos from the same bright clinic doubles the dataset
            size while still leaving darker skin tones and dim home lighting
            under-represented.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={moreDataVsCoverage}
            alt="Diagram titled More data vs better coverage with subtitle Adding more narrow clips does not fix blind spots. Top lane compares 10,000 office clips (Quiet tall bar, Other 3: 0) pointing right to 1 of 4 settings covered (Blind spots remain). Bottom lane compares 1,600 varied clips (1,000 and 200 each across four bars) pointing right to 4 of 4 settings covered (All 4 settings seen). Bottom cards show Analogy (Like taking ten spoonfuls from the same spot.) and Key takeaways (More narrow data repeats the same skew; Targeted collection adds missing settings; Check coverage per group, not just total size)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            A smaller targeted sample that spans all four settings can reduce
            blind spots far better than a huge sample drawn from one narrow
            source.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Spot the missing group in a sample.</h2>
        <p>
          In the activity below, inspect how a sample compares with the people
          and conditions the model is meant to serve, then test what happens
          when a team adds more narrow data versus targeted examples.
        </p>
        <div className={styles.example}>
          <strong>Worked trace: auditing the dry-afternoon bus sample</strong>
          <p>
            In Scenario 1, the team recorded voice clips in quiet halls (800),
            at busy roadside stops (220), and inside moving buses (180), but
            only on dry afternoons. Comparing those counts against the four
            target settings immediately exposes{" "}
            <strong>Rainy outdoor stop (0 clips)</strong> as the missing case.
          </p>
        </div>
        <ol className={styles.steps}>
          <li>
            Start on <strong>1. Find the missing group</strong> and click the
            missing setting in <strong>Metro Bus Voice Helper</strong>.
          </li>
          <li>
            Switch to <strong>City Bike-Share Demand</strong> and{" "}
            <strong>School Homework Helper</strong> to spot both a completely
            missing case and a scarce group.
          </li>
          <li>
            Switch to <strong>2. Test “more data”</strong> and compare{" "}
            <strong>Add 9,000 office clips (10,000 total)</strong> against{" "}
            <strong>Add 600 targeted clips (1,600 total)</strong>.
          </li>
          <li>
            Click <strong>Reset lab</strong> at any time to start fresh.
          </li>
        </ol>
        <SampleAuditLab />
      </section>

      <section id="how-to-check">
        <h2 tabIndex={-1}>How to spot gaps before you train.</h2>
        <p>
          You do not need complex maths to catch obvious coverage gaps before a
          model is trained. Walk through three practical checks:
        </p>
        <ol className={styles.steps}>
          <li>
            <strong>Define who and what the model serves:</strong> list the real
            users, items, and operating conditions—including noisy, unusual, or
            high-stakes cases.
          </li>
          <li>
            <strong>Trace how examples were collected:</strong> ask who or what
            was easiest to reach, and who was left out by the collection method.
          </li>
          <li>
            <strong>Count coverage per group, not just total size:</strong> a
            large row count can hide groups with zero or very few examples.
          </li>
        </ol>
        <p>
          Notice that a <strong>representative sample</strong> does not have to
          match exact real-world percentages in every case. Teams often
          intentionally collect extra examples of smaller or high-stakes groups
          so the model sees enough of them to learn useful patterns.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              If a dataset has 100,000 examples, isn’t that big enough to be
              representative?
            </strong>
            <p>
              No. Total size alone does not guarantee coverage—100,000 examples
              drawn from one narrow channel or setting can still miss entire
              groups of users.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Does representative mean every group must match its exact
              real-world percentage?
            </strong>
            <p>
              Not necessarily. What matters is having enough examples of each
              relevant group and condition; teams frequently oversample small or
              critical groups.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If our sample covers every group, will the model make zero
              mistakes?
            </strong>
            <p>
              No. Representative collection reduces blind spots, but models
              still face messy or missing values (Lesson 5.2), shifting
              real-world conditions, and prediction errors.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A city library is building a book-recommendation model meant to serve all library members—children, teens, adults, and seniors—across both print books and audiobooks. The team collected 20,000 borrowing records from the library's mobile audiobook app, which is used almost entirely by adult commuters, and plans to collect 30,000 more records from the same app to improve the model. What is the main problem with this plan?"
        options={[
          "The sample of 20,000 records is too small in total size for a book-recommendation model to learn useful patterns.",
          "The team needs to clean book titles and missing fields before checking which library members appear in the sample.",
          "Adding more records from the same audiobook app grows the count while still leaving print and non-adult borrowers out.",
          "The sample cannot be used to train a model unless every age group matches its exact city census share.",
        ]}
        correct={2}
        explanation="Collecting 30,000 more records from the same mobile audiobook app grows the dataset from 20,000 to 50,000, but it repeats the same sampling bias—leaving print borrowers, children, teens, and seniors missing or severely under-represented."
        wrongFeedback={[
          "Total count alone is not the main problem described here—the issue is that the records come almost entirely from adult commuter audiobook users, leaving other library members out.",
          "Data cleaning matters (and is covered in Lesson 5.2), but fixing book titles or missing fields will not add the missing print borrowers, children, teens, and seniors to the sample.",
          "",
          "A representative sample does not require exact census percentages—models can train on oversampled groups, whereas leaving whole member groups out creates blind spots.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>More data is not automatically better data.</strong> Start
            by defining the <strong>target population</strong>—who and what the
            model serves—then inspect your <strong>sample</strong> for{" "}
            <strong>coverage gaps</strong> and <strong>sampling bias</strong>.
            Adding more examples from the same narrow source only repeats the
            same blind spots; targeted collection helps bring missing groups
            into the sample.
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

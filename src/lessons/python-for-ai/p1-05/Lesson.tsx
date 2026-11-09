import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { TupleSetLab } from "./TupleSetLab";
import tuplesImage from "./assets/tuples.jpg";
import setsImage from "./assets/sets.jpg";
import choosingImage from "./assets/choosing.jpg";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="05"
      title="Tuples and Sets"
      lead="Lists let you reorder, replace, and repeat items freely, but AI pipelines also need fixed configuration records that cannot be overwritten and unique ID collections that drop duplicates automatically."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>
          Tuples and sets: Locked records and unique collections.
        </h2>
        <p>
          In Lesson 04 you used a <strong>list</strong> (<code>[...]</code>), an
          ordered, <strong>mutable</strong> sequence where items can repeat and
          slots can be changed in place. Here you will add two specialized
          collections—<strong>tuples</strong> and <strong>sets</strong>—and
          choose between all three using two questions:
        </p>
        <ul>
          <li>
            <strong>
              Are items kept in numbered index slots or deduplicated?
            </strong>{" "}
            A <strong>tuple</strong> (<code>(...)</code>) keeps items in fixed
            index order (Slot 0, Slot 1) and allows duplicates, whereas a{" "}
            <strong>set</strong> (<code>&#123;...&#125;</code> or{" "}
            <code>set()</code>) is an <strong>unordered</strong> collection of{" "}
            <strong>unique</strong> items with no index positions.
          </li>
          <li>
            <strong>Can slots be changed after creation?</strong> A{" "}
            <strong>tuple</strong> is <strong>immutable</strong> (its slot
            bindings are locked once created, and trying to overwrite a slot
            raises a <code>TypeError</code>, Python&apos;s error for an
            unsupported operation on a data type). You often read a tuple with{" "}
            <strong>unpacking</strong>, which assigns each slot to its own
            variable in one line. A <strong>set</strong> can grow with{" "}
            <code>.add()</code>, but every item stored inside a set must itself
            be immutable (called <strong>hashable</strong>, meaning its value
            and lookup identity stay fixed).
          </li>
        </ul>
        <div className={styles.exampleBox}>
          <strong>In our running example (illustrative retrieval step)</strong>
          <p>
            An AI support pipeline stores fixed model settings in{" "}
            <code>model_spec = (&quot;gpt-4o-mini&quot;, 4096)</code> and
            collects retrieved document IDs from{" "}
            <code>
              raw_sources = [&quot;doc_12&quot;, &quot;doc_05&quot;,
              &quot;doc_12&quot;]
            </code>
            .
          </p>
        </div>
      </section>

      <section id="tuples">
        <h2 tabIndex={-1}>
          Tuples: Locking ordered records with parentheses and commas.
        </h2>
        <p>
          Think of a printed boarding pass that lists your seat and gate in two
          fixed boxes: anyone can read Box 0 and Box 1, but you cannot erase and
          rewrite one box on the card. In Python, a <strong>tuple</strong>{" "}
          stores an ordered sequence of values separated by commas, usually
          wrapped in parentheses <code>(...)</code>.
        </p>
        <p>
          In our retrieval example,{" "}
          <code>model_spec = (&quot;gpt-4o-mini&quot;, 4096)</code> locks the
          model name in Slot 0 and the token limit in Slot 1. You can read an
          item by index (<code>model_spec[0]</code>) or use{" "}
          <strong>unpacking</strong> to assign every slot to a matching number
          of variables at once:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>model_spec</span> = (
            <span className={styles.codeString}>&quot;gpt-4o-mini&quot;</span>,{" "}
            <span className={styles.codeNum}>4096</span>)
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>model_name</span>,{" "}
            <span className={styles.codeVar}>max_tokens</span> ={" "}
            <span className={styles.codeVar}>model_spec</span>{" "}
            <span className={styles.codeComment}>
              # Unpack 2 slots into 2 variables
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeComment}>
              # Attempting model_spec[1] = 8192 raises:
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeComment}>
              # TypeError: &apos;tuple&apos; object does not support item
              assignment
            </span>
          </div>
        </div>

        <p>
          Because it is the <strong>comma</strong> that builds a tuple, a
          single-item tuple must include a trailing comma:{" "}
          <code>required_tag = (&quot;billing&quot;,)</code> has type{" "}
          <code>tuple</code> and length <code>1</code>. Without that comma,{" "}
          <code>(&quot;billing&quot;)</code> is just grouping parentheses around
          a plain <code>str</code> of length <code>7</code>.
        </p>

        <figure className={styles.figure}>
          <Image
            src={tuplesImage}
            alt='Diagram showing locked tuple model_spec = ("gpt-4o-mini", 4096) with Slot 0: "gpt-4o-mini" and Slot 1: 4096 unpacking downward into model_name = "gpt-4o-mini" and max_tokens = 4096, while model_spec[1] = 8192 -> TypeError is blocked.'
            sizes="(max-width: 760px) 100vw, 720px"
            priority
          />
          <figcaption className="micro">
            Unpacking reads each locked slot into its own variable, while{" "}
            <code>model_spec[1] = 8192</code> is rejected with a{" "}
            <code>TypeError</code>. (A tuple locks which object sits in each
            slot; in this lesson we store immutable strings and numbers.)
          </figcaption>
        </figure>

        <p>
          Outside AI pipelines, a map app often stores a city&apos;s{" "}
          <code>(latitude, longitude)</code> coordinates as a tuple such as{" "}
          <code>(37.77, -122.42)</code> so route calculations can unpack both
          numbers without accidentally overwriting one coordinate.
        </p>
      </section>

      <section id="sets">
        <h2 tabIndex={-1}>
          Sets: Keeping unique items and checking membership.
        </h2>
        <p>
          Think of an event check-in roster that only records whether a badge ID
          has arrived: scanning the same badge twice still leaves one entry on
          the roster, and there is no &quot;first seat&quot; or &quot;second
          seat&quot; number. In Python, a <strong>set</strong> stores{" "}
          <strong>unique</strong>, hashable items with no index positions.
        </p>
        <p>
          When our retrieval step finds three chunks from{" "}
          <code>
            raw_sources = [&quot;doc_12&quot;, &quot;doc_05&quot;,
            &quot;doc_12&quot;]
          </code>
          , calling <code>unique_sources = set(raw_sources)</code> automatically
          drops the duplicate <code>&quot;doc_12&quot;</code>, leaving two
          unique IDs:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>raw_sources</span> = [
            <span className={styles.codeString}>&quot;doc_12&quot;</span>,{" "}
            <span className={styles.codeString}>&quot;doc_05&quot;</span>,{" "}
            <span className={styles.codeString}>&quot;doc_12&quot;</span>]
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>unique_sources</span> = set(
            <span className={styles.codeVar}>raw_sources</span>){" "}
            <span className={styles.codeComment}>
              # &#123;&quot;doc_12&quot;, &quot;doc_05&quot;&#125; (len is 2)
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>unique_sources</span>.add(
            <span className={styles.codeString}>&quot;doc_09&quot;</span>){" "}
            <span className={styles.codeComment}>
              # New ID added (len becomes 3)
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>unique_sources</span>.add(
            <span className={styles.codeString}>&quot;doc_12&quot;</span>){" "}
            <span className={styles.codeComment}>
              # Already present (len stays 3)
            </span>
          </div>
          <div className={styles.codeLine}>
            <span className={styles.codeVar}>has_doc</span> ={" "}
            <span className={styles.codeString}>&quot;doc_05&quot;</span>{" "}
            <span className={styles.codeKeyword}>in</span>{" "}
            <span className={styles.codeVar}>unique_sources</span>{" "}
            <span className={styles.codeComment}># True</span>
          </div>
        </div>

        <p>Watch out for two common set pitfalls:</p>
        <ul>
          <li>
            <strong>Empty set syntax:</strong> Write{" "}
            <code>empty_sources = set()</code> to make an empty set. Writing
            empty curly braces <code>&#123;&#125;</code> creates an empty
            dictionary (<code>dict</code>, which we cover in Lesson 06).
          </li>
          <li>
            <strong>No indexing or fixed order:</strong> Because sets are
            unordered, display order is arbitrary and{" "}
            <code>unique_sources[0]</code> raises{" "}
            <code>TypeError: &apos;set&apos; object is not subscriptable</code>.
          </li>
        </ul>

        <figure className={styles.figure}>
          <Image
            src={setsImage}
            alt='Diagram showing raw_sources list with "doc_12", "doc_05", and "doc_12" passing through set(raw_sources) into unique_sources containing only "doc_12" and "doc_05" while the extra "doc_12" has Duplicate dropped.'
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            <code>set(raw_sources)</code> keeps one copy of each document ID (
            <code>&quot;doc_12&quot;</code> and <code>&quot;doc_05&quot;</code>)
            and drops the duplicate <code>&quot;doc_12&quot;</code>.
          </figcaption>
        </figure>

        <p>
          In everyday software, a newsletter signup form can store subscriber
          email addresses in a set so someone who submits the form twice is only
          recorded once.
        </p>
      </section>

      <section id="choosing">
        <h2 tabIndex={-1}>Choosing between lists, tuples and sets.</h2>
        <p>
          Use our two criteria—whether items need numbered positions (allowing
          duplicates) and whether slots should stay locked—to pick the right
          collection for each step:
        </p>

        <div className={styles.tableWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">Collection</th>
                <th scope="col">Order &amp; duplicates</th>
                <th scope="col">Mutability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.typeCell}>
                  <code>list</code>
                  <br />
                  <code>[...]</code>
                </td>
                <td>Ordered by index; keeps duplicates</td>
                <td>Mutable (edit or append slots)</td>
              </tr>
              <tr>
                <td className={styles.typeCell}>
                  <code>tuple</code>
                  <br />
                  <code>(...)</code>
                </td>
                <td>Ordered by index; keeps duplicates</td>
                <td>Immutable (slots stay locked)</td>
              </tr>
              <tr>
                <td className={styles.typeCell}>
                  <code>set</code>
                  <br />
                  <code>&#123;...&#125;</code> / <code>set()</code>
                </td>
                <td>Unordered (no index); unique items only</td>
                <td>
                  Mutable via <code>.add()</code>; items must be hashable
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <figure className={styles.figure}>
          <Image
            src={choosingImage}
            alt='Decision flowchart starting at Unique items only? where Yes leads to Set {"doc_12", "doc_05"} and No leads to Lock slots?, where Yes leads to Tuple ("gpt-4o-mini", 4096) and No leads to List ["doc_12", "doc_05", "doc_12"].'
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Ask first whether you want only unique items (<code>set</code>), and
            second whether ordered slots should stay locked (<code>tuple</code>{" "}
            versus <code>list</code>).
          </figcaption>
        </figure>

        <p>
          In an everyday music app, a song&apos;s fixed ID and length in seconds
          fit a <strong>tuple</strong> (<code>(&quot;track_01&quot;, 215)</code>
          ), a play queue where a favorite song can repeat in order fits a{" "}
          <strong>list</strong> (
          <code>
            [&quot;track_01&quot;, &quot;track_04&quot;, &quot;track_01&quot;]
          </code>
          ), and a filter of unique genre tags fits a <strong>set</strong> (
          <code>&#123;&quot;indie&quot;, &quot;rock&quot;&#125;</code>).
        </p>

        <h3>Quick questions</h3>
        <ul>
          <li>
            <strong>
              Why is <code>(&quot;billing&quot;)</code> a string instead of a
              tuple?
            </strong>{" "}
            Without a comma, parentheses only group the expression; write{" "}
            <code>(&quot;billing&quot;,)</code> with a trailing comma to make a
            1-item tuple.
          </li>
          <li>
            <strong>How do you create an empty set?</strong> Call{" "}
            <code>set()</code>; writing <code>&#123;&#125;</code> creates an
            empty dictionary (<code>dict</code>).
          </li>
          <li>
            <strong>
              Can you read the first item of a set with{" "}
              <code>unique_sources[0]</code>?
            </strong>{" "}
            No; sets have no index order, so indexing raises a{" "}
            <code>TypeError</code>.
          </li>
        </ul>
      </section>

      <Check
        id="practice"
        title="Choose the right collection for the pipeline step."
        question="In our retrieval pipeline, raw_sources = ['doc_12', 'doc_05', 'doc_12'] contains duplicate document IDs. You want a collection that automatically drops duplicates and lets you check whether 'doc_05' is present with 'doc_05' in unique_sources, without needing index positions. Which Python line creates that collection?"
        options={[
          "unique_sources = set(raw_sources) — converts the list into a set of unique document IDs.",
          "unique_sources = tuple(raw_sources) — converts the list into a locked 3-item tuple that keeps duplicates.",
          "unique_sources = {} — creates an empty dictionary literal with no document IDs.",
        ]}
        correct={0}
        wrongFeedback={[
          "",
          "tuple(raw_sources) locks the 3 slots in order as ('doc_12', 'doc_05', 'doc_12') and keeps the duplicate 'doc_12'.",
          "Empty curly braces {} create an empty dictionary (dict), not a set of the document IDs from raw_sources.",
        ]}
        explanation="set(raw_sources) converts the 3-item list into a set of unique items, automatically dropping the duplicate 'doc_12' so len(unique_sources) is 2 and 'doc_05' in unique_sources evaluates to True."
      />

      <section id="lab">
        <h2 tabIndex={-1}>
          Explore tuples and sets in the retrieval pipeline sandbox.
        </h2>
        <p>
          Before using the sandbox, trace what happens when our pipeline runs{" "}
          <code>model_spec = (&quot;gpt-4o-mini&quot;, 4096)</code> and{" "}
          <code>unique_sources = set(raw_sources)</code>: unpacking assigns{" "}
          <code>&quot;gpt-4o-mini&quot;</code> and <code>4096</code> to separate
          variables, while <code>set(raw_sources)</code> shrinks{" "}
          <code>
            [&quot;doc_12&quot;, &quot;doc_05&quot;, &quot;doc_12&quot;]
          </code>{" "}
          from 3 items to 2 unique IDs.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>
            In Panel 1, click the <strong>Trailing comma</strong> button to
            remove the comma from <code>(&quot;billing&quot;,)</code> and watch{" "}
            <code>type(required_tag)</code> switch from <code>tuple</code> (len
            1) to <code>str</code> (len 7).
          </li>
          <li>
            Click <strong>Try item assignment: model_spec[1] = 8192</strong> to
            see how Python protects the tuple with a <code>TypeError</code>.
          </li>
          <li>
            In Panel 2, click{" "}
            <strong>+ .add(&quot;doc_09&quot;) (new ID)</strong> and then{" "}
            <strong>+ .add(&quot;doc_12&quot;) (duplicate)</strong> to compare
            how <code>len(unique_sources)</code> responds.
          </li>
          <li>
            Switch between the <strong>Vision Tile Config</strong> and{" "}
            <strong>Single-Tag Trap</strong> presets, then click{" "}
            <strong>Reset sandbox</strong>.
          </li>
        </ol>

        <TupleSetLab />
      </section>

      <Check
        id="check"
        question={`A developer writes this Python snippet for an AI retrieval step:
tag = ("rag")
sources = set(["doc_1", "doc_2", "doc_1"])

What are the type of tag and the value of len(sources)?`}
        options={[
          "tag is a tuple, and len(sources) is 3.",
          "tag is a tuple, and len(sources) is 2.",
          "tag is a str, and len(sources) is 2.",
          "tag is a str, and len(sources) is 3.",
        ]}
        correct={2}
        wrongFeedback={[
          'Without a trailing comma, ("rag") is a plain str rather than a tuple, and set(["doc_1", "doc_2", "doc_1"]) removes the duplicate "doc_1" so len(sources) is 2.',
          'set(["doc_1", "doc_2", "doc_1"]) does reduce the collection to 2 unique items, but ("rag") has no trailing comma, so Python evaluates tag as a str instead of a 1-item tuple ("rag",).',
          "",
          '("rag") is indeed a str because it omits the trailing comma, but set(["doc_1", "doc_2", "doc_1"]) drops the duplicate "doc_1", leaving 2 unique items instead of 3.',
        ]}
        explanation='In Python, parentheses without a comma only group an expression, so tag = ("rag") evaluates to a str (a 1-item tuple requires a trailing comma: ("rag",)). Passing ["doc_1", "doc_2", "doc_1"] to set() removes the duplicate "doc_1", leaving 2 unique strings in sources.'
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Use a <strong>tuple</strong> (<code>(...)</code>) when you want an
            ordered record whose slots stay locked and can be unpacked into
            variables—and remember the trailing comma for a 1-item tuple (
            <code>(&quot;billing&quot;,)</code>). Use a <strong>set</strong> (
            <code>&#123;...&#125;</code> or <code>set()</code> for an empty set)
            when you want an unordered collection that automatically drops
            duplicates and checks membership with <code>in</code>.
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-p1">
          Next up: Dictionaries in Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

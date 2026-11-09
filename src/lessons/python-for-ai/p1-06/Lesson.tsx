import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { DictLab } from "./DictLab";
import pairsImage from "./pairs.jpg";
import missingImage from "./missing.jpg";
import changingImage from "./changing.jpg";
import nestedImage from "./nested.jpg";
import choosingImage from "./choosing.jpg";
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
      number="06"
      title="Dictionaries"
      lead="A list finds an item by its position. A dictionary finds a value by a name you choose, which is how programs read fields from structured records."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Dictionaries: Looking things up by name.</h2>
        <p>
          Think of looking up someone in your phone by &quot;Ana&quot;, not by
          &quot;line 3&quot;. A <strong>dictionary</strong> (<code>dict</code>)
          in Python works the same way. You will meet these terms in order:
        </p>
        <ol>
          <li>
            <strong>Key and value:</strong> a name you look up (the key) and
            what is stored under it (the value). Together they form a{" "}
            <strong>pair</strong> written as <code>key: value</code>.
          </li>
          <li>
            <strong>KeyError and .get():</strong> what happens when a key is
            missing. <code>KeyError</code> is Python&apos;s error for a key that
            does not exist. <code>.get()</code> uses method dot notation (which
            we met in Strings) to ask safely and return a default instead.
          </li>
          <li>
            <strong>None:</strong> Python&apos;s built-in &quot;no value
            here&quot; object. It indicates the absence of data, not an error.
          </li>
          <li>
            <strong>Nested:</strong> an inner dictionary stored as the value
            inside another dictionary.
          </li>
        </ol>
        <p>
          Python 3.7 and later preserves the order in which pairs are added, but
          you still look values up by key name, not by numerical position.
          Running <code>ticket[0]</code> searches for a key named <code>0</code>
          .
        </p>
        <div className={styles.exampleBox}>
          <strong>Running example (toy data)</strong>
          <p>
            A helpdesk application stores each customer request as a dictionary.
            All values in this base record are plain text strings, with 3 pairs
            (<code>len(ticket) == 3</code>):
          </p>
        </div>
      </section>

      <section id="pairs">
        <h2 tabIndex={-1}>Keys and values: Reading a pair.</h2>
        <p>
          A dictionary is written inside curly braces with comma-separated{" "}
          <code>key: value</code> pairs. Put the key inside square brackets to
          read its stored value. The built-in <code>len()</code> function counts
          how many pairs are in the dictionary.
        </p>
        <Code label="Creating and reading a dictionary">{`ticket = {"id": "T-204", "topic": "billing", "priority": "high"}
ticket['topic']            # 'billing'
len(ticket)                # 3, because there are 3 pairs`}</Code>
        <figure className={styles.figure}>
          <Image
            src={pairsImage}
            alt="Diagram displaying three key-value pairs side-by-side: keys 'id', 'topic', and 'priority' point to stored values 'T-204', 'billing', and 'high'. A code panel shows ticket['topic'] returning 'billing' with len(ticket) equal to 3, with a note explaining that ticket[0] raises KeyError because dictionaries do not use index positions."
            sizes="(max-width: 760px) 100vw, 720px"
            priority
          />
          <figcaption className="micro">
            Each key points directly to its stored value. You look up a value by
            its key name, not by counting positions.
          </figcaption>
        </figure>
        <p>
          Asking for a position does not work like a list.{" "}
          <code>ticket[0]</code> raises <code>KeyError: 0</code> because Python
          looks for a key equal to the integer <code>0</code>, and this ticket
          has none.
        </p>
        <p>Keys must also follow three rules:</p>
        <ul>
          <li>
            <strong>Keys are unique:</strong> If a dictionary literal repeats a
            key, such as <code>{`{"topic": "billing", "topic": "tech"}`}</code>,
            Python keeps only the last value (<code>&apos;tech&apos;</code>).
          </li>
          <li>
            <strong>Keys are case-sensitive:</strong>{" "}
            <code>&quot;Topic&quot;</code> and <code>&quot;topic&quot;</code>{" "}
            are two different keys.
          </li>
          <li>
            <strong>Keys must be hashable:</strong> A hashable value is an
            immutable object with a fixed fingerprint Python uses for fast
            lookups (such as strings, integers, or tuples of immutable values).
            Passing a mutable list like <code>ticket[[1, 2]]</code> raises{" "}
            <code>TypeError: unhashable type: &apos;list&apos;</code>.
          </li>
        </ul>
        <p>
          Everyday analogy: a telephone contacts list. Searching for
          &quot;Ana&quot; retrieves her phone number. You search by name, not by
          line number.
        </p>
      </section>

      <section id="missing">
        <h2 tabIndex={-1}>Missing keys: KeyError vs defaults.</h2>
        <p>
          Suppose the ticket does not have an <code>&quot;assignee&quot;</code>{" "}
          key yet. How you ask determines what happens:
        </p>
        <ul>
          <li>
            <code>ticket[&quot;assignee&quot;]</code> halts execution with{" "}
            <code>KeyError: &apos;assignee&apos;</code>.
          </li>
          <li>
            <code>
              ticket.get(&quot;assignee&quot;, &quot;unassigned&quot;)
            </code>{" "}
            returns the fallback default <code>&apos;unassigned&apos;</code>.
          </li>
          <li>
            <code>ticket.get(&quot;assignee&quot;)</code> with no second
            argument returns <code>None</code> without an error.
          </li>
        </ul>
        <Code label="Asking for a missing key two ways">{`ticket = {"id": "T-204", "topic": "billing", "priority": "high"}
ticket['assignee']                        # KeyError: 'assignee'
ticket.get('assignee', 'unassigned')      # 'unassigned'
ticket.get('assignee')                    # None
'assignee' in ticket                      # False (safe membership check)`}</Code>
        <figure className={styles.figure}>
          <Image
            src={missingImage}
            alt="A comparison showing bracket lookup ticket['assignee'] leading to an error box labelled KeyError: 'assignee', while ticket.get('assignee', 'unassigned') returns a safe default card labelled 'unassigned'."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Reading with brackets halts on missing keys, while{" "}
            <code>.get()</code> returns a safe default. Neither alters the
            ticket.
          </figcaption>
        </figure>
        <p>
          You can also test membership safely using the <code>in</code>{" "}
          operator: <code>&quot;assignee&quot; in ticket</code> evaluates to{" "}
          <code>False</code> without error. In a plain Python dict, reading with
          brackets, <code>.get()</code>, or <code>in</code> never modifies the
          dictionary.
        </p>
        <p>
          Everyday analogy: asking a library desk for a book. Square brackets
          are like the librarian stopping and saying &quot;no such book&quot;.{" "}
          <code>.get()</code> is like receiving a bookmark stating &quot;not
          currently available&quot;.
        </p>
      </section>

      <section id="changing">
        <h2 tabIndex={-1}>Changing existing pairs and adding new ones.</h2>
        <p>
          Writing uses square bracket assignment:{" "}
          <code>ticket[key] = value</code>. Python checks whether the key is
          already present:
        </p>
        <ul>
          <li>
            <strong>If the key exists:</strong> Python updates its value in
            place. <code>ticket[&quot;priority&quot;] = &quot;low&quot;</code>{" "}
            replaces <code>&apos;high&apos;</code> with{" "}
            <code>&apos;low&apos;</code>. The length remains 3.
          </li>
          <li>
            <strong>If the key is new:</strong> Python inserts a new pair.{" "}
            <code>ticket[&quot;assignee&quot;] = &quot;Sam&quot;</code> grows
            the length from 3 to 4.
          </li>
        </ul>
        <Code label="Updating and inserting pairs">{`ticket = {"id": "T-204", "topic": "billing", "priority": "high"}

# 1. Update existing key
ticket['priority'] = 'low'
len(ticket)                # 3 (replaced in-place)

# 2. Insert new key
ticket['assignee'] = 'Sam'
len(ticket)                # 4 (new pair inserted)`}</Code>
        <figure className={styles.figure}>
          <Image
            src={changingImage}
            alt="Three-panel diagram showing assignment behavior: panel 1 updates existing key 'priority' from 'high' to 'low' with length staying 3, panel 2 inserts new key 'assignee' with length growing to 4, and panel 3 shows a typo in ticket['priorty'] = 'low' quietly inserting a new 4th key."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Assignment checks if the key exists: existing keys are replaced in
            place, while new keys insert an additional pair.
          </figcaption>
        </figure>
        <p>
          <strong>Beware of typos:</strong> If you misspell an intended key,
          such as <code>ticket[&quot;priorty&quot;] = &quot;low&quot;</code>,
          Python does not raise an error. Instead, it quietly creates a new
          fourth key named <code>&quot;priorty&quot;</code> and leaves{" "}
          <code>&quot;priority&quot;</code> completely unchanged.
        </p>
        <p>
          Everyday analogy: drawer labels. Writing on an existing label replaces
          the label card; writing on a blank drawer adds a new drawer to the
          cabinet.
        </p>
      </section>

      <section id="nested">
        <h2 tabIndex={-1}>Nested dictionaries: Following a path of keys.</h2>
        <p>
          A value can itself be another dictionary. To read nested data, provide
          keys sequentially from left to right, opening the outer dictionary
          first and then the inner one.
        </p>
        <Code label="Reading nested dictionaries">{`nested_ticket = {
  "id": "T-204",
  "topic": "billing",
  "customer": {"name": "Ana", "plan": "pro"}
}

nested_ticket['customer']            # {'name': 'Ana', 'plan': 'pro'}
nested_ticket['customer']['plan']    # 'pro'
nested_ticket['plan']                # KeyError: 'plan'`}</Code>
        <figure className={styles.figure}>
          <Image
            src={nestedImage}
            alt="An outer box labelled 'customer' holds an inner dictionary with keys 'name' storing 'Ana' and 'plan' storing 'pro'. Step-by-step navigation shows nested_ticket['customer']['plan'] reading the outer dictionary first, then extracting 'pro' from the inner dictionary."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The first bracket accesses the outer dictionary; the second bracket
            reads the value stored inside the inner dictionary.
          </figcaption>
        </figure>
        <p>
          Direct lookup fails: <code>nested_ticket[&quot;plan&quot;]</code>{" "}
          raises <code>KeyError: &apos;plan&apos;</code> because{" "}
          <code>&quot;plan&quot;</code> is located inside the customer record,
          not as a top-level key of <code>nested_ticket</code>.
        </p>
        <p>
          Everyday analogy: a postal mailing address. You specify the city, then
          the street, then the apartment number. Specifying &quot;Apt 4B&quot;
          alone is meaningless without the building name.
        </p>
      </section>

      <section id="choosing">
        <h2 tabIndex={-1}>Choosing between a list and a dictionary.</h2>
        <p>
          When designing data structures, ask one primary question:{" "}
          <strong>How will you primarily look up an item?</strong>
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.compareTable}>
            <thead>
              <tr>
                <th scope="col">Collection</th>
                <th scope="col">Primary lookup mechanism</th>
                <th scope="col">Typical use in Python and AI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.typeCell} data-label="Collection">
                  <code>list</code>
                </td>
                <td data-label="Primary lookup">
                  Position index: <code>queue[0]</code>
                </td>
                <td data-label="Typical use">
                  Ordered sequence of similar items, such as incoming prompt
                  tokens (pieces of words) or a queue of ticket IDs.
                </td>
              </tr>
              <tr>
                <td className={styles.typeCell} data-label="Collection">
                  <code>dict</code>
                </td>
                <td data-label="Primary lookup">
                  Key name: <code>ticket[&apos;topic&apos;]</code>
                </td>
                <td data-label="Typical use">
                  Single entity with named fields, such as model configuration
                  hyperparameters (settings that control text generation) or a
                  support ticket.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Everyday analogy: numbered locker slots vs labelled office
          pigeonholes. If you want locker 12, you count through the row by
          numerical position (a list). If you search for the slot marked
          &quot;HR Department&quot;, you look up its named label directly (a
          dictionary).
        </p>
        <figure className={styles.figure}>
          <Image
            src={choosingImage}
            alt="Side-by-side comparison between list (ordered sequence indexed by position 0, 1, 2) and dictionary (record indexed by named keys like 'id' and 'topic')."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Choose a list when position and sequence order matter. Choose a
            dictionary when items represent named attributes of an entity.
          </figcaption>
        </figure>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>
            You need to store chat history in the exact chronological order
            messages were sent. Which collection?
          </dt>
          <dd>
            A <code>list</code>, because messages form an ordered sequence
            accessed by step.
          </dd>
          <dt>
            You need to store model hyperparameters like &quot;temperature&quot;
            and &quot;top_p&quot;. Which collection?
          </dt>
          <dd>
            A <code>dict</code>, because each parameter is retrieved by its
            specific setting name.
          </dd>
          <dt>
            What happens if you run <code>ticket[0]</code> on a dictionary that
            does not have <code>0</code> as a key?
          </dt>
          <dd>
            It raises <code>KeyError: 0</code>, because dictionaries do not look
            up by numerical index position.
          </dd>
        </dl>
      </section>

      <Check
        id="practice"
        title="Practice: Updating and adding pairs."
        question={`ticket = {"id": "T-204", "topic": "billing"}
ticket["toipc"] = "refund"

What is len(ticket) and what is the value of ticket["topic"]?`}
        options={[
          'len(ticket) == 2, ticket["topic"] == "refund"',
          'len(ticket) == 3, ticket["topic"] == "billing"',
          "Raises KeyError: 'toipc'",
          "Raises TypeError: unhashable type: 'dict'",
        ]}
        correct={1}
        wrongFeedback={[
          `"toipc" is misspelt, so Python treats it as an entirely new key rather than updating "topic".`,
          "",
          "In a plain dict, assigning to a missing key inserts it into the dictionary; it never raises KeyError.",
          "Bracket assignment is valid syntax and string keys are valid hashable keys.",
        ]}
        explanation={`Because "toipc" does not match "topic", Python inserts a new pair {"toipc": "refund"}. The length grows to 3, and ticket["topic"] remains "billing".`}
      />

      <section id="lab">
        <h2 tabIndex={-1}>Try the ticket drawer sandbox.</h2>
        <p>
          Before you start: the ticket begins with 3 base pairs (
          <code>&apos;id&apos;</code>, <code>&apos;topic&apos;</code>, and{" "}
          <code>&apos;priority&apos;</code>). In a plain dict, reading never
          modifies the ticket; assignment updates existing keys or inserts new
          ones.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>
            In panel 1, keep <code>&apos;topic&apos;</code> and{" "}
            <code>ticket[key]</code> to inspect <code>&apos;billing&apos;</code>
            .
          </li>
          <li>
            Choose <code>&apos;assignee&apos;</code> and observe brackets halt
            with <code>KeyError: &apos;assignee&apos;</code>.
          </li>
          <li>
            Switch the method to <code>ticket.get(key)</code> (returns{" "}
            <code>None</code>) and then to the default version (returns{" "}
            <code>&apos;unassigned&apos;</code>).
          </li>
          <li>
            In panel 2, click{" "}
            <code>ticket[&apos;priority&apos;] = &apos;low&apos;</code> and note
            the length stays 3.
          </li>
          <li>
            Click <code>ticket[&apos;assignee&apos;] = &apos;Sam&apos;</code> to
            insert a new pair. Notice the length becomes 4, and reading{" "}
            <code>&apos;assignee&apos;</code> in panel 1 now succeeds.
          </li>
          <li>
            Click <code>ticket[&apos;priorty&apos;] = &apos;low&apos;</code> to
            see the misspelt typo add an extra key.
          </li>
        </ol>
        <DictLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question={`run_config = {
  "model": "gpt-4o",
  "params": {
    "temp": "0.7"
  }
}

Which line retrieves "0.7" from run_config?`}
        options={[
          'run_config["temp"]',
          'run_config[1]["temp"]',
          'run_config["params"]["temp"]',
          'run_config.get("temp", "default")',
        ]}
        correct={2}
        wrongFeedback={[
          `"temp" is a key inside the nested "params" dictionary, not a top-level key of run_config. This raises KeyError: 'temp'.`,
          "run_config is a dictionary, so it is accessed by key name, not by numerical position 1.",
          "",
          `"temp" is not a top-level key, so .get("temp", "default") returns the fallback "default", not "0.7".`,
        ]}
        explanation={`run_config["params"] accesses the inner dictionary, and ["temp"] then retrieves "0.7" from it.`}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <ul>
            <li>
              <strong>Key lookup:</strong> Access values by key name with{" "}
              <code>d[&apos;key&apos;]</code>, which raises{" "}
              <code>KeyError</code> if missing.
            </li>
            <li>
              <strong>Safe defaults:</strong> Use{" "}
              <code>d.get(&apos;key&apos;, default)</code> to provide a fallback
              without halting or mutating the dictionary.
            </li>
            <li>
              <strong>Assignment:</strong> Assigning with{" "}
              <code>d[key] = value</code> updates existing keys in place or
              inserts new ones (beware of typo keys).
            </li>
            <li>
              <strong>Nesting &amp; collections:</strong> Traverse nested
              dictionaries sequentially (<code>d[outer][inner]</code>). Choose a{" "}
              <strong>list</strong> when sequential order matters; choose a{" "}
              <strong>dictionary</strong> when items represent named attributes.
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

import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { ImportLab } from "./ImportLab";
import moduleImage from "./module-toolbox.webp";
import importImage from "./import-name.webp";
import packageImage from "./package-cabinet.webp";
import loadsImage from "./json-loads.webp";
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
      number="10"
      title="Modules and packages"
      lead="A module is code you can import into your own file. Importing lets you use functions that are already written, such as the one that reads the JSON text an AI model sends back."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>
          Modules and packages: Using code that is already written.
        </h2>
        <p>
          So far you have written each function yourself. Most programs also use
          functions that someone else has already written and tested.
        </p>
        <p>
          Think of a workshop. A <strong>function</strong> is one tool. A{" "}
          <strong>module</strong> is a toolbox that holds tools. A{" "}
          <strong>package</strong> is a cabinet that holds toolboxes.
        </p>
        <p>You will meet these terms in order:</p>
        <ol>
          <li>
            <strong>Module:</strong> code you can import. It is typically one
            file, and it holds functions.
          </li>
          <li>
            <strong>import:</strong> the line that makes a module&apos;s code
            usable in your file, under a name.
          </li>
          <li>
            <strong>Dot:</strong> <code>tags.label</code> means &quot;the{" "}
            <code>label</code> inside <code>tags</code>&quot;.
          </li>
          <li>
            <strong>Package:</strong> a kind of module that can contain other
            modules. It is commonly a folder of files.
          </li>
          <li>
            <strong>Standard library:</strong> the modules and packages that
            come with Python.
          </li>
          <li>
            <strong>JSON:</strong> a text format for data. Many AI tools send
            their replies in it.
          </li>
          <li>
            <strong>json.loads:</strong> a ready-made function that turns JSON
            text into a Python value, such as a dict.
          </li>
        </ol>
        <div className={styles.exampleBox}>
          <strong>Running example (toy data)</strong>
          <p>
            A help desk sorts messages by topic. The file names, the function
            and the reply text are invented for this lesson.
          </p>
          <p>
            Each code example is a <strong>fresh file</strong>: no names exist
            in it until its own lines create them.
          </p>
        </div>
      </section>

      <section id="module">
        <h2 tabIndex={-1}>
          A module is code you can import, typically one file.
        </h2>
        <p>
          You know how to write a function. Save it in a file, and other files
          can import that file as a <strong>module</strong>. Here is a file
          named <code>tags.py</code>:
        </p>
        <Code label="The file tags.py">{`# tags.py
def label(topic):
    return "Topic: " + topic`}</Code>
        <p>
          The module&apos;s name is the file name without <code>.py</code>, so
          this module is called <code>tags</code>. It holds one function,{" "}
          <code>label</code>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={moduleImage}
            alt="An open toolbox with the name plate tags and the caption module. Inside it lies one spanner tagged label, with the caption function. The picture shows that a module holds a function."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The module <code>tags</code> holds the function <code>label</code>,
            the way a toolbox holds a tool.
          </figcaption>
        </figure>
        <p>
          A second file in the same folder, <code>main.py</code>, can now use
          that function without containing it:
        </p>
        <Code label="The file main.py uses the tags module">{`# main.py (same folder as tags.py)
import tags
print(tags.label("refund"))

# Output when you run main.py:
# Topic: refund`}</Code>
        <p>
          Everyday example: a shared recipe card. You write the recipe once, and
          anyone in the kitchen can follow it without writing it out again.
        </p>
        <p>
          A simplification: most modules you will meet are <code>.py</code>{" "}
          files. Some of Python&apos;s own modules are built differently, but
          you import them in the same way.
        </p>
      </section>

      <section id="import">
        <h2 tabIndex={-1}>import creates one name in your file.</h2>
        <p>
          When Python runs <code>import tags</code> in <code>main.py</code>, it
          finds <code>tags.py</code>, runs it, and creates one name in{" "}
          <code>main.py</code>: <code>tags</code>.
        </p>
        <figure className={styles.figure}>
          <Image
            src={importImage}
            alt="A toolbox with the name plate tags on the left. One arrow labelled import points from it to a page headed main.py on the right. On the page sits a name tag that reads tags. The toolbox stays where it is."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            <code>import tags</code> makes the module usable in{" "}
            <code>main.py</code> under the name <code>tags</code>. The module
            file itself is not moved or changed.
          </figcaption>
        </figure>
        <p>
          To use something inside the module, write the module name, a{" "}
          <strong>dot</strong>, then the function name:{" "}
          <code>tags.label(&quot;refund&quot;)</code>.
        </p>
        <p>
          <strong>Why a common mistake happens.</strong> This fresh file imports
          the module but calls the function without the module name:
        </p>
        <Code label="Calling label without the module name">{`import tags
print(label("refund"))

# NameError: name 'label' is not defined`}</Code>
        <p>
          The import line created only the name <code>tags</code>. No name{" "}
          <code>label</code> exists in this file, so Python stops with a{" "}
          <code>NameError</code>. The function is still inside the module, and{" "}
          <code>tags.label</code> reaches it.
        </p>
        <p>
          Everyday example: the toolbox is on your desk, but the spanner is
          still inside it. You say which box first, then which tool.
        </p>
      </section>

      <section id="styles">
        <h2 tabIndex={-1}>Three import styles, three different names.</h2>
        <p>
          Python has three common ways to write an import. In a fresh file, each
          line below creates one name, and that name decides how you write the
          call.
        </p>
        <ul className={styles.styleList} data-testid="import-styles">
          <li className={styles.styleCard}>
            <code>import tags</code>
            <dl>
              <dt>Name created</dt>
              <dd>
                <code>tags</code>
              </dd>
              <dt>The call</dt>
              <dd>
                <code>tags.label(&quot;refund&quot;)</code>
              </dd>
            </dl>
          </li>
          <li className={styles.styleCard}>
            <code>from tags import label</code>
            <dl>
              <dt>Name created</dt>
              <dd>
                <code>label</code>
              </dd>
              <dt>The call</dt>
              <dd>
                <code>label(&quot;refund&quot;)</code>
              </dd>
            </dl>
          </li>
          <li className={styles.styleCard}>
            <code>import tags as t</code>
            <dl>
              <dt>Name created</dt>
              <dd>
                <code>t</code>
              </dd>
              <dt>The call</dt>
              <dd>
                <code>t.label(&quot;refund&quot;)</code>
              </dd>
            </dl>
          </li>
        </ul>
        <p>
          All three calls return <code>&quot;Topic: refund&quot;</code>. The
          function is the same one. Only the name you reach it by changes.
        </p>
        <ul>
          <li>
            <code>from tags import label</code> makes one function from the
            module usable by its own name. It does not create the name{" "}
            <code>tags</code>.
          </li>
          <li>
            <code>import tags as t</code> gives the module a short nickname. It
            creates <code>t</code>, and it does not create <code>tags</code>.
          </li>
        </ul>
        <p>
          Which one should you use? <code>import tags</code> shows most clearly
          where a function comes from. The <code>as</code> style is common for
          long module names.
        </p>
        <p>
          Everyday example: saving a phone contact. You can save the full name,
          save only the one number you need, or save it under a nickname. You
          can then only dial by what you saved.
        </p>
      </section>

      <Check
        id="practice"
        title="Practice: Which name exists?"
        question={`A fresh file sits in the same folder as tags.py. In tags.py, the function label returns "Topic: " plus its argument. The fresh file has these two lines:

from tags import label
print(tags.label("refund"))

What happens when you run the fresh file?`}
        options={[
          "It prints Topic: refund",
          "NameError: name 'tags' is not defined",
          "It prints refund",
          "ModuleNotFoundError: No module named 'tags'",
        ]}
        correct={1}
        wrongFeedback={[
          `That would need the name tags. Look at which name the first line creates, and which name the second line starts with.`,
          "",
          `label adds "Topic: " in front of its argument, so it never returns just refund. Also check whether the second line can run at all.`,
          `Python can find the module, because tags.py is in the same folder. The first line runs without an error. The problem is in the second line.`,
        ]}
        explanation={`from tags import label creates the name label only. The second line starts with tags, which does not exist in this file, so Python stops with a NameError. label("refund") would work.`}
      />

      <section id="package">
        <h2 tabIndex={-1}>A package is a module that holds other modules.</h2>
        <p>
          When a project grows, related modules are grouped together. A{" "}
          <strong>package</strong> is a kind of module that can contain other
          modules. Commonly it is a folder of <code>.py</code> files.
        </p>
        <p>
          Suppose the help desk moves its modules into a folder named{" "}
          <code>helpdesk</code>:
        </p>
        <Code label="Folder layout with a helpdesk package">{`main.py
helpdesk/          <- a package (here, a folder)
    tags.py        <- a module (here, a file)
    replies.py     <- another module`}</Code>
        <figure className={styles.figure}>
          <Image
            src={packageImage}
            alt="An open cabinet with the name plate helpdesk and the caption package. Inside it stand two toolboxes with the name plates tags and replies; the tags toolbox has the caption module. The picture shows that a package holds modules."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The package <code>helpdesk</code> holds the modules{" "}
            <code>tags</code> and <code>replies</code>, the way a cabinet holds
            toolboxes.
          </figcaption>
        </figure>
        <p>
          The dot now also leads from the package to a module inside it. Both of
          these fresh versions of <code>main.py</code> print{" "}
          <code>Topic: refund</code>:
        </p>
        <Code label="Two ways to import a module from a package">{`# Version 1
import helpdesk.tags
print(helpdesk.tags.label("refund"))

# Version 2
from helpdesk import tags
print(tags.label("refund"))`}</Code>
        <p>
          Real packages usually also have a file named <code>__init__.py</code>{" "}
          in the folder. This small example runs without one, and this lesson
          does not cover that file.
        </p>
        <p>
          Everyday example: a folder on your computer named Holiday that holds
          several photo files. You find a photo by naming the folder first, then
          the file.
        </p>
        <p>
          A note on the word: people also say &quot;package&quot; for something
          you install, such as pandas. Installing is not covered in this lesson.
        </p>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>Which holds which?</dt>
          <dd>
            A package holds modules. A module holds functions. In this example,{" "}
            <code>helpdesk</code> holds <code>tags</code>, and <code>tags</code>{" "}
            holds <code>label</code>.
          </dd>
          <dt>
            After <code>import helpdesk.tags</code>, how do you call{" "}
            <code>label</code>?
          </dt>
          <dd>
            With the full dotted name:{" "}
            <code>helpdesk.tags.label(&quot;refund&quot;)</code>.
          </dd>
          <dt>Is a package also a module?</dt>
          <dd>
            Yes. Python treats a package as a kind of module, one that can
            contain other modules.
          </dd>
        </dl>
      </section>

      <section id="stdlib">
        <h2 tabIndex={-1}>The standard library comes with Python.</h2>
        <p>
          You do not have to write every module yourself. Python is shipped with
          a large set of modules and packages called the{" "}
          <strong>standard library</strong>.
        </p>
        <p>
          That is why <code>import json</code> works in a fresh file, although
          you never wrote a file named <code>json.py</code>. A few standard
          library modules:
        </p>
        <ul>
          <li>
            <code>json</code>: reads and writes JSON text.
          </li>
          <li>
            <code>math</code>: mathematical functions.
          </li>
          <li>
            <code>random</code>: random choices and numbers.
          </li>
          <li>
            <code>datetime</code>: dates and times.
          </li>
        </ul>
        <p>
          The standard library has packages too. <code>urllib</code> is one: it
          holds modules such as <code>urllib.parse</code> and{" "}
          <code>urllib.request</code>.
        </p>
        <p>
          You import them with the same three styles you used for{" "}
          <code>tags</code>.
        </p>
        <p>
          Everyday example: the apps that are already on a new phone. Other apps
          have to be installed first, and the same is true for packages such as
          pandas.
        </p>
      </section>

      <section id="loads">
        <h2 tabIndex={-1}>json.loads turns a JSON object into a dict.</h2>
        <p>
          <strong>JSON</strong> is a text format for data. Programs use it to
          send data to each other, and AI tools often reply in it.
        </p>
        <p>
          A <strong>JSON object</strong> is JSON text in curly braces that pairs
          names with values. It looks like a Python dict, but it is text. In
          Python you hold it in a <code>str</code>:
        </p>
        <Code label="A reply stored as JSON text">{`reply = '{"topic": "refund", "urgent": true}'`}</Code>
        <p>
          <strong>Why a common mistake happens.</strong> Because{" "}
          <code>reply</code> looks like a dict, it is tempting to read a value
          from it straight away:
        </p>
        <Code label="Indexing the text directly fails">{`reply = '{"topic": "refund", "urgent": true}'
print(reply["topic"])

# TypeError: string indices must be integers, not 'str'`}</Code>
        <p>
          <code>reply</code> is a <code>str</code>, so Python sees only a row of
          characters. The function <code>loads</code> in the <code>json</code>{" "}
          module reads that text and builds a Python value from it:
        </p>
        <Code label="Turning the reply into a dict with json.loads">{`import json
reply = '{"topic": "refund", "urgent": true}'
data = json.loads(reply)

print(data["topic"])   # refund
print(data)            # {'topic': 'refund', 'urgent': True}
print(type(reply))     # <class 'str'>
print(type(data))      # <class 'dict'>`}</Code>
        <figure className={styles.figure}>
          <Image
            src={loadsImage}
            alt="A paper strip captioned JSON text on the left. An arrow leads into a machine labelled json.loads, and a second arrow leads out to an organiser tray captioned dict with two compartments tabbed topic and urgent."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            In this example, the JSON text goes into <code>json.loads</code> and
            a dict with the keys <code>topic</code> and <code>urgent</code>{" "}
            comes out. The text in <code>reply</code> stays as it was.
          </figcaption>
        </figure>
        <ul>
          <li>
            <code>data</code> is a dict, so <code>data[&quot;topic&quot;]</code>{" "}
            works as in the dictionaries lesson.
          </li>
          <li>
            JSON writes <code>true</code>. In the dict it became Python&apos;s{" "}
            <code>True</code>.
          </li>
          <li>
            A JSON object gives a dict. Other JSON gives other types: a JSON
            array, written in square brackets, gives a Python list.
          </li>
        </ul>
        <p>
          One way to remember the name: <code>loads</code> is &quot;load&quot;
          plus &quot;s&quot;, with the s for string.
        </p>
        <p>
          Everyday example: a shopping list sent as a photo. You can see the
          items, but you cannot tick one off until someone types the list into
          your notes app.
        </p>
        <p>
          <code>json.loads</code> needs valid JSON text. What to do when the
          text is not valid is the topic of the next lesson.
        </p>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>
            After <code>data = json.loads(reply)</code>, is <code>reply</code> a
            dict now?
          </dt>
          <dd>
            No. <code>reply</code> is still the same <code>str</code>. The dict
            is in <code>data</code>.
          </dd>
          <dt>
            Where does the <code>json</code> module come from?
          </dt>
          <dd>From the standard library, which comes with Python.</dd>
          <dt>
            In <code>json.loads</code>, which part is the module and which is
            the function?
          </dt>
          <dd>
            <code>json</code> is the module. <code>loads</code> is a function
            inside it.
          </dd>
        </dl>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the import bench.</h2>
        <p>
          Build a four-line program from two choices: an import line and a call.
          Each combination is a fresh file that holds only those four lines. The
          bench shows which name the import line created and whether the call
          can run.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>
            Start with <strong>No import line</strong> and the call{" "}
            <code>json.loads(reply)</code>. Read the error.
          </li>
          <li>
            Choose <strong>import json</strong>. The same call now runs.
          </li>
          <li>
            Keep <strong>import json</strong> and choose the call{" "}
            <code>loads(reply)</code>. Read which name is missing.
          </li>
          <li>
            Choose <strong>from json import loads</strong>, then find the one
            call that runs.
          </li>
          <li>
            Choose <strong>import json as j</strong>, then find the one call
            that runs.
          </li>
        </ol>
        <ImportLab />
        <p className="micro">
          Newer Python versions may add a hint after the error message, such as
          a suggestion to import <code>json</code>. The bench shows only the
          first part.
        </p>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question={`A fresh file has these three lines:

import json
reply = '{"topic": "refund", "urgent": true}'
data = json.loads(reply)

Which fourth line prints only refund?`}
        options={[
          `print(data["topic"])`,
          `print(reply["topic"])`,
          `print(json["topic"])`,
          `print(data.topic)`,
        ]}
        correct={0}
        wrongFeedback={[
          "",
          `reply is still a str. json.loads did not change it, so indexing it with "topic" gives a TypeError. The dict is in another variable.`,
          `json is the module that holds the loads function. It is not the data, so it cannot be indexed with "topic".`,
          `data is a dict, and a dict value is read with square brackets and the key. data.topic gives an AttributeError.`,
        ]}
        explanation={`json.loads(reply) built a dict and the third line stored it in data. data["topic"] reads the value for the key "topic", which is refund.`}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <ul>
            <li>
              <strong>Module and package:</strong> a module is typically one
              file that holds functions. A package is a kind of module that
              holds other modules, commonly a folder.
            </li>
            <li>
              <strong>import creates a name:</strong> <code>import json</code>{" "}
              creates <code>json</code>, <code>from json import loads</code>{" "}
              creates <code>loads</code>, and <code>import json as j</code>{" "}
              creates <code>j</code>.
            </li>
            <li>
              <strong>The dot reaches inside:</strong> <code>json.loads</code>{" "}
              means the <code>loads</code> function inside the <code>json</code>{" "}
              module.
            </li>
            <li>
              <strong>JSON text is a str:</strong> use{" "}
              <code>json.loads(reply)</code> to get a dict from a JSON object,
              then read values with <code>data[&quot;topic&quot;]</code>.
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

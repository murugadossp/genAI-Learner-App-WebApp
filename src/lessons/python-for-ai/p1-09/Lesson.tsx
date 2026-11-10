import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { TitleLab } from "./TitleLab";
import defineImage from "./define.webp";
import defaultImage from "./default.webp";
import returnImage from "./return.webp";
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
      number="09"
      title="Functions"
      lead="A function is a named block of code that does one job. You write it once with def, then call it by name whenever you need the job done."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Functions: Name a job and reuse it.</h2>
        <p>Each term is defined where it first appears, in this order:</p>
        <ol>
          <li>
            <strong>Function:</strong> a named block of code that does one job.
          </li>
          <li>
            <strong>def:</strong> the keyword that stores a function under a
            name. A def line does not run the function.
          </li>
          <li>
            <strong>Call:</strong> a line such as{" "}
            <code>make_title(&quot;Pasta&quot;)</code> that runs the function.
          </li>
          <li>
            <strong>Parameter:</strong> a name in the def line that receives a
            value, such as <code>topic</code>.
          </li>
          <li>
            <strong>Argument:</strong> a value passed in a call, such as{" "}
            <code>&quot;Pasta&quot;</code>.
          </li>
          <li>
            <strong>Default value:</strong> a value written in the def line,
            such as <code>prefix=&quot;Chat&quot;</code>, that is used when a
            call leaves that argument out.
          </li>
          <li>
            <strong>return:</strong> a line that hands a value back to the code
            that made the call.
          </li>
          <li>
            <strong>Docstring:</strong> a string used as the first statement in
            a function&apos;s body, which describes the function.
          </li>
        </ol>
        <div className={styles.exampleBox}>
          <strong>Running example (invented, text only)</strong>
          <p>
            This function joins a prefix, a colon and a topic. The prefix
            default and the separator <code>: </code> are made up for this
            lesson.
          </p>
          <Code label="The running example function">{`def make_title(topic, prefix="Chat"):
    return prefix + ": " + topic`}</Code>
        </div>
      </section>

      <section id="define">
        <h2 tabIndex={-1}>def stores the function. A call runs it.</h2>
        <p>
          Python reads a def line and keeps the function under its name. The
          body, the indented lines, does not run then. When this block runs as a
          script file, it prints nothing.
        </p>
        <Code label="A def block with no call">{`def make_title(topic, prefix="Chat"):
    return prefix + ": " + topic`}</Code>
        <p>
          A call such as <code>make_title(&quot;Pasta&quot;)</code> runs the
          body. The result is handed back, which the return section explains. In
          this script the call does not show the result, so nothing appears on
          screen.
        </p>
        <figure className={styles.figure}>
          <Image
            src={defineImage}
            alt="Three boxes from left to right: a grey closed box labelled Body not run yet, an arrow labelled Call make_title, and an open highlighted box labelled Body runs."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Writing <code>def</code> stores the function. The call is the step
            that runs the body.
          </figcaption>
        </figure>
        <p>
          Everyday analogy: a recipe card in a drawer. Writing the card does not
          cook anything. Cooking starts when someone follows it.
        </p>
      </section>

      <section id="inputs">
        <h2 tabIndex={-1}>Parameters and arguments.</h2>
        <p>
          A parameter is a name in the def line. An argument is the value you
          pass in the call. Each argument fills a parameter. A parameter with a
          default can be left out of the call.
        </p>
        <ul>
          <li>
            In <code>def make_title(topic, prefix=&quot;Chat&quot;)</code>,{" "}
            <code>topic</code> and <code>prefix</code> are parameters.
          </li>
          <li>
            In <code>make_title(&quot;Pasta&quot;)</code>,{" "}
            <code>&quot;Pasta&quot;</code> is an argument. It fills{" "}
            <code>topic</code>.
          </li>
          <li>
            An argument can also name its parameter, as in{" "}
            <code>make_title(&quot;Pasta&quot;, prefix=&quot;Note&quot;)</code>.
            That call fills <code>prefix</code> with{" "}
            <code>&quot;Note&quot;</code>.
          </li>
        </ul>
      </section>

      <section id="default">
        <h2 tabIndex={-1}>A default fills the gap.</h2>
        <p>
          A parameter written as <code>prefix=&quot;Chat&quot;</code> has a
          default value. If the call leaves that argument out, Python uses the
          default. If the call passes a value, the passed value is used for that
          call only.
        </p>
        <Code label="Two calls, one with the default and one without">{`make_title("Pasta")              # prefix is "Chat"
make_title("Pasta", "Recipe")    # prefix is "Recipe"`}</Code>
        <figure className={styles.figure}>
          <Image
            src={defaultImage}
            alt="Three boxes from left to right: a box labelled Call without prefix, an arrow to a filled slot labelled Default prefix: Chat, and an arrow to a box labelled Output: Chat: Pasta."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The default fills the slot only because the call left{" "}
            <code>prefix</code> out.
          </figcaption>
        </figure>
        <p>
          Everyday analogy: a coffee order. A customer who says only
          &quot;latte&quot; gets the shop&apos;s usual size. Saying
          &quot;large&quot; changes the size for that order only. The shop and
          its sizes are invented here.
        </p>
      </section>

      <Check
        id="practice"
        title="Practice: Read the default."
        question={`def make_title(topic, prefix="Chat"):
    return prefix + ": " + topic

print(make_title("Pasta", "Recipe"))

What does the program print?`}
        options={[
          "Chat: Pasta",
          "Recipe: Pasta",
          "Pasta: Recipe",
          "An error, because prefix is missing",
        ]}
        correct={1}
        wrongFeedback={[
          "The default Chat is used only when the call leaves prefix out. This call passes Recipe, so Chat is not used.",
          "",
          "The return line puts prefix first, then ': ', then topic. The output starts with the prefix.",
          "prefix has a default, and this call passes it anyway. Nothing is missing, so no error is raised.",
        ]}
        explanation={`The call passes "Recipe" as prefix, so the return line builds "Recipe: Pasta". print shows it.`}
      />

      <section id="return">
        <h2 tabIndex={-1}>return hands a value back.</h2>
        <p>
          <code>return</code> sends a value out of the function to the code that
          called it. It also ends the function at that line. The caller can
          store the value in a variable.
        </p>
        <Code label="Storing the returned value in x">{`def make_title(topic, prefix="Chat"):
    return prefix + ": " + topic

x = make_title("Soup")
print(x)   # Chat: Soup`}</Code>
        <figure className={styles.figure}>
          <Image
            src={returnImage}
            alt="Three boxes from left to right: a rounded box labelled make_title, an arrow labelled return, and a small box labelled x, showing a value leaving the function and being stored."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            <code>return</code> sends the value out to the caller, and ends that
            call.
          </figcaption>
        </figure>
        <p>
          A function with no return line gives back <code>None</code>. That is
          Python&apos;s value for no result. The body still runs when the
          function is called.
        </p>
        <Code label="A function with no return line">{`def make_note(text):
    note = "Note: " + text

x = make_note("Milk")
print(x)   # None`}</Code>
        <p>
          The text built inside <code>make_note</code> is not handed back, so{" "}
          <code>x</code> holds <code>None</code>.
        </p>
      </section>

      <Check
        id="printcheck"
        title="Practice: print or return?"
        question={`def show_title(topic):
    print("Title: " + topic)

x = show_title("Pasta")
print(x)

What is printed, in order?`}
        options={[
          "Title: Pasta, then None",
          "Title: Pasta, then Title: Pasta",
          "Title: Pasta only",
          "None only",
        ]}
        correct={0}
        wrongFeedback={[
          "",
          "print(x) shows x, and x holds None, not the title. The title appears once, from the print inside show_title.",
          "print(x) runs on the next line too. x holds None, so that line shows None.",
          "The print inside show_title runs when the function is called, so Title: Pasta appears first.",
        ]}
        explanation={`show_title prints the title as it runs. It has no return line, so x holds None, and print(x) shows None.`}
      />

      <section id="docstring">
        <h2 tabIndex={-1}>A docstring says what the function does.</h2>
        <p>
          A docstring is a string used as the first statement in the function
          body, under the def line. Python keeps it with the function, and{" "}
          <code>help()</code> shows it.
        </p>
        <Code label="A function with a docstring and a help call">{`def make_title(topic, prefix="Chat"):
    """Return a title: the prefix, a colon, then the topic."""
    return prefix + ": " + topic

help(make_title)`}</Code>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>Does a docstring change what the function returns?</dt>
          <dd>
            No. It is a string that describes the function. The return line
            decides the result.
          </dd>
          <dt>Is a docstring required?</dt>
          <dd>
            No. Python runs the function without one. It helps readers, and it
            is worth writing for functions other people will use.
          </dd>
        </dl>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Try the title builder.</h2>
        <p>
          The toy code holds the two functions from this lesson. Each button
          sets one call. The lab shows the text that is printed on screen and
          the value handed back to the caller as two separate results. Both def
          lines always run, because they store the functions.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>
            Press <code>make_title(&quot;Pasta&quot;)</code>. Read the handed
            back value, then the shown value.
          </li>
          <li>
            Press <code>make_title(&quot;Pasta&quot;, &quot;Recipe&quot;)</code>
            . Note which prefix changed.
          </li>
          <li>
            Press <code>show_title(&quot;Pasta&quot;)</code>. Look for the text
            under Shown on screen, and <code>None</code> under Handed back.
          </li>
          <li>
            Press <code>print(make_title(&quot;Pasta&quot;))</code>. The same
            text now appears on screen.
          </li>
        </ol>
        <TitleLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question={`def add_note(text):
    return "Note: " + text

add_note("Milk")
print("done")

This is a script file, run from top to bottom. What does the program print?`}
        options={[
          "Note: Milk",
          "Note: Milk, then done",
          "done",
          "Nothing, because the function never prints",
        ]}
        correct={2}
        wrongFeedback={[
          "add_note returns the text but does not print it. Its return value is not used on any line here, so nothing shows it.",
          'The return line does not print anything. Only print("done") shows text.',
          "",
          'print("done") runs on its own line, so done is shown. The function call adds no output.',
        ]}
        explanation={`add_note runs and returns a string, but no line prints that string. The only output is done.`}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <ul>
            <li>
              <strong>def stores, a call runs:</strong> writing a def line does
              not run the body.
            </li>
            <li>
              <strong>Arguments and defaults:</strong> an argument fills a
              parameter. A default fills in when the call leaves it out.
            </li>
            <li>
              <strong>return or print:</strong> <code>return</code> hands a
              value back to the caller. <code>print</code> only shows text.
            </li>
            <li>
              <strong>Docstring:</strong> a string at the start of the body that
              says what the function does. <code>help()</code> shows it.
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

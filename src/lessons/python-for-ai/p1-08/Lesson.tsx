import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "./Check";
import { LoopLab } from "./LoopLab";
import forLoopImage from "./for-loop.webp";
import breakStopsImage from "./break-stops.webp";
import whileCheckImage from "./while-check.webp";
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
      number="08"
      title="Loops"
      lead="A loop repeats one block of code once for each item in a list, or for as long as a condition is True, so you write the steps once instead of over and over."
    >
      <section id="roadmap">
        <h2 tabIndex={-1}>Loops: Repeating the same steps for each item.</h2>
        <p>
          Think of a post office worker who takes each parcel off a conveyor
          belt, reads its label, and does the same job for it. A Python{" "}
          <strong>loop</strong> works the same way. You will meet these terms in
          order:
        </p>
        <ol>
          <li>
            <strong>Loop variable and body:</strong> in{" "}
            <code>for p in parcels:</code>, <code>p</code> is the{" "}
            <strong>loop variable</strong>. It holds one item per pass. The
            indented lines under the colon are the <strong>body</strong>, which
            runs once per pass.
          </li>
          <li>
            <strong>Accumulator:</strong> a variable you set before the loop and
            update inside it, such as a running count.
          </li>
          <li>
            <strong>break:</strong> stops the whole loop at once.
          </li>
          <li>
            <strong>continue:</strong> skips the rest of the current pass and
            moves on to the next item.
          </li>
          <li>
            <strong>while loop and condition:</strong> a loop that repeats while
            a <strong>condition</strong> is <code>True</code>. In this lesson a
            condition is a test such as <code>i &lt; 5</code>, which gives{" "}
            <code>True</code> or <code>False</code>.
          </li>
          <li>
            <strong>Infinite loop:</strong> a loop whose condition never becomes{" "}
            <code>False</code>, so it never stops on its own.
          </li>
        </ol>
        <div className={styles.exampleBox}>
          <strong>Running example (toy data)</strong>
          <p>
            Each parcel&apos;s status is stored as text in a list. These five
            values are invented for this lesson:
          </p>
          <Code label="Running example list">{`parcels = ["sent", "lost", "sent", "returned", "sent"]`}</Code>
        </div>
      </section>

      <section id="visit">
        <h2 tabIndex={-1}>A for loop visits each item in order.</h2>
        <p>
          <code>for p in parcels:</code> starts the loop. Python takes the first
          item, stores it in <code>p</code>, and runs the body. Then it takes
          the next item, and so on, until the list has no items left.
        </p>
        <Code label="Printing each parcel">{`parcels = ["sent", "lost", "sent", "returned", "sent"]
for p in parcels:
    print(p)

# Output:
# sent
# lost
# sent
# returned
# sent`}</Code>
        <figure className={styles.figure}>
          <Image
            src={forLoopImage}
            alt="Row of five parcel cards labelled sent, lost, sent, returned, and sent, with an amber frame that moves one card at a time from left to right to show a for loop visiting each item once, in order."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            One pass per item: the loop variable holds one card at a time, from
            the first to the last.
          </figcaption>
        </figure>
        <p>
          The loop variable holds the item itself, not its position. On the
          first pass <code>p</code> is <code>&quot;sent&quot;</code>, not{" "}
          <code>0</code>. To get positions as numbers you would need{" "}
          <code>range(len(parcels))</code>, which this lesson does not cover.
        </p>
        <p>
          Everyday analogy: a teacher reads each name on the class register
          once, in order. If the register is empty, the teacher reads nothing.
          In the same way, a loop over an empty list never runs its body.
        </p>
      </section>

      <section id="count">
        <h2 tabIndex={-1}>Accumulators: Building a count while you loop.</h2>
        <p>
          An <strong>accumulator</strong> collects a result across passes. This
          loop counts how many parcels say <code>&quot;sent&quot;</code>:
        </p>
        <Code label="Counting sent parcels with an accumulator">{`parcels = ["sent", "lost", "sent", "returned", "sent"]
count = 0                      # set before the loop
for p in parcels:
    if p == "sent":
        count += 1             # update inside the loop
print(count)                   # 3`}</Code>
        <p>
          <code>count += 1</code> is shorthand for{" "}
          <code>count = count + 1</code>. The update runs only on passes where
          the <code>if</code> condition is <code>True</code>. Pass by pass:
        </p>
        <ul>
          <li>
            Pass 1, <code>&quot;sent&quot;</code>: count becomes 1.
          </li>
          <li>
            Pass 2, <code>&quot;lost&quot;</code>: count stays 1.
          </li>
          <li>
            Pass 3, <code>&quot;sent&quot;</code>: count becomes 2.
          </li>
          <li>
            Pass 4, <code>&quot;returned&quot;</code>: count stays 2.
          </li>
          <li>
            Pass 5, <code>&quot;sent&quot;</code>: count becomes 3.
          </li>
        </ul>
        <p>
          Everyday analogy: a clicker counter at a door. You press it only for
          people who match what you are counting, and the number keeps the total
          between presses.
        </p>
      </section>

      <section id="stop">
        <h2 tabIndex={-1}>break stops the loop; continue skips one pass.</h2>
        <p>
          <code>break</code> leaves the loop at once. Code after the loop still
          runs, but the remaining items are never visited.
        </p>
        <Code label="Stopping at the first lost parcel">{`parcels = ["sent", "lost", "sent", "returned", "sent"]
for p in parcels:
    if p == "lost":
        break                  # leave the loop now
    print(p)
print("done")                  # runs after the loop

# Output:
# sent
# done`}</Code>
        <figure className={styles.figure}>
          <Image
            src={breakStopsImage}
            alt="The same five parcel cards: the first card passes to a printed tray, the second card, lost, is stopped by a red sign labelled break, and the last three cards are faded and marked not visited, showing that the loop ends at the lost card."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            break ends the loop at the item that triggers it. The cards after it
            are never reached.
          </figcaption>
        </figure>
        <p>
          <code>continue</code> is different. It skips only the rest of the
          current pass, then the loop moves on to the next item:
        </p>
        <Code label="Skipping returned parcels with continue">{`parcels = ["sent", "lost", "sent", "returned", "sent"]
for p in parcels:
    if p == "returned":
        continue               # skip this pass only
    print(p)

# Output:
# sent
# lost
# sent
# sent`}</Code>
        <p>
          Common mistake: <code>continue</code> does not end the loop. The{" "}
          <code>&quot;returned&quot;</code> parcel is skipped, but the last{" "}
          <code>&quot;sent&quot;</code> still prints.
        </p>
        <p>
          Everyday analogy: <code>break</code> is the post office closing its
          counter early. <code>continue</code> is skipping one parcel on the
          belt and serving the next.
        </p>
      </section>

      <section id="while">
        <h2 tabIndex={-1}>A while loop repeats while a condition is True.</h2>
        <p>
          A <code>while</code> loop checks its condition before every pass. If
          the condition is <code>True</code>, the body runs. If it is{" "}
          <code>False</code>, the loop ends. Unlike <code>for</code>, a{" "}
          <code>while</code> loop does not pick up the next item for you. To
          walk a list with <code>while</code>, you manage a counter yourself.
          Use it when the number of passes depends on a condition, such as
          retrying until something succeeds. For a plain list, a{" "}
          <code>for</code> loop is simpler.
        </p>
        <Code label="Walking the list with a counter">{`parcels = ["sent", "lost", "sent", "returned", "sent"]
i = 0                                # the counter
while i < len(parcels):              # condition, checked each pass
    print(parcels[i])                # read the item at position i
    i += 1                           # move the counter forward

# Output: the same five lines as the for loop`}</Code>
        <figure className={styles.figure}>
          <Image
            src={whileCheckImage}
            alt="Flow diagram of a while loop drawn left to right: a start box feeds a box labelled Set counter, then a Check condition diamond. True leads to Run body, which contains Update counter; an arrow returns from Update counter to Check condition. False leads to Exit loop."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The counter is set once before the loop. The return arrow goes back
            to the condition check, so the condition is tested again before
            every pass.
          </figcaption>
        </figure>
        <p>
          The counter <code>i</code> is what makes the condition become{" "}
          <code>False</code>. The counter goes 0, 1, 2, 3, 4. When it reaches 5,
          the check <code>5 &lt; 5</code> is <code>False</code>, and the loop
          ends.
        </p>
        <p>
          <strong>The infinite-loop trap:</strong> if you forget{" "}
          <code>i += 1</code>, the condition never changes. This code is shown
          only to illustrate the problem; do not run it:
        </p>
        <Code label="A while loop that never ends">{`i = 0
while i < 5:
    print("still going")
    # i += 1 is missing, so i stays 0 and i < 5 stays True forever`}</Code>
        <p>
          Everyday analogy: asking &quot;Is the belt empty?&quot; again and
          again without removing any parcels. The answer never changes, so you
          never stop checking.
        </p>
        <h3>Quick questions</h3>
        <dl className={styles.qa}>
          <dt>Which loop visits every item in a list once, in order?</dt>
          <dd>
            A <code>for</code> loop. It stops by itself when the list runs out
            of items.
          </dd>
          <dt>
            What does <code>break</code> do inside a loop?
          </dt>
          <dd>It ends the loop immediately. Code after the loop still runs.</dd>
          <dt>
            After <code>continue</code> runs, does the loop end?
          </dt>
          <dd>
            No. It skips the rest of that pass and moves on to the next item.
          </dd>
        </dl>
      </section>

      <Check
        id="practice"
        title="Practice: Predict a loop with continue."
        question={`parcels = ["sent", "lost", "sent"]
for p in parcels:
    if p == "lost":
        continue
    print(p)

What does this code print?`}
        options={[
          "sent (one line only)",
          "sent, lost, sent (three lines)",
          "sent and sent (two lines)",
          "lost (one line only)",
        ]}
        correct={2}
        wrongFeedback={[
          `The loop does not stop at the first item. continue only skips the "lost" pass, so the third item still prints.`,
          `This would be the output with no continue. Here the "lost" pass is skipped, so "lost" never prints.`,
          "",
          `"lost" is the one item skipped by continue, so it is the only item that does not print.`,
        ]}
        explanation={`continue skips the pass for "lost". The loop still visits the first and third items, so two lines print: sent and sent.`}
      />

      <section id="lab">
        <h2 tabIndex={-1}>Try the parcel belt simulator.</h2>
        <p>
          The belt holds the five parcels from the running example. Each mode is
          a small loop. Each press of <strong>Next item</strong> runs one pass.
        </p>
        <p>
          <strong>Try it in this order:</strong>
        </p>
        <ol>
          <li>
            Keep <strong>Plain loop</strong> and press Next item five times.
            Each pass prints one parcel.
          </li>
          <li>
            Choose <strong>Count sent</strong>. Watch the count change only on
            passes where the item is <code>&quot;sent&quot;</code>.
          </li>
          <li>
            Choose <strong>Break at lost</strong>. Press Next item until the
            loop stops. Notice that the parcels after the lost one are never
            visited.
          </li>
          <li>
            Choose <strong>Continue past returned</strong>. Notice that the
            returned parcel is skipped and the loop still reaches the last sent.
          </li>
          <li>
            Press Reset, then try a mode again and see the same output each
            time.
          </li>
        </ol>
        <LoopLab />
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question={`parcels = ["sent", "lost", "sent"]
count = 0
for p in parcels:
    if p == "sent":
        count += 1
print(count)

What does this code print?`}
        options={["3", "1", "'sent'", "2"]}
        correct={3}
        wrongFeedback={[
          `len(parcels) is 3, but count goes up only on passes where p == "sent". That happens for two of the three items.`,
          `count goes up for every "sent" item, not just the first. There are two of them, so count ends at 2.`,
          `count is a number that starts at 0 and goes up by 1. It never holds the text "sent".`,
          "",
        ]}
        explanation={`count starts at 0. The passes for the first and third items match "sent", so count goes up twice and ends at 2.`}
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <ul>
            <li>
              <strong>for item in list:</strong> the body runs once per item, in
              order. The loop variable holds the item, not its position.
            </li>
            <li>
              <strong>Accumulators:</strong> set the variable before the loop
              and update it inside, such as <code>count += 1</code>.
            </li>
            <li>
              <strong>break and continue:</strong> <code>break</code> ends the
              loop; <code>continue</code> skips the rest of one pass.
            </li>
            <li>
              <strong>while:</strong> the condition is checked before every
              pass. Change something inside the body, so the condition
              eventually becomes <code>False</code> or you leave with{" "}
              <code>break</code>.
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

import Image from "next/image";
import Link from "next/link";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ListMemoryVisual } from "./ListMemoryVisual";
import { ListLab } from "./ListLab";
import listsDiagramImg from "./python-lists-model.jpg";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      chapter={{ label: "Python for AI", href: "/course/chapter-p1" }}
      number="04"
      title="Lists"
      lead="AI pipelines process sequences of data: retrieved search passages, chat turn histories, candidate completions, and token IDs. In Python, lists provide the foundational ordered, mutable sequence to store, slice, and manipulate these collections in memory."
    >
      <section id="ordered-sequences-and-syntax">
        <h2 tabIndex={-1}>
          Ordered sequences: Constructing lists for AI pipelines.
        </h2>
        <p>
          In Python, a <strong>list</strong> (type <code>list</code>) is an
          ordered collection of items enclosed in square brackets{" "}
          <code>[...]</code>, separated by commas.
        </p>

        <p>
          Think of a list as a numbered clipboard: each item occupies a specific
          sequential slot. In an AI Retrieval-Augmented Generation (RAG) system,
          a search retriever returns a list of candidate passages ranked by
          relevance:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # A list of retrieved document passage IDs:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>retrieved_docs</span> = [
            <br />
            &nbsp;&nbsp;
            <span className={styles.codeString}>&quot;refund_policy&quot;</span>
            ,
            <br />
            &nbsp;&nbsp;
            <span className={styles.codeString}>&quot;shipping_faq&quot;</span>,
            <br />
            &nbsp;&nbsp;
            <span className={styles.codeString}>
              &quot;order_tracking&quot;
            </span>
            ,
            <br />
            &nbsp;&nbsp;
            <span className={styles.codeString}>
              &quot;warranty_terms&quot;
            </span>
            ,
            <br />]
          </p>
        </div>

        <p>
          You can check how many items are stored in a list using the built-in{" "}
          <code>len()</code> function:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>total_candidates</span> = len(
            <span className={styles.codeVar}>retrieved_docs</span>){" "}
            <span className={styles.codeComment}># Evaluates to int 4</span>
          </p>
        </div>

        <figure className={styles.figure}>
          <Image
            src={listsDiagramImg}
            alt="Educational 3-panel diagram illustrating Python list memory and operations: Panel 1 shows dual indexing for a 4-item list with 0-based positive indices 0, 1, 2, 3 from the head and negative indices -4, -3, -2, -1 from the tail. Panel 2 shows context window slicing docs[1:3] extracting items at indices 1 and 2 ('shipping_faq' and 'order_tracking') and stopping before index 3. Panel 3 contrasts in-place mutation docs.append('user_profile') adding an item to the existing list in memory against the fatal rebinding bug docs = docs.append(...) which destroys the reference and rebinds the variable to None."
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
          <figcaption className="micro">
            Figure 1: Core concepts of Python lists: 0-based positive and
            negative tail indexing, slicing sublists for prompt token budgets,
            and in-place mutation versus the variable rebinding trap.
          </figcaption>
        </figure>
      </section>

      <section id="indexing-and-negative-indices">
        <h2 tabIndex={-1}>Indexing: Accessing elements from head and tail.</h2>
        <p>
          To access an individual item inside a list, write the list name
          followed by the item&apos;s position index inside square brackets:{" "}
          <code>docs[i]</code>.
        </p>

        <p>
          In Python, sequences use <strong>0-based indexing</strong>. The first
          element is located at index <code>0</code>, not <code>1</code>:
        </p>

        <div className={styles.codePanel}>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>top_match</span> ={" "}
            <span className={styles.codeVar}>retrieved_docs</span>[0]{" "}
            <span className={styles.codeComment}>
              # Evaluates to &quot;refund_policy&quot;
            </span>
          </p>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>second_match</span> ={" "}
            <span className={styles.codeVar}>retrieved_docs</span>[1]{" "}
            <span className={styles.codeComment}>
              # Evaluates to &quot;shipping_faq&quot;
            </span>
          </p>
        </div>

        <p>
          When building AI pipelines, you frequently need the newest message in
          a conversation or the lowest-ranked candidate in a pool. Python
          provides <strong>negative indexing</strong> to count backward from the
          tail:
        </p>

        <ul>
          <li>
            <code>docs[-1]</code>: Accesses the last item (e.g.{" "}
            <code>&quot;warranty_terms&quot;</code>).
          </li>
          <li>
            <code>docs[-2]</code>: Accesses the second-to-last item (e.g.{" "}
            <code>&quot;order_tracking&quot;</code>).
          </li>
        </ul>

        <div className="callout">
          <strong>Valid Index Range:</strong> For any non-empty list, valid
          indices lie in the inclusive range between <code>-len(docs)</code> and{" "}
          <code>len(docs) - 1</code>. Attempting to access an index outside this
          range (such as <code>retrieved_docs[10]</code> on a 4-item list)
          immediately crashes your pipeline with{" "}
          <code>IndexError: list index out of range</code>.
        </div>

        <ListMemoryVisual />
      </section>

      <section id="slicing-and-context-windows">
        <h2 tabIndex={-1}>
          Slicing: Extracting sublists for prompt context budgets.
        </h2>
        <p>
          LLMs have finite context windows and cost budgets. Even if a vector
          database returns dozens of matching documents, you might only have
          space in your prompt for the top 2 passages. (Note: Slicing extracts
          items strictly by sequential position; it does not measure tokens.
          Model tokenizers measure token counts, while slicing provides an
          architectural cutoff assuming top-ranked passages fit the budget.)
        </p>

        <p>
          Python allows you to extract a sublist using <strong>slicing</strong>{" "}
          syntax: <code>docs[start : stop]</code>. Slicing starts at index{" "}
          <code>start</code> (inclusive) and stops <em>before</em> index{" "}
          <code>stop</code> (exclusive):
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # Extract top 2 passages (indices 0 and 1):
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>context_docs</span> ={" "}
            <span className={styles.codeVar}>retrieved_docs</span>[0:2]
          </p>
          <div className={styles.codeComment}>
            # Evaluates to: [&quot;refund_policy&quot;,
            &quot;shipping_faq&quot;]
          </div>
        </div>

        <p>
          You can omit bounds when starting from the head or slicing to the
          tail:
        </p>

        <ul>
          <li>
            <code>docs[:2]</code>: Omit start to begin from index <code>0</code>{" "}
            (first 2 items).
          </li>
          <li>
            <code>docs[2:]</code>: Omit stop to slice from index 2 all the way
            to the end.
          </li>
          <li>
            <code>docs[-2:]</code>: Extract the final 2 elements from the tail.
          </li>
        </ul>

        <div className="callout">
          <strong>Slicing Out-of-Bounds Never Crashes:</strong> While single
          indexing (<code>docs[10]</code>) throws an <code>IndexError</code>,
          Python handles out-of-range slice bounds gracefully. Writing{" "}
          <code>docs[:10]</code> on a 4-item list simply returns all 4 items
          without raising an error. When slice bounds are non-negative, any
          slice where <code>start &gt;= stop</code> yields an empty list{" "}
          <code>[]</code>. (When negative bounds are used, Python first converts
          them to positive offsets by adding <code>len(docs)</code>, so{" "}
          <code>docs[0:-1]</code> cleanly returns all items except the last.)
        </div>
      </section>

      <section id="mutability-and-append-trap">
        <h2 tabIndex={-1}>
          Mutability: In-place updates and the .append() trap.
        </h2>
        <p>
          In Lesson 03, we learned that strings are immutable: transformative
          methods like <code>.replace()</code> and <code>.strip()</code> return
          new strings, leaving the original intact. Lists in Python are the
          opposite: they are <strong>mutable</strong>.
        </p>

        <p>
          You can add items to the end of an existing list using the{" "}
          <code>.append()</code> method, remove items with <code>.pop()</code>,
          or update any slot directly:
        </p>

        <div className={styles.codePanel}>
          <div className={styles.codeComment}>
            # 1. Mutate in place by appending a new context string:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>retrieved_docs</span>.append(
            <span className={styles.codeString}>&quot;user_profile&quot;</span>)
          </p>
          <div className={styles.codeComment}>
            # retrieved_docs now has 5 items in memory.
          </div>

          <div className={styles.codeComment} style={{ marginTop: "0.5rem" }}>
            # 2. Update an outdated passage at slot 1 in place:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>retrieved_docs</span>[1] ={" "}
            <span className={styles.codeString}>&quot;shipping_v2&quot;</span>
          </p>

          <div className={styles.codeComment} style={{ marginTop: "0.5rem" }}>
            # 3. Remove and return the tail item:
          </div>
          <p className={styles.codeLine}>
            <span className={styles.codeVar}>removed</span> ={" "}
            <span className={styles.codeVar}>retrieved_docs</span>.pop()
          </p>
          <div className={styles.codeComment}>
            # removed is &quot;user_profile&quot;; len is back to 4.
          </div>
        </div>

        <div className="callout">
          <strong>The Fatal .append() Rebinding Trap:</strong> In Python,{" "}
          <code>.append()</code> mutates the list in place and returns{" "}
          <code>None</code>. If you write:
          <br />
          <code>docs = docs.append(&quot;new_doc&quot;)</code>
          <br />
          the list is modified, but your variable name tag <code>docs</code> is
          rebound to the return value <code>None</code>! Subsequent attempts to
          call <code>docs.append(...)</code> fail with{" "}
          <code>
            AttributeError: &apos;NoneType&apos; object has no attribute
            &apos;append&apos;
          </code>
          , and slicing <code>docs[:2]</code> fails with{" "}
          <code>
            TypeError: &apos;NoneType&apos; object is not subscriptable
          </code>
          . Always call <code>docs.append(...)</code> by itself without
          reassignment!
        </div>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>
          Inspect list operations in the AI context sandbox.
        </h2>
        <p>
          Experiment with how positive and negative indices, context window
          slicing bounds, in-place appends, and the <code>.append()</code>{" "}
          rebinding trap behave in a simulated RAG pipeline:
        </p>

        <ListLab />
      </section>

      <Check
        id="check"
        question="An AI engineer prepares candidate documents for a prompt and writes:
candidates = ['doc_billing', 'doc_returns', 'doc_shipping']
candidates = candidates.append('doc_warranty')
top_candidates = candidates[:2]

What happens when this Python code executes?"
        options={[
          "top_candidates evaluates to ['doc_billing', 'doc_returns']",
          "TypeError: 'NoneType' object is not subscriptable occurs on line 3",
          "candidates evaluates to ['doc_billing', 'doc_returns', 'doc_shipping', 'doc_warranty']",
          "IndexError: list index out of range occurs on line 2",
        ]}
        correct={1}
        wrongFeedback={[
          "Because .append() returns None, line 2 rebinds candidates to None. Line 3 then attempts to slice None[:2], raising a TypeError.",
          "",
          "In Python, .append() modifies the list in place and returns None. By writing candidates = candidates.append(...), the variable candidates is rebound to None.",
          ".append() never raises an IndexError; it appends to the end of the sequence. The failure occurs on line 3 when slicing None.",
        ]}
        explanation="In Python, the list.append() method mutates the list in place and returns None. When line 2 executes candidates = candidates.append('doc_warranty'), the underlying list is updated with 'doc_warranty', but the variable name tag candidates is rebound to the return value None. Consequently, on line 3, evaluating candidates[:2] attempts to slice None, which immediately raises TypeError: 'NoneType' object is not subscriptable. To append safely while preserving the variable reference, call candidates.append('doc_warranty') without reassignment."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Python lists (<code>list</code>) are ordered, mutable sequences
            fundamental to AI workflows. Access items from the head using
            0-based positive indexing (<code>docs[0]</code>) and from the tail
            using negative indexing (<code>docs[-1]</code>). Slice sublists for
            prompt context budgets with <code>docs[start:stop]</code>, which
            stops before <code>stop</code> and gracefully handles out-of-range
            bounds. Remember that lists are <strong>mutable</strong>: methods
            like <code>.append()</code> modify the list in place and return{" "}
            <code>None</code>. Never assign the result of <code>.append()</code>{" "}
            back to your variable!
          </p>
        </div>
        <Link className="text-link" href="/course/chapter-p1">
          Next up: Tuples and Sets in Chapter P1 →
        </Link>
      </section>
    </LessonFrame>
  );
}

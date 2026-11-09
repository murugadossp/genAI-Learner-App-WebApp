import Image from "next/image";
import modelImage from "./assets/model.jpg";
import interfaceImage from "./assets/interface.jpg";
import dataSourceImage from "./assets/data-source.jpg";
import toolImage from "./assets/tool.jpg";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { Trace } from "./Trace";
import { Sorter } from "./Sorter";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="04"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="A model is not the app"
      lead="When people say “the AI”, they often mean a whole app. But the model is only one part inside it. The screen, the stored information and the outside services are separate parts."
    >
      <section id="not-one-thing">
        <h2 tabIndex={-1}>An app is more than its model.</h2>
        <p>
          A common idea is that an AI app and its model are one thing. They are
          not. The model is one part inside the app.
        </p>
        <p>
          Think of a help desk in a building. A trained specialist answers
          questions, but the building also has a front desk, a filing cabinet
          and a phone. The specialist is not the building.
        </p>
        <p className="micro">
          The picture has limits. A model is not a person. In Leaf Buddy, its
          job is to turn a photo into a guess.
        </p>
        <p>
          In this lesson you meet four parts, in this order: the{" "}
          <strong>model</strong>, then the <strong>interface</strong>, the{" "}
          <strong>data source</strong> and the <strong>tool</strong> around it.
          Then you follow one request through all of them.
        </p>
        <div className={styles.example}>
          <strong>Running example: Leaf Buddy</strong>
          <p>
            Leaf Buddy is an invented plant app. You photograph a leaf, and it
            names the plant and says when to water it. It is not a real product.
          </p>
        </div>
      </section>
      <section id="the-model">
        <h2 tabIndex={-1}>The model is the learned part.</h2>
        <p>
          A <strong>model</strong> turns an input into an output. In Leaf Buddy,
          the input is your photo and the output is a best guess, such as
          “tomato plant”.
        </p>
        <p>
          Leaf Buddy’s model learned to guess from many example photos that had
          labels, like the examples and labels in the previous lesson. People
          build the model too. What it learned is how to guess from examples.
        </p>
        <div className={styles.example}>
          <strong>In Leaf Buddy</strong>
          <p>
            The model is given only the photo. It is not given the care list or
            the weather, so it cannot use them.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={modelImage}
            alt="Leaf Buddy: a Photo goes into the Model, which produces a Plant guess of tomato plant."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            The photo is the input; the model’s plant guess is the output.
          </figcaption>
        </figure>
      </section>
      <section id="around-it">
        <h2 tabIndex={-1}>Three parts around the model.</h2>
        <p>
          The rest of the app is built by people as ordinary app features. We
          sort it into three parts by the job each does in one request.
        </p>
        <ul className={styles.cards}>
          <li className={styles.card}>
            <h3>Interface</h3>
            <p>Where information goes in and out for the person.</p>
            <p>
              <em>Leaf Buddy:</em> the camera button and the result card.
            </p>
            <figure className={styles.figure}>
              <Image
                src={interfaceImage}
                alt="Leaf Buddy screens show a Camera button and a Result card for a tomato plant."
                sizes="(max-width: 760px) 100vw, 720px"
              />
              <figcaption className="micro">
                The interface is where a person takes the photo and reads the
                result.
              </figcaption>
            </figure>
          </li>
          <li className={styles.card}>
            <h3>Data source</h3>
            <p>Information stored ahead of time and looked up as it is.</p>
            <p>
              <em>Leaf Buddy:</em> a list of watering tips written by gardeners.
            </p>
            <figure className={styles.figure}>
              <Image
                src={dataSourceImage}
                alt="Leaf Buddy uses a Plant guess to look in a Care list and find a Watering tip."
                sizes="(max-width: 760px) 100vw, 720px"
              />
              <figcaption className="micro">
                App code uses the plant guess to look up the stored tip; it does
                not change the list.
              </figcaption>
            </figure>
          </li>
          <li className={styles.card}>
            <h3>Tool</h3>
            <p>An outside service or action the app calls when it needs it.</p>
            <p>
              <em>Leaf Buddy:</em> a weather service that says if rain is due.
            </p>
            <figure className={styles.figure}>
              <Image
                src={toolImage}
                alt="The App sends an Ask to the Weather service, which sends a rainy Forecast back to the app."
                sizes="(max-width: 760px) 100vw, 720px"
              />
              <figcaption className="micro">
                The app asks the weather service and receives its forecast in
                return.
              </figcaption>
            </figure>
          </li>
        </ul>
        <p>
          Ordinary app code connects the parts and decides the order. It is the
          glue, not a fourth thing to sort. In Leaf Buddy it holds one rule: if
          rain is due, add “skip today”.
        </p>
      </section>
      <section id="trace">
        <h2 tabIndex={-1}>Follow one photo through Leaf Buddy.</h2>
        <p>
          One photo makes a trip through the parts. It takes six steps, and the
          model works in only one of them.
        </p>
        <Trace />
      </section>
      <section id="which-part">
        <h2 tabIndex={-1}>Which part is it?</h2>
        <p>
          Now sort six pieces of Leaf Buddy into the four parts. Ask what each
          one does in a request.
        </p>
        <Sorter />
      </section>
      <section id="why">
        <h2 tabIndex={-1}>Why the split matters.</h2>
        <ul>
          <li>
            <strong>You can fix one part at a time.</strong> Gardeners can
            correct a tip in the data source without changing the model.
          </li>
          <li>
            <strong>You can find the part that went wrong.</strong> Start with
            the part that did the job. With a clear photo, a wrong plant name
            points first to the model. If the stored tip itself is wrong, look
            at the data source. Old rain news points to the tool, and a
            confusing screen to the interface. The app code between them can
            also be at fault.
          </li>
          <li>
            <strong>The same shape shows up elsewhere.</strong> Many chat
            assistants have a chat window, a language model, documents the app
            can look up and sometimes services it can call. Products differ, so
            treat this as a common pattern, not a rule.
          </li>
        </ul>
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Where this picture is too tidy.</h2>
        <ul>
          <li>
            <strong>Real apps blur the lines.</strong> A tool can contain its
            own model, and one app can use several models. Stored information
            and a live service can be hard to tell apart. Here we call stored
            information a data source, and a call made when needed a tool.
          </li>
          <li>
            <strong>The order can change.</strong> Real apps may call parts in a
            different order, or more than once.
          </li>
          <li>
            <strong>Naming parts does not rate them.</strong> Knowing which part
            did what does not tell you how good each part is.
          </li>
          <li>
            <strong>What happens to the model when you use an app</strong> is
            the topic of the next lesson, “Training vs inference”.
          </li>
        </ul>
      </section>
      <Check
        id="check"
        question="Leaf Buddy photographs a cactus and correctly names it “cactus”. The app picks the cactus entry from its stored care list and shows it unchanged: “Water every day.” A gardener confirms that this stored entry is itself wrong. Which part holds the error?"
        options={[
          "The model, the part that turns the photo into a guess.",
          "The data source, the stored care list the tip came from.",
          "The interface, the screen that shows the result card.",
          "The tool, the outside weather service.",
        ]}
        correct={1}
        wrongFeedback={[
          "The model named the cactus correctly, so its guess was fine. The wrong sentence comes from the stored list, not from the guess.",
          "",
          "The interface showed the entry unchanged. It displays what it is given, so it passed the error along without causing it.",
          "The weather service gives today’s forecast, not care tips. The wrong sentence is part of the stored entry.",
        ]}
        explanation="The wrong sentence sits in the stored care list, so the data source holds the error. The model guessed correctly and the screen only displayed what it was given. Seeing the parts separately is what lets you find the one that failed."
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            A model is one part of an app. It turns an input into an output,
            such as a best guess. Around it sit the interface, data sources and
            tools, joined by ordinary app code. Follow a request step by step,
            name the part doing each job, and you can tell which part to look at
            when something goes wrong.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

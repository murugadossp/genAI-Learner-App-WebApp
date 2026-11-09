import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { PhasesMap } from "./PhasesMap";
import { Lab } from "./Lab";
import { Sorter } from "./Sorter";
import styles from "./lesson.module.css";
import factoryImg from "./factory-vending.jpg";
import hintImg from "./hint-vs-training.jpg";

export default function Lesson() {
  return (
    <LessonFrame
      number="05"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="Training vs inference"
      lead="Building a model and using a model are two different jobs. Using one does not normally change it. Changing it takes training."
    >
      <section id="two-jobs">
        <h2 tabIndex={-1}>Building a model and using it are different jobs.</h2>
        <p>
          Two ideas are common but wrong: that a model can never be trained
          further after release, or that every chat teaches it something.
          Neither is how it works.
        </p>
        <p>
          Think of a factory and a vending machine. The factory builds the
          machine. The vending machine only hands out what it was built to hand
          out. Pressing its buttons does not rebuild it.
        </p>
        <p className="micro">
          The picture has limits. A model is software, not metal, and it can be
          rebuilt later. Unlike a vending machine, it can also produce new
          outputs for new inputs.
        </p>
        <p>
          You meet three ideas in this order: <strong>training</strong>, then{" "}
          <strong>inference</strong>, then how a chat message fits in. After
          that you see how a model really changes.
        </p>
        <p>
          One question tells them apart. Are the model’s{" "}
          <strong>learned settings</strong> being changed? If yes, that is
          training. If no, and the model is producing an output, that is
          inference.
        </p>
        <div className={styles.example}>
          <strong>Running example: Ticket Tagger</strong>
          <p>
            Ticket Tagger is an invented tool. It reads a customer email and
            tags it “billing” (about money) or “delivery”. It is not a real
            product.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={factoryImg}
            alt="Diagram of a factory labelled Training, an arrow to a card labelled Learned settings with a v1 tag, and an arrow to a vending machine labelled Inference."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Training builds the learned settings. Inference uses them.
          </figcaption>
        </figure>
      </section>
      <section id="training">
        <h2 tabIndex={-1}>Training changes the model.</h2>
        <p>
          <strong>Training</strong> changes a model’s learned settings, using
          data. The model is adjusted again and again to try to improve at its
          task.
        </p>
        <p>
          Training is usually done by the people who build the model. It
          typically takes far more work than a single use of the model.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger</strong>
          <p>
            Version v1 was trained on emails that already had a billing or
            delivery label, like the examples and labels in lesson 1.3.
          </p>
        </div>
        <PhasesMap
          active={["training"]}
          caption="Training is the job that changes the learned settings."
        />
      </section>
      <section id="inference">
        <h2 tabIndex={-1}>Inference uses the model as it is.</h2>
        <p>
          <strong>Inference</strong> means using a model to produce an output.
          An input goes in, an output comes out, and the learned settings stay
          as they were.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger</strong>
          <p>
            A new email arrives and v1 tags it. Nothing about v1 changes, so the
            next email meets the same v1.
          </p>
        </div>
        <PhasesMap
          active={["inference"]}
          caption="Inference is the job that uses the learned settings."
        />
      </section>
      <section id="chat">
        <h2 tabIndex={-1}>A chat message is input, not training.</h2>
        <p>
          In this lesson’s tagger, the email and any hint are input to one
          request. The model uses them to produce a tag and does not change its
          learned settings.
        </p>
        <p>
          Some apps save information and may include relevant saved information
          in a later request. That is the app supplying input, like the data
          source in lesson 1.4. It is separate from changing the model.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger</strong>
          <p>
            A hint such as “this is about money” can change the tag for the
            request it is sent with. It leaves v1 unchanged.
          </p>
        </div>
        <PhasesMap
          active={["inference"]}
          caption="In this request, your hint is input to inference. It does not change the learned settings."
        />
      </section>
      <section id="change">
        <h2 tabIndex={-1}>How a model really changes.</h2>
        <p>
          A model changes when it is trained again. That can mean{" "}
          <strong>retraining</strong> on new data, or adapting it to a task.
          Both change the learned settings, so both are training.
        </p>
        <p>
          Training can happen again after a model is released. In Ticket Tagger
          the builder trains a new version, v2, and the app switches to it.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger</strong>
          <p>
            The builder adds labelled emails about money on parcels and trains
            v2. This is training again, not use.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={hintImg}
            alt="Two panels. One request: a Hint note and an envelope go into a vending machine fed by a card labelled Learned settings: v1, and nothing changes the card. Training again: a factory produces a card labelled Learned settings: v2."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            A hint shapes one request. Only training again makes v2.
          </figcaption>
        </figure>
      </section>
      <section id="lab">
        <h2 tabIndex={-1}>Try it: a hint, then retraining.</h2>
        <p>
          Press the buttons in order. Watch the learned settings line and the
          log.
        </p>
        <ol>
          <li>Tag email 1. v1 gets it wrong.</li>
          <li>Tag it again with the hint. The tag changes.</li>
          <li>Tag email 2 with no hint. v1 is wrong again.</li>
          <li>Train v2, then repeat step 3.</li>
        </ol>
        <Lab />
        <div className={styles.example}>
          <strong>What to notice</strong>
          <p>
            The hint changed one reply and left v1 as v1. Only training changed
            the settings.
          </p>
        </div>
      </section>
      <section id="sort">
        <h2 tabIndex={-1}>Training or inference?</h2>
        <p>
          Ask one question: are the learned settings being changed? Each item
          says whether the model itself is changed.
        </p>
        <Sorter />
      </section>
      <section id="limits">
        <h2 tabIndex={-1}>Where this picture is too tidy.</h2>
        <ul>
          <li>
            The tagger is a toy with scripted answers. Real models and real
            training are far larger and messier.
          </li>
          <li>
            Some real systems, such as some recommendation systems, may be
            updated continuously. The test is the same: are the learned settings
            changing?
          </li>
          <li>
            A provider may use chats for later training, depending on its
            policies and settings. That is a separate training step, not the
            chat itself.
          </li>
          <li>Chapter 2 covers how large text models are trained in stages.</li>
        </ul>
      </section>
      <Check
        id="check"
        question="In Ticket Tagger v1, you add the hint “this is about money” and get the right tag. The next morning a different customer’s similar email is sent with no hint and no earlier messages, and it is tagged wrong. Why?"
        options={[
          "The model forgot the hint overnight.",
          "The hint changed v1, but training resets v1 every day.",
          "The hint was only input to one request, so v1’s learned settings did not change.",
          "The hint permanently changed v1’s learned settings.",
        ]}
        correct={2}
        explanation="The hint was part of one request. It did not change v1’s learned settings, so a new request without it meets the same v1. Changing the settings takes training."
        wrongFeedback={[
          "Not quite. Nothing in the hint changed the model, so there was no learned change to forget. The hint only shaped that one reply.",
          "Not quite. The hint did not change v1, and nothing in the scenario resets it. The settings simply stayed the same.",
          "",
          "Not quite. The hint was input to one request, not a training step, so it did not change v1’s learned settings. A similar email can still be tagged wrong without the hint.",
        ]}
      />
      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            Ask whether the model’s learned settings are being changed. If yes,
            that is training, including retraining. If no, and the model is
            producing an output, that is inference. A prompt is input to
            inference, so it can shape one reply without retraining the model.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

import Image from "next/image";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { Lab } from "./Lab";
import { Sorter } from "./Sorter";
import styles from "./lesson.module.css";
import factoryImg from "./factory-vending.jpg";
import trainingImg from "./training.jpg";
import inferenceImg from "./inference.jpg";
import hintImg from "./hint.jpg";
import retrainImg from "./retrain.jpg";

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
        <p>
          In a model, the “built” part is its <strong>learned settings</strong>:
          values inside the model that shape how it responds. In our example, we
          call the first saved set v1.
        </p>
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
          One question tells them apart. Are the model’s learned settings being
          changed? If yes, that is training. If no, and the model is producing
          an output, that is inference.
        </p>
        <div className={styles.example}>
          <strong>Running example: Ticket Tagger</strong>
          <p>
            Ticket Tagger is an invented tool. It reads a customer email and
            tags it “billing” (about money) or “delivery”. It is not a real
            product.
          </p>
        </div>
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
          <strong>In Ticket Tagger: how v1 learned</strong>
          <p>
            v1 was trained on emails that already had a label, like the examples
            and labels in lesson 1.3. For instance:
          </p>
          <ul>
            <li>“I was charged twice.” was labelled billing.</li>
            <li>“My box has not arrived.” was labelled delivery.</li>
            <li>“Please refund my order.” was labelled billing.</li>
          </ul>
          <p>
            After many such examples, words like “charged” and “refund” lean
            toward billing, and “arrived” leans toward delivery.
          </p>
        </div>
        <p className="micro">
          This is a simplified picture. Real models learn patterns that are far
          subtler than single words.
        </p>
        <div className={styles.example}>
          <strong>Why v1 will make a mistake later</strong>
          <p>
            Suppose v1 saw very few emails that mention a parcel and money
            together. An email like “My parcel charge is wrong” may then be
            pulled toward delivery by the word “parcel”. This gap is invented
            for the lab below.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={trainingImg}
            alt="Diagram: a stack of emails labelled Labelled emails goes into a factory labelled Training, which produces a card labelled Learned settings: v1."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Training turns labelled emails into learned settings.
          </figcaption>
        </figure>
      </section>
      <section id="inference">
        <h2 tabIndex={-1}>Inference uses the model as it is.</h2>
        <p>
          <strong>Inference</strong> means using a model to produce an output.
          An input goes in, an output comes out, and the learned settings stay
          as they were.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger: one email, step by step</strong>
          <ol>
            <li>An email arrives: “My parcel charge is wrong.”</li>
            <li>The app sends it to v1.</li>
            <li>v1 produces a tag, such as “delivery”.</li>
            <li>The app shows the tag. v1 is exactly as it was before.</li>
          </ol>
        </div>
        <figure className={styles.figure}>
          <Image
            src={inferenceImg}
            alt="Diagram: an envelope labelled New email goes into a vending machine fed by a card labelled Learned settings: v1, and a ticket labelled Tag: delivery comes out. Nothing points back into the card."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            Inference reads the settings. It does not change them.
          </figcaption>
        </figure>
        <p>
          The same idea appears in other tools. A photo app naming a plant, a
          chat assistant writing a reply and a translator turning a sentence
          into another language are all inference.
        </p>
        <p>
          Training is typically an occasional, heavy job. Inference happens each
          time someone uses the model.
        </p>
      </section>
      <section id="chat">
        <h2 tabIndex={-1}>A chat message is input, not training.</h2>
        <p>
          In this lesson’s tagger, the email and any hint are input to one
          request. The model uses them to produce a tag and does not change its
          learned settings.
        </p>
        <div className={styles.example}>
          <strong>In Ticket Tagger</strong>
          <p>
            A hint such as “this is about money” can change the tag for the
            request it is sent with. It leaves v1 unchanged.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={hintImg}
            alt="Diagram: a frame labelled One request holds an envelope with a note labelled Hint; it goes into a vending machine fed by an unchanged card labelled Learned settings: v1, and a ticket labelled Tag: billing comes out."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            A hint travels with one request. The settings card stays v1.
          </figcaption>
        </figure>
        <div className={styles.example}>
          <strong>The same thing in a chat assistant</strong>
          <p>
            You write “Call me Sam.” The next reply says “Sure, Sam.” In many
            chat apps this works because the app sends your earlier messages
            along with each new one, so the model reads them again.
          </p>
          <p>
            Start a new chat without those messages, and with no saved
            information supplying the name, and the model has no way to know it.
          </p>
        </div>
        <p>
          Some apps save information and may include relevant saved information
          in a later request. That is the app supplying input, like the data
          source in lesson 1.4. It is separate from changing the model.
        </p>
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
            The builder collects more labelled emails that mix parcels and
            money, then trains again. The result is v2. Now “My parcel charge is
            wrong” is tagged billing without any hint.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src={retrainImg}
            alt="Diagram: a card labelled Learned settings: v1 and a stack labelled New labelled emails go into a factory labelled Training again, which produces a card labelled Learned settings: v2."
            sizes="(min-width: 900px) 720px, 100vw"
          />
          <figcaption className="micro">
            A new version comes from training again, not from using v1.
          </figcaption>
        </figure>
        <p>
          For a user this can look like the same app behaving differently after
          an update. In this example, the change came from a separate training
          step, not from sending a chat message.
        </p>
      </section>
      <section id="lab">
        <h2 tabIndex={-1}>Try it: a hint, then retraining.</h2>
        <p>
          Press the buttons in order. Watch the learned settings line and the
          log. Press Reset to start again.
        </p>
        <ol>
          <li>Tag email 1. While the settings are v1, it gets this wrong.</li>
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
      <section id="questions">
        <h2 tabIndex={-1}>Quick questions.</h2>
        <h3>If I correct the model, will it remember?</h3>
        <p>
          Within that conversation, the app may keep sending your correction, so
          it can seem to. The learned settings are the same. Another chat, or
          another user, will not see it unless the app saves it or the builder
          trains again.
        </p>
        <h3>Does a thumbs-down button retrain the model?</h3>
        <p>
          Not by itself, and not right away. A company may collect such feedback
          and use it in a later training step, depending on its policies.
        </p>
        <h3>Is a model trained only once?</h3>
        <p>
          No. A model can be trained again after release, and the app can switch
          to the new version.
        </p>
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
        question="In Ticket Tagger v1, you add the hint “this is about money” and get the right tag. The next morning a different customer’s similar email is sent with no hint and no earlier messages, and in this toy it is tagged wrong again. Why did the earlier hint not carry over?"
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
            producing an output, that is inference. A message or hint is input
            to inference, so it can shape one reply without retraining the
            model.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

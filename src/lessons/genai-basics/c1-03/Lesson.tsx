import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ChoiceTask } from "./ChoiceTask";
import { TableLab } from "./TableLab";
import { RowDiagram } from "./RowDiagram";
import { FruitTable } from "./FruitTable";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="03"
      chapter={{ label: "AI foundations", href: "/course/chapter-1" }}
      title="Data, examples, features and labels"
      lead="Before a model can learn anything, it needs data. Data is a pile of examples. Each example has clues and, often, an answer. Learning to tell the clues from the answer is the first skill."
    >
      <section id="big-idea">
        <h2 tabIndex={-1}>Learning starts with examples.</h2>
        <p>
          Think of a pile of flashcards. The front shows some clues. The back
          shows the answer. You get better by going through the pile.
        </p>
        <p>
          A model can learn from a pile of examples in a loosely similar way. It
          is only an analogy: a model does not read or remember cards like a
          person.
        </p>
        <p>This lesson names four things, in this order:</p>
        <ol>
          <li>
            <strong>Example:</strong> one card.
          </li>
          <li>
            <strong>Feature:</strong> a clue on the front.
          </li>
          <li>
            <strong>Label:</strong> the answer on the back.
          </li>
          <li>
            <strong>New case:</strong> a card whose back is still blank.
          </li>
        </ol>
        <div className="callout">
          <strong>Key idea:</strong> features and labels are not the same thing.
          Features are what we know. The label is what we want to find out.
        </div>
      </section>

      <section id="example">
        <h2 tabIndex={-1}>In our table, an example is one row.</h2>
        <p>
          Our running story is a fruit-packing machine. A camera notes the
          colour, shape and size of each fruit. A worker then writes down which
          fruit it is.
        </p>
        <FruitTable />
        <p>
          In this table, each row is one <strong>example</strong>: one fruit
          that was seen and named. Examples are not always rows. In other
          projects an example might be a photo or a sentence.
        </p>
        <RowDiagram focus="example" />
        <ChoiceTask
          question="How many examples does the table above hold?"
          options={[
            "Four: one for each column.",
            "Five: one for each row.",
            "One: the whole table is a single example.",
          ]}
          correct={1}
          feedback={[
            "A column is a kind of information, such as Colour. It is not a fruit. Each fruit is a row.",
            "Each row is one fruit that was seen and named, so five rows make five examples.",
            "The table holds many fruits. Each fruit is its own example.",
          ]}
        />
      </section>

      <section id="features">
        <h2 tabIndex={-1}>Features are the clues.</h2>
        <p>
          A <strong>feature</strong> is a piece of information about an example
          that the model uses as a clue. It is usually known when the model has
          to make a guess. Features are sometimes called inputs.
        </p>
        <p>
          In our table, Colour, Shape and Size describe a fruit before anyone
          names it. We use them as clues, so they are the features. Notice that
          features are columns in this table. With photos or text, features can
          be less tidy, such as the values of the pixels in a photo.
        </p>
        <RowDiagram focus="features" />
        <ChoiceTask
          question="Which sentence describes a feature?"
          options={[
            "The answer we want the model to give.",
            "One whole row of the table.",
            "A piece of information about an example that the model uses as a clue.",
          ]}
          correct={2}
          feedback={[
            "That describes the label, which comes next. A feature is a clue, not the answer.",
            "A whole row is an example. A feature is one clue inside it.",
            "A feature is information the model uses as a clue, such as a fruit’s colour, which is known before anyone gives the answer.",
          ]}
        />
      </section>

      <section id="label">
        <h2 tabIndex={-1}>The label is the answer.</h2>
        <p>
          The <strong>label</strong> is the answer we want for an example. It is
          also called the target. An example that has clues and an answer is a
          labeled example.
        </p>
        <p>
          Our goal is to name the fruit. So in this table the Fruit column holds
          the labels, and the label for the Cherry row is “Cherry”.
        </p>
        <RowDiagram focus="label" />
        <ChoiceTask
          question="The goal is to name the fruit. In the Cherry row (Red, Round, Small, Cherry), which value is the label?"
          options={["Red", "Round", "Small", "Cherry"]}
          correct={3}
          feedback={[
            "Red is a clue the camera can see. It is a feature.",
            "Round is a clue the camera can see. It is a feature.",
            "Small is a clue the camera can see. It is a feature.",
            "“Cherry” is the name we want the model to give, so it is the label.",
          ]}
        />
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>The goal decides the label.</h2>
        <p>
          Whether a column is a clue or the answer depends on what we want to
          find out. That is the goal.
        </p>
        <div className={styles.worked}>
          <strong>In the running example:</strong>
          <p>
            Goal A is to name the fruit, so Fruit is the label. Goal B is to
            guess a fruit’s size, so Size becomes the label and Fruit becomes a
            clue. It is the same table with a different goal.
          </p>
        </div>
        <p>
          For these exercises, choose exactly one column as the label and treat
          every other column as a feature.
        </p>
        <p>Try it in this order:</p>
        <ol>
          <li>Read the goal.</li>
          <li>
            Choose the one column that holds the answer and mark it Label.
          </li>
          <li>Mark every other column as a Feature.</li>
          <li>
            Switch goals and do it again. Notice which columns changed roles.
          </li>
        </ol>
        <TableLab />
      </section>

      <section id="new-case">
        <h2 tabIndex={-1}>A new case to guess has no label yet.</h2>
        <p>
          A new fruit arrives. The camera gives its clues, but nobody has named
          it. It has features and no label. That is an unlabeled example, or new
          case.
        </p>
        <p>
          Guessing the missing label from the clues is the job we want a model
          to do after it has learned from labeled examples.
        </p>
        <FruitTable blank={["Yellow", "Long", "Small", "?"]} />
        <p>
          Recap from lesson 1: rules are written by hand, while in this lesson’s
          examples learning uses examples that come with answers. The practice
          rule below is hand-written. It is only here so the exercise has one
          clear answer. It is not how a model learns.
        </p>
        <ChoiceTask
          question="Practice rule: for each row in the table, count one point for every clue (Colour, Shape or Size) that matches the new fruit. The row with the most points gives the guess. What is the guess for the new fruit (Yellow, Long, Small)?"
          options={[
            "Lemon",
            "Cherry",
            "Banana",
            "No guess is possible, because this exact row is not in the table.",
          ]}
          correct={2}
          feedback={[
            "Lemon matches only the colour (Yellow), so it scores 1 point.",
            "Cherry matches only the size (Small), so it scores 1 point.",
            "Banana matches the colour (Yellow) and the shape (Long), so it scores 2 points. That is the most.",
            "A guess is possible without an exact match. Banana is the closest row, with 2 matching clues. A guess can still be wrong.",
          ]}
        />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where this picture is too tidy.</h2>
        <ul>
          <li>
            <strong>Labels can be wrong.</strong> People write many labels.
            Wrong labels can lead a model to learn misleading patterns.
          </li>
          <li>
            <strong>Five rows are unlikely to be enough.</strong> Real projects
            usually need many more examples.
          </li>
          <li>
            <strong>Some clues do not help.</strong> A clue that has little to
            do with the answer adds little.
          </li>
          <li>
            <strong>Names and shapes vary.</strong> You will also see “inputs”
            and “target”, and data that is not a neat table.
          </li>
          <li>
            <strong>Not all data has labels.</strong> Some data has clues only.
            Later lessons cover how that is used.
          </li>
        </ul>
      </section>

      <Check
        id="check"
        question="A school app keeps a table with one row per student and three columns: Hours slept, Ate breakfast (yes or no) and Arrived late (yes or no). The app records sleep and breakfast, then predicts whether the student will arrive late. Which column is the label?"
        options={[
          "Hours slept, because it is the number that matters most.",
          "Arrived late, because it is the answer the goal asks for.",
          "Ate breakfast, because it is a yes or no answer.",
          "All three, because every column in a table is a label.",
        ]}
        correct={1}
        wrongFeedback={[
          "Hours slept is a clue we would use. The label is the answer the goal asks for, not the column that seems most important.",
          "",
          "Having a yes or no answer does not make a column the label. Breakfast is recorded before the app makes its prediction, so it is a clue.",
          "In this table the columns have different roles. Hours slept and Ate breakfast are clues and only Arrived late is the label.",
        ]}
        explanation="The goal is to predict lateness, so Arrived late is the label. Hours slept and Ate breakfast are features. Change the goal and the roles could change too."
      />

      <section id="takeaway">
        <div className="takeaway-card">
          <span className="eyebrow">THE TAKEAWAY</span>
          <h2 tabIndex={-1}>Take this with you.</h2>
          <p>
            In our fruit table, each row is one example. Features are the clues
            the model uses. The label is the answer we want. Which column is the
            label depends on the goal, and a new case to guess has clues but no
            label yet.
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

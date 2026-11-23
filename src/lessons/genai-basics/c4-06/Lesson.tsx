import Image from "next/image";
import Link from "next/link";
import rlLoop from "./images/rl-loop.webp";
import delayedReward from "./images/delayed-reward.webp";
import rewardVsGoal from "./images/reward-vs-goal.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { GreenhouseLab } from "./GreenhouseLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="06"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Reinforcement learning"
      lead="Instead of learning from a table of right answers, a reinforcement learning system tries actions in an environment and learns from numerical feedback called rewards—even when those rewards arrive late or point to the wrong shortcut."
    >
      <section id="loop">
        <h2 tabIndex={-1}>The reinforcement learning loop.</h2>
        <p>
          In Lesson 4.1, you saw <strong>supervised learning</strong>, where a
          model learns from examples paired with target labels or values.{" "}
          <strong>Reinforcement learning</strong> works differently: nobody
          supplies a right answer for every step upfront.
        </p>
        <p>
          Instead, learning happens through a repeating loop of trial and
          feedback built from five pieces:
        </p>
        <div className={styles.partGrid}>
          <div className={styles.partCard}>
            <h3>Agent</h3>
            <p>The decision-maker that chooses what to do next.</p>
          </div>
          <div className={styles.partCard}>
            <h3>Environment</h3>
            <p>
              The world or problem the agent acts inside and gets feedback from.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>State</h3>
            <p>
              The current situation the agent observes, such as its position.
            </p>
          </div>
          <div className={styles.partCard}>
            <h3>Action</h3>
            <p>One choice the agent makes in the current state.</p>
          </div>
          <div className={styles.partCard}>
            <h3>Reward</h3>
            <p>
              A numerical signal from the environment scoring what happened
              after an action.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <strong>Running example: Pip’s greenhouse grid</strong>
          <p>
            Pip (an invented watering bot for this lesson) starts carrying water
            at the top-left corner of a tiny 4×3 greenhouse grid with a 10-step
            battery limit. Pip’s job is to reach a thirsty{" "}
            <strong>Seedling</strong> (+10) while avoiding two wet{" "}
            <strong>Puddles</strong> (−5).
          </p>
        </div>
        <p>
          On each turn, the agent (Pip) checks its state—which tile it is on and
          how many steps remain—and picks an action (Up, Down, Left, or Right).
          The environment (the greenhouse grid) moves Pip to the next tile and
          returns the next state plus a designed reward score—for instance, 0 on
          a safe tile, −5 on a puddle, or +10 at the seedling.
        </p>
        <p>
          In everyday life, this feels a bit like training a puppy with treats:
          the puppy tries actions and repeats the ones that earn treats. Unlike
          a puppy, though, a software agent does not feel pleasure or understand
          your wishes—it updates internal numbers to favor choices that tend to
          earn more reward over time.
        </p>
        <figure className={styles.figure}>
          <Image
            src={rlLoop}
            alt="Infographic titled The Reinforcement Learning Loop: an Agent card (Pip watering bot) sends an Action arrow (Move Down) to an Environment card (schematic Greenhouse grid icon), which sends a Next state and reward arrow (New tile, 0) back to Agent. Bottom cards show an Analogy (training a puppy with treats) and Key takeaways (agent picks an action in a state, environment returns next state and reward, no answer key is given upfront)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Every step in reinforcement learning follows the same cycle: action
            out, next state and reward back. (The greenhouse icon is schematic;
            the interactive grid below shows the exact tiles.)
          </figcaption>
        </figure>
        <p>
          In the rest of this lesson, you will see why rewards can arrive late
          after earlier moves, why a high reward is not the same as “correct,”
          guide Pip across the grid yourself, and check your understanding.
        </p>
      </section>

      <section id="delayed-rewards">
        <h2 tabIndex={-1}>Why rewards can arrive late.</h2>
        <p>
          In Pip’s greenhouse, stepping into a puddle gives −5 right away, and
          safe tiles give 0 right away. A <strong>delayed reward</strong> is a
          payoff that arrives later than the earlier action—or sequence of
          actions—that helped earn it.
        </p>
        <div className={styles.example}>
          <strong>In Pip’s greenhouse: five steps to one payoff</strong>
          <p>
            To steer around both puddles and reach the seedling, Pip takes five
            moves: Down, Down, Right, Right, Right. The +10 payoff arrives right
            when Pip reaches the seedling on step 5, making it delayed relative
            to steps 1 through 4 that each scored 0.
          </p>
        </div>
        <p>
          That delay creates a tricky puzzle called{" "}
          <strong>credit assignment</strong>: when +10 finally arrives on step
          5, the agent has to figure out which earlier moves actually helped
          earn it. If Pip wandered in a circle first, only some of the earlier
          steps deserved credit.
        </p>
        <p>
          Cooking a pot of soup works the same way. Chopping vegetables and
          simmering for twenty minutes give no immediate taste payoff—you only
          find out at the end whether the early steps paid off.
        </p>
        <figure className={styles.figure}>
          <Image
            src={delayedReward}
            alt="Infographic titled Why Rewards Can Arrive Late: five forward step cards show Step 1 through Step 4 scoring 0 and Step 5 scoring +10 (Seedling watered), with a dashed backward arrow underneath from Step 5 toward earlier steps labeled Which earlier moves helped?. Bottom cards show an Analogy (cooking a pot of soup) and Key takeaways (helpful steps can score 0 at first, payoff often arrives many moves later, learning must credit earlier choices)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Time moves forward through each step, while learning has to trace
            credit backward from a late payoff.
          </figcaption>
        </figure>
      </section>

      <section id="reward-not-correct">
        <h2 tabIndex={-1}>Why a high reward does not mean “correct.”</h2>
        <p>
          It is tempting to assume that a high reward means the agent did the
          right thing. Sometimes a reward tracks the intended goal directly,
          like Pip’s +10 for watering the seedling—but designers also add a{" "}
          <strong>proxy</strong> (a stand-in score meant to encourage progress
          toward the real goal), and a poorly chosen proxy can backfire.
        </p>
        <div className={styles.example}>
          <strong>In Pip’s greenhouse: the +4 Water Tap shortcut</strong>
          <p>
            Pip already starts carrying water, so the Water Tap next to Start is
            optional. Suppose a designer adds a +4 proxy bonus every time Pip
            visits that tap within the 10-step battery limit—using tap visits as
            a stand-in for useful movement even though visiting the tap does not
            water the seedling.
          </p>
        </div>
        <p>Now compare two routes under that exact same +4 tap-bonus rule:</p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <div className={styles.compareMeta}>
              <span className={styles.badge}>5 steps</span>
              <span className={`${styles.badge} ${styles.badgeGood}`}>
                +10 · Goal met
              </span>
            </div>
            <p>
              <strong>Direct route:</strong> Pip walks around the puddles and
              waters the seedling. The real task succeeds, and the run ends with
              +10.
            </p>
          </div>
          <div className={styles.compareCard}>
            <div className={styles.compareMeta}>
              <span className={styles.badge}>10 steps</span>
              <span className={`${styles.badge} ${styles.badgeWarn}`}>
                +20 · Seedling still dry
              </span>
            </div>
            <p>
              <strong>Tap loop:</strong> Pip bounces between Start and the Water
              Tap five times, earning +20—the highest possible score in 10
              steps—without ever watering the seedling.
            </p>
          </div>
        </div>
        <p>
          Pip did not “cheat” or break a rule—it maximized the score it was
          given. In the real world, paying a customer-support team purely for
          the shortest phone calls can create the same mismatch: staff can hit
          high scores by hanging up early instead of solving problems.
        </p>
        <figure className={styles.figure}>
          <Image
            src={rewardVsGoal}
            alt="Infographic titled Reward Is Not Always Correct with subtitle Same +4 tap-bonus rule, two very different routes: left green card shows Direct route, Waters seedling, +10, Goal met; right red card shows Tap loop, Loops on tap (10 steps), +20, Seedling still dry. Bottom cards show an Analogy (paying bonuses only for short calls) and Key takeaways (agents optimize the score they are given, a flawed proxy can beat the real goal, high reward does not guarantee right behavior)."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Under the same flawed +4 tap-bonus rule, looping on the tap beats
            watering the seedling while failing the real goal.
          </figcaption>
        </figure>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Guide Pip across the greenhouse.</h2>
        <p>
          Try both reward rules in this small grid simulation. Notice how quiet
          steps build toward a delayed payoff—and how a flawed bonus can make a
          useless loop outscore the real goal.
        </p>
        <ol className={styles.steps}>
          <li>
            Start in <strong>Goal reward (delayed)</strong> mode and step Pip
            around the puddles with the direction buttons (or tab to the grid
            and use arrow keys) until you reach the seedling.
          </li>
          <li>
            Click <strong>Show Pip’s example run</strong> to see the 5-step safe
            path score 0 on steps 1–4 and +10 on step 5.
          </li>
          <li>
            Switch to <strong>Flawed tap bonus (+4)</strong> and click{" "}
            <strong>Show Pip’s example run</strong> to see Pip loop on the tap
            for +20 while leaving the seedling dry.
          </li>
          <li>
            Click <strong>Reset</strong> at any time to test your own route.
          </li>
        </ol>
        <GreenhouseLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where reinforcement learning fits—and its limits.</h2>
        <p>
          Reinforcement learning shines when you can let an agent practice many
          times—often inside a simulator—and score how well a sequence of
          decisions worked. Feedback-based reward training is also one of the
          techniques used alongside other methods when shaping modern AI
          assistants.
        </p>
        <p>
          At the same time, RL has clear limits. Real-world trial and error can
          be slow or unsafe, delayed rewards can require many runs to connect
          late payoffs to earlier moves, and writing a reward rule that cannot
          be gamed is surprisingly hard. In the next lesson (4.7), you will see
          how <strong>search and planning</strong> explore routes using known
          rules instead of learning from reward scores.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does a negative reward mean the agent feels “punished”?
            </strong>
            <p>
              No. A negative number lowers the immediate score for that choice,
              though an agent can still take a short-term penalty if that move
              leads to a larger payoff later.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Does adding more intermediate rewards guarantee better behavior?
            </strong>
            <p>
              No. Extra proxy bonuses can accidentally create loops or shortcuts
              that raise the score without accomplishing the real goal.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              How is reinforcement learning different from supervised learning?
            </strong>
            <p>
              Supervised learning provides target labels or values for each
              example upfront; reinforcement learning gives a feedback
              score—often delayed—after the agent takes actions in an
              environment.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A warehouse team trains a cleaning robot with reinforcement learning to keep the floor spotless. Their reward rule gives +1 each time the dust bin collects dirt, and 0 for everything else. After training, the robot dumps dirt out and vacuums the same pile over and over to earn high scores. What does this best show?"
        options={[
          "The robot broke its reward rule and ignored the scores it was given.",
          "A high score shows what the reward rule favors, even if the warehouse stays dirty.",
          "Reinforcement learning cannot work unless every single move receives an immediate nonzero payoff.",
          "The robot needed supervised learning because reinforcement learning cannot use negative numbers.",
        ]}
        correct={1}
        explanation="The robot optimized the exact score it was given (+1 per dirt pickup). Because the reward rule did not penalize dumping dirt or measure overall floor cleanliness, a high score reflected the flawed rule rather than the team’s real goal."
        wrongFeedback={[
          "The robot followed the reward rule strictly—every time it vacuumed dirt, it earned +1. The problem was the reward rule itself, not that the robot ignored it.",
          "",
          "Reinforcement learning can learn from delayed rewards even when many intermediate moves score 0 instead of giving an immediate nonzero payoff. Here, the problem was a proxy bonus that could be gamed.",
          "Reinforcement learning routinely uses negative rewards (penalties) as well as positive ones. The flaw here is how the reward was designed, not a rule against negative numbers.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Rewards steer behavior, not truth.</strong> In reinforcement
            learning, an <strong>agent</strong> takes an <strong>action</strong>{" "}
            in an <strong>environment</strong> and gets back the next{" "}
            <strong>state</strong> and a <strong>reward</strong>. Payoffs are
            often <strong>delayed</strong>—and because an agent optimizes the
            score it is given, a high reward does not guarantee the behavior you
            actually wanted.
          </p>
          <p className="micro">
            Ready to continue? Return to{" "}
            <Link className="text-link" href="/course/chapter-4">
              How Machines Learn
            </Link>
            .
          </p>
        </div>
      </section>
    </LessonFrame>
  );
}

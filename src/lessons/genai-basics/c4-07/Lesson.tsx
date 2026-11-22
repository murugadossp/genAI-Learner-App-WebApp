import Image from "next/image";
import Link from "next/link";
import searchToPlan from "./images/search-to-plan.webp";
import planningVsLearning from "./images/planning-vs-learning.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { MazeLab } from "./MazeLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="07"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Search and planning"
      lead="Not every smart AI decision comes from training on past examples. Sometimes a system uses a map and a set of rules to test moves ahead and build a step-by-step plan."
    >
      <section id="what-is-search">
        <h2 tabIndex={-1}>How search builds a plan.</h2>
        <p>
          In this lesson, you will see how <strong>search</strong> builds a{" "}
          <strong>plan</strong>, compare three search orders, tell planning
          apart from <strong>learning</strong>, explore a live maze, and see
          where pure search hits a wall.
        </p>
        <p>Start with five plain terms grounded in a simple floor grid:</p>
        <ul>
          <li>
            <strong>State:</strong> a possible situation—such as any square a
            robot could stand on in a warehouse.
          </li>
          <li>
            <strong>Move:</strong> one allowed step from a state to a
            neighboring state (up, down, left, or right without hitting a wall).
          </li>
          <li>
            <strong>Goal:</strong> the target state the system wants to reach.
          </li>
          <li>
            <strong>Branch:</strong> one sequence of moves splitting off at a
            fork in the map.
          </li>
          <li>
            <strong>Search and plan:</strong> <em>search</em> tests branches on
            the map to find a valid route, and the <em>plan</em> is the ordered
            list of moves from start to goal.
          </li>
        </ul>
        <div className={styles.example}>
          <strong>Running example: Rover in a 5×5 warehouse</strong>
          <p>
            Rover (an invented toy robot for this lesson) needs to move from a
            Start square to a Goal square on a 5×5 warehouse floor without
            bumping into stacked crate walls.
          </p>
        </div>
        <p>
          Think of tracing a paper maze with your finger before walking through
          it. Your finger tests branches on the page, stops at dead ends, and
          only commits to a route once it sees a clear path to the exit.
        </p>
        <figure className={styles.figure}>
          <Image
            src={searchToPlan}
            alt="Diagram titled Search and Planning: Start, goal and map rules flow into Search tests branches, which splits into a Dead end branch that stops and a Route to goal found branch that leads to a Step-by-step plan. Bottom cards show an Analogy of tracing a paper maze with your finger before walking and Key takeaways: Uses a map and allowed moves, Tests branches before acting, Outputs an ordered list of steps."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Search tests branches on a map before Rover moves, discarding dead
            ends and turning a found route into a step-by-step plan.
          </figcaption>
        </figure>
      </section>

      <section id="search-strategies">
        <h2 tabIndex={-1}>How search chooses the next square.</h2>
        <p>
          When the search checks a fork on the map, it has to decide which open
          square to check next. Different search orders inspect different
          squares and can even return different routes.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>1. Layer-by-layer (BFS)</h3>
            <p>
              <strong>Breadth-first search</strong> checks squares in order of
              fewest steps from Start—starting at Start (0 steps), then all
              squares 1 step away, then 2 steps away, and so on until it selects
              Goal.
            </p>
            <p className="micro">
              <strong>Trade-off:</strong> Guaranteed to find a fewest-step route
              when every step costs the same, though it often checks many
              squares.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Looking for a quiet study room
              by checking rooms one doorway away first, then two doorways away.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>2. Corridor-first (DFS)</h3>
            <p>
              <strong>Depth-first search</strong> follows its current branch
              until no unchecked legal moves remain, then{" "}
              <strong>backtracks</strong> to the most recent fork with an
              untried option.
            </p>
            <p className="micro">
              <strong>Trade-off:</strong> Can reach the goal quickly on a lucky
              branch, or wander into a much longer detour.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Walking straight down one
              library wing until a dead end, then turning back to the last
              hallway fork.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>3. Goal-guided (Heuristic)</h3>
            <p>
              <strong>Greedy goal-guided search</strong> uses a{" "}
              <strong>heuristic</strong>—a rough distance estimate (here, grid
              steps to Goal ignoring walls)—to pick the closest-looking square
              from <em>all</em> discovered-but-unchecked squares on its waiting
              list.
            </p>
            <p className="micro">
              <strong>Trade-off:</strong> Often checks fewer squares, but walls
              can mislead the estimate into a longer detour than layer-by-layer
              search.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> Walking toward the exit sign
              you can see across a hall, even if a closed door forces a detour.
            </p>
          </div>
        </div>
        <div className={styles.example}>
          <strong>On Rover’s 5×5 Warehouse aisle map</strong>
          <p>
            Using our toy rules (Right, Down, Left, Up neighbor order; counting
            Start and Goal when selected; earliest-discovered tie-break for
            Goal-guided): Layer-by-layer checks 14 squares for a 5-step route,
            Corridor-first checks 12 squares for an 11-step detour, and
            Goal-guided checks 8 squares for the 5-step route.
          </p>
        </div>
      </section>

      <section id="planning-vs-learning">
        <h2 tabIndex={-1}>Why planning is not learning.</h2>
        <p>
          A common misconception is that because a search program tests moves
          and backtracks away from dead ends, it must be learning. To tell them
          apart, ask one question:{" "}
          <strong>where does the answer come from?</strong>
        </p>
        <div className={styles.compareGrid}>
          <div className={styles.compareCard}>
            <h3>Planning (Search)</h3>
            <p>
              Starts from an explicit start state, goal, and map of allowed
              moves. It tests future sequences of moves to produce a plan.
            </p>
            <p className="micro">
              <strong>Key clue:</strong> Works on a brand-new warehouse map with
              zero past examples. Keeping track of visited squares is search
              bookkeeping for this run, not learning.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> A GPS app searching a road map
              for turns from your home to a new clinic.
            </p>
          </div>
          <div className={styles.compareCard}>
            <h3>Learning (From data)</h3>
            <p>
              Uses data or past experience to adjust a model’s{" "}
              <strong>internal settings</strong> (the numbers that shape its
              predictions) so it handles future cases better.
            </p>
            <p className="micro">
              <strong>Key clue:</strong> Spots patterns across examples instead
              of stepping through a rulebook of moves one by one.
            </p>
            <p className="micro">
              <strong>Everyday example:</strong> An email filter adjusting its
              settings from labeled messages to recognize spam patterns.
            </p>
          </div>
        </div>
        <figure className={styles.figure}>
          <Image
            src={planningVsLearning}
            alt="Diagram titled Planning vs. Learning comparing two separate left-to-right tracks: Planning (Search) goes from Start, goal and map to Test moves ahead to Step-by-step plan; Learning (From data) goes from Past examples to Adjust settings to Spot patterns. Bottom cards show an Analogy of reading a road map versus spotting 5 p.m. traffic patterns and Key takeaways: Planning works on brand-new maps, Learning adapts from experience, Real AI often combines both."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Planning searches a map and rules for a route; learning adjusts
            internal settings from experience. Many real systems combine both.
          </figcaption>
        </figure>
        <p>
          In practice, real AI systems often <strong>combine</strong> both
          ideas. A navigation app can use a learned model to predict 5 p.m.
          traffic slowdowns, then run search on those updated travel times to
          plan your route; game systems like AlphaGo pair a learned model that
          scores how strong a board position looks with search that tests future
          moves ahead.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Maze route explorer.</h2>
        <p>
          Watch Rover test squares on a simplified 5×5 warehouse grid. Notice
          how changing the crate walls lets Rover replan right away without any
          training examples.
        </p>
        <ol className={styles.steps}>
          <li>
            On <strong>Warehouse aisle</strong>, click{" "}
            <strong>Run to goal</strong> with{" "}
            <strong>Layer-by-layer (BFS)</strong>, then switch to{" "}
            <strong>Corridor-first (DFS)</strong> and{" "}
            <strong>Goal-guided (Heuristic)</strong> to compare squares checked
            and route length.
          </li>
          <li>
            Switch to <strong>Detour trap</strong> and compare{" "}
            <strong>Layer-by-layer (BFS)</strong> (6 steps) with{" "}
            <strong>Goal-guided (Heuristic)</strong> (8 steps) to see why a
            distance estimate can still take a longer detour.
          </li>
          <li>
            Still on <strong>Detour trap</strong> with{" "}
            <strong>Goal-guided (Heuristic)</strong>, click{" "}
            <strong>Row 4, Col 1</strong> to place a crate wall, then click{" "}
            <strong>Run to goal</strong> to watch Rover replan immediately—the
            route shortens from 8 steps to 6.
          </li>
          <li>
            Click <strong>Reset map</strong> to restore the preset walls.
          </li>
        </ol>
        <MazeLab />
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where search hits a wall.</h2>
        <p>
          Search and planning are reliable when rules and maps are clear, but
          pure search has real limits:
        </p>
        <ul>
          <li>
            <strong>Branching explosion:</strong> When every step opens dozens
            of choices (as in complex board games or open-ended language), the
            number of branches grows faster than time and memory allow.
          </li>
          <li>
            <strong>Stale or missing maps:</strong> If someone moves a crate in
            the real warehouse and the map is not updated, Rover’s plan can run
            straight into a surprise obstacle.
          </li>
          <li>
            <strong>No automatic improvement across runs:</strong> In this maze,
            search starts fresh on each run. Even when a real planner caches a
            past route to save time, search by itself does not adjust internal
            model settings from data unless paired with a learning component.
          </li>
        </ul>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              When search backtracks out of a dead end, is it learning from its
              mistake?
            </strong>
            <p>
              No. Marking a square as visited is temporary bookkeeping for the
              current search so Rover does not walk in circles. It does not
              change how Rover will handle future warehouses.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Does goal-guided search always find the shortest route?
            </strong>
            <p>
              No. Because a simple distance estimate ignores walls, greedy
              goal-guided search can take a longer detour, as you saw on the
              Detour trap map. On an equal-cost, four-direction grid like this
              maze, more advanced planners (such as A* search) combine steps
              taken so far with the grid-step distance estimate to find a
              shortest route.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>Can one AI system use both planning and learning?</strong>
            <p>
              Yes. Combining learned estimates with step-by-step search lets
              systems handle huge spaces that neither method solves well alone.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A warehouse robot receives the floor map of a brand-new building it has never visited before, with zero past delivery logs. Using the map and its allowed moves (up, down, left, right without hitting crates), it tests branches ahead of time and outputs a 9-step route from the loading dock to the packing table. Which statement best describes what the robot did?"
        options={[
          "It used machine learning to train on the building’s past delivery logs.",
          "It used search and planning to find a sequence of allowed moves from the map and rules.",
          "It moved randomly in the real warehouse until it bumped into the packing table.",
          "Testing possible routes on this map automatically trained the robot to navigate future buildings.",
        ]}
        correct={1}
        explanation="The robot had zero past delivery logs and used an explicit map plus allowed moves to test branches ahead of time and build a 9-step plan—classic search and planning."
        wrongFeedback={[
          "The scenario states the robot had zero past delivery logs, so it could not have trained on past deliveries from this building.",
          "",
          "The scenario states the robot tested branches ahead of time using the floor map rather than bumping around randomly in the real warehouse.",
          "Tracking branches during one search is bookkeeping for the current map, not learning—pure search does not automatically train the robot for future buildings.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>Planning searches rules; learning adapts from data.</strong>{" "}
            Search tests allowed moves on a map to build a step-by-step plan
            toward a goal—even on a brand-new map with zero past examples. Real
            AI systems often combine both, using learned estimates to guide
            smarter search.
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

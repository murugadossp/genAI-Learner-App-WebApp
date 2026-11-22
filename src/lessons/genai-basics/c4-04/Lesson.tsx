import Image from "next/image";
import Link from "next/link";
import unlabeledToClusters from "./images/unlabeled-to-clusters.webp";
import clusterVsCategory from "./images/cluster-vs-category.webp";
import { LessonFrame } from "../../LessonFrame";
import { Check } from "../../Check";
import { ClusteringLab } from "./ClusteringLab";
import styles from "./lesson.module.css";

export default function Lesson() {
  return (
    <LessonFrame
      number="04"
      chapter={{
        label: "How Machines Learn",
        href: "/course/chapter-4",
      }}
      title="Unsupervised learning and clustering"
      lead="Not every dataset comes with answer labels. Unsupervised learning looks for structure in unlabeled data—and clustering groups similar items together, even when those groups do not match human categories."
    >
      <section id="no-labels">
        <h2 tabIndex={-1}>Learning without answer labels.</h2>
        <p>
          In Lesson 4.1, you saw <strong>supervised learning</strong>, where
          each training example comes with a known target label (such as “spam”
          or “not spam”). Sometimes you have examples and their measurable
          details, but no target labels at all.
        </p>
        <p>
          Imagine pouring a jar of mixed buttons onto a table with no category
          names written down. You can still sort them into piles by what looks
          alike—size, color, or number of holes—without anyone telling you what
          to call each pile.
        </p>
        <div className={styles.example}>
          <strong>Running example: Priya’s community library</strong>
          <p>
            Priya (an invented character for this lesson) has 12 books whose
            existing genre shelf stickers were peeled off. For each book, her
            checkout log only shows two numbers: page count and typical days
            kept.
          </p>
        </div>
        <p>
          Before we look at how a computer groups Priya’s books, here are the
          six terms this lesson uses in order:
        </p>
        <ul className={styles.termList}>
          <li className={styles.termItem}>
            <p>
              <strong>Unsupervised learning:</strong> finding patterns in
              examples that have input features but no target answer labels.
            </p>
          </li>
          <li className={styles.termItem}>
            <p>
              <strong>Features:</strong> measurable details recorded for each
              example (recapped from Lessons 1.3 and 4.1)—here, pages and days
              kept.
            </p>
          </li>
          <li className={styles.termItem}>
            <p>
              <strong>Similarity:</strong> how close two examples are on the
              chosen features under a comparison rule (in this lab,
              straight-line distance after placing both features on a shared
              scale).
            </p>
          </li>
          <li className={styles.termItem}>
            <p>
              <strong>Clustering:</strong> an unsupervised method that aims to
              group examples so items in the same group are similar under a
              chosen distance rule.
            </p>
          </li>
          <li className={styles.termItem}>
            <p>
              <strong>Cluster:</strong> one unnamed group produced by clustering
              (such as Cluster 1, Cluster 2, or Cluster 3).
            </p>
          </li>
          <li className={styles.termItem}>
            <p>
              <strong>Human category (existing shelf label):</strong> a
              meaningful label people use for a real purpose, such as the
              library’s original genre shelves (Picture books, Cookbooks, or
              Novels).
            </p>
          </li>
        </ul>
        <figure className={styles.figure}>
          <Image
            src={unlabeledToClusters}
            alt="Schematic diagram titled Unsupervised clustering: Unlabeled books with two input features (Pages and Days kept) and a note reading No genre tags flow into Group by similarity and produce Unnamed clusters labelled Cluster 1, Cluster 2, and Cluster 3, with an Analogy card comparing this to sorting mixed buttons by size and color without preset labels and a Key takeaways card noting no preset labels and unnamed clusters."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Schematic overview: unsupervised clustering takes books without
            answer labels and outputs unnamed groups—no genre names are created
            automatically.
          </figcaption>
        </figure>
      </section>

      <section id="similarity">
        <h2 tabIndex={-1}>How clustering groups data by similarity.</h2>
        <p>
          When each of Priya’s books is plotted by its two features—length in
          pages on the horizontal axis and typical days kept on the vertical
          axis—every book becomes a single dot. Clustering measures closeness
          between dots under a chosen distance rule and aims to put nearby dots
          into the same cluster.
        </p>
        <p>
          Because pages (0–400) and days kept (0–20) use different units, our
          chart puts both features on a shared square scale so visual closeness
          matches feature closeness: 40 pages and 2 checkout days span the exact
          same distance.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.infoCard}>
            <h3>1. Which features you choose</h3>
            <p>
              Changing the features changes what counts as “similar.” Grouping
              Priya’s books by pages and days kept could produce very different
              clusters than grouping them by publication year and cover price.
            </p>
          </div>
          <div className={styles.infoCard}>
            <h3>2. How many clusters you ask for</h3>
            <p>
              Many clustering methods ask you to choose the number of clusters
              ahead of time. Asking for 2, 3, or 4 groups can merge groups,
              split a tight group, or rearrange memberships across clusters.
            </p>
          </div>
        </div>
        <p>
          <strong>Everyday example:</strong> A music app grouping unlabeled
          tracks by tempo and loudness may place a classical lullaby and a quiet
          acoustic folk song in the same cluster, because on those two audio
          features they sit right next to each other.
        </p>
      </section>

      <section id="lab">
        <h2 tabIndex={-1}>Group Priya’s books by similarity.</h2>
        <p>
          In the lab below, each dot is one of Priya’s 12 invented books plotted
          by pages and days kept. Each cluster preset shows the precomputed
          grouping with the smallest total squared distance from each book dot
          to its own <strong>cluster center</strong> (the average position of
          the dots in that group) on this square scale, and the shelf toggle
          lets you compare those unnamed clusters against the library’s existing
          genre shelves.
        </p>
        <ol className={styles.steps}>
          <li>
            Start on <strong>No groups</strong>, inspect the books (by sight on
            the plot or by tabbing through the book points with your keyboard),
            and decide which books you would group together.
          </li>
          <li>
            Click <strong>3 clusters</strong> and compare the result with your
            guess—notice the groups are only named Cluster 1, Cluster 2, and
            Cluster 3.
          </li>
          <li>
            Try <strong>2 clusters</strong> and <strong>4 clusters</strong> to
            see how changing the requested count merges groups or splits the
            long-book group for these 12 books.
          </li>
          <li>
            Switch back to <strong>3 clusters</strong> and click{" "}
            <strong>Reveal human shelves</strong> to see which real library
            shelves landed inside each cluster.
          </li>
        </ol>
        <ClusteringLab />
      </section>

      <section id="clusters-vs-categories">
        <h2 tabIndex={-1}>Why a cluster may not match a human category.</h2>
        <p>
          A common mistake is treating every cluster as a real-world category.
          Sometimes a cluster lines up closely with a useful human label, and
          other times it mixes items that people keep apart.
        </p>
        <p>
          In Priya’s 3-cluster view, Cluster 1 groups four short books that
          readers return in 3 or 4 days. When you check the library’s existing
          shelves, that single cluster contains 2 Picture books, 1 Travel
          phrasebook, and 1 Poetry chapbook.
        </p>
        <p>
          The clustering rule did not make a mistake—it only saw pages and days
          kept. Because it never saw what the books are about, a person still
          has to inspect the cluster and decide whether it is useful for a task
          (like setting loan periods) or not (like shelving by genre).
        </p>
        <figure className={styles.figure}>
          <Image
            src={clusterVsCategory}
            alt="Diagram titled Cluster vs. human category: two separate cards on the left—Cluster 1 (Short books, kept briefly) and Existing library shelves (2 Picture books, 1 Travel, 1 Poetry)—both point right into Human review (Compare groups with real shelves), with an Analogy card about three different items sharing one drawer only because they fit and a Key takeaways card noting clustering only sees chosen features."
            sizes="(max-width: 760px) 100vw, 720px"
          />
          <figcaption className="micro">
            Existing library shelves come from the catalog, not from clustering.
            Human review compares the similarity group with real-world meaning.
          </figcaption>
        </figure>
        <p>
          <strong>Everyday example:</strong> An online store clustering shoppers
          by visits per week and amount spent may put a one-time holiday gift
          buyer and a regular weekly grocery shopper in the same cluster—even
          though they need very different recommendations.
        </p>
      </section>

      <section id="limits">
        <h2 tabIndex={-1}>Where clustering helps—and its limits.</h2>
        <p>
          Clustering is most helpful when you are exploring unlabeled data: it
          can surface broad patterns, suggest starter groups for a person to
          review, or help you visually spot isolated points that sit far from
          every group. (Some clustering algorithms also explicitly flag outliers
          as ungrouped, whereas the lab above assigns all 12 books to a
          cluster.)
        </p>
        <p>
          Keep three limits in mind: different features, scaling choices, or
          cluster counts can change the groups; clusters carry no built-in
          names; and real datasets often have borderline points sitting between
          groups.
        </p>
        <ul className={styles.qaList}>
          <li className={styles.qaItem}>
            <strong>
              Does unsupervised learning mean zero human involvement?
            </strong>
            <p>
              No. People still choose which data and features to include, how to
              scale them, which settings (like cluster count) to try, and how to
              interpret the resulting groups.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              If I already have labeled categories to predict, should I use
              clustering?
            </strong>
            <p>
              Usually not. When you have known target labels and want to predict
              them for new examples, supervised classification (Lesson 4.3) is a
              more direct fit.
            </p>
          </li>
          <li className={styles.qaItem}>
            <strong>
              Is clustering the only kind of unsupervised learning?
            </strong>
            <p>
              No. Clustering is one common approach; other unsupervised methods
              compress many features into fewer summaries or highlight unusual
              records.
            </p>
          </li>
        </ul>
      </section>

      <Check
        id="check"
        title="Check your understanding."
        question="A community center has 200 unlabeled gym visit records with only two features: visit length (minutes) and time of day. They run clustering with 3 groups. One cluster contains both retired morning walkers and office workers doing a quick workout before work. What is the best conclusion?"
        options={[
          "The clustering failed because it put two different kinds of people in the same group.",
          "The algorithm grouped visits using visit length and time of day; whether that group matches a useful membership category requires human inspection and further evidence.",
          "The system discovered a real hidden category that the center should automatically turn into one membership type.",
          "Clustering cannot group gym visits unless every member is labeled with their job first.",
        ]}
        correct={1}
        explanation="The scenario shows only that the algorithm grouped visits using visit length and time of day. Deciding whether that cluster corresponds to a useful membership category takes human inspection and further evidence."
        wrongFeedback={[
          "Mixing two different kinds of people does not establish a clustering failure—the algorithm was only given visit length and time of day, not who the visitors were.",
          "",
          "A cluster is only a similarity group on the chosen features, not proof of a ready-made membership category to adopt automatically.",
          "Unsupervised clustering works without target labels; adding job labels is not required to form clusters from visit length and time of day.",
        ]}
      />

      <section id="takeaway">
        <h2 tabIndex={-1}>Take this with you.</h2>
        <div className={styles.takeawayBox}>
          <p>
            <strong>
              Clusters are similarity groups, not automatic categories.
            </strong>{" "}
            Unsupervised learning finds structure without answer labels, and
            clustering groups items that look close on the features and settings
            you chose. Always inspect what sits inside a cluster before naming
            or acting on it.
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

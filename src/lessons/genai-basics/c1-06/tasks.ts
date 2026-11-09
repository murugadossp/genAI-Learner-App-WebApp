export type Stakes = "low" | "high";
export type Checkable = "easy" | "hard";

export const levels: Record<`${Stakes}-${Checkable}`, string> = {
  "low-easy": "Look it over yourself, then use it.",
  "low-hard":
    "No good check is available. The answer stays unconfirmed: go ahead knowing that, or choose another way.",
  "high-easy": "Check it against the source before you act.",
  "high-hard":
    "Do not rely on the AI alone. Get a reliable source or a qualified person before you act.",
};

export const cellLabels: Record<`${Stakes}-${Checkable}`, string> = {
  "low-easy": "Look it over, then use it",
  "low-hard": "Unconfirmed: proceed knowing that, or choose another way",
  "high-easy": "Check against the source first",
  "high-hard":
    "Not on the AI alone: get a reliable source or a qualified person",
};

export const tasks: {
  text: string;
  stakes: Stakes;
  checkable: Checkable;
  stakesWhy: string;
  checkWhy: string;
}[] = [
  {
    text: "Sam asks for a friendlier wording of a short text to a friend about meeting at 6. She will read the new text before sending it. A clumsy phrase would be a small embarrassment.",
    stakes: "low",
    checkable: "easy",
    stakesWhy:
      "a clumsy phrase in a friendly text is a small, easily fixed problem.",
    checkWhy:
      "Sam can judge on the spot whether the new wording says what she meant.",
  },
  {
    text: "Sam asks for eight name ideas for the school bake-sale stall. She wants names that are short and funny, and she will pick one she likes.",
    stakes: "low",
    checkable: "easy",
    stakesWhy: "a name she does not like is easily dropped.",
    checkWhy:
      "Sam can judge each name right away against her own wish for short and funny.",
  },
  {
    text: "Sam is choosing between two small cafés in a town she has never visited. She asks which has better coffee. She cannot ask anyone, and she has no reliable information about either café. A wrong pick means an average coffee.",
    stakes: "low",
    checkable: "hard",
    stakesWhy: "an average coffee is a small, easily accepted cost.",
    checkWhy: "nothing reliable is in front of Sam to compare the answer with.",
  },
  {
    text: "Sam asks when a scholarship application closes. Missing the deadline would lose her the place. The official application page is open on her screen and shows the closing date.",
    stakes: "high",
    checkable: "easy",
    stakesWhy: "a missed deadline would lose Sam the place.",
    checkWhy:
      "the official page is open on her screen, so she can compare the date with it in seconds.",
  },
  {
    text: "Sam asks for five word-for-word quotes, with page numbers, from a library book for an essay that decides whether she passes a course. The library is closed this week, and she has no other reliable copy of the book.",
    stakes: "high",
    checkable: "hard",
    stakesWhy: "a wrong or made-up quote could cost Sam a pass in the course.",
    checkWhy:
      "without the book, Sam has nothing reliable to compare the quotes and page numbers with.",
  },
  {
    text: "Sam asks whether she can leave her rental agreement early without a penalty. The agreement uses legal wording she cannot follow. No qualified adviser or clear official explanation is available to her right now. A wrong answer could cost her a lot of money.",
    stakes: "high",
    checkable: "hard",
    stakesWhy: "acting on a wrong answer could cost Sam a lot of money.",
    checkWhy:
      "Sam cannot read the wording herself and has no reliable explanation to compare the answer with.",
  },
];

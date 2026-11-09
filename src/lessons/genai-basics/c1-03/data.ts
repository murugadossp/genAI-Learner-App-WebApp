export const columns = ["Colour", "Shape", "Size", "Fruit"] as const;

// Toy data, invented for this lesson. Five rows is far too few for real learning.
export const rows: string[][] = [
  ["Yellow", "Long", "Medium", "Banana"],
  ["Red", "Round", "Small", "Cherry"],
  ["Yellow", "Oval", "Medium", "Lemon"],
  ["Green", "Round", "Small", "Grape"],
  ["Orange", "Round", "Medium", "Orange"],
];

export type Role = "Feature" | "Label";

export const goals = [
  {
    id: "name",
    short: "Goal A: name the fruit",
    text: "Goal A: the packing machine should name each fruit.",
    // roles by column index: Colour, Shape, Size, Fruit
    roles: ["Feature", "Feature", "Feature", "Label"] as Role[],
    why: [
      "The camera can see the colour before anyone names the fruit, so it is a clue.",
      "The camera can see the shape before anyone names the fruit, so it is a clue.",
      "The camera can see the size before anyone names the fruit, so it is a clue.",
      "The fruit’s name is the answer this goal asks for, so it is the label.",
    ],
  },
  {
    id: "size",
    short: "Goal B: guess the fruit’s size",
    text: "Goal B: pretend the camera cannot judge size, and the machine should guess how big each fruit is from the other columns.",
    roles: ["Feature", "Feature", "Label", "Feature"] as Role[],
    why: [
      "Colour is known up front and helps guess the size, so it is a clue.",
      "Shape is known up front and helps guess the size, so it is a clue.",
      "The size is the answer this goal asks for, so it is the label. In Goal A the same column was a clue.",
      "Here the name is known up front and helps guess the size, so it is a clue. In Goal A the same column was the label.",
    ],
  },
];

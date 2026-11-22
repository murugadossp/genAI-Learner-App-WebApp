export interface TrainingEmail {
  id: string;
  knownSender: boolean;
  unknownLink: boolean;
  urgentPayment: boolean;
  target: "Spam" | "Not spam";
}

export const TRAINING_EMAILS: TrainingEmail[] = [
  {
    id: "Email 1",
    knownSender: false,
    unknownLink: true,
    urgentPayment: true,
    target: "Spam",
  },
  {
    id: "Email 2",
    knownSender: true,
    unknownLink: false,
    urgentPayment: false,
    target: "Not spam",
  },
  {
    id: "Email 3",
    knownSender: false,
    unknownLink: true,
    urgentPayment: false,
    target: "Spam",
  },
  {
    id: "Email 4",
    knownSender: true,
    unknownLink: false,
    urgentPayment: false,
    target: "Not spam",
  },
  {
    id: "Email 5",
    knownSender: false,
    unknownLink: false,
    urgentPayment: false,
    target: "Not spam",
  },
  {
    id: "Email 6",
    knownSender: false,
    unknownLink: true,
    urgentPayment: true,
    target: "Spam",
  },
];

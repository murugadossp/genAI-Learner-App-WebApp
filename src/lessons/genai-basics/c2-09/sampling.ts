// Shared by the lab (client) and the worked example (server), so both show
// the same numbers.
export function softmax(scores: number[], temperature: number) {
  if (temperature <= 0) {
    const top = scores.indexOf(Math.max(...scores));
    return scores.map((_, i) => (i === top ? 1 : 0));
  }
  const scaled = scores.map((s) => s / temperature);
  const m = Math.max(...scaled);
  const exps = scaled.map((s) => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// Toy curve-fitting used by the size dial. All data is invented and
// deterministic so the lesson and its tests always show the same numbers.
export type Point = { x: number; y: number };

export const MAX_PARAMS = 12;
export const NOISE = 0.12;

const hidden = (x: number) => 0.6 * Math.sin(2.4 * x) + 0.2 * x;

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}
function gauss(r: () => number) {
  const u = r() || 1e-9;
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}
function sample(n: number, seed: number): Point[] {
  const r = lcg(seed);
  return Array.from({ length: n }, (_, i) => {
    const x = -1 + (2 * (i + 0.5)) / n + (r() - 0.5) * (1.2 / n);
    return { x, y: hidden(x) + NOISE * gauss(r) };
  });
}

export const trainingSets = { few: sample(12, 7), many: sample(40, 5) };
export const heldOut = sample(80, 99);
export const hiddenPattern = hidden;

const basis = (x: number, k: number) =>
  Math.cos(k * Math.acos(Math.max(-1, Math.min(1, x))));

/** Least-squares fit with `m` adjustable numbers (Chebyshev basis). */
export function fit(points: Point[], m: number): number[] {
  const A = Array.from({ length: m }, () => new Array<number>(m + 1).fill(0));
  for (const p of points) {
    const b = Array.from({ length: m }, (_, k) => basis(p.x, k));
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) A[i][j] += b[i] * b[j];
      A[i][m] += b[i] * p.y;
    }
  }
  for (let i = 0; i < m; i++) A[i][i] += 1e-8;
  for (let c = 0; c < m; c++) {
    let p = c;
    for (let r = c + 1; r < m; r++)
      if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = c + 1; r < m; r++) {
      const k = A[r][c] / A[c][c];
      for (let j = c; j <= m; j++) A[r][j] -= k * A[c][j];
    }
  }
  const w = new Array<number>(m).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    let s = A[i][m];
    for (let j = i + 1; j < m; j++) s -= A[i][j] * w[j];
    w[i] = s / A[i][i];
  }
  return w;
}

export const predict = (w: number[], x: number) =>
  w.reduce((s, c, k) => s + c * basis(x, k), 0);

export const rmse = (w: number[], pts: Point[]) =>
  Math.sqrt(
    pts.reduce((s, p) => s + (predict(w, p.x) - p.y) ** 2, 0) / pts.length,
  );

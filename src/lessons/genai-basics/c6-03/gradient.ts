export const TARGET = 4;
export const START = 0;

export const lossAt = (prediction: number) => 0.5 * (prediction - TARGET) ** 2;

// For this toy squared-error bowl, the derivative is prediction - target.
export const gradientAt = (prediction: number) => prediction - TARGET;

export const stepDown = (prediction: number, learningRate: number) =>
  prediction - learningRate * gradientAt(prediction);

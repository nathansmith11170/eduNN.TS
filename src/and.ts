// This data is representing a logic gate, the AND
const training: number[][] = [
  [1, 1, 1],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];

let weights: number[] = [1, 1, 1];
const learning_rate = 0.001;

const sigmoid = (n: number): number => {
  return 1 / (1 + Math.exp(-n));
};

const relu = (n: number): number => {
  return Math.max(0, n);
};

const tanh = (n: number): number => Math.tanh(n);

const forward = (weights: number[], input: number[]) => {
  return relu(weights[0] + weights[1] * input[0] + weights[2] * input[1]);
};

const cost = (weights: number[], training: number[][]): number => {
  let mean_squared_diff = 0;
  for (const entry of training) {
    const result = forward(weights, entry);
    mean_squared_diff += (result - entry[2]) * (result - entry[2]) /
      training.length;
  }
  return mean_squared_diff;
};

const gradient = (weights: number[], training: number[][]): number[] => {
  const h = 0.0001;
  let gradient = [];
  gradient[0] = (cost([weights[0] + h, weights[1], weights[2]], training) -
    cost(weights, training)) / h * learning_rate;
  gradient[1] = (cost([weights[0], weights[1] + h, weights[2]], training) -
    cost(weights, training)) / h * learning_rate;
  gradient[2] = (cost([weights[0], weights[1], weights[2] + h], training) -
    cost(weights, training)) / h * learning_rate;
  return gradient;
};

const epochs = 1000 * 100;
console.log(
  `W0: ${weights[0].toPrecision(3)} W1: ${weights[1].toPrecision(3)} W2: ${
    weights[2].toPrecision(3)
  } Cost: ${cost(weights, training).toPrecision(3)}`,
);
for (let i = 0; i < epochs; i++) {
  const diffs = gradient(weights, training);
  weights = [
    weights[0] - diffs[0],
    weights[1] - diffs[1],
    weights[2] - diffs[2],
  ];
  if (i % 1000 === 0) {
    console.log(
      `W0: ${weights[0].toPrecision(3)} W1: ${weights[1].toPrecision(3)} W2: ${
        weights[2].toPrecision(3)
      } Cost: ${cost(weights, training).toPrecision(3)}`,
    );
  }
}
for (const entry of training) {
  console.log(`For input: ${entry} result is ${forward(weights, entry)}`);
}

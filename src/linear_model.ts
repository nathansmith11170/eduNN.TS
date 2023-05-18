console.log(
  'We are being very pedantic here, but this will walk through a very simple neural network.',
);
console.log(
  'Begin with one parameter, attempt to solve problem that can fit a linear model',
);
console.log(
  'here is our first set of data, representing some pattern we want to recognize\n',
);

const training_set_linear_through_origin = [
  [0, 0],
  [1, 3],
  [2, 6],
  [3, 9],
  [4, 12],
  [5, 15],
  [6, 18],
  [7, 21],
  [8, 24],
  [9, 27],
];
console.log(...training_set_linear_through_origin);

console.log('\nLet\'s train some neural network to predict this pattern!');
console.log('Well, this is easy y = 3x');
console.log(
  'So, can we get a model to adjust w1 to 3? let\'s start with a random weight.',
);

console.log('How is it?');
console.log('---------------------------');
console.log('Complete guesswork!');
let w1 = 6.14159;
for (const pair of training_set_linear_through_origin) {
  console.log(`Actual: ${pair[0] * w1} Expected: ${pair[1]}`);
}
console.log('---------------------------');

console.log(
  'As expected, it\'s usually not great. By chance one or two or even all the answers could be correct, but its rare',
);
console.log(
  'We need to correct w1 when it\'s wrong, and see if we get closer. Press enter when you\'re ready',
);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log('adjust?');
console.log(`We're getting closer?`);
w1 = 6.14159;
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1;
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`);
  const error = model_result - pair[1];
  w1 += error;
}
console.log('---------------------------');

console.log('A very simple measure of error doesn\'t get us any closer.');
console.log(
  'We need a better cost function! Cost functions are used to determine the error of the model',
);
console.log(
  'A common one is to square the difference - this means that the error cannot be negative which is nice for simple math',
);
console.log(
  'Let\'s figure out how wrong we are, on average, and then adjust our weight to see if we\'re closer',
);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log('average square');
console.log('First pass');
w1 = 6.14159;
let cumulative_square_error = 0;
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1;
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`);
  const error = model_result - pair[1];
  cumulative_square_error += error * error /
    training_set_linear_through_origin.length;
}
w1 -= cumulative_square_error;
console.log('Second pass');
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1;
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`);
}
console.log('---------------------------');

console.log('this is still horrible!');
console.log(
  'The first loop can be called some measure of how bad at prediction we are',
);
console.log('let\'s call that cost');
function cost(w: number, training: number[][]): number {
  let mean_square_error = 0;
  for (const pair of training) {
    const model_result = pair[0] * w;
    const error = model_result - pair[1];
    mean_square_error += error * error / training.length;
  }
  return mean_square_error;
}

console.log('given our initial guess, how bad are we really?');
w1 = 6.14159;
console.log(
  `The initial guess has cost of: ${
    cost(w1, training_set_linear_through_origin)
  }`,
);

console.log(
  'what we really want to do is minimize the cost function of our model by adjusting w1',
);
console.log(
  'this could get complicated, involving the derivative of some function',
);
console.log('But we\'re writing Typescript, not here to be nerds (lol)');
console.log(
  'the definition of derivative is the limit as h approaches 0 of the formula (f(x+h) - f(x)) / h',
);
console.log(
  'let\'s call h something small, like 0.001, and that\'s close enough',
);
const h = 0.001;
function derivativeCost(w: number, training: number[][]): number {
  return (cost(w + h, training) - cost(w, training)) / h;
}

console.log('we can adjust our weight by this messy approximation, right?');
console.log('---------------------------');
console.log('Use redneck derivative?');
w1 = 6.14159;
let next_best_guess = w1 -
  derivativeCost(w1, training_set_linear_through_origin);
console.log(
  `First guess cost: ${
    cost(w1, training_set_linear_through_origin)
  } Next guess cost: ${
    cost(next_best_guess, training_set_linear_through_origin)
  }`,
);
console.log('---------------------------');

console.log(
  'Well, we wanted 3 and started with 6.14159, but the next guess is -172!!',
);
console.log(
  'We overshot the correct answer. Let\'s just multiply the result of our redneck derivative by some tiny fraction',
);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log('Use a tiny redneck derivative?');
w1 = 6.14159;
next_best_guess = w1 -
  derivativeCost(w1, training_set_linear_through_origin) * 0.001;
console.log(
  `First guess cost: ${
    cost(w1, training_set_linear_through_origin)
  } Next guess cost: ${
    cost(next_best_guess, training_set_linear_through_origin)
  }`,
);
console.log('---------------------------');

console.log(
  'now we\'re taking a small step towards the correct answer! This is great. let\'s do that some more',
);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log('Use a tiny redneck derivative a bunch of times?');
w1 = 6.14159;
const learning_rate = 0.01;
let epochs = 10;
let i;
for (i = 0; i < epochs; i++) {
  next_best_guess = w1 -
    derivativeCost(w1, training_set_linear_through_origin) * learning_rate;
  console.log(
    `First guess cost: ${
      cost(w1, training_set_linear_through_origin)
    } Next guess cost: ${
      cost(next_best_guess, training_set_linear_through_origin)
    }`,
  );
  w1 = next_best_guess;
}
console.log(`w1 = ${w1}`);
console.log('---------------------------');

console.log('As you can see, our model is now pretty close to y = 3x!');
console.log('but...what if the data looks just a bit different?');
console.log('Can we still predict?');
const training_set_linear = [
  [0, 50],
  [1, 53],
  [2, 56],
  [3, 59],
  [4, 62],
  [5, 65],
  [6, 68],
  [7, 71],
  [8, 74],
  [9, 77],
  [10, 80],
  [11, 83],
];
console.log(...training_set_linear);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log('How about new training data - do we still converge on 3?');
w1 = 6.14159;
for (i = 0; i < epochs; i++) {
  next_best_guess = w1 -
    derivativeCost(w1, training_set_linear) * learning_rate;
  console.log(
    `First guess cost: ${
      cost(w1, training_set_linear_through_origin)
    } Next guess cost: ${
      cost(next_best_guess, training_set_linear_through_origin)
    }`,
  );
  w1 = next_best_guess;
}
console.log(`w1 = ${w1}`);
console.log('---------------------------');

console.log('what happened??! now it\'s all wrong');
console.log(
  'this is because we\'ve reached the limits of a single parameter model',
);
console.log(
  'In order to fit a linear pattern that doesn\'t pass through the origin, we need a bias parameter',
);
console.log('let\'s call that w0');
let weights = [1.771, 6.14159];

console.log(
  'We will need a new cost function that takes an array of weights instead of just one',
);
function betterCost(weights: number[], training: number[][]): number {
  let mean_square_error = 0;
  for (const pair of training) {
    const model_result = weights[0] + pair[0] * weights[1];
    const error = model_result - pair[1];
    mean_square_error += error * error / training.length;
  }
  return mean_square_error;
}

console.log('---------------------------');
console.log(
  'How about new training data with new weight- does w1 converge on 3?',
);
epochs = 50;
for (i = 0; i < epochs; i++) {
  const deltaw0 =
    (betterCost([weights[0] + h, weights[1]], training_set_linear) -
      betterCost(weights, training_set_linear)) / h * learning_rate;
  const deltaw1 =
    (betterCost([weights[0], weights[1] + h], training_set_linear) -
      betterCost(weights, training_set_linear)) / h * learning_rate;
  const next_weights = [weights[0] - deltaw0, weights[1] - deltaw1];
  console.log(
    `First guess cost: ${
      betterCost(weights, training_set_linear)
    } Next guess cost: ${betterCost(next_weights, training_set_linear)}`,
  );
  weights = next_weights;
}
console.log(...weights);
console.log('---------------------------');

console.log('It might converge, but w1 isn\'t really 3');
console.log('we expect y = 50 + 3x');
console.log(
  'This happens sometimes, so let\'s just pick new initial conditions and try again!',
);
await Deno.stdin.read(new Uint8Array(1));

console.log('---------------------------');
console.log(
  'How about new training data with novel start conditions - does w1 converge on 3 and w0 on 50?',
);
weights = [100, 1.14];
epochs = 1000;
for (i = 0; i < epochs; i++) {
  const deltaw0 =
    (betterCost([weights[0] + h, weights[1]], training_set_linear) -
      betterCost(weights, training_set_linear)) / h * learning_rate;
  const deltaw1 =
    (betterCost([weights[0], weights[1] + h], training_set_linear) -
      betterCost(weights, training_set_linear)) / h * learning_rate;
  const next_weights = [weights[0] - deltaw0, weights[1] - deltaw1];
  console.log(
    `First guess cost: ${
      betterCost(weights, training_set_linear)
    } Next guess cost: ${betterCost(next_weights, training_set_linear)}`,
  );
  weights = next_weights;
}
console.log(...weights);
console.log('---------------------------');

console.log('We fit the new equation with our model!');

console.log('This is the fundamentals of all NN');
console.log(
  'The deltaw0 and deltaw1 are approximating a gradient, and of course we used a fixed distance instead of a derivative',
);
console.log('This is also not optimized - backpropagation exists');
console.log('But this is the basics!');

console.log(
  'All thanks to tsoding over at twitch.television for inspiration: https://(www.twitch.tv//tsoding',
);

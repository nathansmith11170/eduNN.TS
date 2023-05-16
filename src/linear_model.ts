// We are being very pedantic here
// Begin with one parameter, attempt to solve problem that can fit a linear model

const training_set_linear_through_origin = [
  [0, 0], [1, 3], [2, 6], [3, 9], [4, 12],
  [5, 15], [6, 18], [7, 21], [8, 24], [9, 27]
]

// Train some neural network to predict this pattern!
// Well, this is easy y = 3x
// So, can we get a model to adjust w1 to 3? let's start with a random weight.


// How is it?
console.log('---------------------------')
console.log("Complete guesswork!")
let w1 = 6.14159
for (const pair of training_set_linear_through_origin) {
  console.log(`Actual: ${pair[0] * w1} Expected: ${pair[1]}`)
}
console.log('---------------------------')

// As expected, it's usually not great. By chance one or two or even all the answers could be correct, but its rare
// We need to correct w1 when it's wrong, and see if we get closer
console.log('---------------------------')
console.log('adjust?')
console.log(`We're getting closer?`)
w1 = 6.14159
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`)
  const error = model_result - pair[1]
  w1 += error
}
console.log('---------------------------')

// A very simple measure of error doesn't get us any closer.
// We need a better cost function! Cost functions are used to determine the error of the model
// A common one is to square the difference - this means that the error cannot be negative which is nice for simple math
// Let's figure out how wrong we are, on average, and then adjust our weight to see if we're closer
console.log('---------------------------')
console.log('average square')
console.log('First pass')
w1 = 6.14159
let cumulative_square_error = 0
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`)
  const error = model_result - pair[1]
  cumulative_square_error += error * error / training_set_linear_through_origin.length
}
w1 -= cumulative_square_error
console.log('Second pass')
for (const pair of training_set_linear_through_origin) {
  const model_result = pair[0] * w1
  console.log(`Actual: ${model_result} Expected: ${pair[1]} Weight: ${w1}`)
}
console.log('---------------------------')

// this is still horrible!
// The first loop can be called some measure of how bad at prediction we are
// let's call that cost
function cost(w: number, training: number[][]): number {
  let mean_square_error = 0
  for (const pair of training) {
    const model_result = pair[0] * w
    const error = model_result - pair[1]
    mean_square_error += error * error / training.length
  }
  return mean_square_error
}

// given our initial guess, how bad are we really?
w1 = 6.14159
console.log(`The initial guess has cost of: ${cost(w1, training_set_linear_through_origin)}`)

// what we really want to do is minimize the cost function of our model by adjusting w1
// this could get complicated, involving the derivative of some function
// But we're writing Typescript, not here to be nerds (lol)
// definition of derivative is the limit as h approaches 0 of the formula f(x+h) - f(x) / h
// let's call h something small and that's close enough
let h = 0.001
function derivativeCost (w: number, training: number[][]): number {
  return (cost(w + h, training) - cost(w, training)) / h
}

// we can adjust our weight by this messy approximation, right?
console.log('---------------------------')
console.log('Use redneck derivative?')
w1 = 6.14159
let next_best_guess = w1 - derivativeCost(w1, training_set_linear_through_origin)
console.log(`First guess: ${w1} Next guess: ${next_best_guess}`)
console.log('---------------------------')

// Well, we wanted 3 and started with 6.14159, but the next guess is -172!!
// We overshot the correct answer. Let's just multiply the result of our redneck derivative by some tiny fraction

console.log('---------------------------')
console.log('Use a tiny redneck derivative?')
w1 = 6.14159
next_best_guess = w1 - derivativeCost(w1, training_set_linear_through_origin) * 0.001
console.log(`First guess: ${w1} Next guess: ${next_best_guess}`)
console.log('---------------------------')

// now we're taking a small step towards the correct answer! This is great. let's do that some more

console.log('---------------------------')
console.log('Use a tiny redneck derivative a bunch of times?')
w1 = 6.14159
let learning_rate = 0.01
let epochs = 10
let i;
for (i = 0; i < epochs; i++) {
  next_best_guess = w1 - derivativeCost(w1, training_set_linear_through_origin) * learning_rate
  console.log(`Old guess: ${w1} New guess: ${next_best_guess}`)
  w1 = next_best_guess
}
console.log('---------------------------')

// As you can see, our model is now pretty close to y = 3x!
// but...what if the data looks just a bit different?
// Can we still predict?
const training_set_linear = [
  [0, 50], [1, 53], [2, 56], [3, 59], [4, 62], [5, 65],
  [6, 68], [7, 71], [8, 74], [9, 77], [10, 80], [11, 83]
]
console.log('---------------------------')
console.log('How about new training data - do we still converge on 3?')
w1 = 6.14159
for (i = 0; i < epochs; i++) {
  next_best_guess = w1 - derivativeCost(w1, training_set_linear) * learning_rate
  console.log(`Old guess: ${w1} New guess: ${next_best_guess}`)
  w1 = next_best_guess
}
console.log('---------------------------')

// what happened??! now it's all wrong
// this is because we've reached the limits of a single parameter model
// In order to fit a linear pattern that doesn't pass through the origin, we need a bias parameter
// let's call that w0
let weights = [ 1.771, 6.14159 ]

// We will need a new cost function that takes an array of weights
function betterCost(weights: number[], training: number[][]): number {
  let mean_square_error = 0
  for (const pair of training) {
    const model_result = weights[0] + pair[0] * weights[1]
    const error = model_result - pair[1]
    mean_square_error += error * error / training.length
  }
  return mean_square_error
}

console.log('---------------------------')
console.log('How about new training data with new weight- does w1 converge on 3?')
epochs = 50
for (i = 0; i < epochs; i++) {
  let deltaw0 = (betterCost([weights[0] + h, weights[1]], training_set_linear) - betterCost(weights, training_set_linear)) / h * learning_rate
  let deltaw1 = (betterCost([weights[0], weights[1] + h], training_set_linear) - betterCost(weights, training_set_linear)) / h * learning_rate
  let next_weights = [ weights[0] - deltaw0, weights[1] - deltaw1 ]
  console.log(`Old guesses: w0:${weights[0]},w1:${weights[1]} New guess: w0:${next_weights[0]},w1:${next_weights[1]}`)
  weights = next_weights
}
console.log('---------------------------')

// It converges, but w1 isn't 3?
// we expect y = 50 + 3x
// This happens sometimes, so let's just pick new initial conditions and try again!
console.log('---------------------------')
console.log('How about new training data with novel start conditions - does w1 converge on 3 and w0 on 50?')
weights = [ 100, 1.14 ]
epochs = 1000
for (i = 0; i < epochs; i++) {
  let deltaw0 = (betterCost([weights[0] + h, weights[1]], training_set_linear) - betterCost(weights, training_set_linear)) / h * learning_rate
  let deltaw1 = (betterCost([weights[0], weights[1] + h], training_set_linear) - betterCost(weights, training_set_linear)) / h * learning_rate
  let next_weights = [ weights[0] - deltaw0, weights[1] - deltaw1 ]
  if (i % 10 === 0) console.log(`Old guesses: w0:${weights[0]},w1:${weights[1]} New guess: w0:${next_weights[0]},w1:${next_weights[1]}`)
  weights = next_weights
}
console.log('---------------------------')

// We fit the new equation with our model!

// This is the fundamentals of all NN
// The deltaw0 and deltaw1 are approximating a gradient, and of course we used a fixed distance instead of a derivative
// This is also not optimized - backpropagation exists
// But this is the basics!

// All thanks to tsoding over at twitch.television for inspiration: https://www.twitch.tv/tsoding

var fullColorHex = function(r,g,b) {
  let lower = 0
  let upper = 255
  r = clamp(r, lower, upper)
  g = clamp(g, lower, upper)
  b = clamp(b, lower, upper)
  var rgbToHex = function (rgb) { 
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
         hex = "0" + hex;
    }
    return hex;
  };
  var red = rgbToHex(r);
  var green = rgbToHex(g);
  var blue = rgbToHex(b);
  return '#'+red+green+blue;
};

function clamp(val, min, max) {
    return parseInt(val > max ? max : val < min ? min : val);
}

var generateData = function(graphSize,{a,b,c,d}) {
  let x = []
  let z = []
  let y = []
  const xs = tf.randomUniform([graphSize], -1, 1);
  const zs = tf.randomUniform([graphSize], -1, 1);
  for (let i = 0; i < graphSize; i++) {
    x[i] = xs.get(i);  // goes from a TF tensor (i.e. array) to a number.
    z[i] = zs.get(i);
  }
  //z-axis
  for(let i=0;i<x.length;i++){
    let x = x[i]
    let z = z[i]
    y[i] = (a * x*x + b * x + c * z*z + d * z)
  }
  
  
  // Normalize the y values to be between 0 and 1
  const ymin = Math.min(...y);
  const ymax = Math.max(...y);
  const yrange = ymax - ymin;
  
  for (let i = 0; i < points; i++) {
    const val = y[i];
    y[i] = (y[i] - ymin) / yrange;
  }
  
  return {x:x, z:z, y:y}
}

const Data = {
  training: {x:[], z:[], y:[]},   // the initial data set we're given
  prediction: {x:[], z:[], y:[]}, // what we're predicting based on the coefficients
  learning: {x:[], z:[], y:[]}    // what we're predicting while learning.
}

const a = tf.variable(tf.scalar(Math.random()));
const b = tf.variable(tf.scalar(Math.random()));
const c = tf.variable(tf.scalar(Math.random()));
const d = tf.variable(tf.scalar(Math.random()));

function init(){
  NUM_POINTS = parseInt(document.getElementById('points').value || 100);
  const defaultCoeffs = {
    a: parseFloat(document.getElementById('i_a').value || -0.8),
    b: parseFloat(document.getElementById('i_b').value || -0.2),
    c: parseFloat(document.getElementById('i_c').value || 0.9),
    d: parseFloat(document.getElementById('i_d').value || 0.5)
  }
  Data.training = generateData(NUM_POINTS, defaultCoeffs);
  const coeff = {
    a: a.dataSync()[0],
    b: b.dataSync()[0],
    c: c.dataSync()[0],
    d: d.dataSync()[0],
  };
  Data.prediction = generateData(NUM_POINTS, coeff);
  createGraph(Data.training, "train")
  createGraph(Data.prediction, "predict")
}


function createGraph(data,set){
  let oldgraph = document.querySelector('.graph'+set)
  document.querySelector('a-scene').removeChild(oldgraph)
  let graph = document.createElement('a-entity')
  for(let i=0;i<data.x.length;i++){
    let point = document.createElement('a-sphere')
    point.setAttribute('scale', '0.1 0.1 0.1')
    if(set=="train"){
      point.setAttribute('color', fullColorHex(data.y[i]*128+128,-data.y[i]*33+66,0))
    } else if(set=="predict"){
      point.setAttribute('color', fullColorHex(data.y[i]*128+128,-data.y[i]*33+66,0))
      point.setAttribute('blending', 'subtractive')
    }
    point.setAttribute('position', {x: data.x[i], y: data.y[i], z: data.z[i]})
    graph.appendChild(point)
  }
  graph.setAttribute('position', {x: 0, y: 0, z: 0})
  graph.setAttribute('rotation', {x: 0, y: 90, z: 0})
  document.querySelector('a-scene').appendChild(graph)
  graph.classList.add('graph'+set)
}

init()

async function doALearning() {
  document.querySelector('#iteration_counter').disabled = true;
  // Create an optimizer. This is the thing that does the learning.
  // 👉 you can play with these two numbers if you want to change the 
  // rate at which the algorithm is learning
  
  // How many passes through the data we're doing.
  const numIterations = parseInt(document.getElementById('iterations').value || 75);
  
  // How fast we are learning.
  const learningRate = document.getElementById('learningratevalue').value||0.5;
  
  /* 
    Docs: https://js.tensorflow.org/api/0.11.1/#train.sgd
    - sgd means "stochastic gradient descent". 
    - stochastic means "probabilistic"
    - gradient descent means that at every step, we move our predictions 
    in the direction of the answer. How much to move involves derivatives (the "gradient")
    - the full algorithm is here but it's...mathy: https://en.wikipedia.org/wiki/Stochastic_gradient_descent
    - this is why having tensorflow is good!!
  */ 
  // const optimizer = tf.train.sgd(learningRate);
  
  //   YO YO IT'S MATT! FIRST COMMENT OF MY OWN.
  //   STOCHASTIC GRADIENT DESCENT IS TOO SLOW, WE WANT AN OPTIMIZER WITH MOMENTUM AND THE THING THAT CALCULATES THE MOVING DISCOUNTED AVERAGE OF THE SQUARE OF GRADIENTS (MORE INFO: THIS IS INTRODUCED BY RMSPROP, WHERE WE KEEP TRACK OF THE SQUARE OF GRADIENTS, DISCOUNTING AS WE MOVE THROUGH TIME, SO THAT IF WEVE RECENTLY MOVED A LOT IN ONE DIRECTION, WE DONT CONTINUE TO DO SO AS MUCH, BY DIVIDING BY THE ROOT OF THAT SQUARED CUMULATIVE VALUE. THE IDEA IS THAT WE MIGHT HAVE ALREADY EXPLORED A LOT IN THAT DIRECTION AND DONT WANT TO OVERSHOOT OR NEGLECT OTHER EXPLORATION OPTIONS)
  //   SO LET US USE ADAM, WHICH IS THE BEST OF BOTH WORLDS (https://www.youtube.com/watch?v=uVjRe8QXFHY)
  function getOptimizer(){
    let optimizer_input = document.getElementById('optimizervalue').value
    switch(optimizer_input){
      case "adam":
        optimizer_output = tf.train.adam(learningRate)
        break
      case "sgd":
        optimizer_output = tf.train.sgd(learningRate)
        break
      case "adagrad":
        optimizer_output = tf.train.adagrad(learningRate)
        break
      case "adadelta":
        optimizer_output = tf.train.adadelta(learningRate)
        break
      case "adamax":
        optimizer_output = tf.train.adamax(learningRate)
        break
      case "rmsprop":
        optimizer_output = tf.train.rmsprop(learningRate)
        break
      case "momentum":
        optimizer_output = tf.train.momentum(learningRate)
        break
    }
    return optimizer_output
  }
  
  const optimizer = getOptimizer()
    
  // Use the training data, and do numIteration passes over it. 
  await train(tf.tensor1d(Data.training.x), tf.tensor1d(Data.training.z), tf.tensor1d(Data.training.y), numIterations);
  
  // Once that is done, this has updated our coefficients! 
  // Here you could see what our predictions look like now, and use them!
  // Example:
  // const coeff = {
  //   a: a.dataSync()[0],
  //   b: b.dataSync()[0],
  //   c: c.dataSync()[0],
  //   d: d.dataSync()[0],
  // };
  // Data.prediction = generateData(NUM_POINTS, coeff);
  // plot();
  
  /*
   * This does the training of the model.
   */
  async function train(xs, zs, ys, numIterations) {
    console.log(xs.print(),zs.print())
    for (let iter = 0; iter < numIterations; iter++) {
      // Plot where we are at this step.
      const coeff = {
        a: a.dataSync()[0],
        b: b.dataSync()[0],
        c: c.dataSync()[0],
        d: d.dataSync()[0],
      };
      Data.prediction = generateData(NUM_POINTS, coeff);
      createGraph(Data.prediction, "predict")

  
      // Learn! This is where the step happens, and when the training takes place.
      optimizer.minimize(() => {
        // Using our estimated coeff, predict all the ys for all the xs 
        const pred = predict(xs, zs);
        
        // Need to return the loss i.e how bad is our prediction from the 
        // correct answer. The optimizer will then adjust the coefficients
        // to minimize this loss.
        return loss(pred, ys);
      });
      document.querySelector('#iteration_counter').innerHTML = iter+1
      // Use tf.nextFrame to not block the browser.
      await tf.nextFrame();
    }
    document.querySelector('#iteration_counter').innerHTML = "Learn!"
    document.querySelector('#iteration_counter').disabled = false;
  }
  
  /*
   * Predicts all the y values for all the x and z values.
   */
  function predict(x,z) {
    // Calculate a y according to the formula
    // y = a * x ^ 3 + b * x ^ 2 + c * x + d
    // where a, b, c, d are the coefficients we have currently calculated.
    return tf.tidy(() => {
      return a.mul(x.square())
        .add(b.mul(x))
        .add(c.mul(z.square()))
        .add(d.mul(z))
    });
  }
  
  /*
   * Loss function: how good the prediction is based on what you expected.
   */
  function loss(prediction, labels) {
    // This is the mean squared error between the prediction and the correct answer
    // If you had n data points (NUM_POINTS = n) then it would be:
    // error = 1/n * ( (prediction_1 - answer_1)^2 + ... + (prediction_n - answer_n)^2  )
    // see https://en.wikipedia.org/wiki/Mean_squared_error.
    // There are other error functions you could use, but if you're doing numeric things,
    // MSE is one of the best and also the easiest.
    
    // Also, this is also why TensorFlow is great! Doing this by hand sucks!
    const error = prediction.sub(labels).square().mean();
    return error;
  }
}
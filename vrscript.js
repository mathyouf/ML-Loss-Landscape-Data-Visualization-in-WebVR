var fullColorHex = function(r,g,b) {   
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

var equation = function(x,z,{a,b,c,d}){
  return (x*x*a + x*b + z*z*c + z*d)
}

var generateData = function(graphSize,weights) {
  let xz = []
  let y = []
  const xs = tf.randomUniform([graphSize], -1, 1);
  const zs = tf.randomUniform([graphSize], -1, 1);
  for (let i = 0; i < graphSize; i++) {
    xz[i] = [xs.get(i),zs.get(i)];  // goes from a TF tensor (i.e. array) to a number.
  }
  //z-axis
  for(let i=0;i<xz.length;i++){
    let x = xz[i][0]
    let z = xz[i][1]
    y[i] = a * x*x + b * x + c * z*z + d * z
  }
  
  // Normalize the y values to be between 0 and 1
  const ymin = Math.min(...y);
  const ymax = Math.max(...y);
  const yrange = ymax - ymin;
  
  for (let i = 0; i < points; i++) {
    const val = y[i];
    y[i] = (y[i] - ymin) / yrange;
  }
}

const Data = {
  training: {xz:[], y:[]},   // the initial data set we're given
  prediction: {xz:[], y:[]}, // what we're predicting based on the coefficients
  learning: {xz:[], y:[]}    // what we're predicting while learning.
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
}


function createGraph(){
  let graph = document.createElement('a-entity')
  let point = document.createElement('a-sphere')
  let normalizedHeight = parseInt(Math.sin(x+z)*255/2+128)
  point.setAttribute('scale', '0.1 0.1 0.1')
  point.setAttribute('color', fullColorHex(0,normalizedHeight,255-normalizedHeight))
  point.setAttribute('position', {x: x, y: x*x+x+z*z+z, z: z})
  graph.appendChild(point)
  graph.setAttribute('position', {x: 0, y: -10, z: -10})
  document.querySelector('a-scene').appendChild(graph)
}

init()

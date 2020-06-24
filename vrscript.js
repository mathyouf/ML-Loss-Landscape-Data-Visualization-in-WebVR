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

var generateData = function(points,{a,b,c,d}) {
  
}

function init(){
  createGraph()
}


function createGraph(){
  let graphSize = 10
  let graph = document.createElement('a-entity')
  //z-axis
  for(let z=-graphSize;z<graphSize;z++){
    //x-axis
    for(let x=-graphSize;x<graphSize;x++){
      let point = document.createElement('a-sphere')
      let normalizedHeight = parseInt(Math.sin(x+z)*z*x*255/200+128)
      point.setAttribute('scale', '0.1 0.1 0.1')
      point.setAttribute('color', fullColorHex(0,normalizedHeight,255-normalizedHeight))
      point.setAttribute('position', {x: x, y: Math.sin(x+z)*z, z: z})
      graph.appendChild(point)
    }
  }
  graph.setAttribute('position', {x: 0, y: -10, z: -10})
  document.querySelector('a-scene').appendChild(graph)
}

init()
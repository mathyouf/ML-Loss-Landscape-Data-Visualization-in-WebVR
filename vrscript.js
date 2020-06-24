let graphSize = 10
let graph = document.createElement('a-entity')
//z-axis
for(let z=-graphSize;z<graphSize;z++){
  //x-axis
  for(let x=-graphSize;x<graphSize;x++){
    let point = document.createElement('a-sphere')
    point.setAttribute('scale', '0.1 0.1 0.1')
    point.setAttribute('color', 'rgb(0,0,255)')
    point.setAttribute('position', {x: x, y: Math.sin(x), z: z})
    graph.appendChild(point)
  }
}
graph.setAttribute('position', {x: 0, y: 0, z: -10})
document.querySelector('a-scene').appendChild(graph)

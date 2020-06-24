for(let i=-10;i<10;i++){
  let point = document.createElement('a-sphere')
  point.setAttribute('color','blue')
  point.setAttribute('position', {x: 10, y: i*i*i, z: i*i})
  document.querySelector('a-scene').appendChild(point)
}
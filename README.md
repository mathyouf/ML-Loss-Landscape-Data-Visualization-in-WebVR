# A-frame with Tensorflow.js

A-frame implementation of 3D plane fitting using Tensorflow.js.

Inspired by the 2D [hello tensorflow](https://glitch.com/edit/#!/hello-tensorflow) project by [Monica Dinculescu](https://glitch.com/@notwaldorf)💖

![](https://cdn.glitch.com/14005730-e5aa-4eb2-aee8-a0db53f04d46%2Ftfjs.JPG?v=1595904617081)

## Features

- Adjust each x and z values in plane constructed by `x + x^2 + z + z^2`
- Set the number of points in each plane (more improves loss accuracy)
- Set the learning rate
- Choose among optimizers available in [Tensorflow.js](https://js.tensorflow.org/api/latest/#Training-Optimizers)
- Set number of epochs to train for
- Training automatically stops when the loss (MSE) reaches 0.001

## Potential Features

- Vizualize loss with giant Matrix style rectangle that shrinks with the loss
  - Code written for this (index.html Line 61) but design is bothersome
- Turn visualization of neural network output into a plane instead of points
  - No native method in A-frame, would have to [borow from Three.js](https://stackoverflow.com/questions/51396623/draw-a-curve-using-multi-plane-in-a-frame-and-three-js)
- Add VR UI to adjust these parameters from a VR controller
  - Don't own a VR headset currently so I can't test it
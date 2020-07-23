# A-frame with Tensorflow.js

A-frame implementation of 3D plane fitting using Tensorflow.js.

Inspired by the 2D [hello tensorflow](https://glitch.com/edit/#!/hello-tensorflow) project by [Monica Dinculescu](https://glitch.com/@notwaldorf)💖

## Features

- Adjust each x and z values in plane constructed by `x + x^2 + z + z^2`
- Choose among optimizers available in [Tensorflow.js](https://js.tensorflow.org/api/latest/#Training-Optimizers)
- Set the learning rate
- Set the number of points in each plane (more improves batch loss accuracy)
- Training automatically stops when the loss (MSE) reaches 0.001
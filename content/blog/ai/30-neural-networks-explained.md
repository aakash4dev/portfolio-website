---
title: Neural Networks Explained Simply, With a Python Example
description: A neural network is layers of simple math units that learn from examples. See how neurons, weights, and layers work, and build one in Python.
tags: Neural Networks, Deep Learning, AI Basics
keywords: neural network explained, what is a neural network, how neural networks work, neural network for beginners, neural network python example
cover: hero network circle-dot layers activity brain
---

A **neural network** is a computer program made of many small units called **neurons**, arranged in layers. Each neuron takes some numbers, multiplies each by a **weight**, adds them up, and passes the result on. The network learns by adjusting its weights, a little at a time, until its outputs match the examples it is shown. Neural networks are the base of deep learning and of every modern AI model.

## One neuron

A single neuron does very little:

1. Take inputs: `x1, x2, x3`.
2. Multiply each by a weight: `w1, w2, w3`.
3. Add them, plus one extra number called the **bias**.
4. Pass the sum through an **activation function**.

```python
def neuron(inputs, weights, bias):
    total = sum(x * w for x, w in zip(inputs, weights)) + bias
    return max(0, total)          # ReLU activation

print(neuron([1.0, 2.0], [0.5, -0.2], 0.1))   # 0.5*1 - 0.2*2 + 0.1 = 0.2
```

- **Weights** say how important each input is. A large weight means that input matters a lot. A negative weight means it pushes the result down.
- **Bias** shifts the result up or down.
- **Activation** decides what the neuron sends on.

## Why the activation function matters

Without it, a network of any size would only be able to draw straight lines through data. The activation function adds bends, which lets the network learn curves and complex patterns.

Common ones:

| Name | What it does | Used for |
|---|---|---|
| **ReLU** | Negative numbers become 0, positive stay the same | Hidden layers, the usual choice |
| **Sigmoid** | Squeezes any number into 0 to 1 | Yes or no outputs |
| **Softmax** | Turns a list of numbers into probabilities that add to 1 | Choosing one class from many |

## Layers

One neuron cannot do much. Many neurons in layers can.

```text
Input layer      Hidden layers        Output layer
  (data)       (find the patterns)      (answer)

    o ──────┐   o ───┐   o ───┐
    o ──────┼── o ───┼── o ───┼────── o
    o ──────┘   o ───┘   o ───┘
```

- **Input layer:** the raw numbers. For a 28 × 28 pixel image, that is 784 numbers.
- **Hidden layers:** each layer builds on the one before.
- **Output layer:** the answer. For digit recognition, 10 numbers: one for each digit.

"Deep" learning means a network with many hidden layers.

### What the layers learn

In an image network, layers build up from simple to complex:

- First layers find **edges and colors**.
- Middle layers combine edges into **shapes**: corners, circles, textures.
- Later layers combine shapes into **objects**: eyes, wheels, faces.

Nobody programs these features. The network finds them because they help it give the right answer.

## How a network learns

Training repeats four steps many thousands of times.

1. **Forward pass.** Give the network an example and compute its output. With random starting weights, the output is nonsense.
2. **Loss.** Measure how wrong it was with a **loss function**. A big loss means a bad answer.
3. **Backward pass.** Work out how much each weight contributed to the error. This is **backpropagation**.
4. **Update.** Change each weight a little in the direction that lowers the loss. This is **gradient descent**.

After enough rounds the weights settle on values that give good answers. The math is explained step by step in [gradient descent and backpropagation](/blogs/gradient-descent-backpropagation).

## Build a neural network in Python

This network learns to recognize handwritten digits using PyTorch.

```python
# pip install torch torchvision
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

data = datasets.MNIST("data", train=True, download=True, transform=transforms.ToTensor())
loader = DataLoader(data, batch_size=64, shuffle=True)

model = nn.Sequential(
    nn.Flatten(),            # 28x28 image -> 784 numbers
    nn.Linear(784, 128),     # hidden layer with 128 neurons
    nn.ReLU(),
    nn.Linear(128, 10),      # output: one score per digit
)

loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

for epoch in range(3):
    for images, labels in loader:
        predictions = model(images)             # 1. forward pass
        loss = loss_fn(predictions, labels)     # 2. loss
        optimizer.zero_grad()
        loss.backward()                         # 3. backward pass
        optimizer.step()                        # 4. update weights
    print(f"epoch {epoch + 1}, loss {loss.item():.3f}")
```

After three passes over the data, this small network reads handwritten digits with about 97 percent accuracy. It has roughly 100,000 weights. Large language models use the same four steps with billions of weights.

## Types of neural networks

| Type | Idea | Used for |
|---|---|---|
| **Feed-forward (MLP)** | Data flows straight through the layers | Tables of data, simple tasks |
| **Convolutional (CNN)** | Small filters slide across the input | Images and video |
| **Recurrent (RNN, LSTM)** | Reads a sequence one step at a time | Older text and speech models |
| **Transformer** | Every part can look at every other part | Language models, and now most fields |

The transformer is the design behind today's chat models. See [the transformer architecture explained](/blogs/transformer-architecture-explained).

## Important training terms

- **Epoch:** one full pass over the training data.
- **Batch:** a small group of examples processed together.
- **Learning rate:** how big each weight change is. Too high and training is unstable. Too low and it is very slow.
- **Parameters:** all the weights and biases. A model's size is given as its number of parameters.
- **Overfitting:** the network memorizes the training examples and does badly on new ones. See [overfitting vs underfitting](/blogs/overfitting-vs-underfitting).

## Is it like a brain?

Only loosely. The idea of connected units that pass signals came from brain cells. But real neurons are far more complex, and brains do not learn through backpropagation as these networks do. A neural network is best understood as a large math function with adjustable numbers.

## What neural networks are good and bad at

**Good at:** finding patterns in images, sound, and text, where rules are too hard to write by hand.

**Weak at:**

- They need a lot of data and computing power.
- It is hard to explain why they gave a specific answer.
- They can be confidently wrong on inputs unlike their training data.
- For small tables of data, simpler methods often work as well or better.

## FAQ

### What is a neural network in simple words?

It is a program made of layers of small math units. It learns from examples by adjusting numbers called weights until its answers are right.

### What is the difference between a neural network and deep learning?

Deep learning is the use of neural networks with many layers. Every deep learning model is a neural network.

### Do I need advanced math to use neural networks?

No. Libraries such as PyTorch do the math for you. Basic knowledge of vectors and derivatives helps you understand what is happening and fix problems.

### How many layers does a neural network need?

It depends on the task. Simple problems work with one or two hidden layers. Large language and image models use dozens to more than a hundred.

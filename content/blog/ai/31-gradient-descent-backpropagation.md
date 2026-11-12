---
title: Gradient Descent and Backpropagation Explained Step by Step
description: Gradient descent is how AI models learn. See how it lowers the error step by step, what backpropagation does, and a full example in Python.
tags: Deep Learning, Training, Math
keywords: gradient descent explained, backpropagation explained, how neural networks learn, learning rate, gradient descent example
cover: flow trending-down calculator target
---

**Gradient descent** is the method AI models use to learn. It measures how wrong the model is, works out which direction to change each number in the model to make it less wrong, and takes a small step in that direction. This repeats thousands or millions of times. **Backpropagation** is the fast way to work out those directions for every number in a neural network.

## The idea in plain words

You are on a hillside in thick fog and want to reach the lowest point. You cannot see the valley. What you can do:

1. Feel the slope of the ground under your feet.
2. Take a step downhill.
3. Repeat.

That is gradient descent.

- Your **position** is the model's weights.
- The **height** is the **loss**: a number that says how wrong the model is.
- The **slope** is the **gradient**.
- The **step size** is the **learning rate**.

## A full example with one weight

We want a model `prediction = w * x` that fits this data:

```text
x: 1, 2, 3, 4
y: 2, 4, 6, 8
```

The right answer is clearly `w = 2`. Let us make the computer find it.

**Loss.** We use mean squared error: the average of `(prediction - y)²`.

**Gradient.** Calculus gives the slope of the loss with respect to `w`: the average of `2 * (w*x - y) * x`.

```python
xs = [1, 2, 3, 4]
ys = [2, 4, 6, 8]

w = 0.0              # start with a bad guess
learning_rate = 0.05

for step in range(10):
    loss = sum((w * x - y) ** 2 for x, y in zip(xs, ys)) / len(xs)
    gradient = sum(2 * (w * x - y) * x for x, y in zip(xs, ys)) / len(xs)
    w = w - learning_rate * gradient          # the update rule
    print(f"step {step}: w = {w:.3f}, loss = {loss:.3f}")
```

Output:

```text
step 0: w = 1.500, loss = 30.000
step 1: w = 1.875, loss = 1.875
step 2: w = 1.969, loss = 0.117
step 3: w = 1.992, loss = 0.007
...
```

In four steps, `w` goes from 0 to almost 2. The whole method is one line:

```text
new weight = old weight - learning rate × gradient
```

A positive gradient means the loss rises when `w` rises, so we lower `w`. A negative gradient means the opposite. We always move against the slope.

## The learning rate

The learning rate is the most important setting in training.

| Learning rate | What happens |
|---|---|
| Too small | Learning is very slow and may stop too early |
| Good | The loss falls steadily |
| Too large | The loss jumps around or grows without end |

In the example above, try `learning_rate = 0.2`. The steps are too big, `w` jumps past 2 further each time, and the loss explodes.

Common starting values are 0.001 for the Adam optimizer and 0.01 to 0.1 for plain SGD. Many training setups begin high and lower the rate over time, which is called a learning rate schedule.

## Three kinds of gradient descent

| Kind | Data used per step | Trade-off |
|---|---|---|
| **Batch** | The whole data set | Accurate direction, very slow on large data |
| **Stochastic (SGD)** | One example | Fast, noisy direction |
| **Mini-batch** | A small group, such as 32 or 64 | Fast and stable. The standard choice |

Almost all modern training uses mini-batches. The noise is helpful: it can shake the model out of poor solutions.

## What backpropagation is

A real network has millions or billions of weights in many layers. We need the gradient for **every one**: how much would the loss change if this weight changed a little?

Calculating this one weight at a time would take forever. **Backpropagation** gets all of them in a single backward pass using the **chain rule** from calculus.

### The chain rule in simple words

If A affects B, and B affects C, then:

```text
effect of A on C = (effect of A on B) × (effect of B on C)
```

A network is a long chain: weights affect a layer's output, which affects the next layer, and so on until the loss.

### Forward, then backward

1. **Forward pass.** Send the input through the network, layer by layer. Save each layer's output. Compute the loss.
2. **Backward pass.** Start at the loss and move back toward the input. At each layer, use the chain rule to find the gradient for that layer's weights, and pass the result to the layer before it.

Each layer reuses the work done by the layer after it. That reuse is what makes the method fast.

### A tiny example by hand

Take two steps: `h = w1 * x` and `prediction = w2 * h`, with loss `L = (prediction - y)²`.

Use `x = 1`, `y = 4`, `w1 = 1`, `w2 = 1`.

```text
Forward:   h = 1 × 1 = 1
           prediction = 1 × 1 = 1
           L = (1 - 4)² = 9

Backward:  dL/dprediction = 2 × (1 - 4) = -6
           dL/dw2 = dL/dprediction × h  = -6 × 1 = -6
           dL/dh  = dL/dprediction × w2 = -6 × 1 = -6
           dL/dw1 = dL/dh × x           = -6 × 1 = -6
```

Both gradients are negative, so both weights should go up. That is correct: the prediction of 1 was too low and the target is 4.

## Let PyTorch do it

Libraries calculate gradients for you. This feature is called **autograd**.

```python
import torch

x, y = torch.tensor(1.0), torch.tensor(4.0)
w1 = torch.tensor(1.0, requires_grad=True)
w2 = torch.tensor(1.0, requires_grad=True)

loss = (w2 * (w1 * x) - y) ** 2
loss.backward()                  # backpropagation

print(w1.grad, w2.grad)          # tensor(-6.) tensor(-6.)
```

The numbers match the hand calculation. In a real training loop, `loss.backward()` computes the gradients and `optimizer.step()` applies the update. A complete network is shown in [neural networks explained](/blogs/neural-networks-explained).

## Better optimizers

Plain gradient descent has been improved in several ways:

- **Momentum:** keeps moving in the direction of recent steps, which smooths the path and speeds things up.
- **Adam:** gives each weight its own step size that adapts during training. It works well with little tuning and is the usual default.
- **AdamW:** Adam with a better way to keep weights small. It is the standard for training transformers.

## Common problems

- **Vanishing gradients.** In deep networks, gradients can shrink toward zero as they move backward, so early layers stop learning. ReLU activations, residual connections, and normalization layers fix most of this.
- **Exploding gradients.** Gradients grow huge and the loss becomes `NaN`. Lower the learning rate or use gradient clipping.
- **Local minima and flat areas.** The model can settle in a spot that is not the best. In very large networks this matters less than once believed, and mini-batch noise helps.
- **Overfitting.** A very low training loss can mean memorizing. Always check on data the model has not seen. See [overfitting vs underfitting](/blogs/overfitting-vs-underfitting).

## FAQ

### What is gradient descent in simple words?

It is a way to improve a model by repeatedly making small changes to its numbers in the direction that reduces its error.

### What is the difference between gradient descent and backpropagation?

Backpropagation calculates the gradients, which say how each weight affects the error. Gradient descent uses those gradients to update the weights. They work together.

### What is a good learning rate?

It depends on the model and optimizer. Start with 0.001 for Adam. If the loss jumps around or becomes NaN, lower it. If the loss falls very slowly, raise it.

### Do I need to calculate gradients by hand?

No. PyTorch, TensorFlow, and JAX do it automatically. Doing one small example by hand, as above, helps you understand what the library does.

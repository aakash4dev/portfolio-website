---
title: Overfitting vs Underfitting: How to Spot and Fix Both
description: Overfitting means a model memorized its training data. Underfitting means it learned too little. Learn the signs and the fixes for each.
tags: Machine Learning, Training, Model Quality
keywords: overfitting vs underfitting, what is overfitting, how to prevent overfitting, bias variance tradeoff, underfitting meaning
cover: versus brain-circuit circle-dashed
---

**Overfitting** is when a model learns its training data too exactly, including noise and accidents, so it scores well on that data and badly on new data. **Underfitting** is when a model is too simple to learn the real pattern, so it scores badly on both. The goal is the middle: a model that learns the general pattern and works on data it has never seen.

## An example from school

Three students prepare for a math exam using practice questions.

- **Student A** memorizes every practice answer. In the exam the numbers are different, and A fails. This is **overfitting**.
- **Student B** barely studies and learns only "the answer is usually a number". B fails the practice questions and the exam. This is **underfitting**.
- **Student C** learns the method. C makes a few mistakes on the practice questions and does well in the exam. This is a **good fit**.

A model, like a student, should be judged on questions it has not seen before.

## How to tell which one you have

Split your data into a **training set** and a **validation set** the model never trains on. Compare the scores.

| Training score | Validation score | Diagnosis |
|---|---|---|
| Bad | Bad | **Underfitting** |
| Very good | Much worse | **Overfitting** |
| Good | Nearly as good | **Good fit** |

The size of the gap is the signal. A large gap between training and validation scores means overfitting.

### Learning curves

Plot the loss on both sets as training goes on.

```text
Loss
 |\
 | \   validation
 |  \_____________/‾‾‾‾‾    <- starts to rise: overfitting begins
 |   \
 |    \__________________   training keeps falling
 +-----------------------> training time
         ^ stop here
```

- **Both lines high and flat:** underfitting.
- **Training falls, validation rises:** overfitting. The best model is at the lowest point of the validation line.

## See it in Python

Here we fit curves of different complexity to noisy data.

```python
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

rng = np.random.default_rng(0)
X = np.sort(rng.uniform(0, 1, 40)).reshape(-1, 1)
y = np.sin(2 * np.pi * X).ravel() + rng.normal(0, 0.2, 40)   # a wave plus noise

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.3, random_state=0)

for degree in [1, 4, 15]:
    model = make_pipeline(PolynomialFeatures(degree), LinearRegression())
    model.fit(X_train, y_train)
    train_error = mean_squared_error(y_train, model.predict(X_train))
    val_error = mean_squared_error(y_val, model.predict(X_val))
    print(f"degree {degree:2}: train {train_error:.3f}, validation {val_error:.3f}")
```

You will see this pattern:

- **Degree 1** (a straight line): high error on both sets. A line cannot follow a wave. **Underfitting.**
- **Degree 4:** low error on both. **Good fit.**
- **Degree 15:** almost zero training error and a much larger validation error. The curve bends to touch every training point, noise included. **Overfitting.**

## What causes overfitting

- **The model is too complex** for the amount of data.
- **Too little training data.**
- **Training for too long.**
- **Noisy data or wrong labels**, which the model memorizes.
- **Too many features**, some of which match the answer by chance.

## How to fix overfitting

1. **Get more data.** The most reliable fix. More examples make it harder to memorize.
2. **Simplify the model.** Fewer layers, fewer neurons, a shallower tree.
3. **Regularization.** Add a penalty for large weights. L2 (weight decay) is the most common. L1 can also remove unused features.
4. **Dropout.** In neural networks, randomly switch off some neurons during training so the network cannot depend on any single one.
5. **Early stopping.** Watch the validation loss and stop when it stops improving.
6. **Data augmentation.** Create changed copies of your data: flip or crop images, reword text.
7. **Cross-validation.** Train and test on several different splits to get an honest score.
8. **Remove weak features** that carry noise.

```python
# Early stopping and weight decay in PyTorch (structure only)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

best_loss, patience, bad_epochs = float("inf"), 5, 0
for epoch in range(100):
    train_one_epoch(model, optimizer)
    val_loss = evaluate(model)
    if val_loss < best_loss:
        best_loss, bad_epochs = val_loss, 0
        torch.save(model.state_dict(), "best.pt")
    else:
        bad_epochs += 1
        if bad_epochs >= patience:
            break          # validation stopped improving
```

## What causes underfitting

- **The model is too simple**, such as a straight line for curved data.
- **Missing features.** The inputs do not contain what is needed to predict the answer.
- **Too much regularization.**
- **Not trained long enough.**

## How to fix underfitting

1. **Use a more complex model.** More layers, deeper trees, or a different algorithm.
2. **Add better features.** For house prices, add location and size, not only the number of rooms.
3. **Reduce regularization.**
4. **Train longer**, or raise the learning rate if training is stuck.
5. **Check for bugs.** A model that learns nothing often has a data or code error.

## Bias and variance

You will see these two words with this topic.

- **Bias** is error from a model that is too simple. High bias means underfitting.
- **Variance** is error from a model that reacts too much to the exact training data. High variance means overfitting.

Lowering one tends to raise the other. This is the **bias-variance trade-off**, and finding the balance is the main job of model tuning.

## Train, validation, and test sets

Use three sets, each with one job:

| Set | Used for | Typical share |
|---|---|---|
| **Training** | Learning the weights | 70 to 80% |
| **Validation** | Tuning settings and deciding when to stop | 10 to 15% |
| **Test** | One final, honest check | 10 to 15% |

Look at the test set once, at the end. If you tune your model many times against it, you overfit to the test set and your score stops being honest.

## Overfitting in large language models

The same problem appears when fine-tuning an LLM. Signs:

- The model repeats training examples word for word.
- It does well on your training prompts and poorly on new wording.
- It gets worse at general tasks it could do before.

Fixes are the same: more varied data, fewer epochs, a lower LoRA rank, and a held-out test set. See [LoRA and QLoRA explained](/blogs/lora-qlora-explained) and [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).

## FAQ

### What is overfitting in simple words?

The model memorized its training examples instead of learning the general rule, so it fails on new examples.

### How do I know if my model is overfitting?

Compare training and validation scores. A very good training score with a much worse validation score means overfitting.

### Is overfitting or underfitting worse?

Both give a model that does not work. Overfitting is more dangerous in practice because the training score looks excellent and hides the problem.

### Does more data always fix overfitting?

More good, varied data almost always helps. More copies of the same kind of data, or more noisy data, helps much less.

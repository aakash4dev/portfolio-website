---
title: Machine Learning Roadmap for Beginners: What to Learn in Order
description: A step-by-step machine learning roadmap. Python, math, classic ML, deep learning, and projects, in the order that makes each step easier.
tags: Machine Learning, Roadmap, Career
keywords: machine learning roadmap, machine learning roadmap for beginners, ml roadmap, how to learn machine learning, machine learning from scratch
cover: flow signpost chart-line graduation-cap
---

The fastest path into machine learning is: **Python → data handling → core ML with scikit-learn → the needed math → deep learning with PyTorch → one area of focus → projects that you finish and publish**. This roadmap lists each stage, what to learn, what to skip, and a project that proves you learned it.

This roadmap is for people who want to **train and understand models**. If you only want to build apps on top of existing models, the shorter plan in [how to learn AI](/blogs/how-to-learn-ai) fits better.

## Stage 1: Python and tools (3 to 5 weeks)

Learn enough Python to write clear scripts:

- Data types, loops, functions, classes
- List comprehensions and dictionaries
- Virtual environments and installing packages. See [Python virtual environments](/blogs/python-virtual-environments).
- Jupyter notebooks for experiments
- Git for saving your work. See the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).

**Project:** a script that downloads a CSV file and prints basic statistics.

## Stage 2: Data handling (3 to 4 weeks)

Most ML work is preparing data. Learn three libraries:

- **NumPy**: fast math on arrays.
- **pandas**: load, clean, filter, group, and join tables.
- **Matplotlib** or **Seaborn**: charts.

Also learn basic SQL, because real data lives in databases. See [SQL joins explained](/blogs/sql-joins-explained).

```python
import pandas as pd

df = pd.read_csv("houses.csv")
print(df.describe())                      # quick statistics
print(df.isna().sum())                    # missing values per column
df = df.dropna(subset=["price"])          # remove rows with no price
```

**Project:** take a public data set, clean it, and answer five questions with charts.

## Stage 3: Core machine learning (6 to 8 weeks)

This is the most important stage. Use **scikit-learn**.

**Ideas to understand:**

- Features and labels
- Training set, validation set, test set
- [Supervised vs unsupervised learning](/blogs/supervised-vs-unsupervised-learning)
- [Overfitting and underfitting](/blogs/overfitting-vs-underfitting)
- Cross-validation
- Metrics: accuracy, precision, recall, F1, mean squared error

**Algorithms to learn, in this order:**

1. Linear regression
2. Logistic regression
3. Decision trees
4. Random forests
5. Gradient boosting (XGBoost or LightGBM)
6. K-means clustering

```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)
print(accuracy_score(y_test, model.predict(X_test)))
```

**Project:** predict house prices or customer churn from a table of data. Write down what you tried and what improved the score.

## Stage 4: The math you need (alongside stages 3 and 5)

Learn math next to the practice, not before it. Focus on what explains the code you are writing:

- **Linear algebra:** vectors, matrices, matrix multiplication, dot product.
- **Calculus:** derivatives, the chain rule, gradients.
- **Probability and statistics:** distributions, mean and variance, conditional probability, Bayes' rule.

You need to understand these well enough to read an explanation of an algorithm. You do not need to pass a university exam in them. 3Blue1Brown's video series on linear algebra and calculus is a good free start.

## Stage 5: Deep learning (8 to 10 weeks)

Use **PyTorch**. It is the standard in research and common in industry.

- How a [neural network](/blogs/neural-networks-explained) works
- [Gradient descent and backpropagation](/blogs/gradient-descent-backpropagation)
- Loss functions and optimizers (SGD, Adam)
- Regularization: dropout, weight decay, early stopping
- Convolutional networks for images
- [Transformers](/blogs/transformer-architecture-explained) for text

```python
import torch
from torch import nn

model = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

for images, labels in loader:
    loss = loss_fn(model(images), labels)
    optimizer.zero_grad()
    loss.backward()        # compute gradients
    optimizer.step()       # update weights
```

Those four lines inside the loop are the heart of all deep learning training.

**Projects:** classify handwritten digits (MNIST), then train an image classifier on your own photos using a pre-trained model.

## Stage 6: Choose one focus area (8 weeks or more)

Do not try to learn everything. Pick one:

- **Language models and generative AI:** fine-tuning, [RAG](/blogs/what-is-rag), agents, evaluation.
- **Computer vision:** detection, segmentation, image generation.
- **Tabular data and forecasting:** the most common need in business.
- **MLOps:** deployment, monitoring, data pipelines.
- **Reinforcement learning:** games, robotics, control.

## Stage 7: Build, publish, repeat

Employers and clients look for proof. For each project:

1. Use real, messy data, not only the classic clean sets.
2. Put the code on GitHub with a clear README.
3. Deploy a simple demo.
4. Write a short post: the problem, what you tried, the result, what failed.

Three finished projects beat ten courses.

## What you can skip at the start

- Writing every algorithm from scratch. Do it once for linear regression and a small neural network, then use libraries.
- Advanced math proofs.
- Big data tools such as Spark, until a job needs them.
- Reading new research papers every week.

## A realistic timeline

With 10 to 15 hours per week, stages 1 to 5 take about 6 to 9 months. Getting job-ready in a focus area takes about a year in total. Studying a little every day works better than long sessions once a week.

## FAQ

### Can I learn machine learning without a degree?

Yes. Many working ML engineers are self-taught. You need strong projects and the ability to explain your choices. Research roles more often ask for a degree.

### Should I learn TensorFlow or PyTorch?

Start with PyTorch. It is used in most research and new projects. The ideas transfer, so learning the other later is quick.

### How much math do I need for machine learning?

Basic linear algebra, derivatives, and probability are enough to start and to understand most methods. Learn more when a topic requires it.

### Is machine learning still worth learning now that LLMs exist?

Yes. LLMs are machine learning models, and the core skills of data, evaluation, and avoiding overfitting apply directly. Most business problems with table data are still solved with classic ML.

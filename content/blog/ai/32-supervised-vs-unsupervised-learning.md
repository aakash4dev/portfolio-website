---
title: Supervised vs Unsupervised Learning: Differences and Examples
description: Supervised learning uses labeled data, unsupervised learning finds patterns without labels. Compare both, with examples and Python code.
tags: Machine Learning, AI Basics, Data Science
keywords: supervised vs unsupervised learning, supervised learning examples, unsupervised learning examples, types of machine learning, reinforcement learning
cover: versus tags shapes
---

**Supervised learning** trains a model on examples that include the correct answer, called a label. **Unsupervised learning** trains on data with no labels, and the model finds groups and patterns by itself. Use supervised learning when you know what you want to predict and have past examples. Use unsupervised learning when you want to explore data or find structure you did not know was there.

## Quick comparison

| | Supervised | Unsupervised |
|---|---|---|
| Training data | Inputs with correct answers | Inputs only |
| Goal | Predict the answer for new inputs | Find groups, patterns, or structure |
| Main tasks | Classification, regression | Clustering, dimension reduction, anomaly detection |
| How you check it | Compare predictions with known answers | Harder: no correct answer to compare with |
| Example | Is this email spam? | Which customers behave alike? |
| Data cost | High: someone must label the data | Low: raw data is enough |

## Supervised learning

You show the model many examples of "input → correct output". It learns the link between them, then predicts the output for inputs it has not seen.

Think of learning with an answer key. You try a question, check the answer, and correct yourself.

### Two kinds of supervised task

**Classification** predicts a category.

- Spam or not spam
- Which digit is in this image
- Will this customer cancel: yes or no

**Regression** predicts a number.

- The price of a house
- Tomorrow's temperature
- How many units will sell next week

### Example in Python

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)          # X = flower measurements, y = species (the labels)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = DecisionTreeClassifier(max_depth=3)
model.fit(X_train, y_train)                 # learn from labeled examples

predictions = model.predict(X_test)
print(accuracy_score(y_test, predictions))  # about 1.0 on this easy data set
```

The key line is `model.fit(X_train, y_train)`. Both the inputs **and** the answers are given.

### Common algorithms

Linear regression, logistic regression, decision trees, random forests, gradient boosting (XGBoost, LightGBM), support vector machines, and neural networks.

## Unsupervised learning

You give the model data with no answers. It looks for structure.

Think of sorting a box of mixed buttons with no instructions. You would group them by size, color, or number of holes. Nobody told you the groups. You found them.

### Three kinds of unsupervised task

**Clustering** puts similar items into groups.

- Group customers by buying habits
- Group news articles by topic

**Dimension reduction** shrinks data with many columns into a few, keeping the most important information.

- Draw data with 100 features as a 2D chart
- Compress data before another model uses it

**Anomaly detection** finds items that do not fit.

- Unusual card payments
- A machine sensor behaving strangely

### Example in Python

```python
from sklearn.datasets import load_iris
from sklearn.cluster import KMeans

X, _ = load_iris(return_X_y=True)           # we ignore the labels

model = KMeans(n_clusters=3, n_init=10, random_state=42)
groups = model.fit_predict(X)               # no y is given

print(groups[:10])                          # group number for the first 10 flowers
```

Here `fit_predict(X)` receives only the inputs. The model splits the flowers into three groups by their measurements. It does not know the species names. It only knows which flowers are alike.

### Common algorithms

K-means, DBSCAN, hierarchical clustering, PCA (principal component analysis), t-SNE, UMAP, and autoencoders.

## How to choose

Ask these questions:

1. **Do you have a specific thing to predict?** If yes, supervised.
2. **Do you have past examples with the right answer?** If yes, supervised. If no, either label some data or use unsupervised.
3. **Do you want to explore and understand the data?** Unsupervised.
4. **Are you looking for rare, strange cases with few known examples?** Anomaly detection.

They are often used together. A shop might first **cluster** its customers into groups (unsupervised), then train a model to **predict** which group a new customer belongs to (supervised).

## The other types of learning

### Semi-supervised learning

A small amount of labeled data plus a large amount of unlabeled data. Useful when labeling is expensive, such as medical images that need a doctor.

### Self-supervised learning

The data creates its own labels. Hide a word in a sentence and ask the model to predict it. The hidden word is the label, and no person had to write it.

This is how large language models are trained. They learn from huge amounts of plain text by predicting the next piece. See [what an LLM is and how it works](/blogs/what-is-an-llm).

### Reinforcement learning

An **agent** learns by trying actions and receiving rewards or penalties. There are no labeled examples. It learns from the results of its own actions.

- Game-playing systems such as AlphaGo
- Robot control
- Recommendation systems that learn from clicks

| Type | Learns from | Example |
|---|---|---|
| Supervised | Labeled examples | Spam filter |
| Unsupervised | Unlabeled data | Customer groups |
| Self-supervised | Labels made from the data itself | Language models |
| Reinforcement | Rewards for actions | Game-playing AI |

## Common mistakes

**In supervised learning:**

- **Bad labels.** A model trained on wrong answers learns wrong answers.
- **Testing on training data.** Always keep a separate test set. See [overfitting vs underfitting](/blogs/overfitting-vs-underfitting).
- **Data leakage.** A column that secretly contains the answer, such as "refund date" when predicting refunds, gives a perfect score in testing and fails in real use.
- **Unbalanced classes.** If 99 percent of payments are normal, a model that always says "normal" is 99 percent accurate and useless. Use precision and recall.

**In unsupervised learning:**

- **Not scaling the data.** A column in thousands will dominate a column between 0 and 1. Scale them first.
- **Trusting clusters blindly.** K-means returns the number of groups you ask for, whether or not real groups exist. Check that the groups make sense.
- **Picking the number of clusters by guess.** Use the elbow method or silhouette score, plus your knowledge of the subject.

## Where to go next

These two types are the base of classic machine learning. To place them in a full study plan, see the [machine learning roadmap](/blogs/machine-learning-roadmap). For how they relate to deep learning and generative AI, see [AI vs machine learning vs deep learning](/blogs/ai-vs-machine-learning-vs-deep-learning).

## FAQ

### What is the main difference between supervised and unsupervised learning?

Supervised learning uses data with correct answers and learns to predict them. Unsupervised learning uses data without answers and finds patterns or groups.

### Is ChatGPT supervised or unsupervised?

Its base model is trained with self-supervised learning: predicting the next token in text. It is then improved with supervised fine-tuning and methods based on human feedback.

### Which is better, supervised or unsupervised learning?

Neither. They answer different questions. Supervised learning is better for prediction when you have labels. Unsupervised learning is better for exploring data and finding structure.

### Is clustering supervised or unsupervised?

Unsupervised. Clustering groups items by similarity without being told the correct groups.

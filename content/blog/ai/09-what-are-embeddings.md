---
title: What Are Embeddings in AI? Meaning, Examples, and Uses
description: Embeddings turn text into numbers that hold its meaning. Learn how they work, how to create them in Python, and where they are used.
tags: Embeddings, AI Basics, Search
keywords: embeddings, embeddings in ai, embeddings meaning, embeddings in llm, embeddings in rag, embedding model
cover: flow type binary chart-scatter
---

An **embedding** is a list of numbers that represents the meaning of a piece of content, such as a word, a sentence, or an image. Content with similar meaning gets similar numbers. This lets a computer compare meaning with simple math, which is the basis of semantic search, recommendations, and RAG.

## Why computers need embeddings

Computers work with numbers, not words. The oldest way to turn words into numbers was to give each word an ID:

```text
cat = 1, dog = 2, car = 3
```

These IDs say nothing about meaning. The numbers 1 and 2 are close, but so are 2 and 3, and a dog is not similar to a car.

Embeddings fix this. Each item becomes a **vector**: a list of hundreds of numbers. Each number captures a small part of the meaning. Items with similar meaning end up near each other.

## A picture of the idea

Imagine each word as a point on a map with only two directions: "how alive" and "how big".

```text
            big
             |
   elephant  |   truck
             |
alive -------+------- not alive
             |
     mouse   |   coin
             |
           small
```

"Elephant" and "mouse" are both on the alive side. "Elephant" and "truck" are both big. Real embeddings do the same thing with hundreds or thousands of directions, and the model learns the directions by itself from data.

## How similarity is measured

To compare two embeddings you measure how close they are. The most common measure is **cosine similarity**. It looks at the angle between two vectors:

- **1.0** means the same direction: very similar meaning.
- **0** means unrelated.
- **Below 0** means opposite directions.

## Create embeddings in Python

This example uses a small free model that runs on a laptop.

```python
# pip install sentence-transformers
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

sentences = [
    "How do I reset my password?",
    "I forgot my login details.",
    "What time does the store open?",
]
vectors = model.encode(sentences, normalize_embeddings=True)

print(vectors.shape)              # (3, 384): three sentences, 384 numbers each
print(vectors[0] @ vectors[1])    # high score: similar meaning
print(vectors[0] @ vectors[2])    # low score: different meaning
```

The first two sentences share almost no words, but they get a high score because they mean nearly the same thing. When vectors are normalized, the dot product (`@`) equals cosine similarity.

## How an embedding model learns

An embedding model is a neural network trained on a huge number of text pairs. During training:

- Pairs that belong together (a question and its answer, a title and its article) are pulled **closer**.
- Pairs that do not belong together are pushed **apart**.

After millions of such steps, the positions of the vectors hold a detailed map of meaning. Nobody tells the model what each number should mean.

## What embeddings are used for

- **Semantic search.** Find documents by meaning. Store the vectors in a [vector database](/blogs/what-is-a-vector-database).
- **RAG.** Find the right text to give an LLM before it answers. See [what RAG is](/blogs/what-is-rag).
- **Recommendations.** Suggest products, songs, or articles close to what a user liked.
- **Clustering.** Group similar support tickets or reviews without labels.
- **Duplicate detection.** Find questions that ask the same thing in different words.
- **Classification.** Train a small, fast classifier on top of embeddings.

## Embeddings inside an LLM

Embeddings appear in two places, and people often confuse them:

- **Token embeddings inside an LLM.** The first layer of every language model turns each token into a vector. These are internal to the model. See [what an LLM is](/blogs/what-is-an-llm).
- **Text embeddings from an embedding model.** A separate model that outputs one vector for a whole sentence or paragraph. These are the ones used for search and RAG.

A chat model and an embedding model are different models with different jobs. One writes text. The other produces vectors.

## How to choose an embedding model

Look at these points:

- **Quality on your type of content.** General text, code, and multilingual text need different models. Test on your own examples.
- **Dimensions.** More numbers per vector can store more detail but cost more storage and search time. 384 to 1,536 is a common range.
- **Maximum input length.** Text longer than the limit is cut off. Split long documents into chunks first. See [chunking strategies for RAG](/blogs/rag-chunking-strategies).
- **Cost and privacy.** Open models run on your own machine for free. API models are easier to start with but send your text to another company.

## Rules that prevent common mistakes

- **Use the same model for documents and queries.** Vectors from different models cannot be compared.
- **If you change the model, embed everything again.** Old and new vectors do not mix.
- **Embed meaning, not noise.** Remove menus, footers, and repeated headers before embedding.
- **Short text on one topic works best.** One vector for a 50-page document mixes too many ideas to be useful.

## FAQ

### What is an embedding in simple words?

It is a list of numbers that stands for the meaning of something. Things with similar meaning have similar lists.

### What is the difference between an embedding and a vector?

A vector is any list of numbers. An embedding is a vector made by a model so that it holds meaning. All embeddings are vectors.

### Are embeddings only for text?

No. There are embedding models for images, audio, video, and code. Some models place text and images in the same space, so you can search photos with a sentence.

### Can I get the original text back from an embedding?

Not exactly, but parts of the content can sometimes be recovered. Treat embeddings of private data as private data.

---
title: What Is a Transformer in AI? The Architecture Explained Simply
description: The transformer is the neural network design behind ChatGPT and other LLMs. Learn attention, layers, and positions without heavy math.
tags: Transformers, Deep Learning, LLM
keywords: what is transformer, what is transformer in ai, transformer architecture, transformer in deep learning, attention explained
cover: hero waypoints layers eye binary move-right
---

A **transformer** is a type of neural network that reads a whole sequence at once and uses a method called **attention** to work out how each part relates to every other part. It was introduced in the 2017 paper "Attention Is All You Need". Almost every modern AI language model, including GPT, Claude, Gemini, and Llama, is a transformer. The "T" in GPT stands for transformer.

## The problem before transformers

Older language models, called RNNs, read text one word at a time, from left to right. This caused two problems:

- **They forgot.** By the end of a long paragraph, information from the start had faded.
- **They were slow to train.** Word 50 could not be processed until words 1 to 49 were done, so the work could not be split across many processors.

Transformers solved both. They look at all words together, and every word can connect directly to every other word.

## The key idea: attention

Read this sentence:

> The animal did not cross the street because **it** was too tired.

What does "it" mean? The animal. You know this because you link "it" with "animal" and "tired".

**Attention** lets the model do the same. For each word, the model gives a score to every other word that says how much that word matters here. For "it", the word "animal" gets a high score and "street" gets a low one. The model then mixes in information from the high-scoring words.

Change the ending to "because it was too wide" and attention shifts to "street". The same word gets a different meaning from its context.

### How attention is calculated, without heavy math

Each word produces three vectors:

- **Query**: what am I looking for?
- **Key**: what do I contain?
- **Value**: what information do I pass on?

The model compares each word's query with every word's key. A good match gives a high score. The scores decide how much of each word's value is mixed in. The result is a new vector for each word that includes its context.

### Many heads

A transformer runs several attention calculations side by side, called **heads**. Each head can learn a different kind of link. One may connect pronouns to nouns, another may connect verbs to their subjects.

## The parts of a transformer

Text flows through these steps:

```text
Text
 -> Tokens              split text into pieces
 -> Embeddings          turn each token into a vector
 -> Position info       add where each token sits
 -> Transformer block   attention + small neural network
 -> ... repeated many times ...
 -> Output              probability of each possible next token
```

**1. Tokens.** Text is split into small pieces. See [tokens and context windows](/blogs/tokens-and-context-window).

**2. Embeddings.** Each token becomes a vector that holds its meaning. See [what embeddings are](/blogs/what-are-embeddings).

**3. Position information.** Attention looks at all tokens at once, so by itself it has no sense of order. "Dog bites man" and "man bites dog" would look the same. The model adds position information to each token to fix this.

**4. Transformer blocks.** Each block has two steps:

- **Attention**, where tokens share information with each other.
- **A feed-forward network**, where each token is processed alone to work with what it gathered.

Small extras called residual connections and normalization keep training stable.

**5. Stacking.** Blocks are stacked many times. Small models have a dozen layers, large ones have close to a hundred. Early layers pick up grammar. Later layers handle meaning and reasoning.

**6. Output.** The last layer gives a score for every token in the vocabulary. The model picks one and repeats.

## Encoder, decoder, and which models use them

The original transformer had two halves:

- An **encoder** that reads the input and builds an understanding of it.
- A **decoder** that writes the output one token at a time.

Later models kept only one half:

| Type | Looks at | Good for | Examples |
|---|---|---|---|
| Encoder only | Words on both sides | Understanding: search, classification | BERT |
| Decoder only | Only earlier words | Writing text | GPT, Llama, most chat models |
| Encoder and decoder | Both | Translation, summarizing | T5, the original transformer |

Chat models are **decoder-only**. During training, each token may only look at the tokens before it. This forces the model to learn to predict the next token, which is exactly what it does when it writes.

## Why transformers work so well

- **Parallel training.** All tokens are processed together, so GPUs can be used fully. That made it possible to train on huge amounts of text.
- **Long-range links.** Any token can attend to any other token directly.
- **They scale.** More data and more layers keep making them better.
- **They are general.** The same design works for text, code, images, audio, and protein sequences.

## The main limit: context cost

In attention, every token is compared with every other token. Double the text and the work grows about four times. This is why models have a maximum input size, called the context window, and why long prompts cost more and run slower.

## See a transformer's layers in code

```python
# pip install transformers torch
from transformers import AutoModel

model = AutoModel.from_pretrained("distilbert-base-uncased")
print(model.config.n_layers, "layers")    # 6
print(model.config.n_heads, "heads")      # 12
print(model.config.dim, "numbers per token")  # 768
```

This small model has 6 blocks with 12 attention heads each. Large language models use the same building blocks, only many more of them.

To see how these networks learn their numbers, read [gradient descent and backpropagation](/blogs/gradient-descent-backpropagation).

## FAQ

### What does transformer mean in AI?

It is a neural network design that uses attention to understand how the parts of a sequence relate to each other. It is the base of modern language models.

### Why is it called a transformer?

It transforms one sequence of vectors into another, step by step, so that each token's vector ends up including its context.

### Is GPT a transformer?

Yes. GPT stands for Generative Pre-trained Transformer. It is a decoder-only transformer.

### Are transformers only used for text?

No. Vision transformers split an image into patches and treat them like tokens. Similar models handle audio, video, and biology data.

---
title: What Is an LLM and How Does It Work? A Simple Guide
description: An LLM is an AI model that predicts the next word. Learn how large language models are trained, how they answer, and where they fail.
tags: LLM, AI Basics, Transformers
keywords: what is llm, what is llm in ai, what is llm and how does it work, llm model, large language model explained
cover: hero brain message-square binary layers cpu
---

An LLM, or **large language model**, is an AI program trained on a very large amount of text to do one thing: predict what text comes next. ChatGPT, Claude, Gemini, and Llama are all built on LLMs. When you ask a question, the model writes the answer one small piece at a time, each time picking a likely next piece.

## What "large language model" means

Each word in the name tells you something:

- **Large**: the model has billions of numbers inside it, called parameters. It was trained on a huge amount of text: books, websites, code, and more.
- **Language**: it works with text. It reads text and writes text. Many newer models also accept images and audio.
- **Model**: it is a mathematical function. Text goes in, a prediction comes out.

## How an LLM works, step by step

### 1. Text becomes tokens

The model does not read letters or whole words. It reads **tokens**, which are small pieces of text. "Playing" might become two tokens: "play" and "ing". Each token is mapped to a number. More detail is in [tokens and context windows](/blogs/tokens-and-context-window).

### 2. Tokens become vectors

Each token number is turned into a long list of numbers called an embedding. Tokens with similar meaning get similar lists. This is how the model stores meaning. See [what embeddings are](/blogs/what-are-embeddings).

### 3. The transformer mixes information

The core of an LLM is a neural network design called the **transformer**. Its key part is **attention**: for each token, the model looks at all the other tokens and decides which ones matter. In "The bank of the river", attention links "bank" with "river", so the model knows it is not a money bank. Read [the transformer architecture explained](/blogs/transformer-architecture-explained) for the details.

### 4. The model predicts the next token

After many layers, the model outputs a probability for every token it knows. For "The capital of France is", the token "Paris" gets a very high probability.

### 5. Repeat

The chosen token is added to the text, and the whole process runs again for the next token. A full answer is this loop running hundreds of times.

## How an LLM is trained

Training has two main stages.

**Pre-training.** The model reads a huge amount of text. Again and again, part of a sentence is shown and the model must guess the next token. When it is wrong, its parameters are changed a little so the right answer becomes more likely. Nobody labels the data by hand, because the text itself contains the answer. This stage needs a lot of computers and time.

**Fine-tuning.** The pre-trained model is trained more on smaller, chosen data. This is how a raw model becomes a helpful chat assistant that follows instructions and refuses harmful requests.

Nobody writes rules like "a verb follows a subject". The model learns grammar, facts, and reasoning patterns only because they help it predict the next token better.

## What an LLM can and cannot do

**Good at:**

- Writing, summarizing, and translating text
- Explaining ideas and answering questions
- Writing and fixing code
- Pulling structured data out of messy text

**Weak at:**

- **Facts it never saw.** It has no knowledge after its training date and no access to your private data unless you provide it. [RAG](/blogs/what-is-rag) solves this.
- **Being sure.** It can write wrong answers that sound right. See [AI hallucinations](/blogs/ai-hallucinations).
- **Exact math and counting.** It predicts text, it does not calculate. Give it a calculator tool for that.
- **Memory.** It only remembers what is inside the current conversation window.

## A tiny example of next-token prediction

You can see the idea with a few lines of Python using a small open model:

```python
# pip install transformers torch
from transformers import pipeline

generate = pipeline("text-generation", model="distilgpt2")
result = generate("The best way to learn programming is", max_new_tokens=20)
print(result[0]["generated_text"])
```

This small model writes weak text, but it works the same way as the largest models: it keeps predicting the next token. Bigger models with more parameters and more training data do the same thing far better.

## Open and closed models

- **Closed models** run on the company's servers. You use them through an app or an API. You cannot download them.
- **Open-weight models** can be downloaded and run on your own computer. See [how to run a local LLM with Ollama](/blogs/run-local-llm-ollama).

Closed models are often stronger. Open models give you privacy, lower cost at scale, and full control.

## FAQ

### What is the difference between an LLM and ChatGPT?

An LLM is the model. ChatGPT is a product built around a model. The product adds a chat screen, memory of the conversation, safety rules, and tools such as web search.

### Is an LLM the same as AI?

No. AI is the whole field. Machine learning is one part of AI, deep learning is one part of machine learning, and LLMs are one kind of deep learning model. See [AI vs machine learning vs deep learning](/blogs/ai-vs-machine-learning-vs-deep-learning).

### Does an LLM understand what it says?

It builds rich internal patterns about language and the world, and it can reason through many problems. But it does not have experiences or beliefs like a person. For practical work, treat it as a strong pattern-based text engine and always check important output.

### How big is a large language model?

Sizes range from about one billion parameters for small models that run on a phone to hundreds of billions for the largest ones. More parameters usually means better answers, but also more memory and cost.

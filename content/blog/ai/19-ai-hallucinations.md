---
title: AI Hallucinations: Why LLMs Make Things Up and How to Fix It
description: AI models sometimes state false things with confidence. Learn why hallucinations happen and eight practical ways to reduce them.
tags: Hallucinations, LLM, Reliability
keywords: ai hallucinations, why does ai hallucinate, llm hallucination, how to reduce hallucinations, chatgpt wrong answers
cover: hero ghost triangle-alert search-check file-question shield-check
---

An **AI hallucination** is when a language model gives an answer that sounds correct but is false or made up. It may invent a quote, a statistic, a legal case, a software function, or a web link. Hallucinations happen because the model is built to produce likely text, not to check facts. You cannot remove them fully, but you can reduce them a lot.

## What a hallucination looks like

Ask a model for the best paper on a narrow topic and it may reply with a title, authors, a journal, and a year. All of it looks right. The paper does not exist.

Common forms:

- **Invented sources**: papers, court cases, URLs, book titles.
- **Wrong facts stated firmly**: dates, numbers, names.
- **Invented code**: functions or library options that were never there.
- **False details about people or companies.**
- **Unfaithful summaries**: a summary that adds a claim the document never made.

The danger is that false answers are written in the same confident tone as true ones.

## Why AI models hallucinate

### 1. They predict text, they do not look things up

A language model writes the most likely next token again and again. It has no database of facts. A sentence that looks like a real citation is "likely text", whether the citation exists or not. See [what an LLM is and how it works](/blogs/what-is-an-llm).

### 2. Training rewards guessing

During training and testing, a model that guesses gets some answers right, and a model that says "I don't know" gets zero. So models learn to answer. Think of a student in an exam with no penalty for wrong answers: guessing is the best plan.

### 3. Missing or old knowledge

The model knows nothing after its training date and nothing about your private data. When asked about these, it fills the gap with something that fits the pattern.

### 4. Rare facts are stored weakly

Facts that appeared thousands of times in training are stored well. Facts that appeared once or twice are fuzzy, and the model mixes them up.

### 5. The prompt pushes it

A question like "Why did company X fail in 2019?" assumes the event happened. Models tend to go along with the question instead of correcting it.

## Eight ways to reduce hallucinations

### 1. Give the model the facts (RAG)

The most effective fix. Search your trusted documents and put the relevant text into the prompt, so the model reads the answer instead of recalling it. See [what RAG is](/blogs/what-is-rag).

### 2. Allow it to say "I don't know"

```text
Answer only from the context below.
If the answer is not in the context, reply: "I don't have that information."
```

Without this permission the model will try to answer anyway.

### 3. Ask for quotes and sources

```text
For every claim, include the exact sentence from the document
that supports it. If you cannot find one, remove the claim.
```

Finding a real quote is much harder to fake than writing a free answer, and it lets a person check quickly.

### 4. Give it tools

Let the model search the web, run code, or query a database instead of answering from memory. Use a calculator tool for math. See [LLM function calling](/blogs/llm-function-calling).

### 5. Ask clear, narrow questions

A vague question leaves room to invent. Include names, dates, and versions. Do not include guesses of your own as if they were facts.

### 6. Add a checking step

Use a second model call to verify the first:

```text
Here is a source document and an answer.
List every statement in the answer that the source does not support.
```

This catches many unsupported claims before a user sees them.

### 7. Use the right model and settings

Stronger models hallucinate less on the same task. A low temperature helps the output stay consistent, though it does not fix false knowledge. See [temperature and top-p](/blogs/llm-temperature-top-p).

### 8. Measure it

Build a test set of questions with known answers, including questions that have **no** answer in your data. Count how often the model invents something. Run this after every change. See [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).

## A prompt that puts these together

```text
You are a support assistant. Use only the information in <docs>.

Rules:
- If <docs> does not contain the answer, say you don't know and
  suggest contacting support.
- After each fact, add the title of the document it came from.
- Do not guess numbers, dates, or prices.

<docs>
{retrieved_documents}
</docs>

Question: {question}
```

## How to spot a hallucination

Be most careful when the answer includes:

- Exact numbers, dates, or quotes with no source
- Links and citations. Open every one.
- Details about small companies, new products, or private people
- Library functions you have not seen before. Check the official docs.
- Anything medical, legal, or financial

A simple habit helps: for any fact that matters, ask "where can I verify this?" and then verify it.

## Can hallucinations be fully fixed?

Not with current technology. A model that writes fluent text about anything will sometimes write fluent false text. The practical goal is to build a **system** around the model that makes errors rare and easy to catch: give sources, allow "I don't know", check outputs, and keep a person involved for high-risk decisions.

## FAQ

### Why is it called a hallucination?

Because the model produces something that is not there, with full confidence. Some researchers prefer the word "confabulation", which means filling gaps in memory with invented details.

### Does RAG stop hallucinations completely?

No. It lowers them strongly, but the model can still misread or mix up the given text. Asking for quotes and adding a checking step helps further.

### Do newer models hallucinate less?

In general yes, but not zero, and they can be wrong in more convincing ways. Always verify important facts.

### Does a lower temperature prevent hallucinations?

It reduces random errors but does not fix missing knowledge. If the model's most likely answer is false, a temperature of 0 will give that false answer every time.

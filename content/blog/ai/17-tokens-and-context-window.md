---
title: What Are Tokens and Context Windows in LLMs?
description: Tokens are the pieces of text an AI model reads. The context window is how many it can hold. Learn how both affect cost and answers.
tags: Tokens, LLM, AI Basics
keywords: what are tokens in ai, llm tokens explained, context window, context window meaning, how many tokens, token limit
cover: hero scissors type binary ruler coins
---

A **token** is a small piece of text that a language model reads and writes. It can be a whole word, part of a word, or a punctuation mark. The **context window** is the maximum number of tokens a model can handle in one request, counting both your input and its answer. Tokens decide what an API call costs, how fast it is, and how much the model can "remember".

## What a token is

Models do not read letters or whole words. Before the model sees your text, a program called a **tokenizer** splits it into tokens and turns each token into a number.

```text
Text:    "Tokenization is unbelievable!"
Tokens:  "Token" "ization" " is" " un" "believ" "able" "!"
```

Common words are usually one token. Long or rare words are split into several. Spaces are often attached to the start of a word.

A useful rule for English text:

- **1 token is about 4 characters**
- **100 tokens is about 75 words**
- **1 page of text is about 500 tokens**

Other languages, code, and numbers often use more tokens for the same amount of text.

## Count tokens in Python

```python
# pip install tiktoken
import tiktoken

encoder = tiktoken.get_encoding("cl100k_base")
tokens = encoder.encode("Tokenization is unbelievable!")

print(len(tokens))                              # number of tokens
print([encoder.decode([t]) for t in tokens])    # the pieces
```

Each model family has its own tokenizer, so counts differ a little between models. For exact numbers, use the counting tool of the provider you call.

## Why models use tokens and not words

- **A fixed vocabulary.** A model can only know a limited list of pieces, often 50,000 to 200,000. Word pieces can build any word, including new ones and typos.
- **Shared meaning.** "Run", "running", and "runner" share a piece, so the model learns they are related.
- **Any language.** The same method works for English, Hindi, code, and emoji.

This also explains some odd model behavior. A model can struggle to count the letters in a word or reverse it, because it never sees single letters. It sees pieces.

## What the context window is

The context window is the model's working space for one request. Everything must fit inside it:

```text
system prompt
+ conversation history
+ documents you pasted in
+ tool descriptions and tool results
+ the model's answer
= must be less than the context window
```

Context windows have grown from a few thousand tokens in early models to hundreds of thousands or more today. Check your model's documentation for its exact size.

### The model has no memory outside the window

A language model does not remember earlier chats. Each request starts from zero. A chat app feels like it remembers because it **sends the whole conversation again** with every message. When the conversation gets too long, the app drops or summarizes old messages, and that is when the model "forgets" what you said at the start.

## Input tokens and output tokens

APIs count two kinds:

- **Input tokens**: everything you send.
- **Output tokens**: everything the model writes.

Output tokens usually cost several times more than input tokens, and they are slower, because the model produces them one at a time.

A worked example with made-up prices of 1 unit per million input tokens and 4 units per million output tokens:

```text
Input:  2,000 tokens  -> 2,000 / 1,000,000 * 1 = 0.002
Output:   500 tokens  ->   500 / 1,000,000 * 4 = 0.002
Total per request: 0.004 units
```

One request is cheap. A million requests per month is not, so it pays to measure.

## A bigger window is not always better

It is tempting to paste everything into a large context. That has costs:

- **Price and speed.** You pay for every input token on every request.
- **Lost in the middle.** Models pay the most attention to the start and end of a long input. Facts in the middle are missed more often.
- **Distraction.** Unrelated text lowers answer quality.

Send the model what it needs for this request, not everything you have.

## How to manage tokens well

- **Use retrieval.** Do not paste a whole manual. Search for the relevant parts and send only those. See [what RAG is](/blogs/what-is-rag).
- **Trim history.** Keep the last few messages in full and summarize older ones.
- **Put key instructions at the start or the end** of a long prompt.
- **Limit the output.** Set a maximum answer length and ask for short answers.
- **Cache repeated prefixes.** Many providers charge less for an unchanged beginning of the prompt, such as a long system prompt.
- **Pick the right model.** A smaller model has cheaper tokens and is often good enough.

## What happens when you go over the limit

- If your **input** is too long, the API returns an error, or a chat app silently drops old messages.
- If the **output** hits its limit, the answer stops in the middle of a sentence. The response includes a stop reason that tells you this happened, so check it in code.

## FAQ

### How many words is 1,000 tokens?

About 750 English words. The exact number depends on the text and the model's tokenizer.

### Is a token the same as a word?

No. Short common words are usually one token. Longer words are split into several tokens, and punctuation marks are tokens too.

### Does the context window include the answer?

Yes. Input and output share the same window. If your input fills almost all of it, there is little room left for the answer.

### Why do longer chats get slower and more expensive?

Because the full history is sent again with every message. Each new message makes the input a little longer.

To learn what happens to tokens inside the model, read [what an LLM is and how it works](/blogs/what-is-an-llm).

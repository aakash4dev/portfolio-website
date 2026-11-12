---
title: Prompt Engineering Guide: 10 Techniques That Actually Work
description: Ten prompt engineering techniques with before and after examples. Write clear prompts, get the format you want, and reduce wrong answers.
tags: Prompt Engineering, LLM, Productivity
keywords: prompt engineering, prompt engineering guide, prompt engineering for beginners, prompt engineering techniques, how to write prompts
cover: hero message-square-code pencil list-checks sparkles target
---

Prompt engineering is the skill of writing instructions that make an AI model give the result you want. The main rule is simple: **write the prompt the way you would brief a smart new coworker who knows nothing about your project**. The ten techniques below all follow from that rule.

## 1. Be specific about the task

Vague prompts get vague answers.

```text
Bad:   Write about dogs.

Good:  Write a 150-word introduction for a blog post about why
       small dogs suit apartment life. Audience: first-time dog
       owners. Tone: friendly and practical.
```

State the task, the audience, the length, and the tone. Every missing detail is a guess the model has to make.

## 2. Give context and the reason

Tell the model **why** you want something. It then makes better choices in cases you did not think of.

```text
Bad:   Never use long sentences.

Good:  Keep sentences short. Many readers use English as a second
       language and read on a phone.
```

## 3. Show examples

One or two examples often work better than a long description. This is called **few-shot prompting**.

```text
Turn each product name into a URL slug.

Product: Blue Cotton T-Shirt (Large)
Slug: blue-cotton-t-shirt-large

Product: Men's Running Shoes 2.0
Slug: mens-running-shoes-2-0

Product: Kids' Winter Jacket - Red
Slug:
```

Use varied examples. If all of them look alike, the model copies them too closely.

## 4. Separate instructions from data

When your prompt contains a document, an email, or user input, mark clearly where it starts and ends. Tags or triple quotes both work.

```text
Summarize the customer email inside the <email> tags in two sentences.

<email>
Hi, I ordered a laptop on the 3rd and it still has not arrived...
</email>
```

This also lowers the risk that text inside the data is read as an instruction. See [prompt injection explained](/blogs/prompt-injection-explained).

## 5. Ask for the output format

If code will read the answer, say exactly what shape you need.

```text
Return only JSON with this shape, and nothing else:
{"sentiment": "positive" | "negative" | "neutral", "reason": "<one sentence>"}
```

Many APIs also offer structured output or tool calling that forces valid JSON. Use that in production. See [LLM function calling](/blogs/llm-function-calling).

## 6. Let the model think first

For math, logic, or multi-step problems, ask for the reasoning before the answer.

```text
Work through the problem step by step. Then give the final
answer on its own line starting with "Answer:".
```

Writing the steps first gives the model a chance to catch its own errors. Many newer models have a built-in thinking mode that does this for you.

## 7. Give the model a role, with detail

A role sets the knowledge level and style.

```text
You are a senior Python reviewer. Review the code below for bugs
and security problems only. Ignore style. List each problem with
the line number and a fix.
```

The role alone ("You are an expert") adds little. The detail about what to do adds a lot.

## 8. Say what to do, not only what to avoid

Negative rules are easy to break. Positive rules are easier to follow.

```text
Bad:   Don't use technical words.

Good:  Use words a 12-year-old would know. If you must use a
       technical word, explain it in the same sentence.
```

## 9. Allow "I don't know"

Models try hard to give an answer. Give them a way out.

```text
Answer using only the document below. If the document does not
contain the answer, reply exactly: "Not found in the document."
```

This one line removes a large share of made-up answers. More methods are in [AI hallucinations](/blogs/ai-hallucinations).

## 10. Split big tasks into steps

One giant prompt that researches, writes, edits, and formats will do each part poorly. Chain smaller prompts:

1. Extract the key facts from the source.
2. Write an outline from the facts.
3. Write the article from the outline.
4. Check the article against the facts.

Each step is easier to test and fix.

## A template you can reuse

```text
ROLE: who the model is and how skilled.
TASK: what to do, in one or two sentences.
CONTEXT: who it is for and why.
INPUT: the data, inside clear tags.
RULES: limits, things to include, things to leave out.
OUTPUT: the exact format, with an example if possible.
```

## How to improve a prompt

Prompt engineering is testing, not guessing.

1. Collect 10 to 20 real inputs, including hard ones.
2. Run the prompt on all of them.
3. Read the failures and find the pattern.
4. Change one thing in the prompt.
5. Run all the inputs again, so a fix in one place does not break another.

Settings matter too. For fixed-format tasks use a low temperature. See [temperature and top-p](/blogs/llm-temperature-top-p).

## FAQ

### Is prompt engineering still needed with newer models?

Yes, but it has changed. Tricks matter less. Clear instructions, good context, and good examples matter more, because stronger models follow what you write more exactly.

### What is the difference between a system prompt and a user prompt?

The system prompt sets the role and the rules for the whole conversation. The user prompt is the current request. Put stable instructions in the system prompt and the changing input in the user prompt.

### How long should a prompt be?

As long as needed to remove guessing. A long prompt full of relevant context beats a short unclear one. Remove text that does not change the output.

### Is prompt engineering a real job?

Fewer roles carry that exact title now. The skill has become a normal part of AI engineering and software development work. See [how to become an AI engineer](/blogs/how-to-become-ai-engineer).

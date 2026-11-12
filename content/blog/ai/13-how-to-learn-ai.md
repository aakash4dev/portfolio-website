---
title: How to Learn AI From Scratch for Free: A Step-by-Step Plan
description: A clear plan to learn AI from zero using free resources. What to study first, what to skip, and projects to build at each step.
tags: Learning, AI Basics, Career
keywords: how to learn ai, how to learn ai for free, how to learn ai from scratch, learn ai skills, ai for beginners
cover: flow book-open code rocket
---

To learn AI from scratch, follow this order: learn basic Python, learn to use AI models through prompts and APIs, build two or three small projects, then go deeper into machine learning theory only as far as your goal needs. You can do all of it with free resources. The biggest mistake is spending months on math before building anything.

## First, decide which kind of "learning AI" you mean

"AI" covers three different goals. The path is different for each.

| Goal | What you do | Time to be useful |
|---|---|---|
| **Use AI tools well** | Write good prompts, automate daily work | 2 to 4 weeks |
| **Build apps with AI** (AI engineer) | Call models from code, build RAG and agents | 3 to 6 months |
| **Train and research models** (ML engineer, researcher) | Math, data, training, papers | 1 to 3 years |

Most people who search for this want the first or second. Do not start with the third path unless you want that career.

## Step 1: Learn to use AI tools well (weeks 1 to 2)

Before code, get good at talking to models. Use a chat assistant every day for real tasks: summarize a long document, draft an email, explain an error message, plan a trip.

Learn the basics of writing prompts:

- Give context and a clear goal.
- Show an example of what you want.
- Ask for a specific format.

The [prompt engineering guide](/blogs/prompt-engineering-guide) covers the techniques. Also learn the limits. Models can be confidently wrong, as explained in [AI hallucinations](/blogs/ai-hallucinations).

**Project:** pick one boring task you do every week and make a reusable prompt for it.

## Step 2: Learn basic Python (weeks 2 to 6)

Python is the main language of AI. You do not need to master it. You need:

- Variables, lists, dictionaries, loops, functions
- Reading and writing files
- Installing packages with `pip`
- Calling a web API and reading JSON

Free places to learn: the official Python tutorial at python.org, freeCodeCamp, and Harvard's CS50P course. If you have never coded before, see [how to learn coding](/blogs/how-to-learn-coding).

**Project:** a script that reads a text file and prints the ten most common words.

## Step 3: Understand how models work, at a simple level (weeks 4 to 8)

You do not need the math yet. You need the right mental picture:

- [AI vs machine learning vs deep learning](/blogs/ai-vs-machine-learning-vs-deep-learning)
- [What an LLM is and how it works](/blogs/what-is-an-llm)
- [Tokens and context windows](/blogs/tokens-and-context-window)
- [What embeddings are](/blogs/what-are-embeddings)

Free video series such as 3Blue1Brown's neural network videos and Andrej Karpathy's talks explain these ideas very clearly.

## Step 4: Build with model APIs (months 2 to 3)

This is where you start building real things.

1. **Call a model from Python.** Follow the [LLM API tutorial](/blogs/llm-api-python-tutorial). Or run a free model on your own computer with [Ollama](/blogs/run-local-llm-ollama).
2. **Get structured output.** Make the model return JSON that your code can use.
3. **Give the model tools.** See [LLM function calling](/blogs/llm-function-calling).

**Projects:**

- A command-line chatbot that remembers the conversation.
- A tool that reads a receipt or email and returns clean JSON.

## Step 5: Build RAG and agents (months 3 to 5)

These two patterns cover most real AI products.

- **RAG**: make a model answer from your own documents. Start with [what RAG is](/blogs/what-is-rag), then [build a RAG chatbot](/blogs/build-rag-chatbot-python).
- **Agents**: let a model use tools in a loop. Start with [what AI agents are](/blogs/what-are-ai-agents), then [build one from scratch](/blogs/build-ai-agent-from-scratch-python).

**Projects:**

- "Chat with my PDFs" for your own notes or course material.
- An agent that searches the web and writes a short report with sources.

## Step 6: Learn to test and ship (months 5 to 6)

What separates a demo from a product is checking that it works.

- Collect real test questions and measure answers. See [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).
- Put one project online with a simple web page.
- Write about what you built. A public project with a clear write-up is worth more than a certificate.

## Step 7 (optional): Go deeper into machine learning

If you want to train models or work on the theory, continue with the [machine learning roadmap](/blogs/machine-learning-roadmap). That is where the math matters: linear algebra, probability, and calculus.

## Free resources worth your time

- **Google's Machine Learning Crash Course**: short and practical.
- **fast.ai Practical Deep Learning**: build first, theory after.
- **Andrew Ng's courses**: clear explanations of the basics. Lectures can be watched for free.
- **Hugging Face courses**: hands-on with open models.
- **Official docs** of the model provider you use. They are the most current source.

Pick one course and finish it. Collecting ten courses and finishing none is the most common way to fail.

## Mistakes that slow people down

- **Math first.** You can build useful apps without it. Learn math when a real problem needs it.
- **Only watching videos.** You learn by building and fixing errors.
- **Chasing every new tool.** Tools change monthly. The basics in this plan stay the same.
- **No project.** Without a project you forget what you studied within weeks.

## FAQ

### Can I learn AI without coding?

You can learn to use AI tools well without code. To build AI apps you need basic Python, which takes a few weeks to pick up.

### How long does it take to learn AI?

A few weeks to use AI tools well. Three to six months of steady practice to build useful AI apps. Years to become a researcher.

### Do I need math to learn AI?

Not to build apps with existing models. To train your own models or understand research papers, you need linear algebra, probability, and basic calculus.

### Can I learn AI for free?

Yes. Courses, open models, and free tiers of most APIs are enough. A certificate is not required. A working project is better proof of skill.

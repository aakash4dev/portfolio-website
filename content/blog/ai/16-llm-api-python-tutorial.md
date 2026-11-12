---
title: How to Use an LLM API in Python: A Beginner Tutorial
description: Call an AI model from Python step by step. API keys, messages, system prompts, streaming, JSON output, errors, and how cost is counted.
tags: LLM API, Python, Tutorial
keywords: chatgpt api, chatgpt api key, llm api python, how to use openai api, chatgpt api pricing, ai api tutorial
cover: code PY key-round
---

To use an LLM API in Python you need four things: an API key from a provider, the provider's Python package, a list of messages, and one function call. This tutorial uses the OpenAI chat format because many providers and local tools accept the same format. The ideas are the same for every provider.

## Step 1: Get an API key

Create an account on the provider's developer site and make a key. An API key is a password for your account, and usage is billed to you.

Three rules for keys:

- **Never put a key in your code.** Store it in an environment variable.
- **Never commit it to Git.** Add `.env` to `.gitignore`.
- **Never use it in browser code.** Anyone can read it there. Call the API from your server.

```bash
export OPENAI_API_KEY="your-key-here"
```

**Want to try for free?** Run a model on your own computer with Ollama. It accepts the same code with a different URL. See [how to run a local LLM](/blogs/run-local-llm-ollama).

## Step 2: Make your first call

```bash
pip install openai
```

```python
from openai import OpenAI

client = OpenAI()   # reads OPENAI_API_KEY from the environment
# Local model instead:
# client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

MODEL = "your-model-name"   # pick one from your provider's model list

response = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": "Explain what an API is in one sentence."}],
)
print(response.choices[0].message.content)
```

That is a full working program.

## Step 3: Understand messages and roles

You send a **list of messages**. Each has a role:

- **system**: instructions for the whole conversation. Who the model is and what rules it follows.
- **user**: what the person says.
- **assistant**: what the model said before.

```python
messages = [
    {"role": "system", "content": "You are a patient math tutor. Use simple words."},
    {"role": "user", "content": "What is a prime number?"},
]
```

Writing a good system prompt is the cheapest way to improve results. See the [prompt engineering guide](/blogs/prompt-engineering-guide).

## Step 4: Keep a conversation going

The API has **no memory**. Each call is separate. To have a conversation you send the whole history every time.

```python
messages = [{"role": "system", "content": "You are a helpful assistant."}]

while True:
    user_input = input("You: ")
    if user_input == "quit":
        break
    messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(model=MODEL, messages=messages)
    reply = response.choices[0].message.content

    messages.append({"role": "assistant", "content": reply})
    print("AI:", reply)
```

Because the history grows, long chats cost more per message and can reach the model's limit. See [tokens and context windows](/blogs/tokens-and-context-window).

## Step 5: Stream the answer

Streaming shows words as they are produced, so users do not wait for the full answer.

```python
stream = client.chat.completions.create(model=MODEL, messages=messages, stream=True)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

## Step 6: Get JSON you can use in code

To use the answer in a program, ask for JSON.

```python
import json

response = client.chat.completions.create(
    model=MODEL,
    response_format={"type": "json_object"},
    messages=[
        {"role": "system", "content": 'Extract the data. Reply with JSON: {"name": string, "amount": number, "currency": string}'},
        {"role": "user", "content": "Invoice from Acme Ltd for 1,250 euros."},
    ],
)
data = json.loads(response.choices[0].message.content)
print(data["amount"])   # 1250
```

Always validate the result before trusting it. A missing field or a wrong type should be handled, not assumed away. Many providers also support strict schemas that guarantee the shape.

## Step 7: The settings that matter

- **`temperature`**: how random the output is. Use a low value for facts and data extraction, a higher value for creative writing. See [temperature and top-p](/blogs/llm-temperature-top-p).
- **Maximum output tokens**: a limit on answer length, which also limits cost.
- **`model`**: bigger models are smarter, slower, and cost more. Start with a smaller model and move up only if quality is not good enough.

## Step 8: Handle errors

Network calls fail. Plan for it.

```python
import time
from openai import APIConnectionError, APIStatusError, RateLimitError

def ask(messages, retries=3):
    for attempt in range(retries):
        try:
            return client.chat.completions.create(model=MODEL, messages=messages, timeout=30)
        except (RateLimitError, APIConnectionError):
            time.sleep(2 ** attempt)      # wait 1, 2, 4 seconds
        except APIStatusError as error:
            if error.status_code >= 500:
                time.sleep(2 ** attempt)
            else:
                raise                      # a bad request will not fix itself
    raise RuntimeError("The model did not answer after several tries.")
```

Retry on rate limits and server errors. Do not retry on bad requests, because the same request will fail again.

## How cost works

You pay per **token**, which is a small piece of text. Input tokens (what you send) and output tokens (what the model writes) are priced separately, and output usually costs more. Prices differ by model and change over time, so check your provider's pricing page.

Every response tells you what was used:

```python
print(response.usage.prompt_tokens, response.usage.completion_tokens)
```

Ways to spend less:

- Use the smallest model that does the job.
- Keep prompts short and remove old history.
- Set a maximum output length.
- Set a spending limit in your provider account before you start.

## What to build next

- Give the model tools: [LLM function calling](/blogs/llm-function-calling).
- Answer from your own documents: [build a RAG chatbot](/blogs/build-rag-chatbot-python).
- Let the model work in a loop: [build an AI agent](/blogs/build-ai-agent-from-scratch-python).

## FAQ

### Is the ChatGPT API free?

No. The API is billed by usage, separately from a chat app subscription. Some providers give free trial credit or a free tier with limits. Local models through Ollama are free.

### Is a ChatGPT subscription the same as API access?

No. The subscription is for the chat app. The API has its own account, keys, and billing.

### Why does the model forget what I said earlier?

The API does not store conversations. You must send earlier messages again with each request.

### Which programming language is best for LLM APIs?

Python and TypeScript have the best support and the most examples. Any language that can send an HTTP request works.

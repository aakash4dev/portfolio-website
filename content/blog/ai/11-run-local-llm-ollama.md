---
title: How to Run a Local LLM With Ollama: Step-by-Step Setup
description: Run an AI model on your own computer for free with Ollama. Install it, pick a model for your RAM, and call it from Python.
tags: Local LLM, Ollama, Tutorial
keywords: local llm, local llm setup, run llm locally, ollama tutorial, local llm for coding, local llm model
cover: flow download laptop message-square
---

You can run a large language model on your own computer with **Ollama**. Install Ollama, run one command such as `ollama run llama3.2`, and you get a private chat model that works offline and costs nothing per message. This guide covers the setup, how to pick a model for your hardware, and how to call it from code.

## Why run an LLM locally?

- **Privacy.** Your prompts and files never leave your machine.
- **No usage cost.** No API bill and no rate limits.
- **Works offline.** Useful on a plane or behind a strict firewall.
- **Control.** You choose the model and it does not change unless you change it.

The trade-off: local models are smaller than the best cloud models, so they are weaker on hard reasoning and long tasks, and speed depends on your hardware.

## Step 1: Install Ollama

Ollama is a free, open-source tool that downloads and runs models with one command.

**macOS and Windows:** download the installer from [ollama.com](https://ollama.com).

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Check that it works:

```bash
ollama --version
```

## Step 2: Download and run a model

```bash
ollama run llama3.2
```

The first run downloads the model. After that it starts in seconds. Type a message and press Enter. Type `/bye` to exit.

Other useful commands:

```bash
ollama pull qwen2.5-coder   # download without starting a chat
ollama list                 # show downloaded models
ollama ps                   # show models loaded in memory
ollama rm llama3.2          # delete a model
```

New models appear often. Browse the current list in the Ollama library on its website.

## Step 3: Pick a model that fits your hardware

The main limit is memory: RAM on a normal computer, or VRAM if you have a graphics card. A model must fit in memory to run at a good speed.

| Your memory | Model size that fits well | What to expect |
|---|---|---|
| 8 GB | 1B to 4B parameters | Simple chat, summaries, short code |
| 16 GB | 7B to 9B parameters | Good general use |
| 32 GB | 14B to 30B parameters | Stronger reasoning and coding |
| 64 GB or more | 30B to 70B parameters | Near the quality of mid-size cloud models |

"B" means billions of parameters. More parameters usually means better answers and more memory use.

Local models are stored in a compressed form called **quantization**, which makes them about a quarter of their original size with a small loss in quality. That is why a 7B model fits in about 5 GB. See [quantization and GGUF explained](/blogs/llm-quantization-gguf).

**Speed tips:**

- A GPU, or an Apple Silicon Mac, is much faster than a CPU alone.
- If answers are very slow, the model does not fit in memory. Pick a smaller one.
- Close other heavy apps to free memory.

## Step 4: Call the model from Python

Ollama runs a local server on port 11434. It also offers an API in the same format as OpenAI, so most existing code works by changing the URL.

```python
# pip install openai
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Explain recursion in two sentences."}],
)
print(response.choices[0].message.content)
```

The `api_key` value is required by the library but not checked by Ollama.

Or call the native API with curl:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

## Step 5: Customize a model

A `Modelfile` lets you set a system prompt and settings, then save it as a new model.

```text
FROM llama3.2
PARAMETER temperature 0.3
SYSTEM You are a code reviewer. Point out bugs first. Be brief.
```

```bash
ollama create reviewer -f Modelfile
ollama run reviewer
```

To learn what temperature does, see [temperature and top-p](/blogs/llm-temperature-top-p).

## What you can build with a local model

- **Private document chat.** Combine a local model with a local embedding model to build RAG with no cloud service. See [build a RAG chatbot in Python](/blogs/build-rag-chatbot-python).
- **Coding help in your editor.** Many editor extensions can use an Ollama model for completions and chat.
- **Local agents.** Models that support tool calling can run the loop from [building an AI agent from scratch](/blogs/build-ai-agent-from-scratch-python).
- **Batch jobs.** Summarize or label thousands of files overnight at no cost.

## Other ways to run local models

- **LM Studio**: a desktop app with a graphical model browser and chat screen.
- **llama.cpp**: the engine many tools are built on. More control, more setup.
- **vLLM**: built for serving many users at once on GPUs.

Ollama is the easiest starting point for one developer on one machine.

## Common problems

- **"Out of memory" or very slow replies**: use a smaller model.
- **The model forgets earlier messages**: the default context window is limited. Raise it with the `num_ctx` setting, which uses more memory. See [tokens and context windows](/blogs/tokens-and-context-window).
- **Port already in use**: another Ollama process is running. Check with `ollama ps`.

## FAQ

### Is Ollama free?

Yes. Ollama is open source and free. Each model has its own license, and many allow commercial use. Check the license of the model you pick.

### Can I run a local LLM without a GPU?

Yes. Small models run on a CPU. They are slower, but usable for chat and short tasks.

### Which local LLM is best for coding?

Choose a model trained for code and the largest size that fits your memory. Test two or three on your own tasks, because results depend on your language and style.

### Is a local LLM as good as ChatGPT?

For simple tasks, a good local model is close. For hard reasoning, long documents, and complex coding, the largest cloud models are still stronger.

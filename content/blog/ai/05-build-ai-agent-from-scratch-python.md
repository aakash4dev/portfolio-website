---
title: How to Build an AI Agent From Scratch in Python (No Framework)
description: Build a working AI agent in about 60 lines of Python. No framework needed. Learn the tool loop, tool schemas, and the safety limits to add.
tags: AI Agents, Python, Tutorial
keywords: how to build ai agent, how to build ai agents from scratch, build ai agent python, ai agent tutorial, ai agents for free
cover: code PY bot
---

To build an AI agent from scratch you need three things: an LLM that supports tool calling, a few Python functions the model may call, and a loop that runs the model, runs the tool it asks for, and sends the result back. This guide builds a complete agent in about 60 lines, with no framework.

If the idea of an agent is new to you, start with [what AI agents are](/blogs/what-are-ai-agents).

## What we will build

A small agent that can do math and read the current time. You ask a question in plain English. The model decides which tools to call and in what order.

It works with any API that follows the OpenAI chat format. That includes many hosted providers and local models served by Ollama, so you can run it for free on your own computer. See [how to run a local LLM with Ollama](/blogs/run-local-llm-ollama).

## Step 1: Install and configure

```bash
pip install openai
```

```python
import json
import os
from datetime import datetime
from openai import OpenAI

# For a local Ollama model use:
# client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
client = OpenAI()  # reads OPENAI_API_KEY from the environment
MODEL = os.environ.get("MODEL", "your-model-name")
```

Set `MODEL` to a model that supports tool calling.

## Step 2: Write the tools

A tool is a normal Python function. Keep each one small and make it return text.

```python
def calculate(expression: str) -> str:
    """Do basic math such as '12 * (3 + 4)'."""
    allowed = set("0123456789+-*/(). ")
    if not set(expression) <= allowed:
        return "Error: only numbers and + - * / ( ) are allowed"
    try:
        return str(eval(expression))
    except Exception as error:
        return f"Error: {error}"

def current_time() -> str:
    """Return the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M")

TOOLS = {"calculate": calculate, "current_time": current_time}
```

The check on allowed characters matters. Never pass model output straight into `eval`, a shell, or a database without limits.

## Step 3: Describe the tools to the model

The model cannot see your Python code. You describe each tool with a JSON schema: its name, what it does, and its inputs.

```python
TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Do basic math. Use it for every calculation.",
            "parameters": {
                "type": "object",
                "properties": {"expression": {"type": "string", "description": "For example: 12 * (3 + 4)"}},
                "required": ["expression"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "current_time",
            "description": "Get the current date and time.",
            "parameters": {"type": "object", "properties": {}},
        },
    },
]
```

Good descriptions are the most important part. The model picks tools only from these words.

## Step 4: Write the agent loop

```python
def run_agent(task: str, max_steps: int = 8) -> str:
    messages = [
        {"role": "system", "content": "You are a helpful assistant. Use tools when they help. Be brief."},
        {"role": "user", "content": task},
    ]

    for _ in range(max_steps):
        response = client.chat.completions.create(model=MODEL, messages=messages, tools=TOOL_SCHEMAS)
        message = response.choices[0].message
        messages.append(message)

        if not message.tool_calls:        # no tool wanted: this is the final answer
            return message.content

        for call in message.tool_calls:
            function = TOOLS.get(call.function.name)
            arguments = json.loads(call.function.arguments or "{}")
            result = function(**arguments) if function else f"Error: unknown tool {call.function.name}"
            print(f"  tool: {call.function.name}({arguments}) -> {result}")
            messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

    return "Stopped: step limit reached."

print(run_agent("How many minutes are left until midnight today?"))
```

Run it and you will see the agent call `current_time`, then `calculate`, then answer. You did not write that order anywhere. The model chose it.

## How the loop works

1. Send the conversation and the tool list to the model.
2. If the model replies with text only, you are done.
3. If it asks for a tool, run the function with the given arguments.
4. Add the result to the conversation with the role `tool`.
5. Go back to step 1.

Every agent framework is this loop with extra features added.

## Make it safe and useful

A toy agent becomes a real one when you add limits.

- **Step limit.** `max_steps` stops endless loops. Keep it.
- **Errors as text.** Return errors to the model, as the code above does. The model can often fix its own mistake on the next step.
- **Approval for risky actions.** For tools that delete, pay, or send messages, ask the user to confirm before running.
- **Small permissions.** A file tool should only reach one folder. A database tool should use a read-only account when possible.
- **Logs.** Print or save every tool call. You cannot fix what you cannot see.
- **Tests.** Keep a list of tasks with expected results and run them after each change. See [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).

## What to add next

- A **web search** tool and a **read page** tool make a research agent.
- **Read file**, **write file**, and **run command** tools make a coding agent.
- Connect ready-made tools through [MCP servers](/blogs/what-is-mcp-server) without writing each one yourself.

## FAQ

### Can I build an AI agent for free?

Yes. Run an open model on your own computer with Ollama and point the code at `http://localhost:11434/v1`. Choose a model that supports tool calling.

### Do I need LangChain or another framework?

No. The loop above is a complete agent. A framework can help later with memory, tracing, and multi-agent setups. Learn the loop first so you understand what the framework does.

### Why does my agent call the wrong tool?

Almost always because the tool description is unclear or two tools sound alike. Rewrite the descriptions, say when to use each tool, and give an example input.

### How many tools can an agent have?

It works best with a small, clear set. Past about twenty tools, models start to pick wrong ones more often. Group related actions or load tools only when needed.

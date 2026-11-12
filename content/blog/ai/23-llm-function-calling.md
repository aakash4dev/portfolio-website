---
title: LLM Function Calling Explained: How AI Models Use Tools
description: Function calling lets an AI model ask your code to run a function. Learn how tool calls work, with a full Python example and safety tips.
tags: Function Calling, Tools, LLM
keywords: function calling llm, tool calling, openai function calling, how llm use tools, tool use ai, function calling example
cover: flow message-square braces wrench
---

**Function calling**, also called **tool calling** or **tool use**, is a feature that lets a language model ask your program to run a function. The model does not run anything itself. It replies with the name of a function and the arguments as JSON. Your code runs the function and sends the result back, and the model uses that result to answer. This is how AI apps check the weather, search the web, query databases, and send emails.

## Why function calling exists

A language model alone can only produce text. It cannot:

- Look up live data such as prices or weather
- Read your database
- Do exact math
- Take actions such as sending a message

Function calling fixes this by connecting the model to normal code.

## How it works in four steps

1. **You describe your functions** to the model: name, purpose, and inputs.
2. **The user asks something.** The model decides whether a function would help.
3. **The model replies with a tool call**: a function name and JSON arguments. Your code runs the real function.
4. **You send the result back.** The model writes the final answer using it.

```text
User:   "What is 15% of 2,340?"
Model:  tool call -> calculate(expression="2340 * 0.15")
Code:   runs it   -> "351.0"
Model:  "15% of 2,340 is 351."
```

The key point: **the model only asks. Your code decides and acts.**

## A full example in Python

This uses the OpenAI chat format, which many providers and local tools support. The setup is covered in the [LLM API tutorial](/blogs/llm-api-python-tutorial).

```python
import json
from openai import OpenAI

client = OpenAI()
MODEL = "your-model-name"

# 1. A normal Python function
def get_order_status(order_id: str) -> str:
    orders = {"A100": "shipped", "A101": "processing"}
    return orders.get(order_id, "not found")

# 2. Its description for the model
tools = [{
    "type": "function",
    "function": {
        "name": "get_order_status",
        "description": "Get the current status of a customer order by its order ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string", "description": "Order ID, for example A100"}
            },
            "required": ["order_id"],
        },
    },
}]

messages = [{"role": "user", "content": "Where is my order A100?"}]

# 3. The model asks for a tool call
response = client.chat.completions.create(model=MODEL, messages=messages, tools=tools)
message = response.choices[0].message
messages.append(message)

for call in message.tool_calls or []:
    arguments = json.loads(call.function.arguments)
    result = get_order_status(**arguments)
    # 4. Send the result back
    messages.append({"role": "tool", "tool_call_id": call.id, "content": result})

final = client.chat.completions.create(model=MODEL, messages=messages, tools=tools)
print(final.choices[0].message.content)   # "Your order A100 has shipped."
```

## Writing good tool descriptions

The model chooses tools using only the name and description. This is where most problems start.

```text
Weak:    name: "search"       description: "Searches."

Strong:  name: "search_orders"
         description: "Find a customer's orders by email address.
         Use this when the user asks about past or current orders
         and has not given an order ID. Returns up to 10 orders,
         newest first."
```

Guidelines:

- Say **what** it does and **when** to use it.
- Describe every parameter, with an example value.
- Use `enum` for fields with fixed choices.
- Make names clear and different from each other.
- Return short, readable results. Do not return 5,000 rows.

## Function calling for structured output

You can use a tool only to get clean data, with no real function behind it. Define a tool whose parameters are the shape you want:

```python
tools = [{
    "type": "function",
    "function": {
        "name": "save_contact",
        "description": "Save contact details found in the text.",
        "parameters": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"},
                "phone": {"type": "string"},
            },
            "required": ["name"],
        },
    },
}]
```

The model fills in the fields from messy text and you receive JSON. Many providers also offer a strict mode that guarantees the output matches the schema.

## Several tool calls

- **Parallel calls.** The model can ask for several tools in one reply, such as the weather in three cities. Run them all and return every result.
- **Chains.** The model can call one tool, read the result, then call another. Running this in a loop until the model stops asking for tools is what makes an **agent**. See [build an AI agent from scratch](/blogs/build-ai-agent-from-scratch-python).

## Safety rules

The model's tool call is a **suggestion** made from text it has read. Treat it like input from a user.

- **Validate arguments.** Check types, ranges, and allowed values before running.
- **Check permissions in your code.** If user 5 is logged in, your function must refuse to return data for user 9, whatever the model asked for.
- **Ask for approval before actions that cannot be undone**: payments, deletes, sending messages.
- **Never pass arguments directly to a shell, `eval`, or raw SQL.**
- **Beware of prompt injection.** Text returned by a tool, such as a web page, can contain instructions that try to make the model call other tools. See [prompt injection explained](/blogs/prompt-injection-explained).
- **Return errors as text.** If a function fails, send the error message back so the model can try again or explain.

## Common problems

| Problem | Likely cause | Fix |
|---|---|---|
| The model never calls the tool | Vague description | Say when to use it |
| Wrong tool chosen | Two tools sound similar | Rename, make the difference clear |
| Invented argument values | Needed information is missing | Tell the model to ask the user |
| Invalid JSON | Weak model or complex schema | Simplify the schema, use strict mode |

## Function calling and MCP

Function calling is how one app gives tools to a model. The **Model Context Protocol** is a standard for packaging tools so that many apps can use the same ones. See [what an MCP server is](/blogs/what-is-mcp-server).

## FAQ

### Does the LLM run the function itself?

No. The model only returns the function name and arguments. Your program runs the function and returns the result.

### What is the difference between function calling and tool calling?

They mean the same thing. "Function calling" was the first name. "Tool calling" and "tool use" are the names used more often now.

### Do all LLMs support function calling?

Most current chat models do, including many open models. Small or old models may not, or may do it unreliably. Check the model's documentation.

### Is function calling the same as an AI agent?

Function calling is one step. An agent is function calling inside a loop, where the model keeps choosing tools until the task is done.

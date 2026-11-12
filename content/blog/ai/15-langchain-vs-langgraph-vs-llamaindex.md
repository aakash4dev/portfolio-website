---
title: LangChain vs LangGraph vs LlamaIndex: Which One to Use?
description: LangChain connects LLM parts, LangGraph builds agents as graphs, LlamaIndex focuses on RAG. Compare them and learn when to use none.
tags: LangChain, LangGraph, LlamaIndex
keywords: langchain vs langgraph, langchain vs llamaindex, langchain vs langgraph vs langsmith, langgraph vs llamaindex, llm framework comparison
cover: hero git-compare link workflow library scale
---

**LangChain** is a general toolkit of ready-made parts for LLM apps. **LangGraph** is a library for building agents and multi-step flows as a graph with saved state. **LlamaIndex** is focused on connecting LLMs to your data, mainly for RAG. **LangSmith** is not a framework at all: it is a tool for tracing and testing. And for many small projects, the best choice is none of them.

## Quick comparison

| | LangChain | LangGraph | LlamaIndex | LangSmith |
|---|---|---|---|---|
| Main purpose | Connect models, prompts, tools, and data | Agents and flows with state | RAG and data access | Tracing, testing, monitoring |
| Core idea | Chains of parts | Nodes and edges in a graph | Indexes and query engines | Logs of every step |
| Best for | Quick prototypes, many integrations | Complex agents, human approval steps | Document question answering | Debugging any LLM app |
| Made by | LangChain team | LangChain team | LlamaIndex team | LangChain team |

## What LangChain is

LangChain gives you standard building blocks:

- One interface for many model providers
- Prompt templates
- Document loaders and text splitters
- Connections to vector databases
- Tool definitions

You join these parts into a pipeline. Its largest strength is the number of integrations. If you need to load data from an unusual source or switch model providers, there is probably a ready component.

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_template("Summarize in one sentence: {text}")
chain = prompt | model          # model is any LangChain chat model
print(chain.invoke({"text": "..."}).content)
```

The common complaint is the number of layers. When something goes wrong, you may need to read through several layers of library code to find out what prompt was really sent.

## What LangGraph is

LangGraph comes from the same team, and it solves a different problem. Agents are loops, not straight lines: think, act, look, repeat. LangGraph lets you draw this as a **graph**:

- **Nodes** are steps, such as "call the model" or "run a tool".
- **Edges** say which step comes next, and can depend on the result.
- **State** is shared data that every node can read and update.

It also saves state between steps. That gives you features that are hard to build by hand:

- Pause for a person to approve an action, then continue.
- Resume after a crash.
- Go back to an earlier step and try again.

Use LangGraph when your agent has branches, loops, several agents working together, or steps that need human review. For background, see [what AI agents are](/blogs/what-are-ai-agents).

## What LlamaIndex is

LlamaIndex started with one goal: make an LLM answer from your data. It is strongest in the data side of RAG:

- Loading many file types, including difficult PDFs
- Splitting documents in smart ways
- Building indexes
- Advanced retrieval methods such as re-ranking and query rewriting

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("docs").load_data()
index = VectorStoreIndex.from_documents(documents)
answer = index.as_query_engine().query("What is the refund policy?")
print(answer)
```

Five lines give a working document question-answering system. That is its appeal. If RAG is new to you, read [what RAG is](/blogs/what-is-rag) first.

LlamaIndex has agent features too, and LangChain has RAG features. They overlap. But each is strongest in its original area.

## What LangSmith is

LangSmith is a hosted tool that records every step of an LLM app: each prompt, each model reply, each tool call, with timing and cost. It also runs test sets. It works with LangChain and LangGraph and can be used with plain code too. It answers the question "what really happened in this request?"

## Which one should you choose?

- **Document Q&A or search over your data:** LlamaIndex.
- **An agent with loops, branches, or approval steps:** LangGraph.
- **A quick prototype that needs many integrations:** LangChain.
- **A simple app with one or two model calls:** no framework.
- **You cannot see why your app fails:** add tracing, with LangSmith or an open-source option.

They can be combined. A common setup uses LlamaIndex for retrieval and LangGraph for the agent that calls it.

## When to use no framework

A model call is one HTTP request. An agent is a short loop. A basic RAG system is: embed, search, build a prompt, call the model. Writing these yourself has real benefits:

- You see the exact prompt being sent.
- There is less code to debug.
- Library updates cannot break your app.
- You learn how things work.

A good approach is to build the first version by hand, as in [build an AI agent from scratch](/blogs/build-ai-agent-from-scratch-python) and [build a RAG chatbot](/blogs/build-rag-chatbot-python). Add a framework when you meet a problem it clearly solves, such as saved state, many data loaders, or complex flows.

## Things to check before you commit

These libraries change fast, so check the current state yourself:

- **Read the current docs.** Tutorials older than a year often use removed functions.
- **Check how easy debugging is.** Can you print the final prompt?
- **Pin versions** in your project so updates do not surprise you.
- **Keep your own logic separate** from framework code, so you can switch later.

## FAQ

### Is LangGraph replacing LangChain?

No. They work together. LangChain provides parts such as model wrappers and tools. LangGraph controls the flow between steps. For new agent projects, the LangChain team itself points people to LangGraph.

### Is LlamaIndex better than LangChain for RAG?

For projects that are mostly about documents and retrieval, LlamaIndex usually needs less code and has more retrieval features built in. LangChain is more general.

### Do I need LangChain to build an AI app?

No. Many production apps use the model provider's SDK directly. Frameworks save time when you need their specific features.

### What is the difference between LangSmith and LangGraph?

LangGraph is a library you build agents with. LangSmith is a service that records and tests what your app does. One builds, the other observes.

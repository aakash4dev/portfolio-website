---
title: What Is an MCP Server? Model Context Protocol Explained
description: MCP is an open standard that connects AI apps to tools and data. Learn what an MCP server is, how it works, and build one in Python.
tags: MCP, AI Agents, Tools
keywords: mcp server, mcp server meaning, mcp full form, what is mcp server, mcp server examples, model context protocol
cover: hero plug bot server wrench database
---

**MCP** stands for **Model Context Protocol**. It is an open standard for connecting AI applications to outside tools and data. An **MCP server** is a small program that offers some ability, such as reading files, querying a database, or calling an API, in a standard way that any MCP-compatible AI app can use.

A common comparison is a USB port: one standard plug, many devices. Without MCP, every AI app needs custom code for every tool. With MCP, a tool is written once and works everywhere.

## The problem MCP solves

An AI model alone can only write text. To be useful it needs to read your files, search your tickets, or check your calendar.

Before MCP, each app wrote its own connection to each service. Five AI apps and ten services meant up to fifty separate integrations. With MCP, each app implements the protocol once and each service is wrapped once. Five plus ten, not five times ten.

MCP was introduced by Anthropic in late 2024 as an open standard, and many AI apps and editors now support it.

## The three roles: host, client, server

- **Host.** The AI app the user works in, such as a chat app or a code editor.
- **Client.** A part inside the host that keeps a connection to one server.
- **Server.** The program that provides the tools or data.

A host can connect to many servers at the same time: one for GitHub, one for a database, one for the file system.

## What an MCP server can offer

A server can expose three kinds of things:

| Kind | What it is | Who uses it |
|---|---|---|
| **Tools** | Functions the model can call, such as `create_issue` | The model decides |
| **Resources** | Data the app can read, such as a file or a database table | The app or user selects |
| **Prompts** | Ready-made prompt templates | The user picks |

Tools are the most used. Each tool has a name, a description, and a schema for its inputs, the same idea as [LLM function calling](/blogs/llm-function-calling).

## How a request flows

1. The host starts and connects to its MCP servers.
2. Each server sends a list of its tools.
3. The host gives those tool descriptions to the model.
4. The user asks something, for example "What are my open bugs?"
5. The model decides to call the `list_issues` tool.
6. The host sends that call to the right server.
7. The server runs it and returns the result.
8. The model reads the result and answers the user.

Messages use JSON-RPC, a simple request and response format.

## Local and remote servers

MCP servers run in two ways:

- **Local (stdio).** The host starts the server as a program on your computer and talks to it through standard input and output. Good for files and local tools.
- **Remote (HTTP).** The server runs on the internet and the host connects by URL. Good for shared services, usually with a login step.

## Build a simple MCP server in Python

The official Python SDK makes a basic server very short.

```bash
pip install "mcp[cli]"
```

```python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes")
NOTES: dict[str, str] = {}

@mcp.tool()
def add_note(title: str, text: str) -> str:
    """Save a note with a title."""
    NOTES[title] = text
    return f"Saved note: {title}"

@mcp.tool()
def read_note(title: str) -> str:
    """Read a saved note by its title."""
    return NOTES.get(title, "No note with that title.")

if __name__ == "__main__":
    mcp.run()
```

The function name becomes the tool name, the docstring becomes the description, and the type hints become the input schema.

To use it, add the server to your AI app's MCP settings. Most apps use a JSON entry like this:

```json
{
  "mcpServers": {
    "notes": { "command": "python", "args": ["/full/path/to/server.py"] }
  }
}
```

After a restart, you can ask the app to "save a note called ideas" and the model will call your tool.

## Examples of MCP servers

Ready-made servers exist for many things:

- **File system**: read and write files in chosen folders.
- **GitHub and GitLab**: issues, pull requests, code search.
- **Databases**: run queries on PostgreSQL or SQLite.
- **Browser automation**: open pages, click, take screenshots.
- **Work tools**: Slack, Google Drive, Notion, Jira.

## MCP security: what to check

An MCP server runs with real access, so treat it like any software you install.

- **Install only servers you trust.** A local server can do anything your user account can do.
- **Give the smallest access.** Limit a file server to one folder. Use a read-only database user when you can.
- **Review tool calls.** Keep approval turned on for actions that change or delete data.
- **Watch for prompt injection.** Content a tool returns, such as a web page or an issue comment, may contain hidden instructions. See [prompt injection explained](/blogs/prompt-injection-explained).
- **Keep secrets out of prompts.** Pass API keys through environment variables in the server settings.

## MCP vs a normal API

MCP does not replace APIs. An MCP server is usually a thin layer **on top of** an API. The API is made for programmers. The MCP layer describes the same actions in a form a model can discover and call by itself.

## FAQ

### What is the full form of MCP?

Model Context Protocol. It is an open standard for giving AI models access to tools and data.

### Is MCP only for Claude?

No. It is an open standard. Many AI apps, code editors, and agent frameworks from different companies support it.

### What is the difference between MCP and function calling?

Function calling is how a model asks to run a tool inside one app. MCP is a standard way to package and share those tools so they work across many apps.

### Do I need MCP to build an AI agent?

No. You can give tools to a model directly, as shown in [building an AI agent from scratch](/blogs/build-ai-agent-from-scratch-python). MCP helps when you want to reuse existing tools or share yours.

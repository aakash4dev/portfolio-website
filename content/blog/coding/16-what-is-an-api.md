---
title: What Is an API and How Does It Work? Simple Guide With Examples
description: An API lets two programs talk to each other. Learn how requests and responses work, HTTP methods, status codes, API keys, and call a real API.
tags: API, Web Development, Basics
keywords: what is api, what is api and how it works, api explained, what is api key, rest api example, how to use an api
cover: flow monitor arrow-left-right server
---

An **API**, or **Application Programming Interface**, is a set of rules that lets one program ask another program for data or for an action. When a weather app shows today's forecast, it sends a **request** to a weather service's API and receives a **response** with the data. The app does not need to know how the service works inside. It only needs to know what to ask and what comes back.

## The restaurant example

- **You** are the app that needs something.
- **The kitchen** is the system that has the data or does the work.
- **The waiter** is the API.

You do not walk into the kitchen. You read the menu, give your order to the waiter, and the waiter brings your food. The menu is the **API documentation**: it lists what you can ask for and how.

## Where APIs are used

- "Sign in with Google" on another website
- A shop that takes card payments through a payment provider
- A travel site that compares prices from many airlines
- A map embedded in a delivery app
- Your phone's weather app
- An AI chatbot inside a product. See the [LLM API tutorial](/blogs/llm-api-python-tutorial).

Nearly every modern app is built by combining APIs.

## How a web API works

Most APIs today work over **HTTP**, the same protocol as web pages.

### The request

A request has four parts:

1. **URL (endpoint):** the address of the resource, such as `https://api.example.com/users/42`.
2. **Method:** what you want to do.
3. **Headers:** extra information, such as your API key and the data format.
4. **Body:** the data you send, for creating or updating something.

### HTTP methods

| Method | Purpose | Example |
|---|---|---|
| `GET` | Read data | Get user 42 |
| `POST` | Create something | Create a new user |
| `PUT` | Replace something | Replace user 42 |
| `PATCH` | Change part of something | Update the email of user 42 |
| `DELETE` | Remove something | Delete user 42 |

### The response

The server answers with:

1. **A status code:** a number that says how it went.
2. **Headers.**
3. **A body:** the data, usually as **JSON**.

### Status codes

| Code | Meaning |
|---|---|
| `200 OK` | Success |
| `201 Created` | Something new was created |
| `204 No Content` | Success, nothing to return |
| `400 Bad Request` | Your request was wrong |
| `401 Unauthorized` | Missing or invalid login or key |
| `403 Forbidden` | You are known, and not allowed |
| `404 Not Found` | That resource does not exist |
| `429 Too Many Requests` | You hit the rate limit |
| `500 Internal Server Error` | The server failed |

A quick rule: **2xx** worked, **4xx** is your mistake, **5xx** is the server's mistake.

### JSON

JSON is the usual data format. It is text made of keys and values.

```json
{
  "id": 42,
  "name": "Asha Verma",
  "email": "asha@example.com",
  "roles": ["admin", "editor"],
  "active": true
}
```

## Call a real API

GitHub has a public API that needs no key for simple requests.

**With curl, in a terminal:**

```bash
curl https://api.github.com/users/octocat
```

**With JavaScript:**

```javascript
const response = await fetch("https://api.github.com/users/octocat");

if (!response.ok) {
  throw new Error(`Request failed: ${response.status}`);
}

const user = await response.json();
console.log(user.name, user.public_repos);
```

**With Python:**

```python
# pip install requests
import requests

response = requests.get("https://api.github.com/users/octocat", timeout=10)
response.raise_for_status()          # raises an error for 4xx and 5xx

user = response.json()
print(user["name"], user["public_repos"])
```

### Sending data with POST

```javascript
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.API_KEY}`,
  },
  body: JSON.stringify({ name: "Ben", email: "ben@example.com" }),
});

const created = await response.json();
console.log(response.status, created.id);     // 201 and the new id
```

For the `await` syntax, see [async and await in JavaScript](/blogs/javascript-async-await).

## What an API key is

An **API key** is a secret string that identifies your app to the API. The service uses it to:

- Know who is calling
- Count your usage and apply limits
- Bill you, if the API is paid
- Block misuse

It is usually sent in a header:

```text
Authorization: Bearer sk_live_abc123...
```

### Keep API keys safe

- **Never put a key in front-end code.** Anyone can read it in the browser. Call the API from your server.
- **Never commit a key to Git.** Store it in an environment variable or a secrets manager, and add `.env` to `.gitignore`.
- **Use the smallest permissions** the key needs.
- **Rotate a key at once** if it leaks.

### Other ways to authenticate

- **OAuth 2.0:** lets a user give an app limited access to their account without sharing their password. This is behind "Sign in with Google".
- **JWT (JSON Web Token):** a signed token that proves who the user is on each request.
- **Basic authentication:** a username and password in a header. Only acceptable over HTTPS, and less common now.

## Types of APIs

| Type | How it works | Used for |
|---|---|---|
| **REST** | Resources at URLs, standard HTTP methods, JSON | Most public web APIs |
| **GraphQL** | One endpoint. The client asks for exactly the fields it wants | Apps with complex, connected data |
| **gRPC** | Fast binary calls with a strict contract | Communication between internal services |
| **WebSocket** | A connection that stays open in both directions | Chat, live updates, games |
| **Webhook** | The server calls **your** URL when something happens | Payment confirmations, notifications |
| **SOAP** | Older, XML-based, strict | Banks and legacy enterprise systems |

They are compared in [REST vs GraphQL vs gRPC](/blogs/rest-vs-graphql-vs-grpc).

**APIs are not only on the web.** A library's functions are an API. Your operating system has an API for files and windows. The browser has APIs such as `fetch` and `localStorage`. The word means any defined way for code to use other code.

## Rate limits and pagination

**Rate limits** cap how many requests you may send in a period. If you go over, you get `429`. Good practice:

- Read the limit in the documentation and in the response headers.
- Wait and retry, with longer pauses each time.
- Cache results you will need again.

**Pagination** splits long lists into pages.

```text
GET /products?page=2&limit=50
GET /products?cursor=eyJpZCI6MTAwfQ
```

Keep requesting until the response says there is no next page.

## How to read API documentation

Look for five things:

1. **Base URL**
2. **Authentication:** how to send your key or token
3. **Endpoints:** the paths and methods
4. **Parameters and body:** what is required and what is optional
5. **Responses and errors:** the shape of the data and the error codes

Many APIs publish an **OpenAPI** description with a page where you can try requests in the browser. Tools such as Postman, Insomnia, or curl are useful for testing before you write code.

## Build a small API yourself

With Python and FastAPI:

```python
# pip install "fastapi[standard]"
from fastapi import FastAPI, HTTPException

app = FastAPI()
tasks = {1: {"id": 1, "title": "Learn APIs", "done": False}}

@app.get("/tasks")
def list_tasks():
    return list(tasks.values())

@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.post("/tasks", status_code=201)
def create_task(title: str):
    task_id = max(tasks) + 1
    tasks[task_id] = {"id": task_id, "title": title, "done": False}
    return tasks[task_id]
```

```bash
fastapi dev main.py
```

Open `http://127.0.0.1:8000/docs` to see and test your API in the browser.

## Good habits when using APIs

- **Always check the status code** before using the data.
- **Set a timeout.** A request without one can hang forever.
- **Handle errors and retry** temporary failures.
- **Validate the response.** Do not assume every field is present.
- **Do not log secrets.**
- **Use HTTPS only.**
- **Respect the terms of use** and the rate limits.

## FAQ

### What is an API in simple words?

It is a way for two programs to talk to each other. One program sends a request, and the other sends back data or performs an action.

### What is an API key?

A secret code that identifies your app when it calls an API. The service uses it to control access, count usage, and bill you. Keep it private.

### What is the difference between an API and a website?

A website returns pages for people to read. An API returns structured data, usually JSON, for programs to use.

### Are APIs free?

Some are free, some are free up to a limit, and some charge by usage. The pricing page of each API explains its rules.

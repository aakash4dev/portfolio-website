---
title: REST vs GraphQL vs gRPC: Differences and When to Use Each
description: REST is simple and universal, GraphQL lets clients pick fields, gRPC is fast for services. Compare them with code and a clear way to choose.
tags: API Design, REST, GraphQL
keywords: rest vs graphql, rest vs grpc, rest vs graphql vs grpc, rest vs soap, graphql vs rest api, when to use grpc
cover: hero git-compare server braces zap network
---

**REST** exposes resources at URLs and uses standard HTTP methods. It is simple, cacheable, and understood by every tool. **GraphQL** has one endpoint where the client asks for exactly the fields it needs, which suits apps with complex, connected data. **gRPC** sends compact binary messages over HTTP/2 with a strict contract, which makes it fast for communication between back-end services. Use REST by default, GraphQL when clients need flexible data, and gRPC between your own services.

If the idea of an API is new, start with [what an API is](/blogs/what-is-an-api).

## Quick comparison

| | REST | GraphQL | gRPC |
|---|---|---|---|
| Style | Resources and HTTP methods | A query language | Remote function calls |
| Endpoints | Many, one per resource | One | One per service method |
| Data format | JSON, usually | JSON | Protocol Buffers (binary) |
| Contract | Optional (OpenAPI) | Required schema | Required `.proto` file |
| Transport | HTTP/1.1 or HTTP/2 | HTTP, usually POST | HTTP/2 |
| Who decides the fields | The server | The client | The server |
| Caching | Easy, with HTTP caching | Harder | Harder |
| Streaming | Limited | Subscriptions | Built in, both directions |
| Works in browsers | Yes | Yes | Needs a proxy (gRPC-Web) |
| Speed | Good | Good | Fastest |
| Learning curve | Low | Medium | Medium to high |

## REST

REST stands for Representational State Transfer. Each thing in your system is a **resource** with a URL, and you act on it with HTTP methods.

```text
GET    /users/42            read user 42
GET    /users/42/orders     read that user's orders
POST   /users               create a user
PATCH  /users/42            update part of a user
DELETE /users/42            delete the user
```

```bash
curl https://api.example.com/users/42
```

```json
{
  "id": 42,
  "name": "Asha",
  "email": "asha@example.com",
  "address": { "city": "Pune", "country": "IN" },
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### Strengths

- **Simple and familiar.** Any language, any tool, a browser, or curl can call it.
- **HTTP caching works.** Browsers and CDNs cache `GET` responses with no extra work.
- **Clear status codes** for errors.
- **Easy to debug.** Requests and responses are readable text.

### Weaknesses

- **Over-fetching.** You get the whole user object when you needed only the name.
- **Under-fetching.** To show a user with their orders and each order's products, you may need several requests in a row.
- **Many endpoints** to design, version, and document.
- **No required contract.** The shape of the data is whatever the documentation says, and documentation can be out of date.

## GraphQL

GraphQL was created at Facebook and released in 2015. The server publishes a **schema** of types. The client sends a **query** describing exactly the data it wants.

```graphql
query {
  user(id: 42) {
    name
    orders(last: 3) {
      total
      items {
        product { title }
      }
    }
  }
}
```

The response has the same shape as the query, and nothing more:

```json
{
  "data": {
    "user": {
      "name": "Asha",
      "orders": [
        { "total": 1200, "items": [{ "product": { "title": "Keyboard" } }] }
      ]
    }
  }
}
```

One request replaced what might be three or four REST calls.

The schema that makes this possible:

```graphql
type User {
  id: ID!
  name: String!
  orders(last: Int): [Order!]!
}

type Order {
  id: ID!
  total: Int!
  items: [OrderItem!]!
}

type Query {
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}
```

- **Query:** read data.
- **Mutation:** change data.
- **Subscription:** receive live updates.

### Strengths

- **The client gets exactly what it asks for.** Good for mobile apps on slow networks.
- **One request for connected data.**
- **A strongly typed schema** that tools use for autocomplete, validation, and generated types.
- **The API can grow without versions.** Add fields, and mark old ones as deprecated.
- **Front-end teams move faster**, because they do not wait for a new endpoint.

### Weaknesses

- **Caching is harder.** Most requests are `POST` to one URL, so HTTP caching does not apply directly.
- **The N+1 problem.** A naive server runs one database query per item in a list. Fixing it needs batching, for example with DataLoader.
- **Expensive queries.** A client can ask for deeply nested data. You need limits on depth and cost.
- **Errors often come with status 200**, inside the response body, which confuses monitoring tools.
- **More setup** on the server.

## gRPC

gRPC was created at Google. You define services and messages in a **`.proto`** file, and a tool generates client and server code in many languages. Calling the remote service looks like calling a local function.

```protobuf
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User);
  rpc ListUsers (ListUsersRequest) returns (stream User);   // server streaming
}

message GetUserRequest {
  int64 id = 1;
}

message ListUsersRequest {
  int32 page_size = 1;
}

message User {
  int64 id = 1;
  string name = 2;
  string email = 3;
}
```

Using the generated client in Python:

```python
import grpc
import user_pb2, user_pb2_grpc

channel = grpc.insecure_channel("localhost:50051")
client = user_pb2_grpc.UserServiceStub(channel)

user = client.GetUser(user_pb2.GetUserRequest(id=42))
print(user.name)
```

Data is sent as **Protocol Buffers**: a compact binary format. Messages are several times smaller than JSON and faster to read and write.

### Strengths

- **Fast and compact.**
- **A strict contract** with generated, type-safe code. Client and server cannot disagree about the shape of the data.
- **Streaming in four modes:** single request and response, server stream, client stream, and both directions at once.
- **HTTP/2:** many calls share one connection.
- **Built-in deadlines and cancellation.**

### Weaknesses

- **Browsers cannot call it directly.** You need gRPC-Web with a proxy, or an alternative such as Connect.
- **Not human-readable.** You need tools such as `grpcurl` to inspect calls.
- **Harder to cache** and to pass through some proxies and firewalls.
- **Client and server share the `.proto` file**, which ties their releases together more closely.

## The same task in all three

"Get the name and email of user 42."

```bash
# REST
curl https://api.example.com/users/42
```

```bash
# GraphQL
curl https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ user(id: 42) { name email } }"}'
```

```python
# gRPC
user = client.GetUser(user_pb2.GetUserRequest(id=42))
```

## How to choose

**Choose REST when:**

- You build a public API for other developers.
- Your data maps well to resources with create, read, update, and delete.
- HTTP caching matters.
- You want the simplest thing that works. This covers most projects.

**Choose GraphQL when:**

- Several clients, such as web and mobile, need different shapes of the same data.
- Screens show deeply connected data, and REST would need many requests.
- Your front end changes often, and you want to avoid a new endpoint for each change.
- You want one gateway in front of many services.

**Choose gRPC when:**

- Services inside your own system talk to each other.
- Speed and small messages matter: high traffic, or low-power devices.
- You need streaming.
- Your services are written in several languages and need one strict contract.

### They are often used together

A common design in larger systems:

```text
Browser / mobile app
        |  REST or GraphQL
        v
   API gateway / back end for the front end
        |  gRPC
        v
   Internal services
```

Public and client-facing traffic uses REST or GraphQL. Internal traffic uses gRPC.

## What about the others?

- **SOAP:** an older, XML-based protocol with strict standards. Still used in banks, government, and legacy enterprise systems. New projects rarely choose it.
- **WebSocket:** a connection that stays open for messages in both directions. Used for chat, live dashboards, and games.
- **Server-Sent Events:** a simple one-way stream from server to browser. Common for streaming AI responses.
- **Webhooks:** the server calls your URL when an event happens, so you do not have to keep asking.
- **tRPC:** type-safe calls between a TypeScript client and server with no schema file. Popular in full-stack TypeScript projects.

## Common mistakes

- **Choosing GraphQL or gRPC because it is newer.** REST is enough for most apps.
- **REST endpoints that are really verbs**, such as `POST /getUser`. Use resources and methods.
- **No versioning plan for REST.** Decide early, for example `/v1/users`.
- **GraphQL with no query limits**, leaving the server open to very expensive queries.
- **gRPC for a browser app** without planning for the proxy.
- **Changing field numbers in a `.proto` file.** That breaks existing clients. Add new fields with new numbers and never reuse old ones.

For where API design sits in a larger system, see [system design basics](/blogs/system-design-basics).

## FAQ

### What is the main difference between REST and GraphQL?

In REST the server decides what each endpoint returns. In GraphQL the client sends a query listing exactly the fields it wants, and gets all of it in one request.

### Is gRPC faster than REST?

Usually yes. gRPC uses a compact binary format and HTTP/2, so messages are smaller and connections are reused. The difference matters most with high traffic between services.

### Is GraphQL replacing REST?

No. Both are widely used. REST remains the most common choice for public APIs, and GraphQL is popular for apps with complex data and several kinds of clients.

### What is the difference between REST and SOAP?

REST is a simple style built on HTTP, usually with JSON. SOAP is a strict protocol that uses XML and formal contracts. SOAP is found mostly in older enterprise systems.

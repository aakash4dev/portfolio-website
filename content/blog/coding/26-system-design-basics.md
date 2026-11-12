---
title: System Design Basics: A Beginner's Guide With an Interview Framework
description: Learn the building blocks of large systems: load balancers, caching, databases, queues, and scaling. Includes a step-by-step interview method.
tags: System Design, Architecture, Interviews
keywords: system design, system design interview, system design basics, system design for beginners, how to scale a web application, system design interview questions
cover: hero network server database layers git-fork
---

**System design** is the work of deciding how the parts of a software system fit together so that it stays fast, reliable, and affordable as users and data grow. The core parts are few: clients, load balancers, application servers, databases, caches, message queues, and storage for files. Most designs are a combination of these, chosen by weighing trade-offs. This guide explains each part and gives a framework for system design interviews.

## Start simple: one server

Every system can begin like this.

```text
User  ->  Server (application + database)
```

One machine runs the code and the database. This is enough for thousands of users. Do not add complexity until you have a problem that needs it.

The problems that eventually arrive:

- The server cannot handle the load.
- If the server fails, everything is down.
- The database becomes the slowest part.

Each building block below answers one of these.

## Scaling: vertical and horizontal

- **Vertical scaling (scale up):** buy a bigger machine. Simple, and it has a ceiling and a single point of failure.
- **Horizontal scaling (scale out):** add more machines. No real ceiling, and it needs a load balancer and servers that do not keep user state.

**Stateless servers** are the key to horizontal scaling. If a server keeps a user's session in its own memory, that user must always return to the same server. Store sessions in a shared place such as Redis or a database, or in a signed token, and any server can handle any request.

## Load balancer

A load balancer sits in front of several servers and spreads requests among them.

```text
                    ┌──> Server 1
User -> Load balancer ──> Server 2
                    └──> Server 3
```

It also checks the health of each server and stops sending traffic to one that fails.

Common ways to choose a server:

- **Round robin:** each in turn.
- **Least connections:** the one with the fewest active requests.
- **Hash of the user or IP:** the same user goes to the same server.

Examples: Nginx, HAProxy, and the load balancers of every cloud provider.

## Databases

### SQL and NoSQL

| | SQL (relational) | NoSQL |
|---|---|---|
| Data model | Tables with rows, and relations | Documents, key-value pairs, wide columns, graphs |
| Schema | Fixed | Flexible |
| Transactions | Strong (ACID) | Varies |
| Joins | Yes | Limited or none |
| Scaling | Vertical first, horizontal with effort | Built for horizontal scaling |
| Examples | PostgreSQL, MySQL | MongoDB, DynamoDB, Cassandra, Redis |

**Default to a relational database.** PostgreSQL handles far more than most projects ever need. Choose NoSQL for a specific reason: very high write volume, a simple key-based access pattern at huge scale, or data without a fixed shape.

### Indexes

The first thing to check when queries are slow. See [how database indexes work](/blogs/how-database-indexes-work).

### Replication

Copy the database to other machines.

```text
              ┌──> Replica (reads)
Primary ──────┼──> Replica (reads)
(writes)      └──> Replica (reads)
```

- **Writes** go to the primary.
- **Reads** are spread over the replicas.
- If the primary fails, a replica is promoted.

This helps read-heavy systems, which is most of them. The cost is **replication lag**: a replica can be slightly behind, so a user may not see their own change for a moment.

### Sharding

When one machine cannot hold or write all the data, split it across several databases by a **shard key**, such as the user ID.

```text
Users A to H  ->  Shard 1
Users I to P  ->  Shard 2
Users Q to Z  ->  Shard 3
```

Sharding gives near-unlimited scale and makes many things harder: queries across shards, transactions, and moving data when shards fill unevenly. Use it late, after indexing, caching, and replication.

## Caching

A cache keeps the result of expensive work in fast memory so it need not be repeated.

```python
def get_user(user_id):
    key = f"user:{user_id}"
    cached = cache.get(key)
    if cached:
        return cached                      # fast path

    user = db.query("SELECT * FROM users WHERE id = %s", (user_id,))
    cache.set(key, user, ttl=300)          # keep for 5 minutes
    return user
```

This is the **cache-aside** pattern. Caches exist at several levels:

- **Browser cache** for static files
- **CDN** for files and pages close to the user
- **Application cache** such as Redis or Memcached
- **Database cache** inside the database itself

The hard parts are:

- **Invalidation:** removing or updating the cached value when the data changes. Stale data is the classic cache bug.
- **Expiry time (TTL):** short means fresher data and more load. Long means the opposite.
- **Eviction:** what to remove when memory is full. Least recently used (LRU) is the usual policy.
- **Stampede:** many requests rebuilding the same expired entry at the same moment.

## CDN

A **content delivery network** keeps copies of static files, such as images, videos, CSS, and JavaScript, on servers around the world. Each user is served from a nearby location. It lowers loading time and takes traffic away from your servers.

## Message queues

Some work should not make the user wait: sending email, resizing images, creating reports.

```text
Web server  ->  Queue  ->  Worker
(responds at once)        (does the slow work)
```

A queue gives you:

- **Faster responses.** The server adds a message and returns.
- **Buffering.** A sudden rush fills the queue instead of overloading the workers.
- **Decoupling.** If workers are down, messages wait.
- **Retries** for failed jobs.

Examples: RabbitMQ, Amazon SQS, Apache Kafka, and Redis-based queues.

Two things to design for:

- **A message may be delivered more than once.** Make the handler **idempotent**: processing the same message twice has the same result as once.
- **Poison messages** that always fail should go to a separate "dead letter" queue.

## File storage

Do not store uploaded files in the database or on an application server's disk. Use **object storage** such as Amazon S3, and keep only the file's address in the database. Serve the files through a CDN.

## Other building blocks

- **API gateway:** one entry point that handles authentication, rate limiting, and routing. See [REST vs GraphQL vs gRPC](/blogs/rest-vs-graphql-vs-grpc).
- **Rate limiter:** caps requests per user to protect the system from abuse.
- **Search engine:** Elasticsearch or OpenSearch for full-text search.
- **Monitoring:** metrics, logs, and traces. You cannot fix what you cannot see.
- **Containers and orchestration:** see [what Kubernetes is](/blogs/what-is-kubernetes).

## A typical web architecture

```text
Users
  │
  ├──> CDN (static files, images)
  │
  └──> Load balancer
          │
     ┌────┴─────┐
  Server      Server          (stateless)
     │           │
     ├──> Cache (Redis)
     ├──> Database primary ──> read replicas
     ├──> Queue ──> Workers ──> email, images, reports
     └──> Object storage (uploaded files)
```

Most products, including large ones, are variations of this picture.

## The key trade-offs

### The CAP theorem

In a distributed system, when the network between machines fails (a **partition**), you must choose:

- **Consistency:** every read returns the latest write, and some requests fail.
- **Availability:** every request gets an answer, and some answers are out of date.

Network failures do happen, so the real decision is which of the two to keep during one. A bank balance needs consistency. A social media feed can accept a slightly old view.

### Strong and eventual consistency

- **Strong:** after a write, everyone sees the new value at once. Simpler to reason about, slower, and harder to scale.
- **Eventual:** copies agree after a short delay. Faster and more available.

### Latency and throughput

- **Latency:** how long one request takes.
- **Throughput:** how many requests the system handles per second.

Improving one can hurt the other. Batching raises throughput and adds latency.

### Monolith and microservices

- **Monolith:** one application, deployed as a unit. Simple to build, test, and deploy. The right choice for most teams.
- **Microservices:** many small services. Teams can deploy independently and scale parts separately, at the cost of network calls, harder debugging, and more operations work.

Start with a well-organized monolith. Split a part out when a real need appears.

## Reliability terms

- **Single point of failure:** a part whose failure stops the whole system. Remove these with redundancy.
- **Failover:** switching to a backup automatically.
- **Timeouts and retries with backoff:** do not wait forever, and do not hammer a struggling service.
- **Circuit breaker:** stop calling a failing service for a while so that it can recover.
- **Availability "nines":** 99.9 percent means about 8.8 hours of downtime per year. 99.99 percent means about 53 minutes.

## A framework for system design interviews

A typical question: "Design a URL shortener", or a chat app, or a news feed. There is no single right answer. The interviewer is judging how you think.

### 1. Clarify the requirements (5 minutes)

Ask before drawing.

- **Functional:** What must it do? Which features are in scope?
- **Non-functional:** How many users? Reads versus writes? How fast? How available?

### 2. Estimate the scale (3 minutes)

Rough numbers only.

```text
100 million new short URLs per month
= about 40 writes per second
Reads are 100 times writes = about 4,000 reads per second
500 bytes per record x 100 million x 12 months x 5 years = about 3 TB
```

This tells you the system is read-heavy and that caching will matter.

### 3. Define the API (3 minutes)

```text
POST /urls          { "longUrl": "..." }  ->  { "shortUrl": "https://sho.rt/aB3x9" }
GET  /{code}        ->  redirect to the long URL
```

### 4. Draw the high-level design (10 minutes)

Client, load balancer, servers, database, cache. Explain the path of a request.

### 5. Design the data model

```sql
CREATE TABLE urls (
    code        VARCHAR(8) PRIMARY KEY,
    long_url    TEXT NOT NULL,
    user_id     BIGINT,
    created_at  TIMESTAMP NOT NULL
);
```

### 6. Go deep on the hard parts (15 minutes)

For a URL shortener: how do you create a short, unique code? Options include a counter converted to base 62, or a random string with a check for collisions. Discuss the trade-offs of each.

### 7. Find the bottlenecks and discuss trade-offs (5 minutes)

What breaks first at ten times the load? Where is the single point of failure? What would you monitor?

**Throughout:** think aloud, state your assumptions, and explain **why** you choose each part.

## Common mistakes

- **Starting to draw before asking questions.**
- **Adding every technology you know.** Each part must solve a stated problem.
- **Sharding and microservices on day one.**
- **Ignoring the numbers.** Scale decides the design.
- **Forgetting failure.** Ask what happens when each part goes down.
- **Giving one answer with no trade-offs.**

## How to keep learning

- Read "Designing Data-Intensive Applications" by Martin Kleppmann.
- Study the free "System Design Primer" on GitHub.
- Read engineering blogs from companies that describe real systems.
- Practice classic problems: URL shortener, rate limiter, chat, news feed, file storage, video streaming.
- Build something and put real load on it.

For the coding side of interviews, see [coding interview patterns](/blogs/coding-interview-patterns) and [Big O notation](/blogs/big-o-notation).

## FAQ

### What is system design in simple words?

It is planning how the parts of a software system, such as servers, databases, and caches, work together so that the system stays fast and reliable as it grows.

### What is the difference between horizontal and vertical scaling?

Vertical scaling makes one machine more powerful. Horizontal scaling adds more machines and spreads the load among them.

### When should I use SQL or NoSQL?

Use a relational SQL database by default, especially when data has relations and you need transactions. Choose NoSQL for specific needs such as very high write volume, flexible data shapes, or simple key-based access at very large scale.

### How do I prepare for a system design interview?

Learn the building blocks and their trade-offs, practice a fixed framework on common problems, do mock interviews where you explain your thinking aloud, and study how real systems are built.

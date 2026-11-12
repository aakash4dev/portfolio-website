---
title: What Is a Vector Database? Explained With a Simple Example
description: A vector database stores embeddings and finds items by meaning, not exact words. Learn how it works, see an example, and compare options.
tags: Vector Database, Embeddings, RAG
keywords: vector database, vector database example, vector database for rag, vector database meaning, vector database tutorial, what is a vector database
cover: hero database search waypoints chart-scatter layers
---

A **vector database** stores data as lists of numbers called vectors, and finds the items whose vectors are closest to a query vector. Because the vectors hold the meaning of text, images, or audio, this lets you search by **meaning** and not by exact words. Vector databases are the search layer behind most RAG systems.

## The problem a vector database solves

A normal database is good at exact matches:

```sql
SELECT * FROM articles WHERE title LIKE '%refund%';
```

This misses an article titled "How to get your money back", because the word "refund" is not in it. People ask the same thing in many different words. Keyword search cannot handle that well.

A vector database solves it by comparing meaning. "Refund" and "money back" end up close together, so both are found.

## What is a vector?

An **embedding model** turns a piece of content into a list of numbers, for example 384 or 1,536 numbers long. That list is the vector, also called an embedding. Content with similar meaning gets similar numbers.

Here is a simplified example with only 3 numbers:

```text
"dog"     -> [0.9, 0.1, 0.0]
"puppy"   -> [0.8, 0.2, 0.1]
"invoice" -> [0.0, 0.1, 0.9]
```

"Dog" and "puppy" are close. "Invoice" is far away. For a deeper look, read [what embeddings are](/blogs/what-are-embeddings).

## How a vector database works

1. **Insert.** You send each item's vector, plus its text and metadata such as author or date.
2. **Index.** The database arranges the vectors so that near ones can be found quickly.
3. **Query.** You send the vector of a question.
4. **Search.** The database returns the top K closest vectors, for example the 5 nearest.

"Closest" is measured with a distance function. The most common is **cosine similarity**, which compares the direction of two vectors.

## Why a special index is needed

The simple way to search is to compare the query with every stored vector. That is exact, but slow when you have millions of vectors.

Vector databases use **approximate nearest neighbor (ANN)** indexes. The best known is **HNSW**, which builds a graph where each vector links to its neighbors. A search walks through the graph and reaches the right area in a few steps.

The trade-off is that the result is approximate. The database might return 9 of the true top 10. In return, the search is hundreds of times faster. You can tune this balance between speed and accuracy.

## A working example with Chroma

Chroma is an open-source vector database that runs inside your Python program. It can create the embeddings for you.

```python
# pip install chromadb
import chromadb

client = chromadb.Client()
collection = client.create_collection("help_center")

collection.add(
    ids=["1", "2", "3"],
    documents=[
        "You can return any item within 30 days for a full refund.",
        "We ship to Europe in 5 to 7 working days.",
        "Reset your password from the login page.",
    ],
    metadatas=[{"topic": "returns"}, {"topic": "shipping"}, {"topic": "account"}],
)

results = collection.query(query_texts=["How do I get my money back?"], n_results=1)
print(results["documents"][0][0])
# You can return any item within 30 days for a full refund.
```

The query has no word in common with "refund" except the idea, and it still finds the right document.

## Filters and hybrid search

Real systems need more than nearest vectors:

- **Metadata filters** limit results, for example "only documents this user may see" or "only from this year".
- **Hybrid search** combines vector search with keyword search. Keyword search is better for exact terms such as product codes, error numbers, and names. Using both gives the best results in most apps.

## Popular vector databases

| Option | Type | Good for |
|---|---|---|
| pgvector | Extension for PostgreSQL | Teams that already use Postgres |
| Chroma | Open source, embedded | Prototypes and small apps |
| Qdrant | Open source, server | Production with strong filtering |
| Weaviate | Open source, server | Hybrid search features |
| Milvus | Open source, distributed | Very large data sets |
| Pinecone | Managed service | No servers to run |
| FAISS | Library, not a database | Fast search inside your own code |

If you already run PostgreSQL, start with pgvector. One database is easier to run than two.

## Do you need a vector database at all?

Not always.

- **Under about 100,000 vectors**, you can keep them in memory and search with NumPy in a few milliseconds.
- **If your content fits in the prompt**, skip search and paste it in.
- **If users search for exact words**, a normal full-text index may be enough.

Add a vector database when you have a lot of content, need filters, or need to add and remove items while the system runs.

## Where it fits in RAG

In a RAG system, the vector database is the "retrieval" part. Documents are split into chunks, embedded, and stored. Each question is embedded and used to find the best chunks, which go into the prompt. See [what RAG is](/blogs/what-is-rag) and [chunking strategies](/blogs/rag-chunking-strategies).

## FAQ

### What is a vector database in simple words?

It is a database that finds things by similar meaning. You store items as lists of numbers, and it returns the items whose numbers are closest to your query.

### Is a vector database the same as an embedding model?

No. The embedding model creates the vectors. The vector database stores them and searches them.

### Can I use PostgreSQL as a vector database?

Yes. The pgvector extension adds a vector column type and similarity search, including HNSW indexes.

### How is a vector database different from a normal database?

A normal database finds rows that match exact conditions. A vector database ranks rows by how close they are to a query vector. Many products now do both.

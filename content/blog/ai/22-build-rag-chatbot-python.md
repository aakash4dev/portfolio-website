---
title: Build a RAG Chatbot in Python: Chat With Your Own Documents
description: A step-by-step tutorial to build a RAG chatbot in Python. Load files, split, embed, store in Chroma, retrieve, and answer with sources.
tags: RAG, Python, Tutorial
keywords: rag chatbot python, build rag from scratch, rag tutorial, chat with pdf python, rag pipeline example, vector database for rag
cover: code PY message-square-quote
---

A RAG chatbot answers questions from your own documents. To build one in Python you need five steps: load the documents, split them into chunks, store the chunks in a vector database, find the best chunks for each question, and send them to a language model with the question. This tutorial builds the whole thing in about 80 lines, with sources shown in each answer.

If RAG is new to you, read [what RAG is](/blogs/what-is-rag) first.

## What you need

```bash
pip install chromadb openai
```

- **Chroma** is a vector database that runs inside your program and creates embeddings for you.
- **openai** is the client for the language model. It also works with a free local model through Ollama. See [how to run a local LLM](/blogs/run-local-llm-ollama).

Create a folder named `docs` and put a few `.txt` or `.md` files in it.

## Step 1: Load the documents

```python
from pathlib import Path

def load_documents(folder: str) -> list[dict]:
    documents = []
    for path in Path(folder).glob("**/*"):
        if path.suffix in {".txt", ".md"}:
            documents.append({"source": path.name, "text": path.read_text(encoding="utf-8")})
    return documents
```

For PDFs, use a library such as `pypdf` to extract the text first. The rest of the code stays the same.

## Step 2: Split into chunks

A whole document is too long and covers too many topics to search well. Split it into smaller pieces. This version splits on paragraphs and joins them until a size limit is reached, with a small overlap so that ideas at the border are not cut off.

```python
def split_text(text: str, max_chars: int = 1000, overlap: int = 150) -> list[str]:
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks, current = [], ""
    for paragraph in paragraphs:
        if current and len(current) + len(paragraph) > max_chars:
            chunks.append(current)
            current = current[-overlap:]        # keep the end of the last chunk
        current = f"{current}\n\n{paragraph}".strip()
    if current:
        chunks.append(current)
    return chunks
```

How you split has a large effect on answer quality. See [chunking strategies for RAG](/blogs/rag-chunking-strategies).

## Step 3: Store the chunks

```python
import chromadb

db = chromadb.PersistentClient(path="./rag_db")
collection = db.get_or_create_collection("docs")

def index_documents(folder: str) -> None:
    for document in load_documents(folder):
        chunks = split_text(document["text"])
        collection.upsert(
            ids=[f"{document['source']}-{i}" for i in range(len(chunks))],
            documents=chunks,
            metadatas=[{"source": document["source"]} for _ in chunks],
        )
    print(f"Stored {collection.count()} chunks.")
```

Chroma turns each chunk into an embedding with its built-in model and saves everything to disk. Using `upsert` means you can run indexing again without making duplicates. For background, see [what a vector database is](/blogs/what-is-a-vector-database).

## Step 4: Retrieve the best chunks

```python
def retrieve(question: str, top_k: int = 4) -> list[dict]:
    results = collection.query(query_texts=[question], n_results=top_k)
    return [
        {"text": text, "source": meta["source"]}
        for text, meta in zip(results["documents"][0], results["metadatas"][0])
    ]
```

## Step 5: Answer with the language model

```python
from openai import OpenAI

client = OpenAI()   # or OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL = "your-model-name"

SYSTEM = """You answer questions using only the provided context.
If the context does not contain the answer, say "I could not find that in the documents."
After your answer, list the source file names you used."""

def answer(question: str) -> str:
    chunks = retrieve(question)
    context = "\n\n".join(f"[Source: {c['source']}]\n{c['text']}" for c in chunks)
    response = client.chat.completions.create(
        model=MODEL,
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"},
        ],
    )
    return response.choices[0].message.content
```

Three details here do a lot of work:

- **"Using only the provided context"** keeps the model on your documents.
- **A fixed sentence for "not found"** gives it a safe way out. This lowers made-up answers. See [AI hallucinations](/blogs/ai-hallucinations).
- **Source labels** let users check the answer.

## Step 6: Run it

```python
if __name__ == "__main__":
    index_documents("docs")
    while True:
        question = input("\nAsk a question (or 'quit'): ")
        if question == "quit":
            break
        print(answer(question))
```

Run the file, ask something your documents cover, then ask something they do not cover. The second answer should be "I could not find that in the documents."

## Improve the chatbot

Once the basic version works, these changes give the biggest gains, in this order.

1. **Look at what was retrieved.** Print the chunks for each question. Most bad answers come from bad retrieval, not from the model.
2. **Fix chunking.** Keep headings with their text. Keep tables and code blocks whole.
3. **Add hybrid search.** Combine vector search with keyword search so exact terms such as product codes and error numbers are found.
4. **Add a re-ranker.** Retrieve 20 chunks, score them with a re-ranking model, keep the best 4.
5. **Handle follow-up questions.** "What about for Europe?" has no meaning alone. Use the model to rewrite a follow-up into a complete question before searching.
6. **Filter by metadata.** Limit the search by date, department, or user permissions.

## Test it properly

Do not judge by a few tries. Write 30 to 50 real questions with the correct answers and the file each answer is in. Then measure two things:

- **Retrieval:** is the correct file among the retrieved chunks?
- **Answer:** is the final answer correct and supported by the context?

Run this test after every change. The method is explained in [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).

## Common problems

- **"I could not find that" for things that are in the documents:** retrieval failed. Increase `top_k`, check your chunks, try hybrid search.
- **Answers mix up two documents:** chunks are too large or lack clear source labels.
- **Slow answers:** use a smaller model, retrieve fewer chunks, and stream the output.
- **Old information:** re-index when files change. Delete chunks of removed files.

## FAQ

### Can I build a RAG chatbot for free?

Yes. Chroma is free and open source, its default embedding model runs on your machine, and you can use a local language model through Ollama.

### How many documents can this handle?

This setup works well up to hundreds of thousands of chunks on one machine. For larger sets or many users at once, move to a database server such as PostgreSQL with pgvector or Qdrant.

### Do I need LangChain or LlamaIndex for RAG?

No. The code above is a complete RAG system. Frameworks help when you need many file loaders or advanced retrieval methods. See [LangChain vs LangGraph vs LlamaIndex](/blogs/langchain-vs-langgraph-vs-llamaindex).

### Why does my chatbot give wrong answers?

In most cases the right text was never retrieved. Print the retrieved chunks first. If they are wrong, fix splitting and search. If they are right and the answer is still wrong, improve the prompt or use a stronger model.

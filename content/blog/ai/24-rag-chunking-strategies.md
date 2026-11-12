---
title: RAG Chunking Strategies: How to Split Documents the Right Way
description: Chunking decides what your RAG system can find. Compare fixed-size, recursive, structure-based, and semantic chunking, with code and sizes.
tags: RAG, Chunking, Search
keywords: chunking strategies for rag, rag chunking, chunk size rag, text splitting, semantic chunking, how to chunk documents
cover: flow file-text scissors layout-grid
---

**Chunking** is splitting documents into smaller pieces before storing them for search in a RAG system. It matters because the model can only answer from the chunks that are retrieved. For most projects the best starting point is **recursive splitting by structure** (headings, then paragraphs, then sentences) with chunks of about 300 to 500 tokens and a small overlap. Then test with real questions and adjust.

New to RAG? Read [what RAG is](/blogs/what-is-rag) first.

## Why chunking is needed

- **Search works on focused text.** An embedding of a 40-page document mixes dozens of topics into one vector and matches nothing well. See [what embeddings are](/blogs/what-are-embeddings).
- **Embedding models have input limits.** Longer text is cut off.
- **Prompts should stay small.** Sending a whole document for every question costs more and can lower answer quality.

## The trade-off: small vs large chunks

| | Small chunks (100 to 200 tokens) | Large chunks (800 tokens or more) |
|---|---|---|
| Search accuracy | High, each chunk has one idea | Lower, ideas are mixed |
| Context for the model | Often too little | Plenty |
| Risk | Answer is split across chunks | Right chunk is not found |

There is no perfect size. The goal is a chunk that contains **one complete idea**: enough to be understood alone, and nothing more.

## Strategy 1: Fixed-size chunking

Cut the text every N characters or tokens.

```python
def fixed_chunks(text: str, size: int = 1000, overlap: int = 100) -> list[str]:
    return [text[i:i + size] for i in range(0, len(text), size - overlap)]
```

- **Good:** simple, fast, predictable.
- **Bad:** cuts through sentences, tables, and code. A chunk may start in the middle of a thought.

Use it only as a baseline to compare against.

## Strategy 2: Recursive chunking

Try to split on the largest natural boundary first. If a piece is still too large, split it on the next smaller boundary.

Order of separators: headings, then blank lines (paragraphs), then line breaks, then sentences, then words.

```python
def recursive_chunks(text: str, max_chars: int = 1500, separators=("\n## ", "\n\n", "\n", ". ")) -> list[str]:
    if len(text) <= max_chars:
        return [text.strip()] if text.strip() else []
    for separator in separators:
        parts = text.split(separator)
        if len(parts) > 1:
            chunks, current = [], ""
            for part in parts:
                candidate = current + separator + part if current else part
                if len(candidate) <= max_chars:
                    current = candidate
                else:
                    chunks.extend(recursive_chunks(current, max_chars, separators))
                    current = part
            chunks.extend(recursive_chunks(current, max_chars, separators))
            return chunks
    return fixed_chunks(text, max_chars, 0)
```

- **Good:** keeps paragraphs and sentences whole. Works on almost any text.
- **Bad:** does not know what the text means.

This is the best default. Most RAG libraries include a ready version.

## Strategy 3: Structure-based chunking

Use the document's own structure:

- **Markdown and HTML:** split by headings. Each section is a chunk.
- **Code:** split by function or class.
- **Tables:** keep the whole table together, or one chunk per row with the column names repeated.
- **FAQ pages:** one question and answer per chunk.
- **Chat logs and transcripts:** split by speaker turn or by topic.

Then add the path of headings to each chunk:

```text
Guide > Billing > Refunds

Refunds are accepted within 30 days of purchase...
```

That one line of context often improves retrieval more than any other change, because a chunk that says "It takes 30 days" is useless without knowing what "it" is.

## Strategy 4: Semantic chunking

Let meaning decide the borders. Embed each sentence, compare neighbors, and start a new chunk where the similarity drops, which signals a change of topic.

- **Good:** chunks follow topics, even in text with no headings.
- **Bad:** slower and more costly to build, and it does not always beat recursive splitting.

Try it for long unstructured text such as transcripts and interviews.

## Strategy 5: Small-to-big retrieval

Search with small chunks, but give the model more.

1. Split documents into large "parent" sections.
2. Split each parent into small "child" chunks and embed the children.
3. Search over the children, which is precise.
4. Send the **parent** of each matching child to the model, which gives full context.

A simpler form is the **sentence window**: search on single sentences, then send that sentence plus a few before and after.

## Overlap

Overlap repeats the end of one chunk at the start of the next, so an idea at the border is whole in at least one chunk.

- A common value is **10 to 20 percent** of the chunk size.
- Structure-based chunks need little or no overlap.
- Too much overlap fills results with near duplicates.

## Starting sizes

| Content | Chunk size | Notes |
|---|---|---|
| Help articles, docs | 300 to 500 tokens | Split by headings |
| Legal and policy text | 500 to 800 tokens | Keep each clause whole |
| Source code | One function or class | Add the file path |
| Chat or call transcripts | 200 to 400 tokens | Split by topic or turn |
| FAQ | One Q and A | No overlap |

For token counts, see [tokens and context windows](/blogs/tokens-and-context-window).

## Add metadata to every chunk

Store these with each chunk:

- Source file or URL
- Title and heading path
- Date
- Access level or owner

Metadata lets you filter searches, show sources, and delete old chunks when a file changes.

## How to test your chunking

1. Write 30 to 50 real questions and note which document section answers each one.
2. Run the search and check whether that section is in the top results. This is your **retrieval hit rate**.
3. Change **one** setting, such as size or strategy.
4. Measure again and keep what scores better.

Read failed cases by hand. You will usually see the cause quickly: a table cut in half, a heading separated from its text, or two topics in one chunk. More on testing is in [how to evaluate LLM apps](/blogs/how-to-evaluate-llm-apps).

## Common mistakes

- **Splitting tables and code blocks in the middle.**
- **Leaving in menus, footers, and page numbers.** Clean the text first.
- **Chunks with no context**, such as "See the table above".
- **One size for every document type.**
- **Tuning by feel instead of measuring.**

A working pipeline to try these ideas on is in [build a RAG chatbot in Python](/blogs/build-rag-chatbot-python).

## FAQ

### What is the best chunk size for RAG?

There is no single best size. Start with 300 to 500 tokens for general text, then test with your own questions and adjust.

### What is chunk overlap in RAG?

It is text repeated between neighboring chunks so that sentences at a border are not lost. Ten to twenty percent of the chunk size is a common setting.

### Is semantic chunking better than recursive chunking?

Sometimes. It can help with long text that has no clear structure. For documents with headings and paragraphs, recursive or structure-based splitting is usually as good and much cheaper.

### Do large context windows make chunking unnecessary?

For a few short documents, yes: you can paste them in whole. For large collections you still need to retrieve the relevant parts, because sending everything is slow, costly, and less accurate.

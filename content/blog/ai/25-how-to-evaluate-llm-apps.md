---
title: How to Evaluate LLM Apps: A Practical Testing Guide
description: Stop judging AI apps by feel. Build a test set, choose the right checks, use an LLM as a judge, and catch quality drops before users do.
tags: Evaluation, Testing, LLM
keywords: llm evaluation, how to evaluate llm, llm evals, rag evaluation, llm as a judge, testing ai applications
cover: hero clipboard-check test-tube chart-line scale repeat
---

To evaluate an LLM app, build a set of real example inputs with expected results, run your app on all of them, score the outputs with automatic checks, and repeat after every change. This is called running **evals**. Without it, every prompt edit or model switch is a guess, and fixing one case can silently break five others.

## Why testing AI apps is different

Normal code gives the same output for the same input, so a test can check for an exact match. LLM output varies, and many different answers can be correct. So you need:

- **Many examples**, not one.
- **Scores**, such as "87 percent correct", not only pass or fail.
- **Checks that understand meaning**, not only exact text.

## Step 1: Build a test set

A test set is a list of inputs and what a good output looks like. Start with 30 to 50 cases. That is enough to see patterns.

```json
[
  {"input": "How do I reset my password?", "expected": "Go to Settings > Security > Reset password."},
  {"input": "Do you ship to Japan?", "expected": "No. Shipping is only available in Europe and India."},
  {"input": "What is your CEO's home address?", "expected": "REFUSE"}
]
```

Where to get cases:

- **Real user questions** from logs or support tickets. These are the most valuable.
- **Edge cases**: empty input, very long input, other languages, typos.
- **Questions with no answer** in your data. The right response is "I don't know".
- **Attacks**: attempts to get the system prompt or break the rules.
- **Every bug you find.** Add it as a case so it cannot return unnoticed.

## Step 2: Choose how to score

Use the simplest check that works for each case.

### Code checks

Fast, free, and exact. Use them whenever you can.

```python
import json

def check_valid_json(output: str) -> bool:
    try:
        json.loads(output)
        return True
    except ValueError:
        return False

def check_contains(output: str, required: list[str]) -> bool:
    return all(word.lower() in output.lower() for word in required)

def check_length(output: str, max_words: int) -> bool:
    return len(output.split()) <= max_words
```

Good for: format, required words, forbidden words, length, exact labels in classification, and whether the right tool was called.

### LLM as a judge

For meaning and quality, use a second model call to grade the output.

```python
JUDGE_PROMPT = """You are grading an answer.

Question: {question}
Expected answer: {expected}
Actual answer: {actual}

Does the actual answer give the same facts as the expected answer?
Ignore differences in wording. Reply with one word: PASS or FAIL.
Then give one sentence explaining why."""
```

Rules for a useful judge:

- **Ask one clear question** per judge. "Is it factually the same?" works. "Is it good?" does not.
- **Use PASS or FAIL**, not a 1 to 10 scale. Scales are inconsistent.
- **Ask for the reason.** It helps you debug.
- **Check the judge.** Grade 20 to 30 cases yourself and compare. If the judge disagrees with you often, fix its prompt.

### Human review

Slow, but the ground truth. Use it to create the first expected answers, to check the judge, and to read failures.

## Step 3: Run the evals

```python
def run_evals(app, test_cases, judge) -> float:
    passed = 0
    for case in test_cases:
        output = app(case["input"])
        ok = judge(case["input"], case["expected"], output)
        passed += ok
        if not ok:
            print(f"FAIL: {case['input']}\n  got: {output[:120]}")
    score = passed / len(test_cases)
    print(f"Score: {score:.0%} ({passed}/{len(test_cases)})")
    return score
```

Record the score with the date, the prompt version, and the model name. Now you can compare.

## Step 4: Improve with a loop

1. Run the evals and get a baseline score.
2. Read the failures. Group them by cause.
3. Fix the largest group: change the prompt, the retrieval, or the model.
4. Run **all** the evals again.
5. Keep the change only if the total score improves.

Change one thing at a time, so you know what caused the result.

## What to measure in a RAG system

A RAG system has two parts, and you should test them separately. See [what RAG is](/blogs/what-is-rag).

**Retrieval:**

- **Hit rate:** is the correct document among the retrieved chunks?
- **Rank:** how high up is it?

**Generation:**

- **Faithfulness:** is every claim in the answer supported by the retrieved text?
- **Answer relevance:** does it answer the question that was asked?
- **Correctness:** does it match the expected answer?

If retrieval fails, no prompt will save the answer. Check retrieval first. [Chunking strategies](/blogs/rag-chunking-strategies) is usually where to look.

## What to measure in an agent

For agents, also check the process. See [what AI agents are](/blogs/what-are-ai-agents).

- **Task success:** did it reach the goal? Check the final state, such as "the file exists" or "the tests pass".
- **Tool use:** did it call the right tools with valid arguments?
- **Efficiency:** number of steps, tokens, time, and cost.
- **Safety:** did it avoid forbidden actions?

## Do not forget cost and speed

A change that raises quality by one percent and doubles the cost may not be worth it. Track for every run:

- Tokens used per request
- Cost per request
- Time to first word and total time

## Evals in production

Offline tests do not cover everything real users do.

- **Log** inputs, outputs, and retrieved context, with care for private data.
- **Collect feedback**: thumbs up or down, edits, repeated questions.
- **Sample and review** a small number of real conversations each week.
- **Add failures to the test set.**
- **Run the evals automatically** before every release, the same as unit tests.

## Common mistakes

- **Testing with five examples and calling it done.**
- **Only easy cases.** Include the hard and strange ones.
- **Trusting an unchecked judge.**
- **Changing the prompt and the model at the same time.**
- **Fitting the prompt to the test set.** Keep some cases aside that you never tune against.
- **One overall score.** Break results down by category to see where the app is weak.

## Tools

You can start with a JSON file and a Python script. When you need shared dashboards and history, look at open-source tools such as promptfoo, Ragas, DeepEval, and Langfuse, or hosted ones such as LangSmith and Braintrust. The method matters more than the tool.

## FAQ

### What are evals in AI?

Evals are tests for AI systems. You run the system on a fixed set of inputs and score the outputs, so you can measure quality and compare versions.

### How many test cases do I need?

Start with 30 to 50 that cover your main use cases and known problems. Grow the set over time with real failures. A few hundred is common for mature apps.

### Can I trust an LLM to judge another LLM?

Yes, for narrow and clear questions, after you have compared its grades with your own on a sample. Do not trust it for vague questions like "is this answer good?"

### How do I reduce wrong answers found by evals?

It depends on the cause. Missing knowledge needs better retrieval. Format errors need clearer instructions or structured output. Made-up facts need grounding and permission to say "I don't know". See [AI hallucinations](/blogs/ai-hallucinations).

---
title: LLM Temperature and Top-P Explained: Which Values to Use
description: Temperature and top-p control how random an AI model's answers are. See how they work, with examples and the best values for each task.
tags: LLM Settings, Sampling, Prompting
keywords: llm temperature, temperature in ai, top p vs temperature, what is temperature in llm, top p sampling, llm parameters
cover: hero thermometer dice-5 sliders-horizontal chart-bar shuffle
---

**Temperature** controls how random a language model's word choices are. A low temperature (near 0) makes the model pick the most likely words, so answers are focused and repeatable. A high temperature (near 1 or above) makes it pick less likely words more often, so answers are more varied and creative, and also more likely to be wrong. **Top-p** is a second setting that limits which words can be picked at all.

## Where randomness comes from

A language model writes one token at a time. At each step it produces a probability for every possible next token. For the text "The sky is", it might produce:

```text
blue     70%
clear    15%
dark      8%
falling   2%
... thousands more with tiny chances
```

The model then **samples**: it picks one token using these chances. Temperature and top-p change this step. They do not change what the model knows.

## How temperature works

Temperature reshapes the probabilities before sampling.

| Temperature | Effect on the example | Result |
|---|---|---|
| 0 | Always picks "blue" | Same answer each time, focused |
| 0.3 | "blue" about 99% | Small variation |
| 1.0 | The original chances | Natural variety |
| 1.5 | "blue" drops to about 55%, rare words rise | Surprising, sometimes wrong |

Low temperature makes likely tokens even more likely. High temperature makes all tokens closer to equal.

Here is the math in a few lines of Python:

```python
import numpy as np

def apply_temperature(logits, temperature):
    scaled = np.array(logits) / temperature
    exp = np.exp(scaled - scaled.max())
    return exp / exp.sum()

logits = [4.0, 2.5, 1.8, 0.5]   # raw scores for: blue, clear, dark, falling
for t in [0.2, 1.0, 2.0]:
    print(t, apply_temperature(logits, t).round(2))
# 0.2 -> [1.   0.   0.   0.  ]
# 1.0 -> [0.73 0.16 0.08 0.02]
# 2.0 -> [0.51 0.24 0.17 0.09]
```

## How top-p works

Top-p, also called **nucleus sampling**, removes unlikely tokens before sampling. The model sorts tokens from most to least likely and keeps adding them until their total reaches p. Everything else is dropped.

With `top_p = 0.9` and the example above:

```text
blue 70% + clear 15% + dark 8% = 93%  -> reached 90%, stop
"falling" and all rarer tokens are removed
```

Top-p adapts to the situation. When the model is sure, only one or two tokens survive. When many words would fit, more of them stay.

## Temperature vs top-p

| | Temperature | Top-p |
|---|---|---|
| What it does | Reshapes all the chances | Cuts off the unlikely tail |
| Low value | Focused, repeatable | Only the top few tokens |
| High value | Random, creative | Almost all tokens allowed |
| Typical range | 0 to 2 | 0 to 1 |

Common advice from API providers is to **change one, not both**. Changing both makes the result hard to predict. For most work, adjust temperature and leave top-p at its default.

## Best values for each task

| Task | Temperature |
|---|---|
| Extracting data, classification | 0 |
| Code generation | 0 to 0.3 |
| Answering questions from documents (RAG) | 0 to 0.3 |
| Summaries | 0.3 to 0.5 |
| General chat | 0.7 |
| Marketing copy, stories, brainstorming | 0.8 to 1.2 |

Start from these and test on your own inputs.

## Set it in code

```python
response = client.chat.completions.create(
    model=MODEL,
    messages=[{"role": "user", "content": "Give me a name for a coffee shop."}],
    temperature=1.0,
)
```

Run this several times at temperature 1.0 and you get different names. At 0 you get the same name almost every time. The setup for this code is in the [LLM API tutorial](/blogs/llm-api-python-tutorial).

Note that some newer reasoning models fix these settings or ignore them. Check your model's documentation.

## Other sampling settings you may see

- **Top-k**: keep only the k most likely tokens, for example the top 40. Common in local model tools such as [Ollama](/blogs/run-local-llm-ollama).
- **Frequency and presence penalties**: lower the chance of tokens that already appeared, to reduce repetition.
- **Seed**: makes sampling repeatable on providers that support it.
- **Maximum tokens**: limits answer length. It does not change style.

## Three things people get wrong

**"Temperature 0 gives the same output every time."** Almost, but not always. Small differences in hardware and server setup can still change a token now and then. If you need exact repeats, store the outputs.

**"Low temperature stops hallucinations."** No. It makes the model pick its most likely answer, but the most likely answer can still be false. To reduce false answers, give the model the facts and allow it to say it does not know. See [AI hallucinations](/blogs/ai-hallucinations).

**"High temperature means more intelligence or creativity."** It only adds randomness. Past a certain point the text stops making sense. Better ideas come from better prompts, covered in the [prompt engineering guide](/blogs/prompt-engineering-guide).

## A simple way to choose

1. Does code read the output, or must it be the same each time? Use **0**.
2. Is it a factual answer for a person? Use **0.2 to 0.5**.
3. Do you want several different ideas? Use **0.8 to 1.0** and ask for many options.
4. Is the output strange or off-topic? Lower the temperature.
5. Is the output dull or repetitive? Raise it a little.

## FAQ

### What is temperature in an LLM in simple words?

It is a setting for randomness. Low means safe and repeatable. High means varied and less predictable.

### What is a good temperature for coding?

Between 0 and 0.3. Code must be correct, and the most likely token is usually the correct one.

### Should I change temperature or top-p?

Change temperature first and keep top-p at its default. Adjusting both at once makes results harder to control.

### Does temperature affect cost or speed?

No. It changes which tokens are chosen, not how many are produced. Cost depends on the number of tokens.

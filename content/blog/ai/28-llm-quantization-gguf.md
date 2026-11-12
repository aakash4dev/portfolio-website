---
title: LLM Quantization and GGUF Explained: Q4, Q5, Q8 Compared
description: Quantization shrinks AI models so they run on normal computers. Learn what Q4_K_M and GGUF mean and which version to download.
tags: Quantization, Local LLM, GGUF
keywords: llm quantization, what is gguf, q4_k_m meaning, quantized models, 4 bit quantization, which quantization to use
cover: flow package shrink laptop
---

**Quantization** makes an AI model smaller by storing its numbers with fewer bits, for example 4 bits instead of 16. A quantized model uses much less memory and runs faster, with a small loss in answer quality. **GGUF** is the file format most local tools use for quantized models. For most people the best choice is a **Q4_K_M** file: about a quarter of the original size with little quality loss.

## Why quantization is needed

A model is a very large list of numbers called weights. Each weight is normally stored as a 16-bit or 32-bit decimal number.

Take a model with 7 billion parameters:

```text
16-bit:  7,000,000,000 x 2 bytes   = about 14 GB
 8-bit:  7,000,000,000 x 1 byte    = about  7 GB
 4-bit:  7,000,000,000 x 0.5 bytes = about  3.5 GB (around 4 to 5 GB in practice)
```

At 16-bit, this model does not fit on a laptop with 8 GB of memory. At 4-bit, it does. That is the reason local AI on normal hardware is possible. For a setup guide, see [how to run a local LLM with Ollama](/blogs/run-local-llm-ollama).

## How quantization works

Think of measuring heights. You could record each person to the nearest millimetre, or to the nearest 5 centimetres. The second way needs fewer digits. You lose some detail, but the general picture is the same.

Quantization does this to weights. It maps a wide range of exact values onto a small set of allowed values:

```python
import numpy as np

weights = np.array([0.12, -0.83, 0.45, 0.91, -0.27])

# 4 bits = 16 possible levels
levels = 16
low, high = weights.min(), weights.max()
step = (high - low) / (levels - 1)

quantized = np.round((weights - low) / step).astype(int)   # stored as small integers
restored = quantized * step + low

print(quantized)            # [ 8  0 11 15  5]
print(restored.round(2))    # [ 0.1  -0.83  0.45  0.91 -0.25]
```

The restored values are close to the originals but not equal. Across billions of weights these small errors add up to a small drop in quality. Language models handle this well, because no single weight matters much.

## What GGUF is

**GGUF** is a single-file format for storing a model so it can be loaded quickly on normal computers. It comes from the **llama.cpp** project and is used by Ollama, LM Studio, and many other local tools.

One GGUF file contains:

- The quantized weights
- The tokenizer
- Settings such as the chat template and context size

So one download is everything needed to run the model. It replaced an older format called GGML.

## How to read quantization names

Model download pages show names such as `Q4_K_M`. Here is what the parts mean:

- **Q + number:** bits per weight. Q4 is about 4 bits, Q8 is about 8 bits.
- **K:** a newer, smarter method that gives important parts of the model more bits.
- **S, M, L:** small, medium, or large version of that level. Larger keeps more quality and takes more space.

| Name | Bits per weight | Size vs 16-bit | Quality | Use it when |
|---|---|---|---|---|
| Q2_K | about 2 to 3 | about 20% | Poor | Only if nothing else fits |
| Q3_K_M | about 3 to 4 | about 25% | Noticeably worse | Very low memory |
| **Q4_K_M** | about 4 to 5 | about 30% | Good | **Best default** |
| Q5_K_M | about 5 to 6 | about 35% | Very good | You have spare memory |
| Q6_K | about 6 to 7 | about 40% | Near original | Quality matters more than size |
| Q8_0 | about 8 | about 50% | Almost the same as original | Plenty of memory |
| F16 | 16 | 100% | Original | Converting or research |

Below 4 bits, quality drops quickly. Above 5 or 6 bits, extra size gives little extra quality.

## Which file should you download?

Use these two rules.

**Rule 1: the file must fit in memory, with room to spare.** Take the file size and add 1 to 2 GB for the context and overhead. That total should be less than your free RAM, or your VRAM if you use a graphics card.

**Rule 2: a bigger model at lower bits usually beats a smaller model at higher bits.** A 14-billion-parameter model at Q4 is generally better than a 7-billion-parameter model at Q8, though both need similar memory. Do not go below Q4 to make a larger model fit, unless you have tested it.

Quick guide:

| Free memory | A good choice |
|---|---|
| 8 GB | 7B or 8B model at Q4_K_M |
| 16 GB | 12B to 14B at Q4_K_M, or 7B at Q8 |
| 24 GB | 20B to 30B at Q4_K_M |
| 48 GB or more | 70B at Q4_K_M |

## What you lose

- **Hard reasoning and math** show the drop first.
- **Coding** is more sensitive than chat. Prefer Q5 or higher for code if you can.
- **Simple chat and summaries** show almost no difference at Q4.
- **Small models suffer more** than large ones from the same quantization.

The only reliable test is your own task. Run the same ten prompts on two versions and compare.

## Other formats you may see

- **GGUF:** runs on CPU, Apple Silicon, and GPU. The standard for local use.
- **Safetensors:** the usual format for full-precision models on Hugging Face.
- **AWQ and GPTQ:** quantized formats for GPU servers.
- **EXL2:** a GPU format with flexible bit rates.
- **bitsandbytes 4-bit:** quantizes while loading, used for training with QLoRA. See [LoRA and QLoRA explained](/blogs/lora-qlora-explained).

## Quantization vs smaller models

Quantization keeps all the parameters and stores each one with less detail. A **smaller model** has fewer parameters. **Distillation** trains a small model to copy a large one. These are different methods and are often used together.

## FAQ

### What does Q4_K_M mean?

It is a quantization level: about 4 bits per weight, using the newer K method, in the medium variant. It is the most common choice for local models.

### Does quantization make a model worse?

A little. At 4 bits and above the loss is small for most tasks. Below 4 bits it becomes easy to notice.

### Is GGUF only for CPU?

No. GGUF models can run on CPU, on GPU, or on both at once, with some layers on the GPU and the rest in normal RAM.

### What is the difference between GGUF and GGML?

GGUF is the newer format that replaced GGML. It stores more information in the file and is easier to extend. Use GGUF files with current tools.

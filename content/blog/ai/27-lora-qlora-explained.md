---
title: LoRA and QLoRA Explained: Fine-Tune LLMs on a Single GPU
description: LoRA trains small add-on weights instead of the whole model. Learn how LoRA and QLoRA work, the key settings, and a training example.
tags: Fine-Tuning, LoRA, LLM
keywords: lora fine tuning, qlora explained, fine tuning llm techniques, fine tuning llm models, peft lora, lora vs full fine tuning
cover: hero puzzle layers sliders-horizontal cpu brain
---

**LoRA** (Low-Rank Adaptation) is a method for fine-tuning a large model by training a small set of new weights while the original model stays frozen. It often trains less than one percent of the parameters, so it needs far less memory and time than full fine-tuning. **QLoRA** adds one more step: it loads the frozen model in compressed 4-bit form, so that even large models can be fine-tuned on a single consumer GPU.

## The problem with full fine-tuning

A language model has billions of parameters. Full fine-tuning updates all of them. That means:

- **Huge memory use.** You must store the weights, their gradients, and optimizer data, several times the size of the model.
- **A full copy per task.** Each fine-tuned version is as large as the original.
- **Forgetting.** Changing every weight can damage what the model already knew.

LoRA is the most used solution. It belongs to a group of methods called **PEFT**: parameter-efficient fine-tuning.

## How LoRA works

A model layer contains a large table of numbers, a weight matrix **W**. Fine-tuning changes it to **W + ΔW**, where ΔW is the update.

The idea behind LoRA: the update does not need to be a full table. It can be written as two much smaller tables multiplied together.

```text
Full update:   ΔW       = 4096 x 4096       = 16,777,216 numbers
LoRA update:   B x A    = (4096 x 8) + (8 x 4096) = 65,536 numbers
```

That is 256 times fewer numbers for this layer. The number 8 is the **rank**, written `r`.

During training:

- **W is frozen.** It never changes.
- **A and B are trained.** They start so that B × A equals zero, so training begins from the original model's behavior.
- The layer's output becomes `W·x + (B·A)·x`.

After training you have two choices:

- **Keep the adapter separate.** It is a small file, often a few megabytes to a few hundred. One base model can serve many tasks by switching adapters.
- **Merge it** into W. The model then runs at normal speed with no extra parts.

## What QLoRA adds

Even with LoRA, the frozen model must sit in GPU memory. QLoRA loads it in **4-bit quantized** form, about a quarter of its usual size. The small LoRA weights are trained at normal precision on top.

The result is that models which once needed several expensive GPUs can be fine-tuned on one. Quality stays close to full-precision LoRA in most tests. For how quantization works, see [quantization and GGUF explained](/blogs/llm-quantization-gguf).

| | Full fine-tuning | LoRA | QLoRA |
|---|---|---|---|
| Weights trained | All | Under 1% in most setups | Under 1% in most setups |
| Base model in memory | Full precision | Full precision | 4-bit |
| GPU memory | Very high | Medium | Low |
| Output | Full model copy | Small adapter | Small adapter |
| Quality | Highest ceiling | Close to full | Close to LoRA |

## The settings that matter

- **`r` (rank):** size of the small tables. Common values are 8, 16, and 32. Higher rank can learn more and uses more memory. Start with 16.
- **`lora_alpha`:** a scaling factor for the update. A common choice is 2 × r.
- **`target_modules`:** which layers get adapters. The attention layers are the usual choice. Adding more layers can help on harder tasks.
- **`lora_dropout`:** a small value such as 0.05 helps against overfitting.
- **Learning rate:** higher than in full fine-tuning. Around 1e-4 to 2e-4 is a common start.
- **Epochs:** one to three passes over the data is typical. More leads to memorizing.

## A training example

This uses the Hugging Face `peft` and `transformers` libraries. It shows the structure. Check the current library docs for exact arguments, as they change over time.

```python
# pip install transformers peft bitsandbytes datasets accelerate
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

model_name = "your-base-model"

# QLoRA: load the base model in 4-bit
quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)
model = AutoModelForCausalLM.from_pretrained(model_name, quantization_config=quant_config, device_map="auto")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = prepare_model_for_kbit_training(model)

# LoRA settings
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# example output: trainable params: 0.1% of all params

# ...train with the Trainer or SFTTrainer on your data set...

model.save_pretrained("my-adapter")   # saves only the small adapter
```

## Preparing the data

Data quality decides the result more than any setting.

- **Format:** pairs of input and ideal output, in the chat format the base model expects.
- **Amount:** a few hundred good examples can be enough for a narrow task. A few thousand is safer.
- **Variety:** cover the range of inputs you expect in real use.
- **Consistency:** if two examples answer the same input in different styles, the model learns confusion.
- **Hold out a test set:** keep 10 to 20 percent of the data out of training to measure real quality.

## Signs of trouble

- **Training loss falls, test loss rises:** overfitting. Use fewer epochs, more data, or a lower rank. See [overfitting vs underfitting](/blogs/overfitting-vs-underfitting).
- **No change in behavior:** learning rate too low, rank too low, or the wrong layers targeted.
- **The model repeats training examples word for word:** too many epochs on too little data.
- **Worse at general tasks:** the data was too narrow. Mix in some general examples.

## When to use LoRA, and when not to

**Use it when** you need a fixed style or format, a narrow task at high volume, or a small model to match a large one on a single job.

**Do not use it** to teach the model facts from your documents. Retrieval works better for that. The full comparison is in [fine-tuning vs RAG](/blogs/fine-tuning-vs-rag). And always try a better prompt first, since it costs nothing.

## FAQ

### What does LoRA stand for?

Low-Rank Adaptation. "Low-rank" refers to writing the weight update as two small matrices multiplied together.

### What is the difference between LoRA and QLoRA?

LoRA trains small adapter weights on a frozen model. QLoRA does the same but loads the frozen model in 4-bit form, which cuts memory use and lets larger models fit on one GPU.

### How much GPU memory do I need for QLoRA?

It depends on the model size and settings. As a rough guide, models around 7 billion parameters can be fine-tuned with QLoRA on a GPU with 12 to 16 GB of memory.

### Is LoRA as good as full fine-tuning?

For most practical tasks it is very close. Full fine-tuning can do better when the new task is very different from what the model already knows and you have a lot of data.

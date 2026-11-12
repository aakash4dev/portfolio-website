---
title: How to Learn Coding for Beginners: A Free Step-by-Step Plan
description: Learn to code from zero with free resources. What to learn first, a week-by-week plan, projects to build, and how to avoid tutorial hell.
tags: Beginners, Learning, Career
keywords: how to learn coding, how to learn coding for free, how to learn coding for beginners, learn programming from scratch, coding for beginners free
cover: flow book-open keyboard rocket
---

To learn coding, pick **one language** (Python or JavaScript), learn the basics with **one free course**, write code every day, and start building **small projects of your own** within the first month. You do not need a degree, a powerful computer, or paid courses. You need about an hour a day and the habit of solving problems yourself before looking up the answer.

## Step 1: Choose a goal and one language

Your goal decides the language. Do not learn two at once.

| You want to | Start with |
|---|---|
| Not sure yet, just learn to program | Python |
| Build websites | HTML, CSS, then JavaScript |
| AI, data, automation | Python |
| Mobile apps | JavaScript (React Native), Kotlin, or Swift |
| Games | C# with Unity, or GDScript with Godot |

If you cannot decide: **Python**. Its syntax is the simplest, so you can focus on thinking. See [Python vs Java vs C++](/blogs/python-vs-java-vs-cpp) for a comparison.

The first language matters less than you think. The second one takes a fraction of the time.

## Step 2: Set up

You need only a laptop and an internet connection.

- **An editor:** Visual Studio Code, which is free.
- **The language:** install Python from python.org, or Node.js for JavaScript.
- **Zero-install option:** start in the browser with Replit or a free online editor.

On a phone you can read and do small exercises, but real practice needs a keyboard. A cheap or old laptop is enough.

## Step 3: Learn the fundamentals (weeks 1 to 6)

These ideas are the same in every language:

1. **Variables and data types:** numbers, text, true and false
2. **Operators:** math and comparisons
3. **Conditions:** `if`, `else`
4. **Loops:** `for`, `while`
5. **Functions:** reusable blocks of code
6. **Collections:** lists and dictionaries (arrays and objects in JavaScript)
7. **Reading errors** and fixing them
8. **Files and input**

```python
# A first real program: a number guessing game
import random

secret = random.randint(1, 20)
tries = 0

while True:
    guess = int(input("Guess a number from 1 to 20: "))
    tries += 1
    if guess < secret:
        print("Too low")
    elif guess > secret:
        print("Too high")
    else:
        print(f"Correct! You needed {tries} tries.")
        break
```

This short program uses variables, a loop, conditions, input, and a library. When you can write it without looking, you know the basics.

### Free courses that are worth your time

Pick **one** and finish it.

- **CS50** from Harvard: a complete introduction to computer science. CS50P is the Python version.
- **freeCodeCamp:** full, free paths for web development and Python, with exercises in the browser.
- **The Odin Project:** a project-based path for web development.
- **Python.org tutorial** and **MDN Web Docs:** the official references. Good to read along with a course.
- **Automate the Boring Stuff with Python:** a free online book about practical scripts.

## Step 4: Practice the right way

Watching is not learning. You learn when you type, get stuck, and get unstuck.

- **Type every example yourself.** Do not copy and paste.
- **Change the example** after it works. What happens if you alter this line?
- **Predict before you run.** Say what the code will print, then check.
- **Read the error message.** It usually names the line and the problem.
- **Struggle for 15 to 20 minutes** before looking up a solution. That effort is where learning happens.
- **Write code every day.** Thirty focused minutes daily beats five hours once a week.

Small exercise sites such as Exercism, Codewars, and the easy problems on LeetCode are good for daily practice.

## Step 5: Build projects (start in week 3 or 4)

Projects turn knowledge into skill. Start small and finish each one.

**Beginner projects**

- A calculator
- A to-do list in the terminal
- A quiz game
- A password generator
- A script that renames files in a folder

**Next level**

- A weather app that calls a public API. See [what an API is](/blogs/what-is-an-api).
- A personal website
- A web scraper that collects prices or headlines
- A budget tracker that saves to a file or database
- A simple chatbot

**Rule:** build something **you** want. Interest keeps you going when it gets hard.

### How to get out of tutorial hell

"Tutorial hell" means watching course after course and still being unable to build anything alone. To get out:

1. Stop starting new courses.
2. Pick a small project with no step-by-step guide.
3. Break it into tiny tasks ("show a text box", "save one item").
4. Search for each small problem as it comes up.
5. Finish it, even if the code is ugly.

Being stuck and searching **is** the real work of programming. Professionals do it daily.

## Step 6: Learn the tools of the trade

Alongside your projects, learn:

- **Git and GitHub** to save and share code. See the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).
- **The command line.** See the [Linux commands cheat sheet](/blogs/linux-commands-cheat-sheet).
- **Debugging:** print values, then learn your editor's debugger.
- **Reading documentation.**
- **Asking good questions:** what you tried, what you expected, what happened, and the exact error.

## Step 7: Go deeper (months 4 to 12)

Choose a direction and learn what it needs.

- **Web front end:** HTML, CSS, JavaScript, then React. See [JavaScript vs TypeScript](/blogs/javascript-vs-typescript).
- **Back end:** a framework such as FastAPI, Django, or Express, plus databases. See [SQL joins explained](/blogs/sql-joins-explained).
- **AI and data:** follow [how to learn AI](/blogs/how-to-learn-ai).
- **Computer science basics:** [data structures](/blogs/data-structures-explained), [Big O notation](/blogs/big-o-notation), and [recursion](/blogs/recursion-explained). These matter for interviews and for writing efficient code.

## A realistic 12-week plan

| Weeks | Focus | Result |
|---|---|---|
| 1 to 2 | Variables, conditions, loops | Small exercises daily |
| 3 to 4 | Functions, lists, dictionaries | Guessing game, calculator |
| 5 to 6 | Files, errors, libraries | A script that processes a file |
| 7 to 8 | Git, the command line, an API | A weather or currency tool on GitHub |
| 9 to 10 | A first larger project | To-do or budget app |
| 11 to 12 | Improve, write a README, share | Two finished projects online |

At one hour a day, this gets you from zero to building simple programs alone. Job readiness usually takes 6 to 12 months or more of steady work.

## Using AI while you learn

AI assistants are excellent tutors if you use them to understand, not to skip the work.

**Good uses**

- "Explain this error message and why it happens."
- "Give me a hint, not the answer."
- "Review my code and tell me what could be clearer."
- "Explain this concept with a simple example."

**Uses that hurt you**

- Asking it to write the whole program and pasting the result.
- Accepting code you do not understand.

If the AI writes everything, you do not build the skill of reading and fixing code, and that skill is exactly what you need when the AI is wrong. See [how to use AI for coding](/blogs/ai-coding-assistants).

## Common mistakes

- **Switching languages** every few weeks.
- **Collecting courses** and finishing none.
- **Only watching videos.**
- **Starting with a project that is far too big.**
- **Comparing yourself** with people who have coded for ten years.
- **Avoiding errors.** Errors are information, not failure.
- **Skipping the basics** to reach frameworks faster.
- **Studying alone in silence.** Join a community and ask questions.

## How to stay motivated

- Set a tiny daily goal: "write code for 25 minutes".
- Keep a list of what you built. Progress is easy to forget.
- Share your work, even small things.
- Find one study partner or an online community.
- Expect bad days. Everyone feels lost at times, and it passes.

When you are ready to turn this into a career, read [how to become a software engineer](/blogs/how-to-become-software-engineer).

## FAQ

### How long does it take to learn coding?

With an hour a day, you can write simple programs in two to three months. Reaching a level where you can get a junior job usually takes six to twelve months or more of steady practice.

### Can I learn coding for free?

Yes. CS50, freeCodeCamp, The Odin Project, and official documentation cover everything a beginner needs at no cost.

### Do I need to be good at math to learn coding?

No. Most programming needs only basic arithmetic and logical thinking. Advanced math matters in specific fields such as machine learning, graphics, and cryptography.

### Can I learn coding on a mobile phone?

You can start with learning apps and small exercises. For real projects you need a computer with a keyboard, though a low-cost or older laptop is enough.

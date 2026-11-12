---
title: Python Virtual Environments Explained: venv, pip, and uv
description: A virtual environment keeps each project's packages separate. Learn to create one with venv or uv, install packages, and fix common errors.
tags: Python, Virtual Environments, Tools
keywords: python virtual environment, python venv, how to create virtual environment python, uv python, pip vs uv, requirements.txt
cover: flow folder package circle-check
---

A **virtual environment** is a private folder that holds a Python interpreter and the packages for **one project**. It stops projects from interfering with each other: project A can use Django 4 while project B uses Django 5. Create one with `python -m venv .venv`, activate it, and install packages with `pip`. Or use **uv**, a newer and much faster tool that does all of this for you.

## The problem it solves

By default, `pip install` puts packages in one shared place for the whole computer. That breaks down quickly:

- Project A needs `requests` version 2.25. Project B needs 2.32. Only one can be installed.
- Upgrading a package for one project breaks another.
- Your operating system uses Python too. Changing its packages can break system tools. Many Linux systems now block this with an "externally-managed-environment" error.
- You cannot tell which packages a project really needs.

One environment per project fixes all of these.

## Option 1: venv and pip (built into Python)

### Create

```bash
cd my-project
python -m venv .venv
```

This creates a folder named `.venv` with its own Python and `pip`. On some systems the command is `python3`.

### Activate

| System | Command |
|---|---|
| macOS, Linux | `source .venv/bin/activate` |
| Windows PowerShell | `.venv\Scripts\Activate.ps1` |
| Windows cmd | `.venv\Scripts\activate.bat` |

Your prompt now starts with `(.venv)`. While it is active, `python` and `pip` point to the environment.

Check:

```bash
which python        # macOS, Linux
where python        # Windows
```

The path should be inside your project's `.venv` folder.

### Install packages

```bash
pip install requests
pip install "fastapi==0.115.0"       # an exact version
pip list                             # what is installed
```

### Save and restore the list of packages

```bash
pip freeze > requirements.txt        # save exact versions
pip install -r requirements.txt      # install them on another machine
```

### Leave or delete

```bash
deactivate           # leave the environment
rm -rf .venv         # delete it. Your code is not affected.
```

An environment is disposable. If it is broken, delete it and create it again from `requirements.txt`.

## Option 2: uv (fast and all-in-one)

**uv** is a Python package and project manager written in Rust. It replaces `pip`, `venv`, `pip-tools`, and `pyenv` with one tool, and it is many times faster.

### Install uv

```bash
# macOS, Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Start a project

```bash
uv init my-project
cd my-project
uv add requests fastapi        # creates .venv, installs, and records the packages
uv run main.py                 # runs inside the environment, no activation needed
```

uv creates and manages these files:

- **`pyproject.toml`**: the packages your project asks for.
- **`uv.lock`**: the exact version of every package, including indirect ones.
- **`.venv/`**: the environment.

### Everyday commands

```bash
uv add pandas                  # add a package
uv add --dev pytest ruff       # add tools needed only for development
uv remove pandas               # remove a package
uv sync                        # make .venv match the lock file exactly
uv run pytest                  # run a command in the environment
uv lock --upgrade              # update to newer allowed versions
uv python install 3.13         # install a Python version
uv tool install ruff           # install a command-line tool for all projects
```

### uv as a faster pip

If you want to keep the classic workflow, uv has matching commands:

```bash
uv venv
uv pip install -r requirements.txt
```

## venv + pip vs uv

| | venv + pip | uv |
|---|---|---|
| Comes with Python | Yes | No, separate install |
| Speed | Slow on large projects | Very fast |
| Lock file with exact versions | Manual, with `pip freeze` | Automatic (`uv.lock`) |
| Installs Python versions | No | Yes |
| Need to activate | Yes | No, `uv run` handles it |
| Best for | Learning, simple scripts, restricted systems | New projects and teams |

For a new project today, uv is a good default. Learn `venv` too, because you will meet it everywhere.

## What "activate" does

It is less special than it looks. Activation changes the `PATH` variable of your terminal so that the `.venv` folder's `python` and `pip` are found first. That is all.

You can skip activation and call the environment's Python by its path:

```bash
.venv/bin/python script.py           # macOS, Linux
.venv\Scripts\python script.py       # Windows
```

This is handy in scripts, cron jobs, and Docker.

## What to commit to Git

| File | Commit it? |
|---|---|
| `pyproject.toml` | Yes |
| `uv.lock` or `requirements.txt` | Yes |
| `.python-version` | Yes |
| `.venv/` | **No** |

Add this to `.gitignore`:

```text
.venv/
__pycache__/
```

The environment contains thousands of files and paths that work only on your machine. Anyone can rebuild it from the lock file. For Git basics, see the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).

## requirements.txt vs a lock file

A hand-written `requirements.txt` often lists only what you asked for:

```text
fastapi>=0.110
requests
```

Each install may then pull different versions of these packages and of the packages they depend on. A program that works today can break next month with no change to your code.

A **lock file** records every package with its exact version and a checksum. Everyone on the team, and your server, gets the same set. This is the main reason to use uv, Poetry, or `pip-tools`.

## Other tools you will hear about

- **pipx:** installs command-line tools, each in its own environment. `uv tool install` does the same.
- **Poetry and PDM:** project managers with lock files, similar in purpose to uv.
- **conda:** manages non-Python libraries too. Common in data science, where packages need compiled math or GPU libraries.
- **pyenv:** installs and switches Python versions.
- **virtualenv:** the older tool that `venv` was based on.

## In your editor

VS Code and PyCharm detect a `.venv` folder in the project. In VS Code, open the command palette, choose "Python: Select Interpreter", and pick the one inside `.venv`. Without this step the editor may report "module not found" although the package is installed.

## Common errors and fixes

| Problem | Cause and fix |
|---|---|
| `ModuleNotFoundError` after installing | You installed into another Python. Activate the environment, or run `python -m pip install <package>` |
| `externally-managed-environment` | You are using the system Python. Create a virtual environment |
| PowerShell says scripts are disabled | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once |
| `pip` installs to the wrong place | Use `python -m pip`, which always uses the pip of the current Python |
| The environment broke after moving the folder | Environments contain fixed paths. Delete and create again |
| It works on my machine, not on the server | Versions differ. Use a lock file |

**A reliable habit:** type `python -m pip install ...` and not `pip install ...`. It guarantees that the package goes to the Python you are running.

## In Docker

A container is already isolated, but an environment is still useful for clean, multi-stage images. With uv:

```dockerfile
FROM python:3.13-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
CMD ["uv", "run", "main.py"]
```

`--frozen` installs exactly what the lock file says and fails if it is out of date. For Docker basics, see [Docker vs virtual machines](/blogs/docker-vs-virtual-machine).

## FAQ

### What is a virtual environment in Python?

It is a folder with its own Python interpreter and packages for one project, kept separate from other projects and from the system Python.

### Do I need a virtual environment for every project?

Yes, as a rule. It takes seconds to create and prevents version conflicts between projects.

### What is the difference between pip and uv?

pip installs packages. uv installs packages much faster and also creates environments, writes a lock file, and installs Python versions.

### Should I commit the venv folder to Git?

No. Commit `pyproject.toml` and the lock file, or `requirements.txt`. The environment can be rebuilt from them.

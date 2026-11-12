---
title: git pull vs git fetch: What Is the Difference?
description: git fetch downloads new commits without changing your files. git pull downloads and merges them. Learn when to use each, with examples.
tags: Git, Version Control, Basics
keywords: git pull vs git fetch, difference between git pull and git fetch, git fetch vs pull, what does git fetch do, git pull rebase
cover: versus download git-merge
---

`git fetch` downloads new commits from the remote repository and **does not touch your files or your branch**. `git pull` does a fetch and then **merges** the downloaded commits into your current branch. In short: **`git pull` = `git fetch` + `git merge`**. Use fetch when you want to look before you change anything. Use pull when you are ready to update your branch.

## Quick comparison

| | `git fetch` | `git pull` |
|---|---|---|
| Downloads new commits | Yes | Yes |
| Changes your working files | No | Yes |
| Changes your current branch | No | Yes |
| Can cause merge conflicts | No | Yes |
| Safe to run at any time | Yes | Only with a clean working tree, ideally |

## The idea you need: remote-tracking branches

Your repository has two kinds of branches:

- **Local branches**, such as `main`. These are yours and you work on them.
- **Remote-tracking branches**, such as `origin/main`. These are your local copy of where the branch was on the server **the last time you checked**.

```text
Server (GitHub):   A - B - C - D - E     <- main on the server
Your machine:      A - B - C             <- your local main
                           ^
                           origin/main   <- what you last saw
```

`origin/main` does not update by itself. It changes only when you talk to the server.

## What git fetch does

```bash
git fetch
```

It contacts the server, downloads commits D and E, and moves `origin/main` forward. Your `main` and your files stay exactly as they were.

```text
After git fetch:
                   A - B - C - D - E
                           ^       ^
                         main   origin/main
```

Now you can look at what changed before deciding what to do:

```bash
git log main..origin/main --oneline     # commits you do not have yet
git diff main origin/main               # the actual changes
git status                              # "Your branch is behind 'origin/main' by 2 commits"
```

When you are ready:

```bash
git merge origin/main
```

## What git pull does

```bash
git pull
```

It runs `git fetch` and then merges `origin/main` into your current branch in one step.

```text
After git pull:
                   A - B - C - D - E
                                   ^
                            main, origin/main
```

If you have no local commits of your own, Git simply moves your branch forward. This is called a **fast-forward**.

## When your branch and the remote have both changed

Suppose you made commit X locally, and a teammate pushed D and E.

```text
              D - E      <- origin/main
             /
A - B - C
             \
              X          <- your main
```

`git pull` must combine them. There are two ways.

### Merge (the default)

```bash
git pull
```

```text
              D - E
             /     \
A - B - C           M    <- merge commit
             \     /
              X ---
```

A **merge commit** joins the two lines. History shows exactly what happened, and it can get crowded with many small merge commits.

### Rebase

```bash
git pull --rebase
```

```text
A - B - C - D - E - X'   <- your commit, replayed on top
```

Git takes your commit, puts it aside, updates your branch, and replays your commit on top. History is one straight line. Your commit gets a new hash, which is fine because it had not been pushed.

Many teams prefer rebase for pulling. To make it the default:

```bash
git config --global pull.rebase true
```

To allow only fast-forward pulls, and stop with a message when history has diverged:

```bash
git config --global pull.ff only
```

## When to use fetch

- **Before you start work**, to see whether teammates pushed anything.
- **When you have uncommitted changes** and do not want to risk conflicts yet.
- **To review a teammate's branch** without merging it:

```bash
git fetch origin
git switch feature-login          # creates a local branch from origin/feature-login
```

- **In scripts and CI**, where you want exact control over what is merged.
- **To remove references to branches deleted on the server:**

```bash
git fetch --prune
```

## When to use pull

- Your working tree is clean and you want the latest code on your branch.
- You are on a branch you do not edit directly, such as `main`, and only want to update it.

A simple daily routine:

```bash
git switch main
git pull                      # update main
git switch -c my-feature      # start new work from the latest main
```

## Handling a conflict during pull

If you and a teammate changed the same lines, the pull stops:

```text
CONFLICT (content): Merge conflict in app.js
Automatic merge failed; fix conflicts and then commit the result.
```

1. Open the file. Git marks the two versions:

```text
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 3000;
>>>>>>> origin/main
```

2. Edit the file to the correct result and remove the markers.
3. Finish:

```bash
git add app.js
git commit                    # for a merge
# or
git rebase --continue         # for a rebase
```

To cancel and return to the state before the pull:

```bash
git merge --abort
# or
git rebase --abort
```

## Pulling with uncommitted changes

If your local edits touch the same files, Git refuses to pull so that nothing is overwritten. Options:

```bash
git stash          # put changes aside
git pull
git stash pop      # bring them back
```

Or let Git do it:

```bash
git pull --rebase --autostash
```

Or simply commit your work first, which is usually the cleanest.

## Force your branch to match the remote

To discard all local commits and changes and make your branch identical to the server:

```bash
git fetch origin
git reset --hard origin/main
```

**This deletes local work on that branch.** It is not the same as pulling. For safer ways to undo, see [how to undo the last commit](/blogs/git-undo-last-commit).

## Useful variations

```bash
git fetch --all                 # fetch from every remote
git fetch origin main           # fetch one branch
git pull origin main            # pull a specific branch into the current one
git pull --ff-only              # update only if no merge is needed
git remote -v                   # show which servers "origin" points to
```

## Common mistakes

- **Running `git pull` with half-finished work** and ending up in a conflict you did not expect. Fetch first, or stash.
- **Pulling into the wrong branch.** `git pull origin main` merges main into whatever branch you are on. Check with `git status`.
- **Thinking `git fetch` did nothing.** It updated `origin/*`. Your own branch moves only when you merge, rebase, or pull.
- **Rebasing commits that are already pushed and shared.** That rewrites history others depend on.
- **Using `git pull` as a habit without reading the output.** Read what was merged.

More daily commands are in the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).

## FAQ

### What is the difference between git pull and git fetch?

Fetch downloads new commits and updates your remote-tracking branches without changing your files. Pull does the same and then merges those commits into your current branch.

### Is git fetch safe?

Yes. It never changes your working files or local branches, so you can run it at any time.

### Should I use git pull or git pull --rebase?

Use `git pull --rebase` if you want a straight history without extra merge commits and your local commits are not pushed yet. Use plain `git pull` if your team prefers merge commits.

### Does git pull overwrite my local changes?

No. If a pull would overwrite uncommitted changes, Git stops and tells you. Committed changes are merged, and you resolve conflicts if both sides changed the same lines.

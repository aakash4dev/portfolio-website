---
title: How to Undo the Last Commit in Git (Keep or Discard Changes)
description: Undo a Git commit safely. Use reset to keep or drop changes, revert for pushed commits, amend for small fixes, and reflog to recover.
tags: Git, Version Control, How-To
keywords: git undo last commit, git undo commit, git undo last commit keep changes, git undo local commit, git reset soft, github undo commit after push
cover: hero undo-2 git-commit-horizontal history trash-2 shield-check
---

To undo the last commit in Git and **keep your changes**, run `git reset --soft HEAD~1`. To undo it and **throw the changes away**, run `git reset --hard HEAD~1`. If the commit is **already pushed** and other people may have it, do not reset. Run `git revert HEAD`, which adds a new commit that reverses it.

## Quick answer table

| Situation | Command |
|---|---|
| Undo commit, keep changes staged | `git reset --soft HEAD~1` |
| Undo commit, keep changes unstaged | `git reset HEAD~1` |
| Undo commit and delete the changes | `git reset --hard HEAD~1` |
| Commit was pushed and shared | `git revert HEAD` |
| Only fix the message or add a file | `git commit --amend` |
| Undo `git add` before committing | `git restore --staged <file>` |
| Get back a commit you deleted | `git reflog`, then `git reset --hard <hash>` |

`HEAD` means your current commit. `HEAD~1` means the commit before it.

## The three areas of Git

To choose the right command, know where your changes can be:

```text
Working directory  ->  Staging area (index)  ->  Repository (commits)
   your files            git add                   git commit
```

The three kinds of reset differ only in how far back they move your changes.

## Case 1: Undo the commit, keep the changes

### Soft reset: changes stay staged

```bash
git reset --soft HEAD~1
```

The commit is removed. Your files are unchanged, and the changes are still staged, ready to commit again. Use this when you committed too early or want to split one commit into several.

### Mixed reset: changes stay, but unstaged

```bash
git reset HEAD~1
```

This is the default (`--mixed`). The commit is removed and the changes are in your working directory, not staged. Use this when you want to choose again what to add.

## Case 2: Undo the commit and discard the changes

```bash
git reset --hard HEAD~1
```

The commit is removed and your files go back to the state of the previous commit.

**Warning:** uncommitted changes in tracked files are deleted and cannot be recovered. Run `git status` first. If you are unsure, save the work somewhere:

```bash
git stash          # put uncommitted changes aside
git branch backup  # keep a pointer to the current commit
```

| Reset type | Commit removed | Staging area | Your files |
|---|---|---|---|
| `--soft` | Yes | Kept | Kept |
| `--mixed` (default) | Yes | Cleared | Kept |
| `--hard` | Yes | Cleared | Reverted |

## Case 3: The commit is already pushed

`git reset` rewrites history. If others have pulled the commit, rewriting it causes conflicts for everyone.

Use **revert**. It creates a new commit that does the opposite of the bad one, and history stays intact.

```bash
git revert HEAD
git push
```

To revert an older commit, use its hash:

```bash
git log --oneline
git revert a1b2c3d
```

To revert several commits and make one combined commit:

```bash
git revert --no-commit HEAD~3..HEAD
git commit -m "Revert the last three commits"
```

### When rewriting a pushed commit is acceptable

If the branch is yours alone, such as a feature branch nobody else uses, you can reset and force push:

```bash
git reset --hard HEAD~1
git push --force-with-lease
```

`--force-with-lease` refuses to push if someone else has pushed in the meantime. Prefer it over plain `--force`. Never force push to `main` or another shared branch.

## Case 4: You only want to fix the last commit

No need to undo it. **Amend** it.

**Fix the message:**

```bash
git commit --amend -m "Correct message"
```

**Add a forgotten file:**

```bash
git add forgotten-file.js
git commit --amend --no-edit
```

Amending replaces the commit with a new one, so the same rule applies: do not amend a commit that others already have.

## Case 5: Undo `git add`

To unstage a file without losing your edits:

```bash
git restore --staged file.txt     # one file
git restore --staged .            # everything
```

On older Git versions, the same thing is `git reset HEAD file.txt`.

To discard the edits in a file completely:

```bash
git restore file.txt
```

This cannot be undone, because the edits were never committed.

## Case 6: Undo more than one commit

```bash
git reset --soft HEAD~3      # undo the last 3 commits, keep all changes staged
git reset --hard a1b2c3d     # go back to a specific commit, discard everything after
```

## Case 7: You reset by mistake. Get the commit back

Git keeps a log of every position `HEAD` has had. A commit removed by reset is still in the repository for a while, usually at least 30 days.

```bash
git reflog
```

```text
a1b2c3d HEAD@{0}: reset: moving to HEAD~1
f4e5d6c HEAD@{1}: commit: Add login form
9a8b7c6 HEAD@{2}: commit: Set up project
```

The lost commit is `f4e5d6c`. Restore it:

```bash
git reset --hard f4e5d6c
```

This is the reason an old piece of Git advice holds: **commit often**. Committed work is very hard to lose. Uncommitted work is easy to lose.

## Case 8: You committed to the wrong branch

Move the last commit to a new branch:

```bash
git branch new-feature       # new branch points at the commit
git reset --hard HEAD~1      # remove it from the current branch
git switch new-feature
```

Move it to an existing branch:

```bash
git switch correct-branch
git cherry-pick main         # copy the latest commit from main
git switch main
git reset --hard HEAD~1
```

## Reset vs revert

| | `git reset` | `git revert` |
|---|---|---|
| What it does | Moves the branch back | Adds a new opposite commit |
| History | Rewritten | Preserved |
| Safe for shared branches | No | Yes |
| Use when | The commit is only on your machine | The commit has been pushed |

## Common mistakes

- **Using `--hard` without checking `git status`.** You lose uncommitted work.
- **Resetting a shared branch and force pushing.** Teammates get broken history.
- **Using `HEAD^` on Windows cmd.** The `^` character has a special meaning there. Use `HEAD~1`.
- **Confusing revert with reset.** Revert adds a commit. Reset removes one.
- **Thinking a reverted secret is gone.** If you committed a password or API key and pushed it, it is still in the history. **Change the secret immediately.** Then remove it from history with a tool such as `git filter-repo`.

For more everyday commands, see the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet). To understand what `pull` does before you undo one, see [git pull vs git fetch](/blogs/git-pull-vs-git-fetch).

## FAQ

### How do I undo the last commit but keep my changes?

Run `git reset --soft HEAD~1`. The commit is removed and your changes stay staged. Use `git reset HEAD~1` if you want them unstaged.

### How do I undo a commit after pushing to GitHub?

Run `git revert HEAD` and then `git push`. This adds a new commit that reverses the change without rewriting history.

### What is the difference between git reset and git revert?

Reset moves the branch pointer back and removes commits from history. Revert keeps history and adds a new commit that cancels the changes.

### Can I recover a commit after git reset --hard?

Yes, if it was committed. Run `git reflog`, find the commit's hash, and run `git reset --hard <hash>`. Changes that were never committed cannot be recovered.

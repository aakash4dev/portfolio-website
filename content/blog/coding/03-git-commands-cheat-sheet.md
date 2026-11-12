---
title: Git Commands Cheat Sheet: 40 Commands You Will Really Use
description: A practical Git cheat sheet. Setup, branches, commits, stash, undo, remotes, and fixes for common mistakes, with short examples for each.
tags: Git, Cheat Sheet, Productivity
keywords: git commands, git cheat sheet, git commands list, how to git clone, how to git push, git stash, delete git branch, rename git branch
cover: hero git-branch terminal git-commit-horizontal git-merge list-checks
---

This cheat sheet covers the Git commands that handle almost all daily work, grouped by task. The core loop is: `git status` to see where you are, `git add` to stage, `git commit` to save, `git pull` to get updates, and `git push` to share.

## Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
git config --global pull.rebase true        # optional: rebase when pulling
git config --list                           # show settings
```

## Start a repository

```bash
git init                                    # make the current folder a repository
git clone https://github.com/user/repo.git  # copy an existing repository
git clone <url> my-folder                   # clone into a named folder
```

## The daily loop

```bash
git status                  # what changed, what is staged
git add file.js             # stage one file
git add .                   # stage everything in this folder
git add -p                  # stage piece by piece (review each change)
git commit -m "Add login form"
git push                    # send commits to the remote
git pull                    # get and merge remote commits
```

`git add -p` is worth learning early. It shows each change and asks whether to stage it, which keeps unrelated edits out of a commit.

## See what changed

```bash
git diff                    # unstaged changes
git diff --staged           # staged changes (what the next commit will contain)
git log --oneline           # short history
git log --oneline --graph --all     # history with branch lines
git log -p file.js          # every change made to one file
git show a1b2c3d            # one commit in full
git blame file.js           # who last changed each line
```

## Branches

```bash
git branch                  # list local branches
git branch -a               # list local and remote branches
git switch feature          # move to a branch
git switch -c feature       # create a branch and move to it
git switch -                # go back to the previous branch
git branch -m new-name      # rename the current branch
git branch -d feature       # delete a merged local branch
git branch -D feature       # delete a local branch even if not merged
git push origin --delete feature    # delete a branch on the remote
```

`git switch` and `git restore` are the newer, clearer replacements for the many uses of `git checkout`. The old form `git checkout -b feature` still works.

### Rename a branch locally and on the remote

```bash
git branch -m old-name new-name
git push origin -u new-name
git push origin --delete old-name
```

## Merge and rebase

```bash
git merge feature           # merge feature into the current branch
git merge --abort           # cancel a merge with conflicts
git rebase main             # replay your commits on top of main
git rebase --continue       # after fixing a conflict
git rebase --abort          # cancel the rebase
git rebase -i HEAD~3        # edit, combine, or reorder the last 3 commits
git cherry-pick a1b2c3d     # copy one commit onto the current branch
```

**Merge or rebase?** Merge keeps the true history and adds a merge commit. Rebase gives a straight line by rewriting your commits. A simple rule: rebase your own unpushed work, and never rebase commits that others already have.

## Remotes

```bash
git remote -v                           # list remotes
git remote add origin <url>             # connect a local repository to a remote
git push -u origin main                 # first push: also set the upstream
git fetch                               # download without merging
git fetch --prune                       # also remove deleted remote branches
git pull --rebase                       # pull and replay your commits on top
git push --force-with-lease             # overwrite the remote safely (your own branch only)
```

The difference between fetching and pulling is explained in [git pull vs git fetch](/blogs/git-pull-vs-git-fetch).

## Stash: put work aside

```bash
git stash                   # save uncommitted changes and clean the working tree
git stash -u                # include untracked files
git stash list              # see saved stashes
git stash pop               # bring back the latest stash and remove it from the list
git stash apply             # bring it back and keep it in the list
git stash drop              # delete the latest stash
git stash push -m "wip: form validation"    # stash with a name
```

Use it when you need to switch branches quickly and are not ready to commit.

## Undo things

```bash
git restore file.js                 # discard unstaged changes in a file
git restore --staged file.js        # unstage a file, keep the changes
git commit --amend -m "New message" # fix the last commit message
git commit --amend --no-edit        # add staged changes to the last commit
git reset --soft HEAD~1             # undo last commit, keep changes staged
git reset HEAD~1                    # undo last commit, keep changes unstaged
git reset --hard HEAD~1             # undo last commit and delete the changes
git revert a1b2c3d                  # new commit that reverses an old one (safe for shared branches)
git clean -n                        # preview which untracked files would be deleted
git clean -fd                       # delete untracked files and folders
git reflog                          # history of where HEAD has been: your safety net
```

Each case is explained in [how to undo the last commit in Git](/blogs/git-undo-last-commit).

## Tags

```bash
git tag v1.0.0                      # lightweight tag on the current commit
git tag -a v1.0.0 -m "First release"   # annotated tag
git push origin v1.0.0              # push one tag
git push --tags                     # push all tags
```

## .gitignore

Create a file named `.gitignore` in the project root. Files that match are not tracked.

```text
node_modules/
.env
dist/
*.log
.DS_Store
```

If a file was committed **before** you added it to `.gitignore`, Git keeps tracking it. Stop tracking it without deleting it from disk:

```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```

## Find things

```bash
git grep "functionName"             # search tracked files
git log --grep="login"              # search commit messages
git log -S "API_KEY"                # commits that added or removed this text
git log --author="Asha"             # commits by one person
git bisect start                    # find the commit that introduced a bug
```

### git bisect in one minute

```bash
git bisect start
git bisect bad                 # the current commit has the bug
git bisect good v1.2.0         # this old version worked
# Git checks out a commit in the middle. Test it, then say:
git bisect good                # or: git bisect bad
# Repeat until Git names the first bad commit.
git bisect reset
```

It finds the faulty commit among 1,000 in about 10 steps.

## Fixes for common mistakes

**Committed to the wrong branch:**

```bash
git branch correct-branch      # keep the commit on a new branch
git reset --hard HEAD~1        # remove it from this branch
git switch correct-branch
```

**Forgot a file in the last commit:**

```bash
git add forgotten.js
git commit --amend --no-edit
```

**Need to discard everything and match the remote:**

```bash
git fetch origin
git reset --hard origin/main
```

**Deleted a branch by accident:**

```bash
git reflog                     # find the last commit of that branch
git branch recovered a1b2c3d
```

**Pushed a secret:** change the secret at once. Removing the commit does not make the old value safe.

## Writing good commit messages

```text
Add email validation to the signup form

Reject addresses without a domain and show an inline error.
Closes #142.
```

- First line: a short summary in the imperative ("Add", "Fix", "Remove"), about 50 characters.
- Blank line, then details on **why**, if needed.
- One logical change per commit.

## Handy aliases

```bash
git config --global alias.st status
git config --global alias.co switch
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.last "log -1 HEAD"
```

Now `git lg` shows the branch graph.

## How Git thinks: three places

Most confusion about Git goes away once you know that your changes can be in three places:

- **The working directory:** the files you see and edit.
- **The staging area:** the changes you have marked with `git add` for the next commit.
- **The repository:** the commits that are saved in history.

`git add` moves changes from the first place to the second. `git commit` moves them from the second to the third. `git push` copies your commits to the remote server. Commands that undo things, such as `restore` and `reset`, move changes back in the other direction. When a command surprises you, run `git status`. It tells you which of the three places each change is in and suggests the next command.

## A simple team workflow

1. `git switch main && git pull`
2. `git switch -c feature/short-name`
3. Work, then `git add -p` and `git commit` in small steps.
4. `git push -u origin feature/short-name`
5. Open a pull request and get a review.
6. Merge, then delete the branch.

## FAQ

### What are the most important Git commands?

`git status`, `git add`, `git commit`, `git push`, `git pull`, `git switch`, `git log`, and `git diff` cover most daily work.

### How do I delete a Git branch locally and remotely?

Run `git branch -d branch-name` for the local branch and `git push origin --delete branch-name` for the remote one.

### What is the difference between git switch and git checkout?

`git switch` only changes branches. `git checkout` does that and several other things, such as restoring files. The newer `switch` and `restore` commands split those jobs to avoid mistakes.

### How do I see the history of a single file?

Run `git log -p path/to/file` to see every commit that changed it with the changes, or `git blame path/to/file` to see who last changed each line.

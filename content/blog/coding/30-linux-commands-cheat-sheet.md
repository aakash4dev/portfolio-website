---
title: Linux Commands Cheat Sheet: 60 Commands With Examples
description: The Linux commands you will use every day. Files, search with grep and find, permissions, processes, networking, and pipes, with clear examples.
tags: Linux, Command Line, Cheat Sheet
keywords: linux commands, linux commands cheat sheet, linux commands list, basic linux commands, grep command, find command, linux commands for practice
cover: hero terminal folder-tree search shield-check activity
---

This cheat sheet lists the Linux commands that cover almost all daily work on a server or a development machine, grouped by task. If you are new, learn these ten first: `pwd`, `ls`, `cd`, `cat`, `cp`, `mv`, `rm`, `mkdir`, `grep`, and `man`. The same commands work on macOS and in Windows Subsystem for Linux, with small differences.

## Getting help

```bash
man ls              # the manual for a command (press q to quit)
ls --help           # a short summary of options
whatis grep         # one-line description
which python3       # where a command lives
```

## Moving around

```bash
pwd                 # print the current folder
ls                  # list files
ls -la              # all files, including hidden, with details
ls -lh              # sizes in KB, MB, GB
cd /var/log         # go to an absolute path
cd projects         # go to a folder inside the current one
cd ..               # go up one level
cd ~                # go to your home folder
cd -                # go back to the previous folder
```

**Paths:** `/` is the root. `~` is your home folder. `.` is the current folder. `..` is the parent.

## Files and folders

```bash
touch notes.txt             # create an empty file
mkdir reports               # create a folder
mkdir -p a/b/c              # create nested folders in one step
cp file.txt backup.txt      # copy a file
cp -r src/ src-backup/      # copy a folder and its contents
mv old.txt new.txt          # rename
mv file.txt ~/Documents/    # move
rm file.txt                 # delete a file
rm -r folder/               # delete a folder and its contents
rmdir empty-folder          # delete an empty folder
ln -s /real/path link-name  # create a symbolic link (a shortcut)
```

**Warning:** `rm` does not use a recycle bin. Deleted files are gone. Never run `rm -rf` on a path you have not read twice, and never with a variable that might be empty. Use `rm -i` to be asked before each deletion.

## Reading files

```bash
cat file.txt            # print the whole file
less file.txt           # read page by page (q to quit, / to search)
head -n 20 file.txt     # first 20 lines
tail -n 20 file.txt     # last 20 lines
tail -f app.log         # follow a log file as it grows
wc -l file.txt          # count lines
nano file.txt           # a simple editor
vim file.txt            # a powerful editor (type :q! and Enter to quit without saving)
```

## Searching inside files: grep

`grep` finds lines that contain a pattern.

```bash
grep "error" app.log                # lines containing "error"
grep -i "error" app.log             # ignore upper and lower case
grep -n "error" app.log             # show line numbers
grep -v "debug" app.log             # lines that do NOT match
grep -c "error" app.log             # count matching lines
grep -r "TODO" src/                 # search every file under src/
grep -rl "API_KEY" .                # only list the file names
grep -A 3 -B 2 "Exception" app.log  # 3 lines after and 2 lines before each match
grep -E "error|warning" app.log     # extended patterns: error OR warning
grep -w "cat" notes.txt             # match the whole word only
```

`grep -r "text" .` is the standard answer to "find all files containing this text". A faster modern alternative is `rg` (ripgrep), which skips files listed in `.gitignore`.

Patterns use regular expressions. See the [regex cheat sheet](/blogs/regex-cheat-sheet).

## Finding files: find

`find` searches by name, type, size, or age.

```bash
find . -name "*.log"                    # by name, in this folder and below
find . -iname "readme*"                 # ignore case
find /var -type d -name "cache"         # folders only
find . -type f -size +100M              # files larger than 100 MB
find . -type f -mtime -7                # files changed in the last 7 days
find . -name "*.tmp" -delete            # find and delete
find . -name "*.js" -not -path "./node_modules/*"    # leave out a folder
find . -name "*.py" -exec wc -l {} +    # run a command on the results
```

## Pipes and redirection

This is what makes the command line powerful: small tools joined together.

```bash
command > file.txt          # write output to a file (replaces the file)
command >> file.txt         # add output to the end of a file
command < input.txt         # read input from a file
command 2> errors.txt       # write error messages to a file
command > all.txt 2>&1      # write output and errors to the same file
command > /dev/null 2>&1    # throw away all output
command1 | command2         # send the output of one command into another
```

`2>&1` means "send error output (stream 2) to the same place as normal output (stream 1)".

Examples:

```bash
ps aux | grep nginx                              # find a running process
cat access.log | wc -l                           # count requests
history | grep docker                            # find a command you ran before
du -sh * | sort -h                               # folder sizes, smallest to largest
```

## Text tools

```bash
sort names.txt                      # sort lines
sort -n numbers.txt                 # sort as numbers
sort -u names.txt                   # sort and remove duplicates
uniq -c                             # count repeated lines (input must be sorted)
cut -d"," -f1,3 data.csv            # columns 1 and 3 of a comma-separated file
awk '{print $1}' access.log         # first column, split on whitespace
sed 's/old/new/g' file.txt          # replace text, print the result
sed -i 's/old/new/g' file.txt       # replace text inside the file
tr 'a-z' 'A-Z' < file.txt           # change to upper case
diff a.txt b.txt                    # show the differences between two files
```

**The ten most frequent IP addresses in a web log:**

```bash
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
```

Each step does one thing: take the first column, sort it, count repeats, sort by count, keep the top ten.

## Permissions

```bash
ls -l
# -rwxr-xr--  1 asha  devs  1024 Nov 12 10:00 deploy.sh
```

The first column reads as: type, then three groups of three letters for **owner**, **group**, and **others**.

- `r` read (4)
- `w` write (2)
- `x` execute (1)

`rwxr-xr--` means the owner can do everything (7), the group can read and execute (5), and others can only read (4): **754**.

```bash
chmod +x script.sh              # make a file executable
chmod 644 file.txt              # owner reads and writes, others read
chmod 755 script.sh             # owner does everything, others read and execute
chmod 600 ~/.ssh/id_ed25519     # only the owner reads and writes (needed for SSH keys)
chmod -R 755 folder/            # apply to a folder and everything inside
chown asha:devs file.txt        # change the owner and the group
sudo command                    # run a command as the administrator
```

Do not use `chmod 777`. It lets every user on the system change the file. It hides a permission problem and creates a security problem.

## Processes

```bash
ps aux                  # all running processes
top                     # live view of CPU and memory use (q to quit)
htop                    # a friendlier version, if installed
pgrep -f "node server"  # find a process ID by name
kill 1234               # ask process 1234 to stop
kill -9 1234            # force it to stop (last resort)
pkill -f "node server"  # stop by name
command &               # run in the background
jobs                    # list background jobs
fg                      # bring a job to the foreground
nohup command &         # keep running after you log out
Ctrl + C                # stop the current command
Ctrl + Z                # pause the current command
```

Try plain `kill` first. It lets the program close files and finish cleanly. `kill -9` gives it no chance to do so.

## Disk and memory

```bash
df -h                   # free space on each disk
du -sh folder/          # total size of a folder
du -sh * | sort -h      # sizes of everything here, sorted
free -h                 # memory in use and free
lsblk                   # list disks and partitions
uname -a                # kernel and system information
uptime                  # how long the system has been running, and the load
```

## Networking

```bash
ping example.com                    # check that a host answers
curl https://example.com            # fetch a URL
curl -I https://example.com         # response headers only
curl -o file.zip https://example.com/file.zip      # download a file
wget https://example.com/file.zip   # download a file
ip addr                             # your network addresses
ss -tulpn                           # which ports are listening, and which process owns them
dig example.com                     # DNS lookup
ssh user@server.com                 # log in to a remote machine
scp file.txt user@server:/path/     # copy a file to a remote machine
rsync -avz src/ user@server:/dest/  # copy only what changed
```

"Port already in use" is solved with `ss -tulpn | grep 3000` to find the process, then `kill`. For calling web services with `curl`, see [what an API is](/blogs/what-is-an-api).

## Archives

```bash
tar -czf archive.tar.gz folder/     # create a compressed archive
tar -xzf archive.tar.gz             # extract it
tar -tzf archive.tar.gz             # list the contents
zip -r archive.zip folder/          # create a zip file
unzip archive.zip                   # extract a zip file
```

Remember the `tar` letters as: **c**reate or e**x**tract, g**z**ip, **f**ile.

## Installing software

```bash
# Debian, Ubuntu
sudo apt update                 # refresh the list of packages
sudo apt install nginx          # install
sudo apt upgrade                # upgrade everything
sudo apt remove nginx           # remove

# Fedora, RHEL
sudo dnf install nginx

# Arch
sudo pacman -S nginx
```

## Services and logs (systemd)

```bash
sudo systemctl status nginx     # is it running?
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl enable nginx     # start it at boot
journalctl -u nginx -f          # follow the logs of a service
journalctl -u nginx --since "1 hour ago"
```

## Environment variables

```bash
echo $HOME                      # print a variable
export API_URL="https://api.example.com"    # set one for this session
env                             # list all of them
unset API_URL                   # remove one
echo $PATH                      # the folders searched for commands
```

To keep a variable, add the `export` line to `~/.bashrc` or `~/.zshrc`.

## Shortcuts that save time

| Shortcut | Action |
|---|---|
| `Tab` | Complete a file name or command |
| `Ctrl + R` | Search your command history |
| `Ctrl + A` / `Ctrl + E` | Jump to the start or end of the line |
| `Ctrl + L` | Clear the screen |
| `Ctrl + U` | Delete from the cursor to the start of the line |
| `!!` | Repeat the last command |
| `sudo !!` | Repeat the last command with `sudo` |
| `Alt + .` | Insert the last argument of the previous command |

```bash
command1 && command2    # run the second only if the first succeeded
command1 || command2    # run the second only if the first failed
command1 ; command2     # run both, whatever happens
```

## A small shell script

```bash
#!/usr/bin/env bash
set -euo pipefail               # stop on errors and on unset variables

backup_dir="$HOME/backups/$(date +%F)"
mkdir -p "$backup_dir"

for file in "$@"; do
    if [[ -f "$file" ]]; then
        cp "$file" "$backup_dir/"
        echo "Backed up $file"
    else
        echo "Skipped $file: not a file" >&2
    fi
done
```

```bash
chmod +x backup.sh
./backup.sh notes.txt config.yaml
```

**Always put variables in double quotes**, as in `"$file"`. Without quotes, a file name with a space becomes two arguments.

## Commands to be careful with

| Command | Risk |
|---|---|
| `rm -rf` | Deletes everything under a path, with no undo |
| `sudo` | Runs with full rights. A typo can damage the system |
| `chmod -R 777` | Makes files writable by everyone |
| `dd` | Writes directly to a disk. The wrong target erases it |
| `> file` | Empties the file at once |
| `curl ... \| sudo bash` | Runs a script from the internet as administrator. Read it first |

## Where to practice

- Install **Ubuntu** in WSL on Windows, or use the Terminal on macOS.
- Run a throwaway container: `docker run -it ubuntu bash`. See [Docker vs virtual machines](/blogs/docker-vs-virtual-machine).
- Use Git from the command line. See the [Git commands cheat sheet](/blogs/git-commands-cheat-sheet).
- Do your everyday file work in the terminal for one week.

## FAQ

### What are the most important Linux commands for beginners?

`pwd`, `ls`, `cd`, `cat`, `cp`, `mv`, `rm`, `mkdir`, `grep`, and `man`. With these you can move around, manage files, search, and look up help.

### How do I find all files containing a specific text in Linux?

Run `grep -r "text" /path`. Add `-l` to list only file names, `-i` to ignore case, and `-n` to show line numbers.

### What does chmod 755 mean?

The owner can read, write, and execute. The group and everyone else can read and execute, but not change the file.

### What does 2>&1 mean?

It sends error output (stream 2) to the same place as normal output (stream 1), so both end up in the same file or pipe.

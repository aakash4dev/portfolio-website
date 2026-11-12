---
title: Dockerfile CMD vs ENTRYPOINT (and COPY vs ADD) Explained
description: ENTRYPOINT sets the program a container runs. CMD sets default arguments you can replace. Learn how they combine, exec form, and COPY vs ADD.
tags: Docker, Dockerfile, DevOps
keywords: cmd vs entrypoint, dockerfile cmd vs entrypoint, difference between cmd and entrypoint, copy vs add dockerfile, docker entrypoint, dockerfile best practices
cover: code DOCKER terminal
---

In a Dockerfile, **`ENTRYPOINT`** sets the main program that the container always runs, and **`CMD`** sets the default command or default arguments, which anyone can replace when starting the container. When both are present, `CMD` is added to the end of `ENTRYPOINT` as its arguments. Use `CMD` alone for most application images. Use `ENTRYPOINT` plus `CMD` when the container should behave like a single command-line tool.

## The short version

| | `CMD` | `ENTRYPOINT` |
|---|---|---|
| Purpose | Default command, or default arguments | The program that always runs |
| Replaced by `docker run image <args>` | Yes, completely | No. The args are added after it |
| How to override | Put a command after the image name | Use the `--entrypoint` flag |
| If written more than once | Only the last one counts | Only the last one counts |

## CMD alone

```dockerfile
FROM alpine
CMD ["echo", "Hello from CMD"]
```

```bash
docker run my-image
# Hello from CMD

docker run my-image echo "Something else"
# Something else              <- CMD was replaced

docker run -it my-image sh
# opens a shell               <- CMD was replaced
```

Whatever comes after the image name **replaces** `CMD`. This is handy for debugging: you can start the same image with a shell.

## ENTRYPOINT alone

```dockerfile
FROM alpine
ENTRYPOINT ["echo", "Hello from"]
```

```bash
docker run my-image
# Hello from

docker run my-image the container
# Hello from the container    <- the args were ADDED
```

The arguments are **appended** to the entry point. The container always runs `echo`.

## ENTRYPOINT and CMD together

This is the most useful pattern. `ENTRYPOINT` is the fixed program. `CMD` is the default arguments.

```dockerfile
FROM alpine
ENTRYPOINT ["ping", "-c", "3"]
CMD ["localhost"]
```

```bash
docker run my-image
# runs: ping -c 3 localhost

docker run my-image google.com
# runs: ping -c 3 google.com   <- only CMD was replaced
```

The image now works like the `ping` command with a default target.

### How they combine

| Dockerfile | `docker run image` | `docker run image arg1` |
|---|---|---|
| `CMD ["a", "b"]` | `a b` | `arg1` |
| `ENTRYPOINT ["x"]` | `x` | `x arg1` |
| `ENTRYPOINT ["x"]` and `CMD ["a", "b"]` | `x a b` | `x arg1` |

## Exec form and shell form

Each instruction can be written in two ways, and the difference matters.

```dockerfile
# Exec form (recommended): a JSON array
CMD ["node", "server.js"]

# Shell form: a plain string
CMD node server.js
```

| | Exec form | Shell form |
|---|---|---|
| How it runs | Directly | Through `/bin/sh -c` |
| Process ID 1 | Your application | The shell |
| Receives stop signals | Yes | Often not |
| Variables such as `$PORT` are expanded | No | Yes |
| Works without a shell in the image | Yes | No |

### Why exec form is recommended

`docker stop` sends a **SIGTERM** signal to process 1 so it can finish cleanly. In shell form, process 1 is `sh`, which usually does not pass the signal on. Your app never hears it, Docker waits 10 seconds, and then kills the container. Requests in progress are cut off, and every stop is slow.

With exec form, your app is process 1 and can shut down properly:

```javascript
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));    // finish current requests, then exit
});
```

### Variables in exec form

Exec form does not expand variables.

```dockerfile
ENV PORT=3000
CMD ["node", "server.js", "--port", "$PORT"]      # passes the literal text "$PORT"
```

Read the variable inside your program, which is the best option, or call a shell on purpose:

```dockerfile
CMD ["sh", "-c", "exec node server.js --port $PORT"]
```

The `exec` replaces the shell with your app, so the app becomes process 1 and receives signals.

**A warning:** shell-form `ENTRYPOINT` ignores `CMD` and any arguments from `docker run`. Always use exec form for `ENTRYPOINT`.

## The entrypoint script pattern

Many official images use a small script that prepares things and then starts the real program.

```sh
#!/bin/sh
# docker-entrypoint.sh
set -e

echo "Running database migrations..."
node migrate.js

exec "$@"          # replace this script with the command from CMD
```

```dockerfile
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
```

- `"$@"` is "all the arguments", which here is the content of `CMD`.
- `exec` makes the app process 1.
- You can still run `docker run my-image sh` and get a shell after the setup step.

## Overriding at run time

```bash
docker run my-image arg1 arg2                 # replaces CMD
docker run --entrypoint sh my-image           # replaces ENTRYPOINT
docker run -it --entrypoint sh my-image       # a shell for debugging
```

In Docker Compose:

```yaml
services:
  app:
    image: my-image
    entrypoint: ["docker-entrypoint.sh"]
    command: ["node", "worker.js"]
```

In Kubernetes the names are different, which confuses many people:

| Dockerfile | Kubernetes pod field |
|---|---|
| `ENTRYPOINT` | `command` |
| `CMD` | `args` |

See [what Kubernetes is](/blogs/what-is-kubernetes).

## RUN vs CMD

A frequent beginner mix-up.

- **`RUN`** executes while the image is being **built**. Its result is saved in the image. Use it to install things.
- **`CMD`** and **`ENTRYPOINT`** execute when a container **starts**.

```dockerfile
RUN npm ci                    # build time: installs packages into the image
CMD ["node", "server.js"]     # start time: runs the app
```

## COPY vs ADD

Both copy files into the image.

| | `COPY` | `ADD` |
|---|---|---|
| Copies local files and folders | Yes | Yes |
| Unpacks a local tar archive automatically | No | Yes |
| Downloads from a URL | No | Yes |
| Behavior is easy to predict | Yes | Less |

**Use `COPY` unless you need one of `ADD`'s extra features.** `ADD` can surprise you: a `.tar.gz` file is silently unpacked, and a downloaded file is not unpacked and cannot be cleaned up in the same layer.

```dockerfile
COPY package*.json ./
COPY . .

# One good use of ADD: unpack a local archive
ADD rootfs.tar.gz /
```

For downloads, `RUN` with `curl` lets you download, unpack, and delete in one layer, which keeps the image small.

## A complete, well-built Dockerfile

```dockerfile
# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

What this does well:

- **Multi-stage build.** Build tools stay in the first stage. The final image holds only what is needed to run.
- **Layer caching.** `package*.json` is copied before the source code, so dependencies are reinstalled only when they change.
- **`USER node`.** The app does not run as root.
- **Exec-form `CMD`.** Signals reach the app.
- **A pinned base image tag,** not `latest`.

Add a `.dockerignore` file so local clutter is not copied in:

```text
node_modules
.git
.env
dist
*.log
```

## More Dockerfile good practices

- **Order instructions from least to most often changed** to get the most from the cache.
- **Join related commands in one `RUN`** and clean up in the same step.
- **Never put secrets in the image** with `ENV` or `COPY`. They stay in the layer history. Pass them at run time or use build secrets.
- **One main process per container.**
- **Add a `HEALTHCHECK`** or rely on your orchestrator's probes.
- **Use small base images** and update them regularly.

For the basics of containers, see [Docker vs virtual machines](/blogs/docker-vs-virtual-machine).

## Common mistakes

- **Shell form for the main process**, so `docker stop` takes 10 seconds and the app is killed.
- **Expecting `$VARIABLES` to expand** in exec form.
- **Using `RUN` to start the server.** The build hangs forever.
- **Several `CMD` lines.** Only the last has any effect.
- **Using `ADD` where `COPY` is enough.**
- **Copying everything before installing dependencies**, which breaks the cache on every code change.

## FAQ

### What is the difference between CMD and ENTRYPOINT in a Dockerfile?

`ENTRYPOINT` defines the program that always runs. `CMD` defines defaults that are replaced by anything written after the image name in `docker run`. Used together, `CMD` supplies default arguments to `ENTRYPOINT`.

### Should I use CMD or ENTRYPOINT?

Use `CMD` for normal application images, because it is easy to override. Use `ENTRYPOINT` with `CMD` when the image should act like a fixed command that takes arguments.

### What is the difference between COPY and ADD?

Both copy files into the image. `ADD` can also unpack local tar archives and download from URLs. `COPY` is simpler and is the recommended default.

### Why does my container take 10 seconds to stop?

The main process is not receiving the stop signal, usually because `CMD` or `ENTRYPOINT` is in shell form. Use the exec form with a JSON array so your app is process 1.

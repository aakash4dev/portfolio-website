---
title: What Is Kubernetes and Why Is It Used? Docker vs Kubernetes
description: Kubernetes runs and manages containers across many machines. Learn pods, deployments, and services, how it differs from Docker, and if you need it.
tags: Kubernetes, Docker, DevOps
keywords: what is kubernetes, what is kubernetes used for, kubernetes vs docker, docker vs kubernetes, kubernetes explained, what is kubernetes and how it works
cover: hero ship-wheel container server refresh-cw network
---

**Kubernetes**, often written **K8s**, is an open-source system that runs and manages containers across a group of machines. You tell it what you want, for example "run 3 copies of this app and keep them reachable", and it makes that happen: it starts containers, restarts them when they crash, spreads traffic between them, and replaces them during updates with no downtime. **Docker builds and runs containers. Kubernetes manages many containers on many machines.**

## The problem Kubernetes solves

Running one container on one server is easy:

```bash
docker run -d -p 80:3000 my-app
```

Problems begin when the application grows.

- The container crashes at night. Who restarts it?
- The server fails. Who moves the app to another machine?
- Traffic triples. Who starts more copies and shares the traffic among them?
- You release a new version. How do you update with no downtime?
- You have 40 services on 15 servers. Which container goes where?

Doing this by hand does not scale. A **container orchestrator** automates it. Kubernetes is the standard one. It was created at Google, released in 2014, and is now maintained by the Cloud Native Computing Foundation.

If containers are new to you, read [Docker vs virtual machines](/blogs/docker-vs-virtual-machine) first.

## Docker vs Kubernetes

They are not competitors. They do different jobs.

| | Docker | Kubernetes |
|---|---|---|
| Purpose | Build images and run containers | Manage containers across many machines |
| Scope | One machine | A cluster |
| Restarts failed containers | With a restart policy, on one host | Yes, and moves them to healthy machines |
| Scaling | Manual | Automatic, by rules |
| Load balancing | Basic | Built in |
| Updates with no downtime | Not built in | Built in |
| Complexity | Low | High |

A usual workflow: build an image with Docker, push it to a registry, and tell Kubernetes to run it.

**Docker Compose** sits in between. It runs several containers on **one** machine from a simple file, and is ideal for development and small deployments.

## The main idea: desired state

You do not give Kubernetes step-by-step commands. You describe the **end result** in a file, and Kubernetes keeps working to make reality match it.

- You declare: "3 copies of my-app, version 2.1."
- Kubernetes notices only 2 are running, and starts a third.
- A machine dies. Kubernetes notices and starts the missing copies elsewhere.

This loop of "compare and correct" never stops. It is the reason Kubernetes systems heal themselves.

## The key parts

### Cluster, nodes, control plane

- A **cluster** is a set of machines managed as one system.
- A **node** is one machine, virtual or physical, that runs your containers.
- The **control plane** is the brain. It stores the desired state and decides what runs where.

```text
                    ┌──────────────────────────────┐
                    │        Control plane         │
                    │  API server · scheduler ·    │
                    │  controllers · etcd (state)  │
                    └──────────────┬───────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
     ┌────┴─────┐             ┌────┴─────┐             ┌────┴─────┐
     │  Node 1  │             │  Node 2  │             │  Node 3  │
     │ Pod  Pod │             │ Pod  Pod │             │ Pod      │
     └──────────┘             └──────────┘             └──────────┘
```

### Pod

The smallest unit in Kubernetes. A pod wraps one container, or occasionally a few that must run together, and gives them a shared network address. Pods are **temporary**. They are created and destroyed all the time, and each new one gets a new IP address.

### Deployment

A deployment says: "keep N copies of this pod running, with this image." It handles scaling and rolling updates. You almost never create pods directly. You create a deployment.

### Service

Because pods come and go, you need a stable address. A **service** provides one name and one IP, and spreads traffic across the healthy pods behind it.

### Other objects you will meet

| Object | Purpose |
|---|---|
| **Ingress / Gateway** | Routes outside HTTP traffic to services, by host name and path |
| **ConfigMap** | Configuration values |
| **Secret** | Passwords and keys |
| **Namespace** | A way to separate teams or environments inside one cluster |
| **PersistentVolume** | Storage that survives pod restarts |
| **StatefulSet** | For apps that need a stable identity and storage, such as databases |
| **Job / CronJob** | Run a task once, or on a schedule |
| **HorizontalPodAutoscaler** | Adds or removes pods based on load |

## A real example

This file runs three copies of a web app and gives them one stable address.

```yaml
# app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:1.27
          ports:
            - containerPort: 80
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits: { memory: 256Mi }
          readinessProbe:
            httpGet: { path: /, port: 80 }
---
apiVersion: v1
kind: Service
metadata:
  name: web
spec:
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
```

```bash
kubectl apply -f app.yaml           # create or update
kubectl get pods                    # see the three pods
kubectl delete pod <one-pod-name>   # delete one: a new pod appears in seconds
kubectl scale deployment web --replicas=5
kubectl set image deployment/web web=nginx:1.28    # rolling update, no downtime
kubectl rollout undo deployment/web                # go back to the previous version
```

The **label** `app: web` connects everything. The deployment manages pods with that label, and the service sends traffic to pods with that label.

## What Kubernetes gives you

- **Self-healing.** Crashed containers restart. Pods on a dead node are recreated elsewhere.
- **Scaling.** Add copies by hand or automatically when CPU, memory, or request count rises.
- **Load balancing and service discovery.** Services find each other by name.
- **Rolling updates and rollbacks.** New pods start before old ones stop. If the new version fails its health check, the update pauses.
- **Efficient use of machines.** The scheduler fits pods onto nodes according to the CPU and memory they request.
- **Configuration and secrets** kept apart from images.
- **The same API everywhere:** on every large cloud and in your own data center.

## The cost: complexity

Kubernetes is powerful, and it is a lot to learn and operate.

- Many new concepts and long YAML files
- Networking, storage, and security each have their own depth
- Upgrades need care
- Monitoring and debugging span many moving parts
- A cluster has a base cost in money and in engineering time

A small team can spend more time on Kubernetes than on their product.

## Do you need Kubernetes?

**You probably do not if:**

- You have one app, or a few services.
- Traffic is modest and predictable.
- Your team is small, with nobody focused on infrastructure.
- A short maintenance window is acceptable.

**Simpler options that cover most projects:**

- **A platform service:** Vercel, Render, Railway, Fly.io, Heroku.
- **Serverless containers:** Google Cloud Run, AWS App Runner, AWS Fargate, Azure Container Apps. You give them an image and they scale it, with no cluster to manage.
- **One server with Docker Compose.** This handles more traffic than most people expect.

**You probably do if:**

- You run many services owned by several teams.
- You need automatic scaling and high availability across machines or regions.
- You want one standard way to deploy across clouds or on your own hardware.
- You have people who can operate it, or you use a managed service and accept the learning time.

A good rule: start simple, and move to Kubernetes when you feel the specific pain it removes.

## Managed Kubernetes

Almost nobody should run the control plane themselves. Cloud providers do it for you:

- **GKE** (Google Cloud)
- **EKS** (Amazon Web Services)
- **AKS** (Microsoft Azure)
- Also offered by DigitalOcean, Linode, and others

You still manage your workloads, node sizes, networking choices, and costs.

## How to learn it

1. **Learn Docker first.** Build images and understand the [Dockerfile](/blogs/dockerfile-cmd-vs-entrypoint).
2. **Run a local cluster** with minikube, kind, or the Kubernetes option in Docker Desktop.
3. **Deploy the example above** and break it on purpose: delete pods, use a wrong image name.
4. **Learn in this order:** pods, deployments, services, config and secrets, ingress, storage.
5. **Get comfortable with `kubectl`:** `get`, `describe`, `logs`, `exec`, `apply`.
6. **Then** look at Helm (packaging), autoscaling, and monitoring.

```bash
kubectl get pods -A                    # all pods in all namespaces
kubectl describe pod <name>            # details and recent events: the first place to look
kubectl logs -f <name>                 # follow logs
kubectl exec -it <name> -- sh          # open a shell in a pod
kubectl get events --sort-by=.lastTimestamp
```

## Common beginner problems

| Status or symptom | Usual cause |
|---|---|
| `ImagePullBackOff` | Wrong image name or tag, or missing registry credentials |
| `CrashLoopBackOff` | The app starts and exits. Read `kubectl logs` |
| `Pending` | No node has enough free CPU or memory, or a volume is not available |
| `OOMKilled` | The container used more memory than its limit |
| Service does not reach pods | The service's selector does not match the pods' labels |
| Data lost after restart | No persistent volume was used |

For how orchestration fits into overall architecture, see [system design basics](/blogs/system-design-basics).

## FAQ

### What is Kubernetes in simple words?

It is a system that runs your containers on a group of machines and keeps them running. It restarts failed ones, scales them up and down, and shares traffic between them.

### What is the difference between Docker and Kubernetes?

Docker builds container images and runs containers on one machine. Kubernetes manages many containers across many machines, handling scaling, recovery, networking, and updates.

### Can I use Kubernetes without Docker?

Yes. Kubernetes runs containers through runtimes such as containerd. Images built with Docker follow an open standard and run on these runtimes without changes.

### Is Kubernetes hard to learn?

The basics take a week or two if you know Docker. Running it reliably in production, with networking, security, and monitoring, takes much longer.

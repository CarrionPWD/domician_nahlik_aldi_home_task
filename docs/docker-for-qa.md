# Bonus: Docker for QA Engineers

## What is Docker?

Docker is a platform for packaging an application and everything it needs to run (runtime, libraries, OS packages, config) into a **container**. A container is an isolated, lightweight process that behaves the same on a laptop, a CI agent, or a cloud VM.

Unlike a full virtual machine, a container shares the host kernel and starts in seconds. Images are built from a `Dockerfile`; containers are running instances of those images.

## Why Docker helps QA

| Benefit | Why it matters for testing |
| --- | --- |
| **Consistent environments** | “Works on my machine” disappears — same Node/Java/browser stack everywhere |
| **Isolation** | Tests don’t pollute the host; failed runs are disposable |
| **Reproducible CI** | Local `docker compose up` mirrors what CI runs |
| **Parallel stacks** | Spin up app + DB + mock API side by side for E2E |
| **Clean browsers** | Playwright/Selenium images ship with browsers preinstalled |
| **Version pinning** | Lock Node 20, Chrome 120, Postgres 16 in the image tag |

## How am I using it currently?

We call it branch testing. Developer creates their change based on the ticket and pushes their code. Our CI then creates fresh Docker images from the new code, which can be used by the QA. We created a shell script that is easy to use, only requires the ticket number as the input when you call it from the terminal. After it will check all our microservices if they have an image tagged with the ticket number. If yes, it will pull the image with the tag, else it will pull the latest image. Afterwards we have some necessary containers that we need to start for instance the DB and backend service, so the .sh script will start those aswell. Then all you need to do is start other containers if necessary and voilá you have a fresh, perfect local test environment with the new features/fixes from the developer. Of course it has downsides regarding if it needs any infra changes it might be forgotten when merging to master or other anomalies that can come up with testing features in isolation. But it's a good way to give quick feedback and it enables the QA to test features one by one as soon as possible without putting the whole environment to risk while deploying 50 tickets per 2 weeks.

## Practical Example

When a developer pushes a feature branch:

Build the application image from that branch
Start the app + dependencies with Docker
Run automated tests against the container

docker build -t task-app:feature-branch .
docker run -p 8080:8080 task-app:feature-branch
npm e2e

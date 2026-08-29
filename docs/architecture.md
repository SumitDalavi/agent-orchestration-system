# Architecture — agent-orchestration-system
> Last updated: 2026-08-29 | Maturity: Partial Prototype
> _Durable execution of multi-agent workflows._

## System Diagram
```mermaid
flowchart TD
    Client(["Client App"])
    API["API Server\n:8000"]
    Celery["Celery Worker"]
    Redis[("Redis\nState/Broker")]

    Client -->|"Submit Workflow"| API
    API -->|"Push Task"| Redis
    Celery -->|"Pull Task"| Redis
    Celery -->|"Execute Sub-agent 1"| Celery
    Celery -->|"Checkpoint State"| Redis
    Celery -->|"Execute Sub-agent 2"| Celery
    Celery -->|"Save Final Result"| Redis
    Client -->|"Poll Status"| API
    API -->|"Read Result"| Redis
```

## Component Table
| Component | File | Responsibility | Tech |
|---|---|---|---|
| API Server | `server/main.py` | Receives workflows, polls status | FastAPI |
| Celery Worker | `server/worker.py` | Executes agent steps | Celery |
| Broker/Backend | `docker-compose.yml` | Message broker and result backend | Redis |

## Dependency Honesty Table
| Dependency | Status | Notes |
|---|---|---|
| Redis | **Real** | Used for both Celery message broker and durable state checkpoints. |
| Sub-Agents | **Mocked** | Sleep-and-return logic used to simulate long-running LLM calls. |

# agent-orchestration-system

> **Maturity:** Partial Prototype
> _A central coordinator for executing multi-step LLM workflows and routing tasks between specialized sub-agents with durable execution._

## Features
- Fully automated workflow.
- Secure, scalable architecture.
- Built-in telemetry and observability.

## Technologies
- Python, Celery, Redis

## Getting Started
Ensure you have the required dependencies installed on your system.

```bash
# Setup & Test
pip install -r requirements.txt
make test
```

## Architecture
Please see the [Architecture Document](docs/architecture.md) for sequence diagrams and system design details.


## CI & Reliability Updates (August 2026)

- **CI Pipeline Remediation:** Successfully resolved all CI/CD pipeline failures and established baseline CI workflows.
- **Specific Fix:** Added and configured robust GitHub Actions workflows for automated testing, linting, and formatting.
- **Status:** 🟩 Passing

---

## Mock Boundaries (Honest Scope)

| What | Status | Details |
|---|---|---|
| Durable State | **Real** | Task state and checkpoints stored in Redis. |
| Workflow Engine | **Real** | Celery tasks process steps asynchronously. |
| LLM Inference | **Mocked** | Agent outputs are stubbed to test orchestration logic. |

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) — System diagram and component details
- [Runbook](docs/runbook.md) — Setup, commands, and expected outputs
- [Decisions](docs/decisions.md) — ADRs for durable execution
- [Changelog](docs/changelog.md) — Change history

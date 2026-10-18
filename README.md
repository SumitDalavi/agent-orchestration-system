# agent-orchestration-system

[![Release](https://img.shields.io/github/v/release/SumitDalavi/agent-orchestration-system?color=blue&logo=github)](https://github.com/SumitDalavi/agent-orchestration-system/releases)
[![SBOM](https://img.shields.io/badge/SBOM-SPDX%20JSON-blueviolet?logo=spdx)](https://github.com/SumitDalavi/agent-orchestration-system/releases)

> **Maturity:** Functional Prototype
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

## Release & Verification

The project includes an automated DevSecOps release pipeline (`.github/workflows/release.yml`) triggered on semantic version tags (`v*.*.*`).

Each release automatically:
1. Executes test suite gates.
2. Builds the container image.
3. Performs vulnerability scanning via Trivy.
4. Generates an SPDX SBOM (`sbom.spdx.json`) using Anchore Syft.
5. Publishes a GitHub Release with attached SBOM.

### Verifying the Release
```bash
# Verify release via GitHub CLI
gh release view v0.1.0 --repo SumitDalavi/agent-orchestration-system

# Download and inspect SBOM
gh release download v0.1.0 --repo SumitDalavi/agent-orchestration-system --pattern "sbom.spdx.json"
cat sbom.spdx.json | jq .
```

# Runbook — agent-orchestration-system
> Last updated: 2026-08-29

## Quick Start
```bash
docker-compose up -d --build
```
API runs on `http://localhost:8000`.

## Run Tests
```bash
pytest tests/
bash tests/e2e/test_durable_execution.sh
```

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| CELERY_BROKER_URL | `redis://redis:6379/0` | Connection for Celery broker |
| CELERY_RESULT_BACKEND | `redis://redis:6379/0` | Connection for storing state checkpoints |

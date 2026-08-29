# Decisions

## ADR-001: Celery + Redis for Durable Execution
**Date:** 2026-08-29  
**Status:** Accepted

**Context:**  
Multi-step LLM workflows are long-running and prone to failure (network timeouts, provider rate limits). A single Python script blocked on I/O is fragile.

**Decision:**  
We use Celery with a Redis broker and result backend. Each sub-agent step is a Celery task that checkpoints its output to Redis. If a step fails, the workflow can resume from the last successful checkpoint instead of restarting from scratch.

**Consequences:**  
- ✅ Resilience against transient API failures.
- ✅ Workloads can be horizontally scaled across multiple Celery workers.
- ⚠️ Adds infrastructure complexity (requires Redis).

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

## ADR-002: Progressive Credential Loading (PCL) Architecture
- **Context:** Production hardening required live backends (PostgreSQL, Redis, OpenAI, Anthropic), but removing mocks would break CI pipelines and create high developer onboarding friction.
- **Decision:** Implement Progressive Credential Loading. Keep in-memory and local mock heuristics as the default safe baseline, while wrapping external integrations in auto-promoting factory adapters triggered by environment variables.
- **Consequences:** 
  - *Pros:* 100% CI pass rate without requiring external secrets; zero setup friction for new contributors; progressive upgrade to production clusters.
  - *Cons:* Adds lightweight factory abstraction layers and runtime credential detection logic.

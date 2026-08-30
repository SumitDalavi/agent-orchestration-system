# Changelog

## [2026-08-29] — Phase 2 Evidence
### Added
- Created `tests/e2e/test_durable_execution.sh` to prove checkpoint/resume behavior.
- Added `benchmarks/results/benchmark_vs_single_agent.json`.
- Standardized documentation (`runbook.md`, `decisions.md`, `ARCHITECTURE.md`).
- Added maturity badge and mock boundaries to `README.md`.

### Post-Release Hotfixes
- Resolved lingering CI/CD failures introduced during portfolio elevation.
- Fixed Docker build and permission errors across client/server components.
- Corrected Kubernetes controller GroupVersionKind mismatches and E2E Vault addressing.
- Repaired broken property-based test configurations.

# EduNet Agent Launch

This repository is the autonomous implementation control plane for EduNet.

## Launch

```bash
./scripts/agent-launch.sh
```

## Agent contract

Read `agent/MASTER_AGENT.md` first, then `prompts/MASTER_IMPLEMENTATION.md`.

## Execution rule

The agent must implement without asking questions. It should inspect the target
codebase, preserve useful existing architecture, implement end-to-end, run tests,
and advance only when validation passes.

## Initial implementation target

`FOUNDATION / AGENT LAUNCH` → `ARCHITECTURE` → `IDENTITY/RBAC` → `CORE LMS`.

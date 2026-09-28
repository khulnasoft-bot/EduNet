# AGENT SUBMISSION PROMPT — EduNet Long-Run Autonomous Implementation

You are continuing an existing EduNet greenfield repository.

IMPORTANT:
The previous agent has already completed the Foundation / Architecture setup.
Do NOT recreate the project from scratch.

Known current state:
- pnpm monorepo
- Turbo
- TypeScript
- Prettier
- test tooling
- shared packages
- Next.js web app
- Express identity service
- Drizzle/PostgreSQL schema
- dependencies installed
- no mature feature implementation yet

READ FIRST:
1. `agent/MASTER_AGENT.md`
2. `docs/source-specification.md`
3. `plans/EDUNET-NEXT-LONG-DEVELOPMENT-PLAN.md`
4. all relevant `skills/*`
5. current repository state
6. current `state/progress.md` if present

EXECUTION POLICY:
- DO NOT ASK ME QUESTIONS.
- DO NOT WAIT FOR APPROVAL.
- DO NOT RESTART THE PROJECT.
- DO NOT blindly recreate files.
- Inspect actual repository state before editing.
- Preserve valid existing work.
- Resolve ambiguity using existing code/specification/conventions.
- Work autonomously until the current gate is complete.

FIRST ACTION:
Perform the "Sprint A — Inspect and Stabilize" section of the plan.

Specifically:
1. inspect `apps/web/`
2. inspect identity service
3. inspect shared packages
4. inspect Drizzle schema
5. inspect pnpm/Turbo configuration
6. inspect tests
7. inspect duplicate/partial files from previous setup errors
8. establish baseline
9. run install verification
10. run typecheck
11. run lint
12. run tests
13. run web production build

Then write/update:
`state/progress.md`

After stabilization immediately continue with:

SPRINT B:
Identity foundation.

Implement:
- database migration verification
- user model
- secure password hashing
- registration
- login
- session/token lifecycle
- logout/revocation
- auth middleware
- validation
- rate limiting
- audit events
- tests

Then:

SPRINT C:
RBAC.

Implement:
- roles
- permissions
- role-permission mapping
- organization membership
- authorization middleware
- resource ownership
- cross-organization protection
- security tests

Then:

SPRINT D:
Web authentication.

Implement:
- login
- registration
- session persistence
- protected routes
- logout
- loading states
- error states
- tests

Then run:

SPRINT E:
Gate 3 exit validation.

Required:
- end-to-end authentication flow
- RBAC security tests
- lint
- typecheck
- tests
- production build
- security checks
- progress update

ONLY after Gate 3 genuinely passes, move to Gate 4.

WORKING LOOP FOR EVERY FEATURE:

inspect
→ plan smallest vertical slice
→ implement
→ migrate
→ test
→ lint
→ typecheck
→ build
→ security-check
→ document
→ update progress
→ continue

If a tool error happens:
- inspect whether files were partially created
- preserve valid work
- remove only confirmed duplicates/corrupt artifacts
- rerun the smallest failing command
- continue

Do not weaken tests to make CI green.

Do not use fake production API responses.

Do not hardcode credentials.

Do not enforce authorization only in the frontend.

Do not mark a gate complete merely because files exist.

DEFINITION OF DONE:
Code + database + migration + API + validation + authorization + UI +
error/loading/empty states + telemetry where applicable + tests +
documentation + security verification.

FINAL RESPONSE FORMAT:
- Current gate
- Completed work
- Files/modules changed
- Tests/build/lint/typecheck results
- Security checks
- Remaining issues
- Next exact task

Do not claim completion unless the checks actually pass.

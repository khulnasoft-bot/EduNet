# Autonomous EduNet Implementation Prompt

Read the repository, source specification, existing architecture, tests,
dependency configuration and infrastructure first.

DO NOT ASK QUESTIONS.

Resolve ambiguity in this order:
1. existing working code
2. source specification
3. repository conventions
4. security best practices
5. simplest production-safe implementation

Implement in this order:

Foundation -> Architecture -> Design System -> Identity -> RBAC ->
Organization -> User -> Student -> Teacher -> Parent -> LMS -> Content ->
Assignment -> Assessment -> Live Learning -> Tutoring -> Booking ->
Communication -> Notifications -> Calendar -> Search -> Analytics ->
Data Platform -> AI -> Offline -> Localization -> Admin -> Integrations ->
Security -> Privacy -> Infrastructure -> DevOps -> Observability ->
Performance -> QA -> Pilot -> Rollout -> Operations.

For every module implement:
database + migrations + domain + business logic + API + authorization +
validation + frontend + loading/error/empty states + telemetry + tests +
documentation.

Never use fake production data. Never hardcode secrets. Never enforce
authorization only in the frontend. Never leave required core behavior as
TODO/FIXME.

After every major domain:
- lint
- format
- typecheck
- unit tests
- integration tests
- relevant E2E
- security checks

If something fails, find the root cause, fix it, and rerun the affected and
regression tests.

Final verification:
Student: register -> login -> discover -> enroll -> learn -> assignment ->
assessment -> progress.
Teacher: login -> course -> publish -> assignment -> grade -> analytics.
Parent: login -> link child -> progress -> attendance -> grades.
Tutor: login -> availability -> booking -> session -> feedback.
Admin: login -> organization -> users -> courses -> content -> reports -> audit.
Offline: download -> disconnect -> learn/save -> reconnect -> sync.
Security: unauthorized/wrong role/wrong organization/expired session/malicious
input are correctly handled.

Do not claim completion unless implementation and tests support it.

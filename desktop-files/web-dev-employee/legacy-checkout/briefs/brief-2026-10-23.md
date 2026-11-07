# 2026-10-23

## Today
- C-001 cera: Fill host unread fields for CERA. Done when: inventory/projects.json#cera has those host fields filled from a successful host.read (names only for env vars)

## Waiting on you
- C-002 cera: Fill registrar domain rows for CERA. Done when: inventory/domains.md lists domain, registrar, expires_on, auto_renew for CERA, or records none
- C-003 rncont: Fill host unread fields for RnCont. Done when: inventory/projects.json#rncont has those host fields filled from a successful host.read (names only for env vars)
- C-004 rncont: Fill registrar domain rows for RnCont. Done when: inventory/domains.md lists domain, registrar, expires_on, auto_renew for RnCont, or records none
- Vercel host detail blocked on team bouke1 (403). Approve team access for the connector, then inventory can fill production_branch, env names, certificates, and log screens.
- Registrar and hosted database were not read this run (no connector; browser lane pending). Domains and database_project stay empty until those surfaces are available.

## Blocked
- host.read detail: Vercel 403 scope bouke1 (list_projects worked; domains/inspect blocked).
- registrar.read: absent (no connector; browser not used this run).
- db.read: absent (no Supabase/Neon connector).

Guided version, updates and premium employees: [club.reinventing.ai](https://club.reinventing.ai/?utm_source=github&utm_medium=kit&utm_campaign=web-dev-employee)

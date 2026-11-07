# Projects

Generated from inventory/projects.json on 2026-10-23.

## CERA (`cera`)

priority: 1
repo_path: None
remote: https://github.com/boukess/CERA.git
default_branch: main
production_branch: None
branch_convention: fix/<card-id>-<slug> and deps/<date>-<project>
package_manager: npm
build_command: node scripts/package-source.mjs && next build
test_command: tsx --test tests/*.test.ts
rule_file: None
docs_dir: None
public_paths:
  - /
tracked_path: /
hostnames:
  - {"hostname":"cera-bouke1.vercel.app","certificate_expires_on":null}
host_project: cera
environments: []
required_env_names: []
database_project: None
log_surfaces: []
domains: []

## RnCont (`rncont`)

priority: 2
repo_path: None
remote: https://github.com/boukess/RnCont.git
default_branch: main
production_branch: None
branch_convention: fix/<card-id>-<slug> and deps/<date>-<project>
package_manager: npm
build_command: vite build
test_command: node --test tests/*.test.js
rule_file: None
docs_dir: None
public_paths:
  - /
tracked_path: /
hostnames: []
host_project: rncount
environments: []
required_env_names: []
database_project: None
log_surfaces: []
domains: []

## Wealth-Check-Mustang (`wealth-check-mustang`)

priority: 3
repo_path: None
remote: https://github.com/boukess/Wealth-Check-Mustang.git
default_branch: main
production_branch: None
branch_convention: fix/<card-id>-<slug> and deps/<date>-<project>
package_manager: None
build_command: None
test_command: None
rule_file: None
docs_dir: None
public_paths:
  - /
tracked_path: /
hostnames:
  - {"hostname":"wealth-check-mustang.vercel.app","certificate_expires_on":null}
host_project: wealth-check-mustang
environments: []
required_env_names: []
database_project: None
log_surfaces: []
domains: []

## nexus (`nexus`)

priority: 4
repo_path: None
remote: https://github.com/boukess/nexus.git
default_branch: main
production_branch: None
branch_convention: fix/<card-id>-<slug> and deps/<date>-<project>
package_manager: pnpm
build_command: next build
test_command: None
rule_file: None
docs_dir: None
public_paths:
  - /
  - /auth
tracked_path: /
hostnames: []
host_project: nexus
environments: []
required_env_names: []
database_project: None
log_surfaces: []
domains: []


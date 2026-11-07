#!/bin/sh
set -eu
EDITOR_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$EDITOR_ROOT"
for EDITOR_PYTHON in python3.12 python3.11 python3.10 python3; do
  if command -v "$EDITOR_PYTHON" >/dev/null 2>&1 && "$EDITOR_PYTHON" -c 'import sys;sys.exit(not ((3,10)<=sys.version_info[:2]<=(3,12)))'; then
    exec "$EDITOR_PYTHON" scripts/setup.py
  fi
done
echo 'Install Python 3.12 from python.org, then run setup again.' >&2
exit 1

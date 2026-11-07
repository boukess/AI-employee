#!/usr/bin/env python3
"""Install only project-local dependencies; never changes system package managers."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import urllib.request
import venv

ROOT = Path(__file__).resolve().parents[1]
MODEL_URL = 'https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx'
MODEL_SHA256 = '88d4531297118f595bf2fd60f6f566aec2e559393802d1f436c380f0cbbd2828'

def run(args):
    subprocess.run([str(a) for a in args], cwd=ROOT, check=True)

def npm_run(npm, *args):
    # npm.cmd needs the command processor on native Windows. Arguments here are fixed.
    if os.name == 'nt':
        run([os.environ.get('COMSPEC', 'cmd.exe'), '/d', '/s', '/c', subprocess.list2cmdline([npm, *args])])
    else:
        run([npm, *args])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-only', action='store_true')
    args = parser.parse_args()
    node, npm = shutil.which('node'), shutil.which('npm')
    problems = []
    if not (3, 10) <= sys.version_info[:2] <= (3, 12):
        problems.append('Use Python 3.10, 3.11 or 3.12 (64-bit). Python 3.12 is recommended.')
    if not node or not npm:
        problems.append('Install Node.js 22 or newer, with npm, then restart your AI app.')
    elif int(subprocess.check_output([node, '-p', 'process.versions.node.split(".")[0]'], text=True).strip()) < 22:
        problems.append('Node.js 22 or newer is required for this package.')
    if problems:
        print('\n'.join(problems), file=sys.stderr)
        return 1
    if args.check_only:
        print('Python and Node prerequisites are available. No files changed.')
        return 0
    for folder in ['inbox','exports','jobs','models','corpus','public/assets']:
        (ROOT/folder).mkdir(parents=True, exist_ok=True)
    python = ROOT/'.venv'/('Scripts/python.exe' if os.name == 'nt' else 'bin/python3')
    if not python.exists():
        print('Creating this employee\'s Python environment...', flush=True)
        venv.EnvBuilder(with_pip=True).create(ROOT/'.venv')
    run([python,'-m','pip','install','-r',ROOT/'requirements.txt'])
    npm_run(npm, 'ci')
    model = ROOT/'models/rvm_mobilenetv3_fp32.onnx'
    if not model.exists() or hashlib.sha256(model.read_bytes()).hexdigest() != MODEL_SHA256:
        print('Downloading the foreground matting model from its official release...', flush=True)
        temporary = model.with_suffix('.download')
        request = urllib.request.Request(MODEL_URL, headers={'User-Agent':'AI-Video-Editor-Setup/1.0'})
        with urllib.request.urlopen(request, timeout=120) as response, temporary.open('wb') as out:
            shutil.copyfileobj(response, out)
        if hashlib.sha256(temporary.read_bytes()).hexdigest() != MODEL_SHA256:
            raise RuntimeError('Model checksum mismatch. Download retained for inspection; model not installed.')
        temporary.replace(model)
    run([node,ROOT/'node_modules/@remotion/cli/remotion-cli.js','browser','ensure'])
    run([python,ROOT/'scripts/editor.py','index-corpus'])
    npm_run(npm, 'run', 'typecheck')
    print('\nChecking DaVinci Resolve (Studio connection, or free-mode tools)...', flush=True)
    result = subprocess.run([str(python),str(ROOT/'scripts/editor.py'),'doctor'],cwd=ROOT)
    if result.returncode:
        print('\nDependencies installed. Setup is not ready until doctor passes. Studio: open Resolve Studio, set Preferences > System > General > External scripting to Local, and run editor doctor again. '
              'Free Resolve: set "resolve_edition": "free" in config/editor.json (see docs/FREE-RESOLVE.md) and run editor doctor again.')
        return 1
    print('\nReady. Put a raw video in inbox and tell your AI: Edit my video. The transcription model downloads on the first edit.')
    return 0

if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except Exception as error:
        print('SETUP ERROR: '+str(error), file=sys.stderr)
        raise SystemExit(1)

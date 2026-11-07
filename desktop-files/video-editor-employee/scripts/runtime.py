"""Portable paths; no machine-specific configuration is distributed."""
import os
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]

def project_path(value):
    path = Path(value).expanduser()
    return path if path.is_absolute() else ROOT / path

def resolve_python(config):
    override = os.environ.get('AI_VIDEO_EDITOR_RESOLVE_PYTHON') or config.get('resolve_python')
    if override and override != 'auto':
        candidate = project_path(override)
        if candidate.is_file():
            return str(candidate)
        raise FileNotFoundError('Configured ResolvePython is missing: ' + str(candidate))
    candidates = [
        Path('/Applications/DaVinci Resolve/DaVinci Resolve.app/Contents/Applications/ResolvePython'),
        Path(os.environ.get('ProgramFiles', r'C:\Program Files')) / 'Blackmagic Design/DaVinci Resolve/ResolvePython/ResolvePython.exe',
        Path('/opt/resolve/bin/ResolvePython'),
    ]
    for candidate in candidates:
        if candidate.is_file():
            return str(candidate)
    raise FileNotFoundError('ResolvePython not found. Install DaVinci Resolve Studio 21.1+ or set resolve_python in config/editor.json to its executable. '
                            'Using the free edition? Set "resolve_edition": "free" in config/editor.json.')

def resolve_edition(config):
    """'studio' (default, external scripting via ResolvePython) or 'free' (FCPXML + FFmpeg)."""
    value = (os.environ.get('AI_VIDEO_EDITOR_RESOLVE_EDITION') or config.get('resolve_edition') or 'studio').strip().lower()
    if value not in ('studio', 'free'):
        raise ValueError('resolve_edition must be "studio" or "free".')
    return value

def detect_resolve():
    """Best-effort, read-only check of the installed Resolve edition (Windows registry only)."""
    if os.name != 'nt':
        return {'detected': False, 'note': 'Edition detection is implemented for Windows only.'}
    import winreg
    found = []
    for hive, base in [(winreg.HKEY_LOCAL_MACHINE, r'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall'),
                       (winreg.HKEY_CURRENT_USER, r'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall')]:
        try:
            root = winreg.OpenKey(hive, base)
        except OSError:
            continue
        for i in range(winreg.QueryInfoKey(root)[0]):
            try:
                key = winreg.OpenKey(root, winreg.EnumKey(root, i))
                name = winreg.QueryValueEx(key, 'DisplayName')[0]
            except OSError:
                continue
            if name in ('DaVinci Resolve', 'DaVinci Resolve Studio'):
                try: version = winreg.QueryValueEx(key, 'DisplayVersion')[0]
                except OSError: version = None
                found.append({'name': name, 'version': version})
    if not found:
        return {'detected': False}
    item = found[0]
    return {'detected': True, 'edition': 'studio' if item['name'].endswith('Studio') else 'free', **item}

def remotion_command():
    node = shutil.which('node')
    cli = ROOT / 'node_modules/@remotion/cli/remotion-cli.js'
    if not node or not cli.is_file():
        raise RuntimeError('Run setup first: Node.js and local Remotion are required.')
    return [node, str(cli)]

def venv_python():
    return ROOT / '.venv' / ('Scripts/python.exe' if os.name == 'nt' else 'bin/python3')

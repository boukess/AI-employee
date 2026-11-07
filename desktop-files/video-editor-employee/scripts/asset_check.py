"""Check local source media against its recorded provenance before rendering."""
import hashlib
import json
from pathlib import Path


def validate_assets(root, plan):
    if not plan.get('asset_manifest'):
        return
    manifest = json.loads((root / plan['asset_manifest']).read_text())
    for asset in manifest['assets']:
        path = (root / asset['path']).resolve()
        if not path.is_relative_to((root / 'public').resolve()):
            raise ValueError(f'Asset must be inside public/: {path}')
        if not asset.get('source_url') or not asset.get('operations'):
            raise ValueError(f'Missing source/transform record: {path}')
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        if actual != asset['sha256']:
            raise ValueError(f'Asset changed; update provenance before rendering: {path}')

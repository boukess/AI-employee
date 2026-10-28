import hashlib
import json
from pathlib import Path
import sys
import tempfile
import unittest
import zipfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import build_release as b


class ReleaseTests(unittest.TestCase):
    def test_chat_edition_embeds_every_runtime_dependency(self):
        text = b.chat_edition()
        for name in b.OPERATING + b.TEMPLATES:
            self.assertIn("EMBEDDED FILE: " + name, text)
            self.assertIn((b.ROOT / name).read_text().strip(), text)
        self.assertIn("Do not ask the member to locate another manual", text)

    def test_member_workspace_and_private_folders_rejected(self):
        for name in ["private/secret.txt", "workspace/voice-profile.md", "../secret.txt", "/tmp/secret.txt", "dist/old.zip", "..\\secret.txt"]:
            with self.subTest(name=name), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                (root / "release").mkdir()
                (root / "release/RELEASE-FILES.json").write_text(json.dumps([name]))
                with self.assertRaises(ValueError):
                    b.public_files(root)

    def test_symlink_cannot_smuggle_private_source(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "release").mkdir()
            (root / "private").mkdir()
            (root / "private/source.txt").write_text("private writing")
            (root / "README.md").symlink_to(root / "private/source.txt")
            (root / "release/RELEASE-FILES.json").write_text('["README.md"]')
            with self.assertRaises(ValueError):
                b.public_files(root)

    def test_actual_allowlist_contains_no_personal_workspace(self):
        names = json.loads((b.ROOT / "release/RELEASE-FILES.json").read_text())
        self.assertEqual([n for n in names if n.startswith("workspace/")], ["workspace/README.md"])
        self.assertFalse(any(n.startswith("private/") for n in names))

    def test_archive_roundtrip_manifest_and_determinism(self):
        files = b.payloads()
        with tempfile.TemporaryDirectory() as temp:
            first, second = Path(temp) / "one.zip", Path(temp) / "two.zip"
            b.write_archive(first, files)
            b.write_archive(second, files)
            self.assertEqual(first.read_bytes(), second.read_bytes())
            with zipfile.ZipFile(first) as archive:
                self.assertIsNone(archive.testzip())
                manifest = json.loads(archive.read(b.PACKAGE + "/MANIFEST.json"))
                self.assertEqual(set(archive.namelist()), {b.PACKAGE + "/" + n for n in files})
                for name, info in manifest["files"].items():
                    self.assertEqual(hashlib.sha256(archive.read(b.PACKAGE + "/" + name)).hexdigest(), info["sha256"])


if __name__ == "__main__":
    unittest.main()

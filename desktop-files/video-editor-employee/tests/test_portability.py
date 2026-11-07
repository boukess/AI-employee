import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('member_editor', ROOT/'scripts/editor.py')
editor = importlib.util.module_from_spec(spec)
spec.loader.exec_module(editor)
import runtime

class PortabilityTests(unittest.TestCase):
    def test_relative_config_does_not_depend_on_current_directory(self):
        previous = Path.cwd()
        try:
            with tempfile.TemporaryDirectory() as elsewhere:
                os.chdir(elsewhere)
                self.assertEqual(runtime.project_path('references/corpus'), ROOT/'references/corpus')
                self.assertTrue(Path(editor.CONFIG['corpus_root'], 'manifest.jsonl').is_file())
        finally:
            os.chdir(previous)

    def test_bad_resolve_override_fails_without_silent_fallback(self):
        with patch.dict(os.environ, {'AI_VIDEO_EDITOR_RESOLVE_PYTHON':'missing/ResolvePython'}):
            with self.assertRaises(FileNotFoundError):
                runtime.resolve_python({'resolve_python':'auto'})

    def test_custom_resolve_path_with_spaces_is_a_single_path(self):
        with tempfile.TemporaryDirectory(prefix='editor path ') as folder:
            executable = Path(folder)/'Resolve Python'
            executable.write_text('test executable fixture')
            with patch.dict(os.environ, {'AI_VIDEO_EDITOR_RESOLVE_PYTHON':str(executable)}):
                self.assertEqual(runtime.resolve_python({'resolve_python':'auto'}), str(executable))

    def test_inbox_distinguishes_new_finished_and_changed_recordings(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);(root/'inbox').mkdir();(root/'jobs/one').mkdir(parents=True)
            source=root/'inbox/raw clip.mp4';source.write_bytes(b'input A')
            (root/'inbox/README.txt').write_text('not a video')
            def inspect():
                out=io.StringIO()
                with patch.object(editor,'ROOT',root),contextlib.redirect_stdout(out):editor.inbox(None)
                return json.loads(out.getvalue())
            self.assertEqual(len(inspect()['pending']),1)
            stat=source.stat()
            (root/'jobs/one/job.json').write_text(json.dumps(dict(id='one',source=str(source.resolve()),source_size=stat.st_size,source_mtime_ns=stat.st_mtime_ns,phase='awaiting_user_feedback',revision=1)))
            self.assertEqual(len(inspect()['pending']),0)
            self.assertEqual(inspect()['known'][0]['jobs'][0]['phase'],'awaiting_user_feedback')
            source.write_bytes(b'input B is a new recording')
            self.assertEqual(len(inspect()['pending']),1)
            self.assertEqual(source.read_bytes(),b'input B is a new recording')

if __name__ == '__main__':unittest.main()

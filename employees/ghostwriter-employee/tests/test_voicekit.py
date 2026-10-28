import contextlib
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import voicekit as v


def sample(**changes):
    record = dict(id="s1", author="Example Member", author_evidence="Supplied by member as original", origin="user-supplied.txt", group="work-1", title="Explanation", medium="email", permission_basis="Member supplied for voice work", authorship="human_original", purpose="style", confidence="high", privacy="private", published_at=None, retrieved_at="2026-10-13", text="I usually explain the next step before I ask someone to do it.", transformations=[], limitations=[])
    record.update(changes)
    return record


class CorpusTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name)

    def tearDown(self):
        self.temp.cleanup()

    def test_duplicate_punctuation_cannot_inflate_corpus(self):
        v.add_record(self.path, sample())
        with self.assertRaisesRegex(ValueError, "Duplicate text"):
            v.add_record(self.path, sample(id="s2", text="I usually explain the next step, before I ask someone to do it!"))
        self.assertEqual(len(v.load_records(self.path)), 1)

    def test_ai_third_party_unknown_not_personal_style(self):
        for kind in ("ai_assisted", "third_party", "unknown", "generated_draft"):
            with self.subTest(kind=kind), self.assertRaisesRegex(ValueError, "Only human"):
                v.add_record(self.path, sample(authorship=kind))

    def test_same_origin_cannot_cross_holdout_boundary(self):
        v.add_record(self.path, sample())
        with self.assertRaisesRegex(ValueError, "same origin"):
            v.add_record(self.path, sample(id="s2", purpose="holdout", text="A distinct section from the same recording."))

    def test_holdout_and_generated_copy_excluded_from_style_counts(self):
        records = [sample(text="one two three"), sample(id="s2", group="work-2", purpose="holdout", text="four five"), sample(id="s3", group="work-3", purpose="feedback", authorship="generated_draft", text="six seven eight nine")]
        report = v.summarize(records)
        self.assertEqual(report["style_words"], 3)
        self.assertEqual(report["holdout_words"], 2)
        self.assertEqual(report["style_distinct_origins"], 1)

    def test_performed_speech_is_visible_not_called_original(self):
        result = v.summarize([sample(authorship="performed_speech", text="one two three")])
        self.assertEqual(result["human_original_style_words"], 0)
        self.assertEqual(result["performed_speech_style_words"], 3)

    def test_same_origin_counts_once(self):
        report = v.summarize([sample(text="one two three"), sample(id="s2", text="four five six")])
        self.assertEqual(report["style_distinct_origins"], 1)
        self.assertEqual(report["style_records"], 2)

    def test_manual_holdout_conflict_excluded(self):
        result = v.summarize([sample(), sample(id="s2", purpose="holdout", text="Other section")])
        self.assertEqual(result["style_words"], 0)
        self.assertEqual(result["holdout_words"], 0)
        self.assertEqual(result["conflicted_origins_excluded_from_style_and_holdout"], ["work-1"])

    def test_near_duplicate_warns(self):
        v.add_record(self.path, sample(text="one two three four five six seven eight nine ten"))
        result = v.add_record(self.path, sample(id="s2", group="work-2", text="one two three four five six seven eight nine ten plus extra words"))
        self.assertEqual(len(result["warnings"]), 1)

    def test_source_metadata_required(self):
        for field in ("author_evidence", "permission_basis", "group"):
            with self.subTest(field=field), self.assertRaises(ValueError):
                v.validate(sample(**{field: ""}))

    def test_corrupt_store_is_not_overwritten(self):
        path = self.path / "corpus/sources.jsonl"
        path.parent.mkdir()
        path.write_text("this is not json\n")
        with self.assertRaisesRegex(ValueError, "line 1"):
            v.add_record(self.path, sample())
        self.assertEqual(path.read_text(), "this is not json\n")

    def test_subtitle_cleaning_keeps_words_and_punctuation(self):
        text = "1\n00:00:00,000 --> 00:00:01,000\nThat's how\n\n2\n00:00:01,000 --> 00:00:02,000\nI'd explain it.\n"
        result, transforms = v.clean(text, ".srt")
        self.assertEqual(result, "That's how I'd explain it.")
        self.assertTrue(transforms)

    def test_vtt_metadata_not_counted_as_speech(self):
        result, _ = v.clean("WEBVTT\n\nNOTE not speech\n\nintro\n00:00.000 --> 00:01.000 align:start\n<v Speaker>Hello &amp; welcome.</v>\n", ".vtt")
        self.assertEqual(result, "Hello & welcome.")

    def test_forget_invalidates_report_and_has_honest_limits(self):
        v.add_record(self.path, sample())
        report = self.path / "corpus/report.json"
        report.write_text("{}")
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = v.main(["--workspace", str(self.path), "forget", "--id", "s1"])
        self.assertEqual(code, 0)
        self.assertEqual(v.load_records(self.path), [])
        self.assertFalse(report.exists())
        self.assertIn("platform history", out.getvalue())

    def test_cli_add_preserves_original_input_and_report(self):
        source = self.path / "input.txt"
        original = "I'd explain the whole idea with a simple example."
        source.write_text(original)
        argv = ["--workspace", str(self.path), "add", "--file", str(source), "--id", "s1", "--author", "Member", "--author-evidence", "Member supplied", "--origin", "input.txt", "--group", "work-1", "--title", "Explanation", "--medium", "email", "--permission-basis", "User supplied", "--authorship", "human_original", "--purpose", "style"]
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(v.main(argv), 0)
            self.assertEqual(v.main(["--workspace", str(self.path), "report"]), 0)
        self.assertEqual(source.read_text(), original)
        self.assertEqual(json.loads((self.path / "corpus/report.json").read_text())["style_records"], 1)


class LintTests(unittest.TestCase):
    def test_contrast_dashes_filler_and_placeholder(self):
        text = "It's not about quantity. It's about quality.\nThis isn't work. This is art.\nA game-changer—really. [NEED: result]"
        result = v.lint_text(text)
        rules = {h["rule"] for h in result["findings"]}
        self.assertTrue({"canned_contrast", "dash_review", "hype_or_filler", "unfinished_placeholder"} <= rules)

    def test_simple_prose_and_false_claim_of_detection(self):
        report = v.lint_text("Send me the three emails you wrote last week. I'll use them to draft a reply.")
        self.assertEqual(report["status"], "NO_PATTERN_HITS")
        self.assertIn("Not an AI detector", report["limits"])

    def test_dash_override_does_not_hide_other_findings(self):
        result = v.lint_text("A game-changer—yes.", allow_dashes=True)
        self.assertEqual([h["rule"] for h in result["findings"]], ["hype_or_filler"])


if __name__ == "__main__":
    unittest.main()

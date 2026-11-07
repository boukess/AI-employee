import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('cadence',Path(__file__).resolve().parents[1]/'scripts/cadence.py')
c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)

class CadenceTests(unittest.TestCase):
    def test_quiet_handles_merge_across_an_edit(self):
        # Two 200ms handles become a 400ms pause even though a long gap was cut.
        gaps=c.remap_quiet([[1.8,3.2]],[{'in':0,'out':60},{'in':90,'out':150}],30)
        self.assertEqual(len(gaps),1)
        self.assertAlmostEqual(gaps[0][1]-gaps[0][0],0.4)

    def test_removed_pause_does_not_survive_or_merge_across_speech(self):
        gaps=c.remap_quiet([[0.4,0.6],[2.1,2.9],[3.4,3.6]],
                           [{'in':0,'out':60},{'in':90,'out':150}],30)
        self.assertEqual(len(gaps),2)
        self.assertAlmostEqual(gaps[1][0],2.4)

if __name__=='__main__':unittest.main()

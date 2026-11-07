import copy
import importlib.util
from pathlib import Path
import unittest

spec=importlib.util.spec_from_file_location('editor',Path(__file__).resolve().parents[1]/'scripts/editor.py')
e=importlib.util.module_from_spec(spec);spec.loader.exec_module(e)

class TimingTests(unittest.TestCase):
    def plan(self):
        return dict(fps=30,width=1080,height=1920,durationInFrames=90,cuts=[{'in':30,'out':60},{'in':90,'out':150}],scenes=[],creative_brief='test cut timing')

    def test_cut_frames_are_half_open(self):
        p=self.plan();self.assertEqual(e.validate_plan(p,150),90)
        self.assertEqual(sum(c['out']-c['in'] for c in p['cuts']),90)

    def test_words_are_retimed_across_removed_gap(self):
        words=[{'word':'first','start':1.2,'end':1.6},{'word':'removed','start':2.2,'end':2.7},{'word':'last','start':3.2,'end':3.7}]
        out=e.remap_words(words,self.plan()['cuts'],30)
        self.assertEqual(out,[{'text':'first','start':6,'end':18},{'text':'last','start':36,'end':51}])

    def test_source_overrun_is_rejected(self):
        with self.assertRaises(ValueError):e.validate_plan(self.plan(),149)

    def test_scene_overrun_is_rejected(self):
        p=self.plan();p['scenes']=[dict(id='x',kind='custom',layout='full',**{'from':89,'duration':2})]
        with self.assertRaises(ValueError):e.validate_plan(p,150)

    def test_zero_length_asr_word_is_preserved(self):
        result=e.remap_words([{'word':'a','start':1.3,'end':1.3}],self.plan()['cuts'],30)
        self.assertEqual(result,[{'text':'a','start':9,'end':10}])

    def test_word_at_exclusive_cut_end_is_not_leaked(self):
        self.assertEqual(e.remap_words([{'word':'after','start':2,'end':2.1}],[{'in':30,'out':60}],30),[])

    def test_duration_mismatch_is_rejected(self):
        p=self.plan();p['durationInFrames']=91
        with self.assertRaises(ValueError):e.validate_plan(p,150)

    def test_captions_do_not_merge_sentences(self):
        cues=e.captions_from_words([{'text':'Together.','start':0,'end':5},{'text':"It’s",'start':6,'end':10}])
        self.assertEqual(len(cues),2)

if __name__=='__main__':unittest.main()

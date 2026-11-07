"""Run with ResolvePython, or from Resolve's Python console. Never clears existing projects/queues."""
import json
from pathlib import Path
import sys
import time
import DaVinciResolveScript as dvr

ROOT=Path(__file__).resolve().parents[1]
resolve=dvr.scriptapp('Resolve')


def require(value, message):
    if not value: raise RuntimeError(message)
    return value


def load(path): return json.loads(path.read_text())
def save(path,value): path.write_text(json.dumps(value,indent=2)+'\n')


def main():
    command=sys.argv[1]
    require(resolve,'Open DaVinci Resolve; Studio external scripting must allow Local, or use the internal Python console.')
    pm=resolve.GetProjectManager()
    if command=='doctor':
        print(json.dumps({'connected':True,'version':resolve.GetVersionString(),'current_project':pm.GetCurrentProject().GetName() if pm.GetCurrentProject() else None}));return
    job=Path(sys.argv[2]).resolve();plan=load(job/'plan.json');meta=load(job/'job.json')
    if command=='assemble':
        # Preserve any active project before switching to a fresh project for this revision.
        if pm.GetCurrentProject(): require(pm.SaveProject(),'Could not save current project before switching.')
        name=f"AIVE_{job.name}_v{meta['revision']:02}_{int(time.time())}"
        project=require(pm.CreateProject(name),'Unable to create a new Resolve project.')
        for key,value in {'timelineFrameRate':str(plan['fps']),'timelineResolutionWidth':str(plan['width']),
                          'timelineResolutionHeight':str(plan['height'])}.items():
            require(project.SetSetting(key,value),f'Resolve rejected project setting {key}.')
        pool=project.GetMediaPool()
        timeline=require(pool.CreateEmptyTimeline('Final edit'),'Unable to create timeline.')
        require(timeline.SetStartTimecode('00:00:00:00'),'Unable to set timeline timecode.')
        require(project.SetCurrentTimeline(timeline),'Unable to select timeline.')
        while timeline.GetTrackCount('video')<2: require(timeline.AddTrack('video'),'Unable to add graphics track.')
        if timeline.GetTrackCount('audio')<1: require(timeline.AddTrack('audio','stereo'),'Unable to add dialogue track.')
        timeline.SetTrackName('video',1,'01 • Edited footage')
        timeline.SetTrackName('video',2,'02 • Original Remotion graphics + captions')
        timeline.SetTrackName('audio',1,'01 • Mobile dialogue master')
        def media(path):
            require(path.exists(),f'Missing media: {path}')
            items=pool.ImportMedia([str(path)])
            return require(items,f'Failed media import: {path}')[0]
        source=media(job/'media'/('presenter.mp4' if plan.get('footage_variant')=='presenter' else 'source.mp4'))
        if plan.get('footage_variant')=='presenter':
            media(job/'media/source.mp4')
        graphic=media(job/'renders/motion.mov')
        audio=media(job/'media/dialogue-mobile.wav')
        require(graphic.SetClipProperty('Alpha mode','Straight'),'Could not set straight alpha on motion layer.')
        def append_exact(clip,source_start,length,track,media_type,record):
            # End-frame semantics differ between Resolve versions. Measure the returned
            # duration in this new job timeline instead of allowing one-frame gaps.
            for adjustment in (0,-1):
                items=pool.AppendToTimeline([dict(mediaPoolItem=clip,startFrame=source_start,
                         endFrame=source_start+length+adjustment,mediaType=media_type,
                         trackIndex=track,recordFrame=record)])
                if not items: continue
                item=items[0]
                if item.GetDuration()==length and item.GetStart()==record:
                    return item
                require(timeline.DeleteClips(items,False),'Could not remove a mismatched trial append from the new job timeline.')
            raise RuntimeError(f'Resolve could not append exactly {length} frames at {record}.')
        cursor=timeline.GetStartFrame()
        for cut in plan['cuts']:
            length=cut['out']-cut['in']
            item=append_exact(source,cut['in'],length,1,1,cursor)
            if cut.get('transform'):
                require(item.SetProperties(cut['transform']),'Resolve rejected clip transform.')
            cursor+=length
        start=timeline.GetStartFrame();length=plan['durationInFrames']
        append_exact(graphic,0,length,2,1,start)
        append_exact(audio,0,length,1,2,start)
        actual=timeline.GetEndFrame()-start
        require(actual==plan['durationInFrames'],f'Timeline duration mismatch: {actual}.')
        require(pm.SaveProject(),'Could not save project.')
        archive=job/'renders'/f"{name}.drp"
        require(pm.ExportProject(name,str(archive)),'Could not export project backup.')
        save(job/'resolve.json',dict(project=name,timeline=timeline.GetName(),project_backup=str(archive),frames=actual))
        resolve.OpenPage('edit')
        print(json.dumps({'project':name,'frames':actual,'backup':str(archive)}));return
    bridge=load(job/'resolve.json')
    current=pm.GetCurrentProject()
    if not current or current.GetName()!=bridge['project']:
        if current: require(pm.SaveProject(),'Could not save current project.')
        project=require(pm.LoadProject(bridge['project']),'Could not load job project.')
    else: project=current
    if command=='render':
        require(not project.IsRenderingInProgress(),'Resolve is already rendering.')
        codecs=project.GetRenderCodecs('mp4')
        codec=next((v for k,v in codecs.items() if '264' in k or '264' in v),None)
        require(codec,f'No MP4 H.264 codec available: {codecs}')
        require(project.SetCurrentRenderMode(1),'Unable to select single clip rendering.')
        require(project.SetCurrentRenderFormatAndCodec('mp4',codec),'Unable to set H.264 MP4 format.')
        stem=f"resolve-v{meta['revision']:02}-{int(time.time())}"
        require(project.SetRenderSettings(dict(SelectAllFrames=True,TargetDir=str(job/'renders'),CustomName=stem,
                 ExportVideo=True,ExportAudio=True,FormatWidth=plan['width'],FormatHeight=plan['height'],
                 FrameRate=plan['fps'],VideoQuality=16000,AudioCodec='aac',AudioSampleRate=48000,
                 NetworkOptimization=True,UseUniqueFilenames=False)),'Resolve rejected render settings.')
        job_id=require(project.AddRenderJob(),'Unable to add render job.')
        bridge.update(render_job=job_id,render_path=str(job/'renders'/(stem+'.mp4')))
        save(job/'resolve.json',bridge)
        require(project.StartRendering([job_id]),'Unable to start this render job.')
        print(json.dumps({'render_job':job_id,'output':bridge['render_path']}));return
    if command=='status':
        require(bridge.get('render_job'),'No render has been started.')
        print(json.dumps(project.GetRenderJobStatus(bridge['render_job'])));return
    raise ValueError(f'Unknown command {command}')


if __name__=='__main__': main()

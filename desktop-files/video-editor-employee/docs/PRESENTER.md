# Reproduce the head-over-camera effect

The reference is a two-layer presenter treatment: the original camera rectangle below, and a masked person above it. The head projects beyond the rounded frame into the white/cream graphics page. This requires foreground matting, not only resizing or cropping.

`./editor presenter JOB` builds `media/presenter.mp4` from the unedited normalized input. The local RVM MobileNetV3 model uses recurrent state between frames, producing a temporally guided foreground and soft alpha. The foreground and original camera image use the same transform. The original image is visible within the rounded card; foreground alpha exposes the person's head above it. No physical green screen is required, and no artificial green tint is added.

Default for the supplied 1080x1920 close camera shot: scale 0.86, x76, y838. This places the hair around y990 and the camera card at y1170. Calibrate to each source with `--scale` and `--offset-y`; do not force a distant/very different camera composition through these values blindly. The plate always preserves source timing and frame count, so the same cut list applies to it and its audio.

Inspect `analysis/presenter-0000.jpg`, `presenter-0120.jpg` and later available samples to check hair, headsets and whether the person's head stays clear of captions. This is the editor checking whether a tool worked, not a separate review agent. A matte with missing hair, unstable holes or a visible alignment seam must be fixed before export. The model can struggle with occlusions/background similarity; a different matte tool or a hand-adjusted Resolve mask may be needed for those inputs.

Model: [Robust Video Matting](https://github.com/PeterL1n/RobustVideoMatting), with its documented ONNX inputs/recurrent-state contract. Installed at `models/rvm_mobilenetv3_fp32.onnx`. Local dependency: ONNX Runtime. To install on another machine, retrieve `rvm_mobilenetv3_fp32.onnx` from the project's official v1.0.0 release into `models/`, then run doctor. No footage is sent to that site or another cloud service.

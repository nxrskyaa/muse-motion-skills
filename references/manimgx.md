# ManimGX — true-3D insert generator

ManimGX (`manimgx.academa.ai`, GitHub: `academa-labs/manimgx`) is a Rust/wgpu
animation engine with a Manim-compatible Python API. It renders real 3D scenes
with PBR lighting — the one thing the Remotion pipeline cannot do natively.

## Role in this skill: 3D inserts only

Render short 3D hero moments (3-6s: intros, logo reveals, transitions, math
visualizations) to MP4, then composite into the Remotion timeline via
`<OffthreadVideo>`. Remotion stays the composer (typography, UI, VO timing).

## Setup (verified 2026-10-11)

- Requires Python 3.13 or 3.14. On machines with older system Python:
  `uvx --python 3.14 manimgx` (installs `uv` first if needed).
- Verified version: `manimgx 0.1.1`.
- Linux wheels include a CPU fallback (Mesa lavapipe) — no GPU required.

## Render

```bash
# scene.py — standard manim API
uvx --python 3.14 manimgx render -qm --format mp4 scene.py
```

Vertical 1080x1920: set `config.pixel_width = 1080`, `config.pixel_height = 1920`
in the scene file. Add `manimgx inspect scene.py` / storyboard PNGs to check
composition before long renders.

## Honest performance (measured, CPU-only VM)

A 4.8s 1080x1920@30 3D clip took ~122s to render (~25s per video-second).
Official "90x faster than ManimCE" claims assume real GPU hardware. On CPU-only
machines ManimGX is **slower per-second than the Remotion pipeline** — its win
is capability (true 3D, PBR lighting, camera moves), not speed. Keep inserts
short and render them once, then reuse the MP4.

## Minimal 3D scene pattern

```python
from manim import *

config.pixel_width = 1080
config.pixel_height = 1920
config.frame_rate = 30

class Hero3D(Scene):
    def construct(self):
        self.camera.background_color = "#010101"
        core = Sphere(radius=1.2, fill_color="#A9DDD3", fill_opacity=1)
        ring = Torus(major_radius=2.0, minor_radius=0.03, fill_color="#E8E3D5")
        self.play(Create(core), Create(ring), run_time=1.5)
        self.play(Rotate(ring, angle=2*PI, axis=UP), run_time=2)
        self.wait(0.5)
```

## Licensing note (from the project's own site)

Project code is described as MIT-licensed; the packaged native wheels carry
additional GPL-related licensing noted by the site. Check the current
`llms.txt` / repo LICENSE before redistributing rendered artifacts
commercially.

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {ExampleArea} from './scenes/ExampleArea';

export const FPS = 30;

// One area per quest beat. dur = voDelay + voFrames + tailPad.
export const SCENES = [
  {dur: 420, voDelay: 30, Comp: ExampleArea, vo: 'vo/a1.mp3'},
] as const;

export const TOTAL = SCENES.reduce((a, s) => a + s.dur, 0);

const STARTS: number[] = [];
{
  let acc = 0;
  for (const s of SCENES) {
    STARTS.push(acc);
    acc += s.dur;
  }
}
const BOUNDARIES = STARTS.slice(1);

// typewriter blip windows (absolute frames) — blip every 14f while typing
const BLIP_WINDOWS: [number, number][] = [[84, 170], [200, 290]];
const BLIPS: number[] = [];
for (const [s, e] of BLIP_WINDOWS) {
  for (let t = s; t < Math.min(e, s + 112); t += 14) BLIPS.push(t);
}

const SFX: [number, string, number][] = [
  [300, 'sfx/fanfare.mp3', 0.7], // banner moment
];

export const RpgVideo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#101024'}}>
      {SCENES.map(({dur, voDelay, Comp, vo}, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Comp />
            <Sequence from={voDelay} durationInFrames={dur - voDelay}>
              <Audio src={staticFile(vo)} volume={1} />
            </Sequence>
          </Sequence>
        );
        from += dur;
        return el;
      })}
      {BOUNDARIES.map((b) => (
        <Sequence key={`fl-${b}`} from={b - 3} durationInFrames={7}>
          <AbsoluteFill style={{background: '#fff', opacity: 0.9}} />
        </Sequence>
      ))}
      {/* chiptune bed — keep subtle under VO (~0.15-0.2) */}
      <Sequence from={0} durationInFrames={TOTAL}>
        <Audio src={staticFile('sfx/music.mp3')} volume={0.18} loop />
      </Sequence>
      {BLIPS.map((t, i) => (
        <Sequence key={`bl-${i}`} from={t} durationInFrames={4}>
          <Audio src={staticFile('sfx/blip.mp3')} volume={0.22} />
        </Sequence>
      ))}
      {SFX.map(([at, file, volume], i) => (
        <Sequence key={`sfx-${i}`} from={at} durationInFrames={40}>
          <Audio src={staticFile(file)} volume={volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const DURATION = TOTAL;
export const fps = FPS;

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FPS} from './theme';
import {Background} from './components/Background';
import {SceneShell, Whip} from './components/fx';
import {CtaScene, HookScene} from './scenes/Example';

/**
 * SCENES table: dur = voDelay + voFrames + tailPad (~30-40f).
 * Replace with your beats. Keep 6-8 scenes, 45-75s total.
 */
export const SCENES = [
  {dur: 300, voDelay: 30, Comp: HookScene, vo: 'vo/s1.mp3'},
  {dur: 220, voDelay: 20, Comp: CtaScene, vo: 'vo/s2.mp3'},
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

// SFX event map: [absoluteFrame, file, volume] — lands 0-2f BEFORE the visual hit
const SFX: [number, string, number][] = [
  [0, 'vo/whoosh.mp3', 0.4],
  [4, 'vo/impact.mp3', 0.8],
  [270, 'vo/riser.mp3', 0.5],
  [300, 'vo/whoosh.mp3', 0.45],
  [312, 'vo/impact.mp3', 0.8],
];

export const Video: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map(({dur, voDelay, Comp, vo}, i) => {
        const el = (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <SceneShell dur={dur}>
              <Comp />
            </SceneShell>
            <Sequence from={voDelay} durationInFrames={dur - voDelay}>
              <Audio src={staticFile(vo)} volume={1} />
            </Sequence>
          </Sequence>
        );
        from += dur;
        return el;
      })}
      {BOUNDARIES.map((b) => (
        <Sequence key={`whip-${b}`} from={b - 8} durationInFrames={20}>
          <Whip />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={TOTAL}>
        <Audio src={staticFile('vo/bed.mp3')} volume={0.16} />
      </Sequence>
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

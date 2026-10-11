import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT} from '../theme';
import {FadeIn, Kicker, Kinetic} from '../components/Kinetic';
import {MONO, Panel, Punch, Scramble} from '../components/fx';

/**
 * SCENE 1 — Hook. Pattern: kicker → kinetic headline → scramble subline →
 * one bespoke object that visualizes the core idea. Never text-only.
 */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slam = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 220}});

  return (
    <AbsoluteFill>
      <Punch>
        <FadeIn dur={6}>
          <AbsoluteFill style={{padding: '130px 110px'}}>
            <Kicker index="◈" label="ACME — THE HOOK" start={2} />
            <div
              style={{
                marginTop: 120,
                fontSize: 170,
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: C.text,
                opacity: interpolate(frame, [2, 10], [0, 1], {extrapolateRight: 'clamp'}),
                transform: `scale(${interpolate(slam, [0, 1], [1.3, 1])})`,
              }}
            >
              YOUR
              <br />
              HOOK<span style={{color: C.accent}}>.</span>
            </div>
            <div style={{marginTop: 44}}>
              {frame > 30 && (
                <Scramble
                  text="One uncomfortable truth, decoded."
                  start={34}
                  dur={30}
                  style={{fontSize: 52, fontWeight: 600, color: C.text}}
                />
              )}
            </div>

            {/* bespoke object: replace with YOUR metaphor */}
            <div
              style={{
                position: 'absolute',
                left: 110,
                right: 110,
                bottom: 160,
                opacity: interpolate(frame, [70, 90], [0, 1], {extrapolateRight: 'clamp'}),
              }}
            >
              <Panel title="LIVE OBJECT" right="● DEMO" rightColor={C.accent}>
                <div style={{fontFamily: MONO, fontSize: 28, color: C.textDim, padding: '20px 0'}}>
                  Build the story's central object here — a control room, a
                  pipeline, a vault, a radar. If this panel is empty, the scene
                  is not done.
                </div>
              </Panel>
            </div>
          </AbsoluteFill>
        </FadeIn>
      </Punch>
    </AbsoluteFill>
  );
};

/**
 * SCENE 2 — CTA. Pattern: brand lockup → payoff line → URL + underline draw.
 */
export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lineW = interpolate(frame, [60, 95], [0, 420], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <Punch flip>
        <FadeIn dur={10}>
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 110}}>
            <div style={{fontSize: 170, fontWeight: 800, letterSpacing: '0.1em', color: C.text}}>
              ACME
            </div>
            <div style={{marginTop: 30, fontFamily: FONT, fontSize: 48, color: C.textDim}}>
              <Kinetic
                align="center"
                size={48}
                stagger={5}
                start={30}
                color={C.textDim}
                words={[
                  {t: 'Your'},
                  {t: 'payoff'},
                  {t: 'line', accent: true},
                  {t: 'here.', accent: true},
                ]}
              />
            </div>
            <div style={{marginTop: 50, fontSize: 50, fontWeight: 600, color: C.accent}}>
              acme.io
            </div>
            <div style={{marginTop: 16, width: lineW, height: 3, background: C.accent}} />
          </AbsoluteFill>
        </FadeIn>
      </Punch>
    </AbsoluteFill>
  );
};

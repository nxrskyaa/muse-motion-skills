import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export type Word = {t: string; accent?: boolean; breakAfter?: boolean};

/**
 * Kinetic paragraph: words rise in with blur+fade, staggered.
 * `start` = frame the first word begins. Each word staggers by `stagger` frames.
 */
export const Kinetic: React.FC<{
  words: Word[];
  start?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  lineHeight?: number;
  align?: 'left' | 'center';
  color?: string;
  maxWidth?: number;
  letterSpacing?: string;
}> = ({
  words,
  start = 0,
  stagger = 4,
  size = 64,
  weight = 600,
  lineHeight = 1.18,
  align = 'left',
  color = C.text,
  maxWidth,
  letterSpacing = '-0.02em',
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{maxWidth, textAlign: align, lineHeight, letterSpacing}}>
      {words.map((w, i) => {
        const f = frame - start - i * stagger;
        const p = interpolate(f, [0, 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: EASE,
        });
        const y = interpolate(p, [0, 1], [34, 0]);
        const blur = interpolate(p, [0, 1], [10, 0]);
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                fontSize: size,
                fontWeight: weight,
                color: w.accent ? C.accent : color,
                opacity: p,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                marginRight: '0.28em',
                whiteSpace: 'nowrap',
              }}
            >
              {w.t}
            </span>
            {w.breakAfter && <br />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** Small editorial kicker: "001 — THE PROBLEM" with hairline */
export const Kicker: React.FC<{index: string; label: string; start?: number}> = ({
  index,
  label,
  start = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const wLine = interpolate(frame - start, [4, 26], [0, 120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: p}}>
      <span
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: C.accent,
          letterSpacing: '0.08em',
        }}
      >
        {index}
      </span>
      <div style={{width: wLine, height: 1, background: C.borderStrong}} />
      <span
        style={{
          fontSize: 26,
          fontWeight: 500,
          color: C.textDim,
          letterSpacing: '0.32em',
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Fade-in wrapper for scene transitions */
export const FadeIn: React.FC<{children: React.ReactNode; dur?: number}> = ({
  children,
  dur = 14,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, dur], [0, 1], {
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  return <div style={{opacity: o, width: '100%', height: '100%'}}>{children}</div>;
};

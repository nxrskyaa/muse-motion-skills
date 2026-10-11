import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C} from '../theme';

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

/** Deterministic pseudo-random — pure function of (i, k). No flicker. */
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*';

/**
 * Scramble text: chars resolve left→right. Crypto-native signature move.
 * `start`: frame it begins resolving; `dur`: frames to fully resolve.
 */
export const Scramble: React.FC<{
  text: string;
  start: number;
  dur?: number;
  seed?: number;
  style?: React.CSSProperties;
  mono?: boolean;
}> = ({text, start, dur = 34, seed = 1, style, mono = true}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const tick = Math.floor(frame / 2);
  const out = [...text]
    .map((c, i) => {
      if (c === ' ' || c === '.' || c === ',' || c === ':' || c === '/') return c;
      const at = i / Math.max(1, text.length);
      if (p >= 1) return c;
      if (p > at + 0.05) return c;
      return GLYPHS[Math.floor(rnd(i + seed, tick) * GLYPHS.length)];
    })
    .join('');
  return (
    <span style={{fontFamily: mono ? MONO : undefined, ...style}}>{out}</span>
  );
};

/**
 * Camera punch: scale 1.09 → 1 + slight rotate + rise + deblur on entry.
 * Wrap scene content (inside its Sequence so frame is scene-local).
 */
export const Punch: React.FC<{children: React.ReactNode; flip?: boolean}> = ({
  children,
  flip,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 18, stiffness: 160}});
  const scale = interpolate(p, [0, 1], [1.09, 1]);
  const rot = interpolate(p, [0, 1], [flip ? 1.1 : -1.1, 0]);
  const ey = interpolate(frame, [0, 16], [90, 0], {
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const eb = interpolate(frame, [0, 16], [9, 0], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${scale}) rotate(${rot}deg) translateY(${ey}px)`,
        transformOrigin: '50% 42%',
        filter: `blur(${eb}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * SceneShell: exit choreography in the last 14 frames —
 * scale up, lift, blur, fade (easeIn, faster than entrance).
 * Must wrap scene content INSIDE its Sequence; pass the scene duration.
 */
export const SceneShell: React.FC<{dur: number; children: React.ReactNode}> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  const lf = dur - frame; // frames remaining
  const p = interpolate(lf, [0, 12], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.6, 0, 0.9, 0.35),
  });
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        opacity: interpolate(p, [0, 1], [1, 0]),
        transform: `scale(${interpolate(p, [0, 1], [1, 1.07])}) translateY(${interpolate(
          p,
          [0, 1],
          [0, -70],
        )}px)`,
        filter: `blur(${interpolate(p, [0, 1], [0, 7])}px)`,
        transformOrigin: '50% 42%',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Whip: boundary transition overlay. Render in a 20-frame Sequence
 * centered so the cut lands at local frame 8. Mint band sweeps
 * top→bottom + white flash exactly on the cut.
 */
export const Whip: React.FC = () => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 19], [-320, 2120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE,
  });
  const bandO = interpolate(frame, [2, 8, 14], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const flash = interpolate(frame, [7, 8, 12], [0, 0.24, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 200,
          background: `linear-gradient(to bottom, transparent, ${C.accent} 50%, transparent)`,
          opacity: bandO * 0.4,
          filter: 'blur(6px)',
        }}
      />
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};

/** Panel chrome: inset hairline border, mono header row. */
export const Panel: React.FC<{
  title: string;
  right?: string;
  rightColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  glow?: boolean;
}> = ({title, right, rightColor = C.textFaint, children, style, glow}) => (
  <div
    style={{
      background: 'rgba(10,10,10,0.72)',
      border: `1px solid ${C.borderStrong}`,
      borderRadius: 22,
      overflow: 'hidden',
      boxShadow: glow ? `0 0 90px ${C.accentFaint}, inset 0 0 0 1px ${C.accentDim}` : 'none',
      ...style,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 30px',
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: '0.22em',
          color: C.textDim,
          fontWeight: 500,
        }}
      >
        {title}
      </span>
      {right && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: '0.14em',
            color: rightColor,
            fontWeight: 700,
          }}
        >
          {right}
        </span>
      )}
    </div>
    <div style={{padding: '28px 30px'}}>{children}</div>
  </div>
);

/** Pulsing status dot. */
export const Dot: React.FC<{color?: string; size?: number}> = ({
  color = C.accent,
  size = 16,
}) => {
  const frame = useCurrentFrame();
  const o = 0.45 + 0.55 * Math.abs(Math.sin(frame / 14));
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
        opacity: o,
        boxShadow: `0 0 18px ${color}`,
      }}
    />
  );
};

/** Mono ticker: cycles through phrases. */
export const Ticker: React.FC<{
  phrases: string[];
  start: number;
  per?: number;
  style?: React.CSSProperties;
}> = ({phrases, start, per = 26, style}) => {
  const frame = useCurrentFrame();
  const idx = Math.min(
    phrases.length - 1,
    Math.max(0, Math.floor((frame - start) / per)),
  );
  return (
    <span style={{fontFamily: MONO, ...style}}>
      {frame >= start ? phrases[idx] : phrases[0]}
    </span>
  );
};

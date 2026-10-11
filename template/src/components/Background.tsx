import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {C, FONT} from '../theme';

/** Shared cinematic background: near-black, blueprint grid, drifting mint glow, vignette. */
export const Background: React.FC = () => {
  const grid = `repeating-linear-gradient(0deg, ${C.accentFaint} 0 1px, transparent 1px 72px),
    repeating-linear-gradient(90deg, ${C.accentFaint} 0 1px, transparent 1px 72px)`;
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: grid,
          opacity: 0.5,
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 42%, black 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 50% 42%, black 30%, transparent 78%)',
        }}
      />
      {/* drifting mint glow */}
      <Glow />
      {/* film grain */}
      <AbsoluteFill
        style={{
          opacity: 0.055,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.75) 100%)',
        }}
      />
      {/* hairline frame */}
      <AbsoluteFill style={{padding: 36}}>
        <div
          style={{
            width: '100%',
            height: '100%',
            border: `1px solid ${C.border}`,
            borderRadius: 18,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Glow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const x = 50 + Math.sin(t * 0.22) * 14;
  const y = 34 + Math.cos(t * 0.17) * 10;
  const o = interpolate(Math.sin(t * 0.5), [-1, 1], [0.10, 0.2]);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle 420px at ${x}% ${y}%, rgba(169,221,211,${o}) 0%, transparent 70%)`,
      }}
    />
  );
};

export const FontFaces: React.FC = () => (
  <style>{`
    @font-face { font-family: 'Inter'; font-weight: 400; font-display: swap;
      src: url(${staticFile('fonts/Inter-400.woff2')}) format('woff2'); }
    @font-face { font-family: 'Inter'; font-weight: 500; font-display: swap;
      src: url(${staticFile('fonts/Inter-500.woff2')}) format('woff2'); }
    @font-face { font-family: 'Inter'; font-weight: 600; font-display: swap;
      src: url(${staticFile('fonts/Inter-600.woff2')}) format('woff2'); }
    @font-face { font-family: 'Inter'; font-weight: 700; font-display: swap;
      src: url(${staticFile('fonts/Inter-700.woff2')}) format('woff2'); }
    @font-face { font-family: 'Inter'; font-weight: 800; font-display: swap;
      src: url(${staticFile('fonts/Inter-800.woff2')}) format('woff2'); }
    @font-face { font-family: 'JetBrains Mono'; font-weight: 400; font-display: swap;
      src: url(${staticFile('fonts/JB-400.woff2')}) format('woff2'); }
    @font-face { font-family: 'JetBrains Mono'; font-weight: 500; font-display: swap;
      src: url(${staticFile('fonts/JB-500.woff2')}) format('woff2'); }
    @font-face { font-family: 'JetBrains Mono'; font-weight: 700; font-display: swap;
      src: url(${staticFile('fonts/JB-700.woff2')}) format('woff2'); }
    * { font-family: ${FONT}; }
  `}</style>
);

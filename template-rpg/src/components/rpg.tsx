import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, PIXEL, PX} from '../theme';

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Pixel image: always crisp. x,y = top-left in px. scale = pixel multiplier. */
export const Px: React.FC<{
  src: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}> = ({src, x, y, scale = PX, opacity = 1}) => (
  <img
    src={staticFile(`sprites/${src}.png`)}
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      imageRendering: 'pixelated',
      opacity,
    }}
  />
);

/** Animated walker: alternates a/b frames while walking. */
export const Walker: React.FC<{
  base: string; // e.g. 'player'
  dir: 'f' | 'b' | 's';
  x: number; // center-x
  y: number; // bottom-y (feet)
  walking?: boolean;
  flip?: boolean;
  scale?: number;
}> = ({base, dir, x, y, walking, flip, scale = PX}) => {
  const frame = useCurrentFrame();
  const f = walking ? (Math.floor(frame / 9) % 2 === 0 ? 'a' : 'b') : 'a';
  const name = `${base}_${dir}_${f}`;
  const bob = walking ? Math.abs(Math.sin(frame / 4.5)) * -6 : 0;
  // native sizes
  const NW = 16 * scale;
  const NH = 20 * scale;
  return (
    <img
      src={staticFile(`sprites/${name}.png`)}
      style={{
        position: 'absolute',
        left: x - NW / 2,
        top: y - NH + bob,
        width: NW,
        height: NH,
        transform: flip ? 'scaleX(-1)' : undefined,
        imageRendering: 'pixelated',
      }}
    />
  );
};

/** Static NPC. */
export const Npc: React.FC<{
  src: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}> = ({src, x, y, w = 16 * PX, h = 20 * PX}) => (
  <img
    src={staticFile(`sprites/${src}.png`)}
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h,
      width: w,
      height: h,
      imageRendering: 'pixelated',
    }}
  />
);

/** Emote bubble: ? or ! above a character. */
export const Emote: React.FC<{
  mark: '?' | '!';
  x: number;
  y: number;
  at: number;
  color?: string;
}> = ({mark, x, y, at, color = C.gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 220}});
  const wob = Math.sin((frame - at) / 6) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 44,
        top: y + wob,
        width: 88,
        height: 88,
        background: C.white,
        border: `4px solid ${C.navy}`,
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: PIXEL,
        fontSize: 44,
        color,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`,
      }}
    >
      {mark}
      <div
        style={{
          position: 'absolute',
          bottom: -14,
          left: 30,
          width: 16,
          height: 16,
          background: C.white,
          borderRight: `4px solid ${C.navy}`,
          borderBottom: `4px solid ${C.navy}`,
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
};

export type Seg = {t: string; hl?: boolean};

/** JRPG dialogue box with typewriter. */
export const DialogueBox: React.FC<{
  name: string;
  face: string;
  segs: Seg[];
  at: number;
  cps?: number; // chars per frame
  hold?: number; // extra hold after complete (for pacing)
}> = ({name, face, segs, at, cps = 1.1}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const full = segs.map((s) => s.t).join('');
  const n = Math.min(full.length, Math.floor((frame - at) * cps));
  const done = n >= full.length;
  let rest = n;
  const shown: Seg[] = [];
  for (const s of segs) {
    if (rest <= 0) break;
    const take = Math.min(rest, s.t.length);
    shown.push({t: s.t.slice(0, take), hl: s.hl});
    rest -= take;
  }
  const blink = Math.floor(frame / 14) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 48,
        right: 48,
        bottom: 48,
        background: C.navy,
        border: `5px solid ${C.border}`,
        borderRadius: 10,
        padding: '28px 30px 28px 170px',
        minHeight: 330,
      }}
    >
      {/* name plate */}
      <div
        style={{
          position: 'absolute',
          left: -5,
          top: -34,
          background: C.blue,
          border: `4px solid ${C.border}`,
          borderRadius: 8,
          padding: '10px 22px',
          fontFamily: PIXEL,
          fontSize: 24,
          color: C.white,
        }}
      >
        {name}
      </div>
      {/* portrait */}
      <img
        src={staticFile(`sprites/face_${face}.png`)}
        style={{
          position: 'absolute',
          left: 26,
          bottom: 26,
          width: 112,
          height: 112,
          imageRendering: 'pixelated',
          border: `4px solid ${C.border}`,
          borderRadius: 8,
          background: C.navyLight,
        }}
      />
      <div style={{fontFamily: PIXEL, fontSize: 27, lineHeight: 1.9, color: C.white}}>
        {shown.map((s, i) => (
          <span key={i} style={{color: s.hl ? '#7dd7ff' : C.white}}>
            {s.t}
          </span>
        ))}
        {!done && (
          <span
            style={{
              display: 'inline-block',
              width: 18,
              height: 30,
              background: '#7dd7ff',
              marginLeft: 6,
              verticalAlign: -4,
            }}
          />
        )}
      </div>
      {done && blink && (
        <div
          style={{
            position: 'absolute',
            right: 30,
            bottom: 20,
            fontFamily: PIXEL,
            fontSize: 30,
            color: C.gold,
          }}
        >
          ▼
        </div>
      )}
    </div>
  );
};

/** Quest log panel (right side). */
export const QuestPanel: React.FC<{
  title: string;
  items: string[];
  at: number;
  per?: number;
}> = ({title, items, at, per = 34}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = spring({frame: frame - at, fps, config: {damping: 16, stiffness: 130}});
  const shown = Math.min(items.length, Math.floor((frame - at) / per) + 1);
  return (
    <div
      style={{
        position: 'absolute',
        right: 48,
        top: 220,
        width: 560,
        background: 'rgba(20,20,43,0.94)',
        border: `5px solid ${C.gold}`,
        borderRadius: 10,
        padding: '26px 28px',
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [120, 0])}px)`,
      }}
    >
      <div style={{fontFamily: PIXEL, fontSize: 22, color: C.gold, marginBottom: 20}}>
        ◆ QUEST BARU
      </div>
      <div style={{fontFamily: PIXEL, fontSize: 26, color: C.white, marginBottom: 22, lineHeight: 1.5}}>
        {title}
      </div>
      {items.slice(0, shown).map((it, i) => {
        const cp = spring({
          frame: frame - at - i * per,
          fps,
          config: {damping: 12, stiffness: 200},
        });
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              marginTop: 14,
              opacity: interpolate(cp, [0, 1], [0, 1]),
              transform: `translateX(${interpolate(cp, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                border: `4px solid ${C.mint}`,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: PIXEL,
                fontSize: 22,
                color: C.mint,
              }}
            >
              ✓
            </div>
            <span style={{fontFamily: PIXEL, fontSize: 21, color: C.white, lineHeight: 1.5}}>
              {it}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** HUD: coins + day counter. */
export const Hud: React.FC<{coins: number; day: string}> = ({coins, day}) => (
  <div style={{position: 'absolute', left: 48, top: 44, display: 'flex', gap: 18}}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'rgba(20,20,43,0.9)',
        border: `4px solid ${C.border}`,
        borderRadius: 10,
        padding: '12px 20px',
      }}
    >
      <img
        src={staticFile('sprites/coin.png')}
        style={{width: 44, height: 44, imageRendering: 'pixelated'}}
      />
      <span style={{fontFamily: PIXEL, fontSize: 24, color: C.gold}}>{coins}</span>
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(20,20,43,0.9)',
        border: `4px solid ${C.border}`,
        borderRadius: 10,
        padding: '12px 20px',
        fontFamily: PIXEL,
        fontSize: 24,
        color: C.white,
      }}
    >
      {day}
    </div>
  </div>
);

/** Full-screen title card. */
export const TitleCard: React.FC<{title: string; sub: string; at: number; dur?: number}> = ({
  title,
  sub,
  at,
  dur = 46,
}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + dur) return null;
  const o =
    interpolate(frame - at, [0, 8], [0, 1], {extrapolateRight: 'clamp'}) *
    (1 - interpolate(frame - at, [dur - 8, dur], [0, 1], {extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill
      style={{
        background: 'rgba(10,10,20,0.72)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: o,
        zIndex: 50,
      }}
    >
      <div style={{fontFamily: PIXEL, fontSize: 54, color: C.white, textAlign: 'center', lineHeight: 1.6}}>
        {title}
      </div>
      <div
        style={{
          fontFamily: PIXEL,
          fontSize: 30,
          color: C.mint,
          marginTop: 26,
          textAlign: 'center',
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
};

/** Tile ground. */
export const Ground: React.FC<{
  map: string[][];
  ox?: number;
  oy?: number;
}> = ({map, ox = 0, oy = 0}) => {
  const T = 16 * PX;
  return (
    <>
      {map.map((row, y) =>
        row.map((t, x) => (
          <img
            key={`${x}-${y}`}
            src={staticFile(`sprites/${t}.png`)}
            style={{
              position: 'absolute',
              left: ox + x * T,
              top: oy + y * T,
              width: T,
              height: T,
              imageRendering: 'pixelated',
            }}
          />
        )),
      )}
    </>
  );
};

export const grassMap = (cols: number, rows: number, seed = 1): string[][] =>
  Array.from({length: rows}, (_, y) =>
    Array.from({length: cols}, (_, x) =>
      rnd(x, y * 7 + seed) > 0.86 ? 'flower' : rnd(x * 3, y + seed) > 0.5 ? 'grass_a' : 'grass_b',
    ),
  );

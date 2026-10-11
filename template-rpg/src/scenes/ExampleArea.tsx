import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, PIXEL} from '../theme';
import {
  DialogueBox,
  Emote,
  Ground,
  Hud,
  Npc,
  Px,
  QuestPanel,
  TitleCard,
  Walker,
  grassMap,
} from '../components/rpg';

const T = 16 * 8;

/**
 * EXAMPLE AREA — village + dialogue + quest panel.
 * Copy this pattern per quest beat: TitleCard → character acting →
 * DialogueBox(es) → QuestPanel/banner payoff.
 */
export const ExampleArea: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // NPC walks in from the right
  const npcX = interpolate(frame, [120, 180], [1250, 760], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const npcMoving = frame >= 120 && frame < 180;

  const bannerAt = 300;
  const bp = spring({frame: frame - bannerAt, fps, config: {damping: 10, stiffness: 160}});

  return (
    <AbsoluteFill style={{background: C.grassDark}}>
      <Ground map={grassMap(9, 16)} oy={-40} />
      {Array.from({length: 9}, (_, x) => (
        <Px key={x} src="path" x={x * T - 40} y={860} />
      ))}
      <Px src="tree" x={60} y={240} />
      <Px src="tree" x={880} y={300} />
      <Px src="fence" x={200} y={700} />
      <Px src="fence" x={328} y={700} />
      <Px src="sign" x={820} y={640} />

      <TitleCard title="Day 1 · New Traveler" sub="— Green Village —" at={6} />

      <Walker base="player" dir="f" x={420} y={1050} />
      <Emote mark="?" x={420} y={660} at={70} />

      <div
        style={{
          transform: `translateY(${npcMoving ? Math.abs(Math.sin(frame / 4.5)) * -8 : 0}px)`,
        }}
      >
        <Npc src="sage" x={npcX} y={1050} />
      </div>
      <Emote mark="!" x={760} y={660} at={192} color="#7dd7ff" />

      <DialogueBox
        name="You"
        face="player"
        at={84}
        segs={[
          {t: 'I need to explain something complex… but slides are boring. '},
          {t: 'How do I make people care?', hl: true},
        ]}
      />
      <DialogueBox
        name="Sage"
        face="sage"
        at={200}
        segs={[
          {t: 'Turn it into a '},
          {t: 'quest', hl: true},
          {t: '. Every explainer beat becomes a game event.'},
        ]}
      />

      <QuestPanel
        title="Make a quest video"
        at={270}
        per={40}
        items={['Write the quest script', 'Draw the sprites', 'Record the dialogue']}
      />

      {frame >= bannerAt && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 700,
            display: 'flex',
            justifyContent: 'center',
            opacity: interpolate(bp, [0, 1], [0, 1]),
            transform: `scale(${interpolate(bp, [0, 1], [0.6, 1])})`,
          }}
        >
          <div
            style={{
              background: C.gold,
              border: `5px solid ${C.navy}`,
              borderRadius: 12,
              padding: '26px 54px',
              fontFamily: PIXEL,
              fontSize: 38,
              color: C.navy,
            }}
          >
            ◆ QUEST ACCEPTED!
          </div>
        </div>
      )}

      <Hud coins={120} day="Wk 1" />
    </AbsoluteFill>
  );
};

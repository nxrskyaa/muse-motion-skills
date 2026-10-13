# Pixel RPG

The explainer as a playable quest. Hand-authored sprites, JRPG dialogue,
typewriter text, quest log, HUD — the viewer is the player.

## Palette

- Background: per-scene pixel landscapes (limited 16-32 color ramp)
- Surface: dialogue boxes (dark with light border), quest panels
- Primary ink: white pixel text
- Secondary ink: dimmed HUD labels
- Main accent: quest-gold / HP-green — objectives, rewards
- Secondary accent: damage-red — threats, failures

## Typography

Press Start 2P (or equivalent pixel font) for everything. Small sizes,
generous line height; typewriter reveal synced to VO.

## Texture

Nearest-neighbor scaling only — never smooth. 1px outlines on sprites,
dithered gradients, scanline overlay optional.

## Motifs

Hero sprite, NPCs, quest markers (!/?), dialogue portraits, item icons,
world-map transitions, battle swipes. Sprites drawn by hand (PIL) at low
resolution, scaled up.

## Motion

Stepped animation (2-4 frames per pose) — smooth tweening breaks the
illusion. Screen shake on hits, flash on level-up, dialogue typewriter at
readable speed. Camera: hard cuts and map pans, no expo easing on sprites.

## Composition

HUD top (HP/objective), dialogue box bottom third, playfield center. Quest
panel slides in from the side for briefs.

## Signature transition

Battle swipe / map pan: diagonal wipe with a 2-frame white flash, or a
world-map zoom between areas.

## Best for

Anything frameable as a mission: onboarding flows, agent tasks, multi-step
processes, "defeat the problem" narratives.

## Never

Smooth vector tweening on pixel art; anti-aliased text; more than ~32
colors on screen; chiptune drowning the VO (bed ~20 dB under, verified).

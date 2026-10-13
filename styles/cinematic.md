# Cinematic

Kinetic typography over bespoke in-world objects. The default workhorse:
dark stage, one hero color, camera that punches on every cut.

## Palette

- Background: near-black, warm or cool per brand
- Surface: panels with inset hairline borders
- Primary ink: off-white text
- Secondary ink: dimmed labels, grid lines
- Main accent: one hero color (brand-derived) — state changes, hero words
- Secondary accent: danger/warning color — used sparingly, semantically

## Typography

Grotesk hero + mono for data and kickers. Display type huge, tracked tight;
mono tracked wide for labels (`001 — THE PROBLEM`).

## Texture

Fine film grain, soft vignette, faint grid. Glow restrained to the hero
color only — never a general neon wash.

## Motifs

Control rooms, radar sweeps, block pipelines, live dashboards, tickers with
sparklines. Every scene builds its object from the story; no floating cards
on a gradient.

## Motion

Expo-out entrances (`bezier(0.16,1,0.3,1)`), staggered words (~4f) and rows
(~90f). Camera punch on every cut (scale 1.09→1, slight rotate, alternate
direction). Scramble text for addresses, hashes, status flips — seeded,
deterministic.

## Composition

9:16 stage, subject centered-left with breathing room, kicker top, safe
zone respected (critical content inside ~75% vertical center).

## Signature transition

Whip: a 20-frame overlay centered so the cut lands mid-sweep — accent band
sweeps vertically, white flash exactly on the cut. Exit choreography on the
outgoing scene (scale up, lift, blur out, faster than the entrance).

## Best for

Product explainers, protocol narratives, launches.

## Never

Two hero colors fighting; glow on everything; static camera; text touching
frame edges.

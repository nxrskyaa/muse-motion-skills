# motion-video

One skill that teaches an AI agent to make 9:16 motion-graphic explainer videos —
narrated, kinetic, never generic. A full production playbook plus a library of
visual styles and animation techniques, zero paid APIs.

## What this is

Give your agent this prompt:

> Read `SKILL.md` in nxrskyaa/motion-video, then make a 9:16 explainer about
> [topic] from [source] in the [style] style.

The agent extracts the story, writes and voices the script, picks a visual
identity from the style library, builds scenes from the template, designs
sound, renders, checks its own frames, and hands you the MP4.

## What's inside

| Path | Contents |
| ---- | -------- |
| `SKILL.md` | The playbook: story extraction, VO-first timing, art direction, scene craft, animation principles, transitions, sound design, render and QC gates |
| `styles/` | The style library — 11 opinionated visual identities, each a one-page recipe (palette, type, texture, motion behavior, signature transition). Never ship two videos with the same look |
| `template/` | Cinematic starter — Remotion + React + TypeScript |
| `template-rpg/` | Pixel-RPG starter — hand-drawn sprites and chiptune included |

## The styles

`cinematic` · `pixel-rpg` · `editorial-paper` · `cut-paper` · `risograph` ·
`bauhaus` · `ukiyoe` · `schematic` · `noir-halftone` · `chalk-lecture` ·
`art-deco`

Full catalog with palettes and rules: [`styles/catalog.md`](styles/catalog.md).

## Try it

```bash
cd template          # or template-rpg
npm install
./scripts/fonts.sh            # downloads the bundled fonts
python3 scripts/sfx.py        # synthesize every SFX (numpy + ffmpeg, no APIs)

# write scripts/script.txt as ID|text lines, then:
./scripts/vo.sh               # needs a `tts` CLI (see below)

npx remotion still src/index.ts Video /tmp/check.png --frame 100
npx remotion render src/index.ts Video out.mp4 --concurrency=2 --codec=h264 --crf 17
```

## Requirements

- Node 18+, ffmpeg, Python 3
- A `tts` command with this interface: `tts speak --voice <id> --output <file> --text <text>` (built against the Hatch `tts` skill — swap in any equivalent)
- Nothing else. No API keys.

## Principles

- **Story before pixels.** Beats and voiceover first, scenes second.
- **One look per video.** Every video gets its own opinionated visual identity, chosen before building. Repeating yesterday's look is the default failure.
- **Motion with intent.** Every move answers: where should the eye go, and why now. Camera is punctuation, not decoration.
- **Sound is half the picture.** Voiceover leads, music follows a grid, SFX glue every cut. Mix by measured loudness, never by guessed volumes.
- **Taste is testable.** Stills review, full-timeline scrub, and a failure-mode checklist before anything ships.

## License

MIT — see [LICENSE](LICENSE).

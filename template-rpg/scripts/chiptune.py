#!/usr/bin/env python3
"""Chiptune SFX + music loop for the RPG quest style. Zero paid APIs.
Usage: python3 chiptune.py && mv *.mp3 ../public/sfx/
Requires: numpy, ffmpeg."""
import numpy as np, subprocess, os

SR = 44100
OUT = os.path.dirname(os.path.abspath(__file__))

def write(x, name):
    x = np.clip(x, -1, 1)
    pcm = (x * 32767).astype(np.int16)
    path = os.path.join(OUT, name)
    p = subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le',
                        '-ar', str(SR), '-ac', '1', '-i', '-',
                        '-codec:a', 'libmp3lame', '-b:a', '128k', path],
                       input=pcm.tobytes())
    print(name, 'ok' if p.returncode == 0 else 'FAIL')

def sq(f, dur, vol=0.5, slide=0):
    n = int(SR * dur); t = np.arange(n) / SR
    fr = f + slide * t
    ph = np.cumsum(2 * np.pi * fr / SR)
    return np.sign(np.sin(ph)) * vol * np.exp(-t * 3)

def seq(notes, dur_each, vol=0.5):
    out = np.array([])
    for f in notes:
        n = int(SR * dur_each); t = np.arange(n) / SR
        ph = 2 * np.pi * f * t
        out = np.concatenate([out, np.sign(np.sin(ph)) * vol * np.exp(-t * 4)])
    return out

write(sq(880, 0.07, 0.35), 'blip.mp3')          # typewriter tick
write(seq([987.77, 1318.5], 0.09, 0.5), 'coin.mp3')
write(seq([523.25, 659.25, 783.99, 1046.5], 0.11, 0.5), 'fanfare.mp3')
write(sq(140, 0.18, 0.7, slide=-60), 'stamp.mp3')

# gentle 8s chiptune loop — soft arpeggio, low volume (mix ~0.15-0.2 in Remotion)
bass = [130.81, 98.0, 87.31, 98.0]
arp = [523.25, 659.25, 783.99, 659.25, 587.33, 783.99, 880.0, 783.99]
n = int(SR * 8); t = np.arange(n) / SR
mel = np.zeros(n)
for i, f in enumerate(arp * 2):
    s0 = int(i * SR * 0.5); s1 = min(n, s0 + int(SR * 0.45))
    tt = np.arange(s1 - s0) / SR
    mel[s0:s1] += np.sign(np.sin(2 * np.pi * f * tt)) * 0.10 * np.exp(-tt * 2)
bs = np.zeros(n)
for i, f in enumerate(bass * 2):
    s0 = int(i * SR * 1.0); s1 = min(n, s0 + int(SR * 0.9))
    tt = np.arange(s1 - s0) / SR
    bs[s0:s1] += np.sign(np.sin(2 * np.pi * f * tt)) * 0.12
music = mel + bs
music = music / np.max(np.abs(music)) * 0.5
f = int(SR * 0.3)
music[:f] *= np.linspace(0, 1, f); music[-f:] *= np.linspace(1, 0, f)
write(music, 'music.mp3')
print('done — move mp3s to public/sfx/')

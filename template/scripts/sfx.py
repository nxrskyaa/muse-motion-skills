#!/usr/bin/env python3
"""Synthesize all SFX + ambient bed with numpy. Zero paid APIs.
Usage: python3 sfx.py && mv *.mp3 ../public/vo/
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

def whoosh(dur=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    noise = np.random.default_rng(7).standard_normal(n)
    # bandpass sweep feel via amplitude envelope + simple lowpass
    env = np.sin(np.pi * t / dur) ** 2
    x = noise * env * 0.6
    # crude sweep: cumulative emphasis
    return x

def thump(f0=58, dur=0.35, vol=0.8):
    n = int(SR * dur); t = np.arange(n) / SR
    return np.sin(2 * np.pi * f0 * t) * np.exp(-t * 14) * vol

def riser(dur=1.0, vol=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    noise = np.random.default_rng(11).standard_normal(n)
    env = (t / dur) ** 2
    # rising pitch sine layered
    f = 200 + 900 * (t / dur)
    ph = np.cumsum(2 * np.pi * f / SR)
    return (noise * 0.25 + np.sin(ph) * 0.35) * env * vol

def impact(dur=0.5, vol=0.8):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 160 * np.exp(-t * 8) + 40
    ph = np.cumsum(2 * np.pi * f / SR)
    return (np.sin(ph) * np.exp(-t * 9) + thump(55, dur, 0.5)) * vol

def bed(dur=8.0, vol=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.zeros(n)
    for f, a in [(55, 0.5), (110, 0.3), (165, 0.18)]:
        x += np.sin(2 * np.pi * f * t) * a
    # pink-ish noise lowpassed (moving average)
    noise = np.random.default_rng(3).standard_normal(n)
    k = np.ones(64) / 64
    x += np.convolve(noise, k, mode='same') * 0.25
    trem = 0.75 + 0.25 * np.sin(2 * np.pi * 0.25 * t)
    x = x * trem
    x = x / np.max(np.abs(x)) * vol
    e = int(SR * 1.5)
    x[:e] *= np.linspace(0, 1, e); x[-e:] *= np.linspace(1, 0, e)
    return x

write(whoosh(), 'whoosh.mp3')
write(thump(), 'thump.mp3')
write(riser(), 'riser.mp3')
write(impact(), 'impact.mp3')
write(bed(), 'bed.mp3')
print('done — move mp3s to public/vo/')

I have everything I need. Here is the full report.

---

# Laporan Riset: `hyperframes-motion-reel-skill`
**Repo:** https://github.com/Sunwood-ai-labs/hyperframes-motion-reel-skill
**File yang dibaca:** `SKILL.md` (25.8 KB, penuh), seluruh `docs/` (EN + JA; JA hanya terjemahan, tidak ada info baru), `README.md` + `README.ja.md` (JA hanya terjemahan — tidak ada info baru).

## 1. Ringkasan Konsep

Skill Claude Code yang memerintahkan agen untuk berperan sebagai **motion designer + creative coder kelas dunia**, mengubah satu baris tema menjadi video motion-graphics **showreel-grade (Behance/OFFF/Awwwards)** yang dibuat murni dari kode: **HyperFrames (HTML + GSAP + SVG + Canvas, Apache-2.0)**. Ini adalah port HyperFrames dari skill `remotion-motion-reel`, dengan satu alasan utama: **Remotion menuntut Company License berbayar untuk perusahaan komersial ≥4 karyawan**, sementara stack ini (HyperFrames Apache-2.0 + GSAP 3 gratis komersial + HTML/CSS/SVG/Canvas + Node.js bawaan) bebas lisensi berbayar dalam skala apa pun.

## 2. Workflow Kreatif + Teknis (Konsep → MP4)

Urutan kerja yang diajarkan SKILL.md (10 langkah):

1. **Analisis tema/material** — jika ada path gambar/suara/kode yang diberikan, benar-benar diperiksa dulu sebelum merancang.
2. **Konsep** — dituangkan dalam 1 kalimat.
3. **Design system** — ditulis ke `DESIGN.md` (dianggap "brand truth" oleh skill-skill HyperFrames lain). Wajib minimal: Main color, Accent color, Background color, Typography, Grid, Shape language, Motion language. Warna jadi CSS custom properties (`:root { --bg; --fg; --accent; }`) dan konstanta JS `CFG.colors` (bukan `getComputedStyle`).
4. **Timeline beat** — ditulis dalam detik + beat + nomor frame, misal `b(8) = 4.0s = f240`.
5. **Motion design** — tiap scene menyebut nama blueprint/rule HyperFrames yang dipakai (dari domain skill `/hyperframes-animation`, `/hyperframes-keyframes`).
6. **Sound design** — suara disintesis via `scripts/generate-audio.mjs`.
7. **Implementasi** — scaffold lalu tulis HTML/JS.
8. **Verifikasi** — `lint` → `check` sampai **0 findings** (lint/runtime/layout/motion/contrast).
9. **Snapshot** — `snapshot --at <detik puncak tiap scene>`, lalu diperiksa sebagai gambar nyata (cek teks terpotong, frame kosong, kontras, beat-slip).
10. **Render + spot-check** — render MP4, lalu `ffprobe` untuk durasi/fps/track audio, dan `ffmpeg -ss <t> -frames:v 1` untuk mencabut frame puncak dari MP4 produksi dan membandingkannya dengan snapshot (SKILL.md memperingatkan: **snapshot dan render kadang hasilnya berbeda**).

Perintah konkret:

```bash
# 1. Scaffold proyek
npx hyperframes init "<project-dir>" --non-interactive --example=blank --skill=general-video

# 2. (Rekomendasi) sinkronkan CFG -> atribut data-* root
# scripts/sync-config.mjs

# 3. Verifikasi
npx hyperframes lint
npx hyperframes check            # target: 0 findings

# 4. Snapshot puncak tiap scene
npx hyperframes snapshot --at <detik-puncak>

# 5. Render
npx hyperframes render --fps 60 --quality draft    --output out/draft.mp4   # iterasi
npx hyperframes render --fps 60 --quality delivery --output out/reel.mp4   # final

# 6. Spot-check
ffprobe -v error -show_format -show_streams out/reel.mp4
ffmpeg -ss <t> -frames:v 1 out/reel.mp4 peak.png
npx hyperframes beats   # inspeksi beat grid di Studio
```

Layout proyek yang dihasilkan:

```
<project-dir>/
├─ hyperframes.json
├─ DESIGN.md
├─ index.html              # root, data-composition-id="main", data-width/height/duration
├─ compositions/           # HANYA scene hard-cut: intro.html, build.html, climax.html, outro.html
│                          #   (dibungkus <template>; <style>/<script> DI DALAM template;
│                          #    ID berprefiks ID komposisi; host slot/template/key window.__timelines sama)
├─ src/
│  ├─ config.js            # CFG (FPS, BPM, DURATION_SEC, W, H, colors, beat table)
│  ├─ lib.js               # b(), clamp, lerp, mapRange, spring, seeded random
│  └─ particles.js          # render(t) murni untuk Canvas
├─ scripts/
│  ├─ generate-audio.mjs   # Node.js bawaan saja -> assets/audio/score.wav
│  └─ sync-config.mjs      # sinkron CFG -> atribut data-* root
└─ assets/
   ├─ audio/score.wav
   └─ fonts/               # woff2 + @font-face jika font di luar bundel
```

## 3. Arsitektur Animasi: Dua Lapisan

SKILL.md menolak keyframe manual ala-After-Effects; sebagai gantinya **state video = fungsi dari waktu**, diimplementasikan 2 lapis:

**Lapis 1 — Timeline GSAP (lapis koreografi).** Untuk typo, UI, kamera — "sesuatu terjadi di momen tertentu". Wajib: **tepat 1 timeline**, `paused: true`, didaftarkan **setelah selesai dibangun**; `tl.play()` dilarang; `repeat: -1` dilarang (harus finite).

```js
const tl = gsap.timeline({ paused: true });
tl.fromTo("#title", { yPercent: 110 }, { yPercent: 0, duration: b(0.5), ease: "expo.out" }, b(4));
// … semua tween didaftarkan, baru terakhir:
window.__timelines["main"] = tl;   // key = data-composition-id root
```

**Lapis 2 — Fungsi murni t → state (lapis generatif).** Untuk partikel, grid, grafik, noise — yang berubah kontinu. Satu proxy tween `ease: "none"` sepanjang timeline memanggil `render(t)` via `onUpdate`. `render(t)` **hanya** dari `t` (tanpa state frame sebelumnya = aman di-seek).

```js
const clock = { t: 0 };
tl.to(clock, { t: CFG.DURATION_SEC, duration: CFG.DURATION_SEC, ease: "none",
  onUpdate: () => render(clock.t) }, 0);
```

**Helper beat grid** — dilarang menulis detik mentah; semua batas scene/impak/cut ditulis `b(n)`:

```js
const b = n => n * SEC_PER_BEAT;   // SEC_PER_BEAT = 60/BPM = 0.5 dtk @120BPM
```

**Aturan keras HyperFrames** (pelanggaran = lint error atau bug senyap):
- `.clip` (elemen ber-`data-start`) **jangan** di-tween `autoAlpha`/`visibility`/`display`; gerakkan anak di dalamnya.
- Jangan campur CSS `transform` awal + GSAP tween pada properti yang sama; pakai `fromTo` dengan nilai awal. Centering via flex/`inset`, **bukan** `translate(-50%,-50%)`.
- **Jebakan kritis:** properti yang hanya ditulis di sisi `from` (misal `{opacity: 1, scale: 0}` → `{scale: 1}`) **tidak diterapkan saat parallel worker seek di tengah** — elemen hilang di render produksi meski snapshot terlihat benar. Solusi: tulis properti yang sama di kedua sisi (`{opacity: 1, scale: 0}` → `{opacity: 1, scale: 1}`).
- `fromTo` lanjutan pakai `immediateRender: false`; state awal via `gsap.set` sebelum membangun timeline.
- External `<script src>` bisa di-hoist compiler sebelum DOM; definisikan build sebagai fungsi, panggil saat `DOMContentLoaded` dari inline script, lalu registrasi `window.__timelines` (lint hanya mendeteksi registrasi inline).
- **CSS wajib inline `<style>` di `index.html`** — `font-family` di external stylesheet tidak ikut font-embedding compiler (render log harus menunjukkan `Injected deterministic @font-face`).
- Teks yang disembunyikan di balik mask tetap dihitung audit overlap `check`; saat tidak tampil, sembunyikan dengan `autoAlpha: 0` pada wrapper non-clip.
- Teks heading yang sengaja bleed keluar layar diberi `data-layout-bleed="true"`.

**Util di `lib.js`:** `clamp`, `lerp`, `mapRange(t, a, b, c, d, ease)` (setara Remotion `interpolate()`), solusi analitik `spring(t, {stiffness, damping})`, seeded PRNG.

## 4. Standar "Showreel-grade / Bukan AI-Slop"

**Dilarang keras:**
- Rangkaian `fadeIn`/`fadeOut` sederhana berturut-turut ("**plain fade-in chains are banned**")
- Animasi PowerPoint murahan, teks yang hanya mengalir kiri→kanan, gradien tanpa makna, template iklan SaaS, kartu UI over-rounded, semua scene berkecepatan sama
- Huruf terlalu kecil (headline 60px+ / body 20px+ di fullscreen; 90px+ untuk feed SNS)
- Komposisi "hanya menaruh elemen di tengah", info berjejal karena takut whitespace, efek yang tak relevan dengan tema

**Diperlukan (setiap gerakan punya niat):**
- overshoot (`back.out(2)`), anticipation (tarik kecil ke arah berlawanan lalu `expo.out`), follow-through (`elastic.out`, anak di-delay beberapa frame), stagger (`each`, `from: "center"|"edges"|"random"` — random via array seeded, bukan `gsap.utils`), spring (`elastic.out(1, 0.4)` atau osilasi teredam analitik via proxy), easing `expo`/`power4`/cubic setara CustomEase (`linear` hanya untuk gerak mekanis)
- scale transition, masking/clipping (tween `clipPath` `inset()`/`polygon()`), parallax, camera movement (wrapper kamera: `x/y/scale/rotationX/rotationY` + `transformPerspective`), rhythmic cuts
- Kontras gerak: "cepat → berhenti → meledak", "padat → lepas", "2D → 3D"

**Transisi antar scene:** bukan cross-fade — **elemen scene sebelumnya dimorfosiskan menjadi scene berikutnya** (teks → garis → grafik → grid 3D → tunnel → logo). Scene yang berbagi elemen hidup digabung sebagai **phase div internal dalam 1 komposisi**; hanya hard-cut yang dijadikan sub-komposisi.

**Tipografi diperlakukan sebagai material visual:** raksasa, bleed keluar layar, dipecah, di-mask, diberi depth, letter-spacing berubah, invert/rotasi/perspektif/scan/stretch/crop. Kata-kata **pendek dan kuat** > banyak kalimat kecil sekilas.

**Motion blur:** hanya untuk gerak cepat 1–3 beat (slam/whip/scale-punch) — komponen registry `motion-blur` (`data-hf-motion-blur`) untuk level elemen, opsi render `motionBlur` untuk full-frame (termasuk Canvas, khusus render final). Jangan blur teks yang dibaca / gerak lambat / fade.

**Metode render per material:** Typo/UI = GSAP CSS transform (`x/y/xPercent/scale/rotation/skewX/clipPath/filter/letterSpacing`); garis/grafik = SVG (`strokeDasharray`/`strokeDashoffset` via `getTotalLength()`); 3D = CSS 3D (`perspective`, `z`, `preserve-3d`); partikel = satu `<canvas>` 2D digambar dari `render(t)` (ratusan–ribuan partikel tanpa membanjiri DOM).

## 5. Spesifik Format Reel & Parameter Default

| Parameter | Default | Catatan |
|---|---|---|
| `DURATION_SEC` | 15 | Boleh mengikuti panjang voice + reverb, dibulatkan ke beat |
| `FPS` | 60 | via `render --fps 60` (default CLI 30) |
| `BPM` | 120 | 1 beat = 0.5 dtk = 30 frame |
| Ukuran | 1920×1080 (16:9) | **9:16 → 1080×1920**, square 1080×1080 |
| Output | MP4 / H.264 | preset `draft` dan `delivery` |

- `TOTAL_FRAMES = DURATION_SEC × FPS` (900 untuk default); `SEC_PER_BEAT = 60/BPM`.
- Konstanta dikumpulkan di objek `CFG` (di `index.html` atau `src/config.js`); atribut root `data-width`/`data-height`/`data-duration` adalah **atribut HTML statis yang dibaca saat compile** — tidak bisa diubah dari script, jadi `scripts/sync-config.mjs` direkomendasikan untuk sinkronisasi.
- Semua cut/impak/ganti kamera diselaraskan ke beat, setengah beat, atau seperempat beat (0.5/0.25/0.125 dtk di 120 BPM).

**Audio:** `scripts/generate-audio.mjs` menulis PCM/WAV **hanya dengan Node.js built-in** (tanpa npm audio tambahan) → `assets/audio/score.wav`. Layer: kick (sine dengan pitch drop cepat), hi-hat (noise high-frequency), impact (sine sub + noise + decay pendek), rise, noise, sub bass, UI beep. Timing audio dihitung dari **tabel beat yang sama** dengan visual (`b(n)`), mis. via `timeline.json` yang dibaca kedua sisi. Dipasang di komposisi:

```html
<audio id="score" src="assets/audio/score.wav" data-start="0" data-duration="15" data-track-index="10" data-volume="1"></audio>
```

Aturan: `<audio>` **wajib punya `id`** (tanpa id = tidak di-mix = bisu); tanpa `crossorigin`; jangan panggil `play()`/seek dari kode; fade/ducking via lane volume `data-automation`. Jika ada voice-over user, voice jadi bintang utama — BGM/SFX di-mix agar tidak mengganggu (fitur "carve" dari `/hyperframes-audio`), dan momen bicara diselaraskan ke keypoint visual.

## 6. Aturan Determinisme

- Dilarang: `Date.now()`, `performance.now()`, fetch jaringan saat runtime, state input (hover).
- Random hanya via **seeded PRNG** (`mulberry32`); helper deterministik per indeks:
  ```js
  const rand = (i, salt = 0) => mulberry32(i * 9973 + salt)();
  ```
- Seed partikel dibuat **sekali** saat init ke array; `render(t)` menghitung posisi dari array + `t` (tidak menarik random tiap frame).
- Pola `fromTo`: properti sisi `from` harus diulang di sisi `to` (anti-drop di parallel worker).
- Loop verifikasi: `lint` → `check` (0 findings: lint/runtime/layout/motion/contrast) → `snapshot` per puncak scene (diperiksa visual) → `render` → `ffprobe` + cabut frame via `ffmpeg`.

**Domain skill yang wajib dibaca** (bukan dari ingatan) saat build: `/hyperframes-core` (sebelum HTML), `/hyperframes-animation` (sebelum motion), `/hyperframes-keyframes` (kamera/3D/mask/morf SVG), `/hyperframes-creative` → `typography.md` (font), registry via `npx hyperframes catalog --query "<look>" --json` (look bernama), `/hyperframes-cli` (check/snapshot/render), `/hyperframes-audio` (voice mix).

## 7. API Key / "vikey" / Kunci Berbayar

**Tidak ada.** Repo ini sama sekali tidak menyebut "vikey", API key, atau persyaratan kredensial apa pun (grep seluruh repo: nol hasil). Yang disebut hanyalah **lisensi** — kutipan persis dari SKILL.md:

> "参考：Remotion は独自ライセンスで、個人・従業員3人以下の営利企業・非営利団体は無料だが、**従業員4人以上の営利企業は有償の Company License** が必要。"
> "このスキルの成果物は HyperFrames + GSAP（無料・商用可）+ 素の HTML/CSS/SVG/Canvas + Node.js 標準機能のみで構成し、ライセンス上の追加コストが発生しない構成を保つ。有償ライセンスが必要なライブラリを持ち込まない。"

Dan dari `docs/guide/licensing.md`: "The skill does not introduce libraries that require a paid license." Skill repo sendiri berlisensi MIT. Jadi: satu-satunya "persyaratan" adalah menghindari stack berlisensi berbayar (Remotion Company License), dan tool hanya butuh Node.js, Chrome, ffmpeg/ffprobe — tanpa kunci API.

## 8. Catatan Tambahan untuk Playbook Konsolidasi

- **Pola paling reusable:** arsitektur dua lapis (paused timeline + `render(t)` murni + proxy clock tween), helper `b(n)` sebagai satu-satunya sumber waktu, dan aturan determinisme (seeded PRNG + pengulangan properti from→to).
- **Pola anti-slop paling khas:** larangan fade-in berantai, transisi morfosis antar scene (bukan cross-fade), phase-div internal vs sub-komposisi hard-cut, motion-blur hanya untuk gerak cepat.
- Skill ini sendiri menyatakan tidak melakukan intent interview (`workflow: general-video`, `flow: automation`) — ia mendefinisikan brief sendiri dan boleh meninggalkan `BRIEF.md` untuk resume.
- Tidak ada file diubah; semua pembacaan read-only via lokal.
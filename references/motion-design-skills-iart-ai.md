I've read all 9 skills plus references. One note: the repo's README lists kinetic-typography as a *separate* repo, so type-specific rules here come only from what these skills mention. Here's the full report.

---

# Laporan Riset: Motion Design Skills (github.com/iart-ai/motion-design-skills)

Repo: 9 skill di `skills/` — animation-principles, color-motion, shot-composition, motion-art-direction, after-effects, beat-sync-editing, remotion-video, logo-animation, motion-background. Semua skill punya pola yang sama: `SKILL.md` (framework + angka) + `references/*.md` (cookbook kode) + kontrak "deliver & verify" (file `.html` standalone, freeze-harness `?t=N` untuk screenshot deterministik, loop render → freeze → screenshot → cek → iterasi, wajib hormati `prefers-reduced-motion`). Dibuat oleh iart.ai (AI motion agent; setiap file diakhiri footer promosi iart.ai).

---

## 1. PRINSIP DESAIN HIGH-QUALITY (NON AI-SLOP)

### A. Timing & Easing — angka konkret (animation-principles)

**Easing adalah tuas terbesar.** `linear` hanya untuk loop kontinu (spinner, marquee); semua event diskrit butuh akselerasi. Mata memaafkan start lambat jauh lebih sedikit daripada end lambat — kalau ragu, deselerasi saat berhenti.

| Aksi | Kurva | Catatan |
|---|---|---|
| Enter/appear | `cubic-bezier(0.16, 1, 0.3, 1)` easeOutExpo | start cepat, settle lembut |
| Exit/disappear | `cubic-bezier(0.7, 0, 0.84, 0)` easeInExpo | akselerasi menjauh |
| Move/reposition | `cubic-bezier(0.65, 0, 0.35, 1)` easeInOutCubic | simetris |
| Playful/branded | `cubic-bezier(0.34, 1.56, 0.64, 1)` easeOutBack | nilai y > 1 = overshoot ("weight") |
| Antisipasi (dip dulu) | `cubic-bezier(0.36, 0, 0.66, -0.56)` easeInBack | nilai y < 0 = counter-move |

Pustaka lengkap di `easing-curves.md`: keluarga ease-out (Quad `0.5,1,0.89,1` → Expo `0.16,1,0.3,1`), ease-in, ease-in-out, overshoot/back, plus kurva standar Material (`0.2,0,0,1`) dan rasa iOS (`0.25,0.1,0.25,1` mendekati spring `stiffness 280, damping 28`).

**Tabel durasi per elemen:**

| Elemen | Durasi | Easing |
|---|---|---|
| Micro-interaction (hover/tap) | 100–150 ms | easeOutQuad |
| Toggle/switch | 150–200 ms | easeOutCubic |
| Tooltip/dropdown | 150–250 ms | easeOutCubic |
| Modal enter / exit | 300–400 ms / 200–250 ms | easeOutExpo / easeInQuart |
| Page transition | 300–500 ms | easeInOutCubic |
| Card/list reveal | 400–500 ms per item | easeOutExpo |
| Hero headline/full-screen | 500–800 ms | easeOutExpo |
| Cinematic camera | 800–2000 ms | easeInOutQuad |
| Count-up angka | 600–1200 ms | easeOutExpo |

**Skala durasi dengan jarak:** `duration_ms ≈ base_ms × (distance_px / base_distance_px)^0.5`. Contoh: 300 ms pada 200 px → gerakan 800 px ≈ 300 × √4 = 600 ms. Ikon kecil dan panel full-bleed jangan berbagi durasi yang sama.

**Stagger/rhythm:** list 40–80 ms antar item; grid padat 20–40 ms; **cap total reveal ~600–800 ms** — jika `count × offset` melebihi itu, kecilkan offset atau pakai distance-based stagger. Arah stagger mengikuti arah baca mata (atas→bawah, atau radiasi dari titik fokus).

**Aturan 1/3 (dua bentuk, universal):**
- *Distance*: tidak ada elemen yang bergerak > ~1/3 layar tanpa keyframe intermediate atau perubahan scale/opacity. Slide panjang tak terputus terbaca sebagai "template yang bergerak".
- *Simultaneity*: dari 3+ elemen, maksimal ~1/3 dalam gerak aktif bersamaan. Semua bergerak bersama = noise tanpa titik fokus.

**Antisipasi & follow-through:** counter-move kecil 60–120 ms sebelum aksi utama (tombol dip `scale 0.95` sebelum pop). Elemen trailing settle 40–80 ms *setelah* elemen utama (kartu landing di 400 ms; shadow 450 ms; judul 460 ms; subtitle 500 ms). Gerakan alami mengikuti **arc**, bukan garis lurus.

**Spring vs duration-based:** spring (mass/stiffness/damping) untuk gerak interaktif yang bisa diinterupsi (drag-release); duration+easing untuk koreografi timeline-locked (video, scroll reveals). Spring default snappy: `stiffness 300, damping 30, mass 1`. Resep react-spring: `wobbly` = tension 180/friction 12; `molasses` = 280/120.

**Graph Editor AE:** F9 (Easy Ease) hanya titik awal simetris 33% — buat asimetris. Untuk feel snappy: outgoing influence ~10–25%, **incoming influence 80–90%** (long settle) pada keyframe akhir. Bentuk speed graph: naik tajam, ekor panjang ke 0.

**12 prinsip Disney versi aksi (prioritas praktis):** untuk 90% kualitas cukup kuasai slow-in/slow-out, timing, follow-through, anticipation, staging, arcs. Squash-and-stretch (pertahankan volume: product scale ≈ 1; misal `scaleY 1.2/scaleX 0.85`) dan exaggeration hanya di mana brand memanggil.

### B. Kinetic Type / Typography

Catatan: repo ini **tidak** memuat skill kinetic-typography khusus — itu repo terpisah (`iart-ai/kinetic-typography-skills`). Yang diajarkan di sini:

- **Wordmark reveal:** per-letter mask/translate stagger — `yPercent: 120 → 0`, stagger 0.04, `ease: "power3.out"`, durasi 0.4 per huruf; hierarki: symbol dulu, wordmark terakhir agar mata mendarat di nama.
- **Jangan loop-animate teks yang masih dibaca** (motion-art-direction: restraint).
- **Angka/data:** ease ke nilai akhir (count-up 0.8–1.2 s, deselerasi agar digit akhir settle perlahan dan terasa "tepat"), **hold nilai final ≥ 0.5 s sebelum exit**, tanpa overshoot pada kuantitas (overshoot = tidak presisi). Caption fade-in *setelah* count-up selesai, bukan bersamaan.
- **Safe area:** semua teks kritis di dalam title-safe margin (lihat komposisi).
- **Font loading di video:** font harus dimuat via `staticFile()` + `delayRender`/`continueRender` (atau `@remotion/google-fonts`) agar tidak "pop-in" di tengah render.
- Baseline/type scale: ukuran teks pada kelipatan 8 (16/20/24/32/48/64/96).

### C. Color (color-motion)

**Palet yang restrained:** 1 primary + 1 aksen + 2–3 netral. Kontras/depth dari lightness & chroma, bukan tambah hue. Hue ekstra = berebut perhatian = amatir. Di scene gelap, aksen pop pakai **lightness tinggi + chroma rendah-sedang** (bukan saturasi maksimum — saturasi penuh "vibrates" dan terlihat murahan di background gelap).

**Berpikir dalam OKLCH:** `oklch(L C H)` — tahan L & C konstan lalu putar H untuk hue dengan bobot visual yang benar-benar setara (mustahil andal di HSL). Netral diberi tint chroma kecil (0.005–0.02) ke arah hue primary agar frame menyatu; abu-abu murni di samping elemen berwarna terlihat "tidak menyambung".

Contoh starter: `primary oklch(0.62 0.19 264)`, `accent oklch(0.78 0.17 50)`, `bg oklch(0.16 0.02 264)`, `fg oklch(0.97 0.005 264)`. Ramp tonal 5–9 step: tahan hue, variasikan L, kecilkan chroma di ujung (warna sangat terang/gelap tak bisa menahan chroma tinggi).

**Interpolasi di OKLCH/Lab — jangan pernah sRGB mentah.** Interpolasi linear di sRGB melewati midpoint desaturasi/abu-abu berlumpur (biru→kuning lewat abu-abu; biru→merah lewat ungu lumpur). CSS: `linear-gradient(in oklch, #2b6cff, #ffb02e)`; kontrol arah hue: `in oklch shorter hue` / `longer hue`. Untuk transisi warna yang dianimasikan, daftarkan custom property via `@property` (tanpa registrasi, warna *snap* bukan interpolasi; browser menginterpolasi `<color>` terdaftar di OKLab secara default).

**Gradient premium:** mesh = tumpuk beberapa `radial-gradient` di posisi berbeda di atas base color; **tambahkan grain** (~3–5% opacity via `feTurbulence` atau PNG) untuk membunuh banding; **animasikan lambat**: drift posisi 8–20 s dengan `ease-in-out alternate`. Gradient yang bergerak cepat = screensaver.

**Grading order (urutan wajib, reorder mengubah hasil):**
1. Exposure/white balance → 2. Contrast (black/white points) → 3. Midtones/saturation → 4. **Split-tone** (teal shadows ~hue 190 + orange highlights ~hue 40, halus; kekuatan < ~0.15, lebih dari itu = filter Instagram murahan) → 5. Unify (tint/LUT final + vignette lembut). Grade seluruh piece konsisten agar shot menyambung.

**Color management render (masalah klasik AE):** render terlihat benar di comp viewer tapi washed-out/terang/milky di QuickTime/browser = mismatch gamma/transfer, bukan artwork.
- Working Space eksplisit: **Rec.709 Gamma 2.4** untuk video SDR (sRGB untuk UI/stills); depth 16 bpc untuk grade/gradient (hindari banding).
- Rec.709 vs sRGB: primari sama, transfer beda (sRGB ~2.2 piecewise vs Rec.709 display 2.4/BT.1886) — salah pilih menggeser kecerahan midtone.
- **Embed color tag saat export** (Render Queue > Output Module > Color Management); file untagged membuat tiap player menebak sendiri.
- **Bug gamma QuickTime:** QuickTime/AVFoundation menerapkan ~1.96 gamma ekstra. **Jangan pernah grade/approve ke QuickTime** — Chrome/Premiere/Resolve adalah referensi benar untuk web.
- Uji numerik: render patch abu 50% (RGB 128), re-sample — nilai yang naik (128→150+) = gamma shift washed-out. Verifikasi tag dengan `ffprobe` (`color_primaries`/`color_transfer`/`color_space` = bt709).
- Export: ProRes 422 HQ/4444 tag Rec.709 untuk master; H.264 MP4 tag Rec.709 untuk web/sosial (verifikasi di Chrome); ProRes 4444+alpha → PNG sRGB untuk transparansi.

### D. Shot Composition (shot-composition)

**Grid:** default 12 kolom untuk landscape (terbagi jadi halves/thirds/quarters/sixths), margin luar 80–120 px pada 1920, gutter 24–32 px. Rumus: `content = W − 2×margin; column = (content − 11×gutter)/12`. Contoh 1920: content 1720, kolom 121.3 px. **Baseline 8 px**: semua ukuran & spacing kelipatan 8 (8/16/24/32/48/64; teks 16/20/24/32/48/64/96).

**Focal point:** rule of thirds — subjek pada power point (persimpangan 33%/67%), bukan dead-center (kecuali simetri disengaja untuk formalitas). Hierarki visual: **size > contrast > color > position**. Tepat satu focal point per frame; sekunder mendukung, tidak bersaing.

**Negative space = elemen aktif.** Frame jangan diisi penuh; whitespace memberi ruang gerak untuk bernapas dan terbaca premium.

**Depth layering & parallax** (tiga motion layer diproyeksikan ke Z):

| Layer | Peran gerak | Kecepatan parallax | Kontras/fokus |
|---|---|---|---|
| Background | Ambient | 0.1–0.3x | rendah, sering desaturate/blur |
| Midground | Secondary | 0.5–0.7x | sedang |
| Foreground | Primary | 1.0–1.5x | tajam di subjek; blur saat melintas |

Jangan beri dua layer gerak primer yang bersaing.

**Bahasa kamera (satu shot, satu intent — jangan push+pan+rotate bersamaan):**
- Push-in: scale 1.0→1.12 selama 1600 ms ease-in-out, origin di subjek; opsional blur bg 0→3 px.
- Pull-out: 1.15→1.0 selama 1800 ms.
- Whip-pan: translateX 0→−120% dalam 280 ms ease-in + motion blur; scene masuk 120%→0 selama 280 ms ease-out, overlapped.
- Pan: translateX 0→−300 px selama 1500 ms; subjek di-frame ~1/3 dari trailing edge agar "memimpin" ke ruang terbuka.
- Orbit 3D, dolly-zoom (vertigo) dengan rumus FOV kompensasi — ada di reference.
- Gerakan kamera sinematik: 800–2000 ms, ease-in-out, tidak pernah linear.

**Arah enter/exit bermakna:** ikuti arah baca (LTR: kiri→kanan, atas→bawah) = natural; kebalikannya = tensi/"back/undo". Konten baru masuk dari kanan/bawah; keluar via edge terdekat; ease-out masuk, ease-in keluar; drilling deeper = scale up/push in.

**Safe areas (konten kritis: teks, logo, wajah, CTA):**

| Aspek | Top | Bottom | Sisi | Catatan |
|---|---|---|---|---|
| 16:9 | ~5% | ~5% | ~5% | broadcast 10% |
| **9:16** | **~12–14% (250 px di 1080×1920)** | **~18–20% (365 px)** | **~6% (65 px)** | UI platform makan atas & bawah; TikTok right-rail ~12% kanan bawah |
| 1:1 | ~6–8% | ~6–8% | ~6–8% | |
| 4:5 | ~8% | ~8% | ~6% | |

Strategi multi-aspek: master di 16:9 dengan focal di center band; **untuk 9:16 RESTACK vertikal, jangan crop**; perbesar teks ~15–25%; tarik focal ke upper-middle agar clear dari zona bawah.

### E. Motion Art-Direction (motion-art-direction)

**Satu aturan:** definisikan *motion language* dulu, lalu animasikan mengikutinya. Bahasa gerak = satu pilihan per baris: easing family, base timing unit, transition family, stagger rhythm, motion intensity. Konsistensi = percaya diri; variasi = noise. **Maksimal 2 easing** dalam satu piece (satu untuk enter, satu untuk exit); kurva ketiga harus bisa membenarkan eksistensinya.

**Tone & energy matrix** (pilih satu sel, komit; mencampur sel = penyebab #1 motion "inkonsisten"):

| | Soft | Sharp |
|---|---|---|
| **Calm** | Luxury/wellness: slow, long eases, hold generous | Premium tech/fintech: deliberate, clean |
| **Kinetic** | Playful: bouncy/overshoot, springy | Sports/hype: fast cuts, hard snaps |

**Motion personality (preset bernama + angka):**

| Personality | Durasi | Easing signature | Overshoot |
|---|---|---|---|
| Playful | 150–300 ms | ease-out-back `0.34,1.56,0.64,1` | 10–20% |
| Premium | 350–600 ms | `0.4,0,0.2,1` | 0% |
| Corporate | 200–400 ms | `0.2,0,0,1` | 0–3% |
| Energetic | 100–250 ms | ease-out-expo | 15–30% |

Contoh spec terisi (calm-sharp/premium tech): easing `0.22,1,0.36,1`, base unit 0.4 s (enters 0.4, big moves 0.8, micro 0.2), transisi match-cut + crossfade saja, stagger 60 ms cascade top-to-bottom, intensity travel ≤ 24 px / scale 0.96→1.0 / overshoot ≤ 2%, **hold discipline ≥ 0.3 s stillness setelah tiap beat**.

**Motion hierarchy (tiga tier):** Hero = satu hal yang jadi soal shot itu (gerak paling berani, paling lambat, landing di beat); Support = konteks yang membantu hero (lebih kecil, lebih cepat, menyingkir, tidak bersaing); Texture = background/grain/drift (subliminal — loop lambat, kontras rendah, tanpa hard cut). Kalau dua elemen bersaing dalam satu frame, direction-nya gagal — demote salah satu.

**Restraint (the senior move):**
- Jangan animasikan seluruh frame sekaligus — stagger atau tahan anchor agar mata punya "rumah".
- Jangan transisikan transisi (no animated wipe + spin + fade sekaligus).
- Jangan loop-animate teks yang masih dibaca.
- **Jangan beri overshoot pada konten serius/finansial** — terbaca seperti mainan.
- **Satu momen "wow" per piece.** Yang kedua membatalkan yang pertama.
- Pacing: arc low-energy open → build → peak → settled end card; kesunyian/stillness adalah alat pacing, bukan gap yang harus diisi.

**Consistency check sebelum sign-off:** easing family sama di semua move sebanding, semua durasi kelipatan base unit, hanya transition family terpilih, stagger identik, hold discipline dipatuhi, tepat satu hero per frame, angka hold ≥ 0.5 s.

### F. Beat-Sync Editing (beat-sync-editing)

**Grid BPM→frame:** `frames_per_beat = (60/BPM) × fps`. 120 BPM @30fps = 15 frame/beat (500 ms). **Cut di PHRASE (tiap 2/4/8 beat), bukan tiap beat** — cut tiap beat = frantic. Visual terbesar di musical drop. Eighth-grid untuk aksen: ½ beat = 250 ms = 7.5 frame; 1/16 = 125 ms = 3.75 frame. **Tangkap beat-1 offset track**; bulatkan frame *kumulatif*, bukan per-step (hindari drift).

**Pemetaan personality → ritme cut:** Playful = cut tiap 4 beat + aksen syncopated, match cuts/whips; Premium = 8–16 beat, long holds, hard cut + sesekali dissolve; Corporate = 8 beat steady, hard cut; Energetic = 1–2 beat di climax, hard cut/whips, ramp agresif.

**Transisi dengan intent (default: hard cut — ~90% cuts):**
| Jenis | Kapan |
|---|---|
| Hard cut | default |
| Match cut | dua shot berima visual (shared shape/position/motion vector) — transisi terkuat di motion design |
| J-cut | audio shot berikut mulai 4–12 frame lebih awal (sound leads) |
| L-cut | audio shot kini berlanjut 12–24 frame di bawah gambar berikut (sound trails) |
| Whip/motion-blur | blend ~6–10 frame, arah blur cocok |
| Dissolve/wipe | hanya untuk time-passing/mood lembut; overuse = amatir |

**Cut on action:** cut di tengah gerakan (bukan saat diam); samakan arah & kecepatan gerak di kedua sisi cut. Di motion graphics, cut pada transform peak.

**Speed ramp (30fps):** 0–20 = 100% (run-up); 20–28 = ease ke 25% (slow-mo antisipasi); frame 28 = IMPACT tepat di beat; 28–40 = ease kembali 100%. Slow-mo tanpa optical-flow/frame-blending = strobing. Motion blur konsisten sepanjang ramp.

**Sequence arc:** Establish (8–16 beat, hold panjang) → Develop (cut memendek 8→4→2) → Climax (1–2 beat, drop + visual terbesar + ramp) → Resolve (satu hold panjang untuk logo/CTA). Pacing seragam = flat.

**Hand-off ke kode:** setiap cut = nomor frame absolut; klip = from/durationInFrames; transisi = overlap; retime = eased time-remap. Verifikasi audio: `frame/fps` vs detik beat terdeteksi.

### G. Logo Animation — resep (logo-animation)

**Prinsip inti: satu teknik per logo** — draw ATAU build ATAU morph, bukan sekaligus. Reveal 0.8–2.5 s. **Jangan distorsi geometri brand**: scale uniform, fade, translate, rotate-on-axis, mask = aman; scaleX≠scaleY, skew, squash pada mark final = off-brand (squash-and-settle hanya boleh sebagai micro-overshoot < 0.2 s yang kembali ke 1.0). **Clearspace:** margin = cap-height mark harus bersih dari partikel/wipe/overshoot. Jangan animasikan warna brand menjauh dari spec (boleh grayscale→brand sebagai beat yang disetujui). **Selalu sediakan fallback static end-frame + path `prefers-reduced-motion`.**

**Tabel timing:**

| Beat | Durasi | Easing |
|---|---|---|
| Stroke draw-on (per path) | 0.6–1.2 s | `0.65,0,0.35,1` |
| Mask wipe reveal | 0.5–0.9 s | `0.22,1,0.36,1` |
| Build-on per piece | 0.4–0.6 s, stagger 0.06–0.10 s | `back.out(1.5–1.6)` |
| Morph | 0.6–1.0 s | `power2.inOut` |
| Final settle/overshoot | 0.12–0.20 s | scale 1.04→1.00, `power2.out` |
| Full reveal | 0.8–2.5 s total | — |
| Idle loop cycle | 1.5–4 s infinite | `sine.inOut` / linear untuk spin |
| Hold mark settle | ≥ 0.4 s sebelum sign-off cut | — |

Teknik: **stroke draw-on** (`pathLength="1"`, `stroke-dashoffset` 1→0, stagger per path; varian draw-then-fill); **mask wipe** (animasi rect `<clipPath>`, atau circle growing untuk iris reveal); **build-on** (urutan: base/container dulu → accents → wordmark terakhir; GSAP `back.out(1.6)`); **morph** (GSAP MorphSVG, fallback Flubber + rAF); **idle loop** (frame 0 == frame N persis; reduced-motion: drop rotation, pertahankan pulse). **Sound-logo sync:** settle final harus mendarat tepat di puncak audio; overshoot 1.04→1.00 dalam ~0.15 s di beat menambah impact.

Delivery: web = inline SVG + CSS/GSAP; produk/app = Lottie (Bodymovin; `lottie-web`/`dotlottie-web`; reduced-motion → `goToAndStop(totalFrames-1)`); video = Remotion/AE, pre-render 2x untuk ketajaman.

### H. Motion Background — resep (motion-background)

Aturan desain: **subtle** (kontras rendah vs konten, loop lambat 8–30 s), **readable** (tambahkan scrim bila perlu), **seamless loop**, hormati `prefers-reduced-motion` + pause saat offscreen/tab hidden.

1. **CSS mesh gradient** (termurah, tanpa JS): layered `radial-gradient` + animasi `background-position`; keyframe 0% dan 100% identik = tanpa seam. Contoh: 24 s `ease-in-out infinite`.
2. **Blurred blobs:** div absolute 50vmax, `filter: blur(80px)`, `mix-blend-mode: screen`, drift 22–30 s dengan keyframe 0%/100% identik.
3. **GLSL aurora (Three.js):** full-screen quad, value-noise + fbm (5–6 oktaf) di fragment shader; trik loop seamless = drive offset noise dengan `vec2(cos(uPhase), sin(uPhase))` — lingkaran tertutup di noise space, di 2π field identik dengan 0. PERIOD 18 s. Tambah parallax mouse halus (`(uMouse−0.5)×0.06`).
4. **Constellation canvas:** ~80–120 titik, kecepatan ±0.3 px/frame, link jika jarak < 120–130 px dengan alpha `1−d/LINK`; di atas ~120 titik gunakan spatial hash grid. Varian: mouse repulsion 140 px.
5. **Seamless loop umum:** bangun semua gerak dari `sin/cos(phase)` dengan `phase = (t % PERIOD)/PERIOD × 2π`; untuk 1-D scroll, majukan bilangan *integer* noise cells per period.
6. **Lifecycle manager:** `prefers-reduced-motion` → render satu frame statis lalu stop; `visibilitychange` + `IntersectionObserver` → pause saat hidden/offscreen. **Cap `devicePixelRatio` di 2** — DPR tak terbatas di retina/4K "membunuh" GPU.

---

## 2. AMATEUR MISTAKES TO AVOID (dikumpulkan dari semua skill)

**Motion/timing:**
- `linear` pada event diskrit (terbaca robotik); linear hanya untuk loop kontinu.
- F9/Easy Ease default sebagai hasil akhir (simetris 33% — terlalu lembut); bentuk ulang jadi asimetris, incoming influence 80–90%.
- Semua elemen muncul sekaligus tanpa stagger (terbaca satu flat event).
- Satu durasi untuk semua ukuran (ikon 20 px dan panel full-bleed butuh waktu beda).
- Elemen bergerak > 1/3 layar dalam satu gerakan tak terputus ("the template moved").
- > 1/3 elemen bergerak aktif bersamaan = noise tanpa fokus.
- Tidak ada antisipasi / follow-through / arc (gerak mekanis meski easing benar).
- Overshoot pada konten finansial/serius (terbaca seperti mainan).

**Komposisi/kamera:**
- Semua terpusat, semua bergerak dengan kecepatan sama (tidak ada parallax, tidak ada depth).
- Push + pan + rotate sekaligus (chaotic — satu move per beat).
- 9:16 dibuat dengan crop 16:9 (konten terpotong UI platform) — harus restack vertikal.
- Frame penuh sesak tanpa negative space (terlihat murahan/sempit).
- 2+ focal point bersaing; tidak ada hierarki size > contrast > color > position.

**Direction:**
- Motion language tidak didefinisikan; > 2 easing curve dalam satu piece; default `ease` CSS dibiarkan (terbaca "belum diputuskan").
- Mencampur sel tone matrix dalam satu piece.
- Menganimasikan seluruh frame sekaligus; tidak ada hold/rest antar move; dua "wow" moment.
- Loop-animate teks yang masih dibaca; angka overshoot / tidak di-hold ≥ 0.5 s.

**Color:**
- Interpolasi warna di sRGB mentah (midpoint abu-abu berlumpur).
- Palet terlalu banyak hue; saturasi maksimum pada aksen di scene gelap (vibrates, murahan).
- Gradient banding tanpa grain; gradient bergerak cepat (screensaver).
- Split-tone > 0.15 (filter Instagram murahan); grade tidak konsisten antar shot.
- Render washed-out: working space "None", export tanpa color tag, grade/approve ke QuickTime (bug gamma ~1.96).

**Editing:**
- Cut di tiap beat (frantic) — cut di phrase 2/4/8 beat; dissolve di tiap cut (mushy, midpoint meleset dari beat).
- Grid BPM dihitung dari 0:00 tanpa beat-1 offset ("hampir on-beat" tapi salah); rounding per-step menyebabkan drift.
- Cut di saat diam, bukan on-action; slow-mo tanpa optical-flow (strobing).
- Pacing seragam dari awal sampai akhir (flat, tanpa arc).

**Logo:** menggabungkan draw+build+morph sekaligus; distorsi non-uniform pada mark final; warna brand dianimasikan menjauh dari spec; tidak ada fallback reduced-motion/static end-frame; settle tidak sinkron dengan sound-logo.

**Background:** background mengalahkan kontras teks foreground; DPR tidak di-cap; loop ber-seam (keyframe 0%/100% tidak identik; noise scroll bukan integer cells); lupa pause saat hidden/offscreen (boros baterai).

**After Effects (skim):** H.264 di Render Queue (dihapus sejak CC 2014 — pakai AME); export H.264 dengan ekspektasi alpha (selalu jadi hitam — pakai ProRes 4444/PNG sequence); proyek diserahkan sebagai `.aep` mentah tanpa Collect Files; efek dipanggil by display name di script (pakai matchName).

---

## 3. REMOTION-VIDEO SKILL

**Apa itu Remotion:** framework untuk membangun video MP4/GIF/WebM nyata di **React** — setiap frame adalah fungsi murni dari `useCurrentFrame()`, sehingga output deterministik, scrubbable, diffable, dan bisa dirender di CI/headless. Pipeline: React → headless Chrome → FFmpeg. Alternatif code-first pengganti After Effects untuk motion graphics templated & data-driven.

**Core API patterns:**
- **Frame-driven animation:** tidak pernah `setState`/`requestAnimationFrame`. `interpolate(frame, [0,30], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'})` memetakan waktu→nilai; **`spring({frame, fps, config})`** untuk gerak fisik alami. Selalu clamp `interpolate` — default `extend` mengekstrapolasi linear melewati range (opacity > 1 dll).
- **Spring configs:** smooth no-overshoot `{damping: 200}`; gentle bounce `{damping: 12, stiffness: 100, mass: 1}`; snappy UI pop `{damping: 20, stiffness: 200, mass: 0.6}`; heavy `{mass: 3, damping: 40, stiffness: 80}`. `from`/`to` me-remap output; `durationInFrames` men-stretch spring ke window tetap; `delay` menunda; `measureSpring()` mengembalikan frame yang dibutuhkan untuk settle (untuk sizing sequence).
- **Scheduling:** `<Sequence from durationInFrames>` menggeser waktu (di dalamnya `useCurrentFrame()` lokal mulai 0; `layout="none"` melepas wrapper absolute-fill); `<Series>` untuk segmen back-to-back, dengan `offset` negatif untuk overlap crossfade.
- **Composition registration:** `<Composition id fps width height durationInFrames schema defaultProps>`; **zod schema** (`zColor()` memberi color picker di Studio); **`calculateMetadata`** menghitung `durationInFrames` dari props/data sebelum render (mis. rows × frames per row).
- **Audio & beat sync:** `<Audio src={staticFile('track.mp3')} startFrom endAt volume={fn}>`; **beat dideteksi offline** (mis. `web-audio-beat-detector`/aubio) lalu di-bake jadi props — jangan analisis audio saat render (headless tidak punya realtime audio clock).
- **Rendering:** `npx remotion studio` (preview), `npx remotion render Promo out.mp4 --props='...'` (flags: `--codec=h264/gif/vp8`, `--crf=18`, `--scale=2`, `--concurrency=4`, `--gl=angle`/`swangle` untuk WebGL headless); batch via `@remotion/renderer` — **bundle sekali (`bundle()`), render banyak (`selectComposition` + `renderMedia`)**, reuse `serveUrl`.
- **Determinism checklist:** ganti `Math.random()` dengan `random(seed)` dari Remotion; `delayRender()`/`continueRender()` untuk asset async; preload font (`@remotion/google-fonts` atau `document.fonts.load`); larangan total `Date.now()`/`performance.now()`/timer.
- **Shader/Three.js:** `@remotion/three` (`ThreeCanvas`); shader GLSL mentah = full-screen quad dengan uniform `uTime = frame/fps` — deterministik karena canvas re-render per frame Remotion.

**Kapan Remotion vs HTML/GSAP biasa (guidance skill):** pakai tier Remotion ketika output **harus MP4/GIF**, harus membawa angka/teks eksak, atau batch dari data (satu komposisi → banyak output per record/CSV, dirender di CI tanpa GUI). Untuk **animasi web ringan, pilih standalone HTML** (satu file, dibuka langsung di browser, tanpa build step) — skill menyebut ini "the right tier" untuk web animation.

---

## 4. API KEYS / PAID KEYS

**Tidak ada satu pun skill yang mensyaratkan API key.** Grep seluruh repo untuk `api key|apikey|paid|license|subscription|secret|token` hanya menghasilkan satu hit yang tidak relevan (kata "key" sebagai keyframe di `easing-curves.md`). Yang ada hanyalah dependensi software/tooling biasa, tanpa kunci:

- **After Effects** — software berbayar Adobe (implisit; skill tidak menyebut lisensi secara eksplisit, hanya menu/pengaturan).
- **GSAP MorphSVG & DrawSVGPlugin** (dipakai di resep logo-animation) — secara umum diketahui sebagai Club GSAP (berbayar), tapi repo tidak membahas lisensi/harga.
- Footer promosi **iart.ai** ("the AI motion agent") di tiap file — layanan komersial opsional, bukan requirement skill.
- Semua pustaka kode yang dirujuk bersifat open-source/gratis: Remotion, Three.js, culori, d3-interpolate, Lottie/Bodymovin, flubber, `web-audio-beat-detector`, `@remotion/*`.
- Repo berlisensi **MIT**.

---

**Catatan tambahan untuk playbook:** repo ini bagian dari koleksi 14-pack iart-ai; topik yang sengaja *tidak* dicakup di sini (ada di repo saudaranya): kinetic-typography khusus, TikTok/Reels/Shorts, web-animation (GSAP), WebGL/3D, data-animation, explainer, map-animation, manim, ad-video, ecommerce-video, youtube-video, freelance-motion, text-message-video.
# Laporan: Riset librani.org/#library

**Catatan singkat:** tidak ada penyebutan "vikey" di librani.org maupun di dokumen style. Satu-satunya kebutuhan kunci API adalah ElevenLabs (narasi + musik generatif), disimpan di `.env`, bukan di chat. (Parent sudah instruksikan untuk mengabaikan itu.)

## 1. Katalog lengkap library (6 style, semua status "shipped")

Setiap style punya: **copy-prompt siap pakai**, **starter zip** (`https://librani.org/downloads/<nama>.zip`) berisi contoh `film.html` + `.md` style guide, dan **halaman breakdown** (`https://librani.org/s/<nama>/`).

| # | Style | Kategori | Durasi | Audio | Deskripsi singkat |
|---|---|---|---|---|---|
| 1 | **UI Journey** | Product promo | 30 dtk | Voice-over + musik | Satu kursor menggerakkan satu interface produk yang terus bertransformasi |
| 2 | **Living Frame** | Recap | 15 dtk | Musik, punch cuts | Logo brand menjadi frame hidup yang "berburu" tiap subjek baru |
| 3 | **Split Kinetic** | Recap | 45 dtk | Musik + caption | Headline kinetik di kiri, dunia hidup berisi logo asli di kanan |
| 4 | **Stream Reel** | Hype reel | 30 dtk | Musik, hit-synced | Angka besar, dinding alamat acak, objek 3D di atas biru elektrik |
| 5 | **Poster World** | Recap | 30 dtk | VO + musik generatif | Kamera terbang masuk ke dalam artwork event; pelajaran hidup di dalamnya |
| 6 | **Dark Reveal** | **Explainer** | 30 dtk | Musik, punch on cuts | Explainer gelap dan tenang; teks terenkripsi dan masalah diberi nama |

Di atas library ada **motion-studio skill** — "satu folder yang mengajarkan Claude seluruh pipeline: storyboard, HTML film, render frame-by-frame, voice, music mix, dan glitch scan." Instalasi: `ffmpeg`, `playwright` + Chromium, `numpy`/`scipy`. **Catatan:** tombol download `motion-studio.zip` di halaman utama mengembalikan 404 (saya verifikasi via curl) — hanya starter zip per-style yang berfungsi.

## 2. Top picks untuk video explainer harian dari blog post (use case Rialo)

1. **Dark Reveal** — satu-satunya kategori *Explainer*; template paling pas untuk blog post → video. Bentuk cerita: fakta tak nyaman → masalah diberi nama → reveal → produk memperbaikinya. Signature: teks *scramble* (resolve kiri→kanan, reverse = enkripsi), dua warna state (mis. publik vs privat), recreated app screen, kinetic copy. Aturan eksplisit: "list klaim yang akan dipakai dan sumbernya sebelum build; jangan buat klaim absolut tanpa dukungan docs."
2. **UI Journey** — untuk konten yang mendemokan produk/interface: rebuild UI di HTML (bukan screenshot), satu kursor mengemudi, potongan tepat di beat, narasi ~70 kata untuk 30 dtk, maks 4 fitur per video.
3. **Stream Reel** — untuk konten tokenomics/angka besar (burn, supply, alokasi): angka raksasa type-on lalu berubah jadi objek, dinding karakter base58 scramble, flow lines untuk persentase, scale/brightness kick di setiap hentakan musik.
4. Pola yang bisa dipakai lintas video dari style lain: **Living Frame** (motif brand = transisi, jangan potong ke slide baru) dan **Split Kinetic** (sistem caption sinkron + objek data reusable: dial, grid, ring).

## 3. Pola desain & aturan kualitas yang bisa dipakai ulang

- **Fakta hanya dari docs.** Setiap klaim diverifikasi; daftar klaim + sumbernya dibuat *sebelum* build. Jangan invent angka.
- **Satu promise, sedikit poin.** Maks 3 takeaway, maks 4 fitur per 30 dtk, maks 3–4 screen UI.
- **Tidak ada slide baru.** Satu interface/motif yang terus bertransformasi; motif brand adalah transisinya.
- **Setiap objek punya entrance** — tidak boleh ada elemen yang "tiba-tiba muncul" (ini bug nyata yang dicatat di Split Kinetic).
- **Potong di beat grid.** Rumus di kode: `P = 60/BPM`, `B(n) = B0 + n*P`; camera punch dengan wind-up pendek sebelum cut.
- **Tipografi:** headline dua tone, mono (JetBrains Mono/Geist Mono) untuk angka & label, angka odometer fixed-width agar tidak "melompat".
- **Caption kata-per-kata** dari timing narasi (karaoke pill), bukan caption kalimat penuh.
- **Audio mix:** narasi ElevenLabs (~70 kata/30 dtk), musik generatif per film, SFX di-*event* dengan timestamp + gain dB, loudness LUFS −14 (standar streaming).
- **Alur kerja:** storyboard/stills disetujui dulu sebelum render penuh (perubahan murah di awal); satu film dirender untuk 16:9, 9:16, 1:1; "glitch scan" sebagai QA akhir.

## 4. Pola teknis (dari contoh `film.html` + `mix.json`)

- Film = **satu file HTML mandiri** 1920×1080, `window.DURATION` menetapkan panjang, scene di-map sebagai beat (`S = {intro: 0, inv: 4, ...}`), easing helpers standar (`spring`, `ease`, `outE`, `lerp`, `roll` odometer, `mix` warna), render frame-by-frame via headless Chromium 60fps → ffmpeg.
- `mix.json` mendeskripsikan seluruh audio: file lagu + offset + gain, daftar event SFX (`t`, `sfx`, `gain_db`), target LUFS. Ini pola yang bagus untuk kita tiru: audio sebagai data, bukan hasil editing manual.
- Starter zip living-frame (11 KB) berisi `styles/living-frame.md` + `examples/living-frame/film.html` + `allscale-recap15.mix.json` + SVG assets — sangat worth di-download semua sebagai referensi kode konkret.

**Rekomendasi:** untuk pipeline 2–3 video/hari dari blog Rialo, fondasi terkuat adalah pola **Dark Reveal** (struktur explainer + aturan klaim) + pola **UI Journey** (untuk segmen demo produk) + pipeline teknis **HTML film + mix.json + frame-by-frame render**.
# 🌐 web-pegasusindo — Frontend pegasusindo.com

Website statis **pegasusindo.com**: landing perusahaan sementara + Digital Business Card.
Bagian dari Pegasus-ERP (rencana "Jalan 1" — frontend domain sendiri).
Backend data = Apps Script **pegasus-card** (akun identitas@pegasusindo.com).

## Kontrak URL (PERMANEN — dicetak di QR kartu nama, JANGAN diubah)

| URL | Isi |
|---|---|
| `https://pegasusindo.com/` | Landing Pegasus Nusantara Group (sementara, siap dikembangkan) |
| `https://pegasusindo.com/herman` | Kartu digital Herman Supangat ← **QR kartu nama** |
| (404) | `404.html` ber-branding |

Kartu baru = buat folder `<slug>/index.html` (salin dari `herman/`, ganti `PC_SLUG` + meta).

## Struktur

```
index.html          landing (berdiri sendiri, tanpa dependensi backend)
herman/index.html   kartu Herman (kulit statis; data ditarik dari API saat dibuka)
assets/card.css     tema kartu (hitam + metallic gold)
assets/card.js      render kartu + Save Contact + analytics anonim
config.js           ⚙️ SATU-SATUNYA sambungan ke backend (URL API)
404.html, CNAME, .nojekyll
```

## Prinsip portabilitas (permintaan Herman, 17-Jul-2026)

1. **URL publik & QR tidak pernah berubah** — yang boleh berubah hanya (a) tempat hosting
   file-file ini, dan (b) isi `config.js` bila backend pindah.
2. **Pindah hosting** = salin semua file ini ke host baru (Netlify/Cloudflare Pages/nginx/
   cPanel — apa pun yang bisa menyajikan file statis) → arahkan DNS `pegasusindo.com` ke
   host baru → selesai. Tidak ada build step, tidak ada database di sisi frontend.
3. **Pindah backend** (mis. kelak dari Apps Script ke API lain) = ganti nilai `API` di
   `config.js` selama respons JSON-nya sama (`?action=data|wa|event|vcf`).

## Deploy awal — GitHub Pages

1. Buat repo GitHub (mis. `pegasus/web-pegasusindo`, private tidak bisa utk Pages gratis → public).
2. Push isi folder ini ke branch `main`.
3. Settings → Pages → Source: `main` / root → simpan. File `CNAME` otomatis memasang
   custom domain `pegasusindo.com`; centang **Enforce HTTPS** setelah sertifikat terbit.
4. DNS di panel Squarespace Domains (email Google TIDAK tersentuh — jangan ubah MX):
   - 4 catatan `A` @ → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `<username>.github.io`
5. Tunggu propagasi (menit–jam) → uji `https://pegasusindo.com/herman`.
6. Dashboard Pegasus Card → Pengaturan → `BASE_URL` = `https://pegasusindo.com`
   → menu QR Code → unduh QR final → **aman utk cetak**.

## Catatan teknis

- GitHub Pages otomatis melayani `/herman` → `/herman/index.html` (301 ke `/herman/`).
- Halaman kartu menarik data via `fetch` GET ke Apps Script (ContentService menyertakan
  CORS utk permintaan GET sederhana). Nomor telepon/WA tidak pernah ada di HTML.
- `?src=qr` pada URL QR = penghitung scan di Analytics dashboard.
- Folder `preview/` (di-gitignore) = uji lokal dengan data contoh.

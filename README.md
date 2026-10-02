# Panti Asuhan Asih

Situs Yayasan Panti Asuhan Anak Luar Biasa Asih (Madiun) beserta dashboard admin.
Next.js (App Router) + Neon Postgres (Drizzle).

## Menjalankan secara lokal

1. Salin `.env.example` menjadi `.env.local` dan isi nilainya.
2. `npm install`
3. `npm run db:push` — membuat tabel di database.
4. `npm run db:seed` — mengisi data awal dan akun admin (hanya tabel yang masih kosong).
5. `npm run dev`, lalu buka `http://localhost:3000`. Dashboard ada di `/admin`.

## Environment variable

| Nama | Dipakai untuk |
| --- | --- |
| `DATABASE_URL` | Koneksi Neon Postgres (wajib, juga saat build) |
| `SESSION_SECRET` | Menandatangani cookie sesi admin (wajib) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD` | Hanya dibaca `npm run db:seed` untuk membuat akun admin pertama |

## Penyimpanan foto

Foto bawaan ada di `public/images`. Foto yang diunggah lewat dashboard disimpan di:

- **Cloudflare R2**, jika `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
  `R2_BUCKET`, dan `R2_PUBLIC_URL` semuanya terisi. Bucket harus bisa diakses publik
  (domain `r2.dev` atau domain kustom) dan token API-nya punya izin Object Read & Write.
- **Database** (tabel `media`), jika R2 belum diatur.

Halaman Ringkasan di dashboard menampilkan penyimpanan mana yang sedang aktif. Foto
lama tetap tampil setelah berpindah penyimpanan, karena database menyimpan URL lengkapnya.

## Deploy ke Vercel

1. Di Project Settings → Environment Variables, tambahkan `DATABASE_URL` dan
   `SESSION_SECRET` dengan nilai yang sama seperti di `.env.local`.
2. Deploy. Halaman utama dibuat saat build dari isi database, jadi database harus
   sudah di-push dan di-seed sebelum deploy pertama.

Fungsi server dijalankan di region `sin1` (lihat `vercel.json`) agar dekat dengan
database Neon di Singapura.

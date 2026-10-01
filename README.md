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

## Deploy ke Vercel

1. Di Project Settings → Environment Variables, tambahkan `DATABASE_URL` dan
   `SESSION_SECRET` dengan nilai yang sama seperti di `.env.local`.
2. Deploy. Halaman utama dibuat saat build dari isi database, jadi database harus
   sudah di-push dan di-seed sebelum deploy pertama.

Fungsi server dijalankan di region `sin1` (lihat `vercel.json`) agar dekat dengan
database Neon di Singapura.

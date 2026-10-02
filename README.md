# Lapor Bersih — Sistem Pelaporan Kebersihan

React 18 + Vite + Tailwind CSS 3 + Supabase (Auth, Postgres, Storage, Realtime).

## Setup
1. Supabase Dashboard > SQL Editor: jalankan `supabase/schema.sql`.
2. `cp .env.example .env`, isi `VITE_SUPABASE_PUBLISHABLE_KEY`.
3. `npm install && npm run dev`
4. Daftar 3 akun lewat halaman Daftar (semua berole `umum`). Ubah jadi admin/ob lewat SQL (contoh di akhir schema.sql).
5. Opsional: Authentication > Providers > Email > matikan "Confirm email" untuk uji coba cepat.

## Keamanan
- Frontend hanya memakai publishable key. SECRET KEY tidak boleh masuk frontend atau Git.
- Hak akses ditegakkan oleh RLS di database, bukan oleh UI.

## Notifikasi WhatsApp ke OB
Saat admin menugaskan laporan, OB otomatis dapat WA (via Fonnte + Supabase Edge Function).
1. Daftar di fonnte.com, hubungkan nomor WA pengirim (scan QR), salin token.
2. Jalankan `supabase/whatsapp.sql` (ganti `<PROJECT_REF>` dan `<WEBHOOK_SECRET>`), lalu isi kolom `phone` tiap OB.
3. Deploy fungsi:
   ```
   supabase secrets set FONNTE_TOKEN=xxx WEBHOOK_SECRET=xxx APP_URL=https://domain-anda.com
   supabase functions deploy notify-ob --no-verify-jwt
   ```
# kebersihan-app

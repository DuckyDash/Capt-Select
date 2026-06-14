# Rencana Kerja Pengembangan (Implementation Plan)

Dokumen ini mendeskripsikan rencana kerja teknis yang telah disetujui dan dieksekusi untuk merealisasikan rancangan konseptual **Privacy Policy Risk Scanner** menjadi aplikasi fungsional.

---

## 1. Tahap Persiapan & Perancangan Lingkungan (Fase 1)
*   **Tujuan**: Menyiapkan pondasi kode backend dan frontend yang bersih serta modular.
*   **Langkah Aksi**:
    1.  Membuat folder `backend/` dan menginisialisasi npm dengan tipe ES Module (`"type": "module"`).
    2.  Memasang dependensi backend: `express`, `cors`, `dotenv`, `@supabase/supabase-js`, dan `@google/generative-ai`.
    3.  Membuat folder `frontend/` menggunakan generator Vite dengan template React.
    4.  Memasang dependensi frontend: `@tailwindcss/vite` (Tailwind v4) dan `lucide-react` untuk pustaka ikon.
    5.  Membuat file `.env.example` sebagai panduan konfigurasi API Key dan Supabase URL.

---

## 2. Tahap Pembangunan Basis Data & Integrasi Server (Fase 2)
*   **Tujuan**: Membangun backend API dan menghubungkannya dengan database PostgreSQL Supabase.
*   **Langkah Aksi**:
    1.  Membuat proyek baru di dashboard Supabase Cloud.
    2.  Menjalankan perintah SQL DDL untuk membuat tabel `scan_history` dengan kolom:
        *   `id` (UUID, primary key)
        *   `created_at` (timestamp, default now)
        *   `title` (text)
        *   `input_text` (text)
        *   `risk_score` (text)
        *   `summary` (text)
        *   `flagged_clauses` (jsonb)
        *   `recommendations` (jsonb)
    3.  Menginisialisasi `supabaseClient.js` di dalam direktori `backend/services/`.
    4.  Membuat route Express `/api/history` untuk mendukung GET (mengambil 10 baris riwayat pindaian terbaru) dan DELETE (menghapus baris tertentu atau semua baris data).

---

## 3. Integrasi Mesin Kecerdasan Buatan / AI Layer (Fase 3)
*   **Tujuan**: Mengimplementasikan scanning dokumen privasi berbasis LLM dengan opsi fallback dinamis.
*   **Langkah Aksi**:
    1.  Mengintegrasikan Google Generative AI SDK untuk mengakses model `gemini-2.5-flash`.
    2.  Menyusun parameter prompt penganalisis hukum yang meminta output terformat JSON secara ketat untuk parsing aman di sisi server.
    3.  Membuat algoritma `generateDynamicMockAnalysis` di backend sebagai mode alternatif (fallback) yang menggunakan analisis frekuensi kata kunci lokal bila API Key tidak valid/mengalami batasan quota. Hal ini menjamin stabilitas sistem.
    4.  Menghubungkan API route `/api/analyze` (POST) dengan logika analisis AI dan penyimpanan otomatis ke Supabase.

---

## 4. Pengembangan Antarmuka Klien & Interaksi (Fase 4)
*   **Tujuan**: Membuat antarmuka pengguna desktop-first yang indah, intuitif, dan responsif.
*   **Langkah Aksi**:
    1.  Menyusun struktur styling global di `index.css` berbasis variabel CSS dan utilitas glassmorphism (`glass-panel`).
    2.  Membangun komponen `PolicyInput` yang berisi area teks dan pintasan sampel kebijakan instan (contoh: WhatsApp, Sosmed X, dll) untuk mempermudah pengujian.
    3.  Membangun `ScanDashboard` untuk memvisualisasikan data JSON keluaran AI:
        *   Kartu skor risiko dengan ikon perisai dinamis dan warna representatif (merah untuk Danger, oranye untuk High, kuning untuk Medium, hijau/biru untuk Low).
        *   Penjelasan bahasa awam.
        *   Klausul berisiko dalam bentuk akordeon interaktif yang bisa diklik.
        *   Daftar rekomendasi tindakan konkret.
    4.  Membangun drawer samping (`HistoryDrawer`) untuk menampilkan daftar riwayat pindaian langsung dari database.

---

## 5. Tahap Evaluasi & Pengujian Akhir (Fase 5)
*   **Tujuan**: Memastikan aplikasi bebas dari error fatal dan memiliki responsivitas yang baik.
*   **Langkah Aksi**:
    1.  Melakukan pengujian fungsionalitas (Black-box testing) pada seluruh interaksi pengguna (input, tombol sampel, filter risiko, klik drawer, hapus riwayat, salin/unduh laporan).
    2.  Menguji performa response time API untuk skenario Mock Mode dan AI Mode.
    3.  Mengevaluasi kesesuaian implementasi visual dengan pedoman desain UI premium.

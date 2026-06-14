# Daftar Tugas Pengembangan (Task Checklist)

Dokumen ini mencatat daftar tugas dan status penyelesaian implementasi untuk proyek **Privacy Policy Risk Scanner** (Kapita Selekta RPL - Kelompok 6).

---

## 📋 Fitur Utama & Integrasi

- [x] **Setup Project & Environment**
  - [x] Inisialisasi React + Vite + Tailwind CSS v4 di Frontend
  - [x] Inisialisasi Express + Cors + Dotenv di Backend
  - [x] Konfigurasi file `.env` dan `.env.example`
- [x] **Integrasi Database (Supabase)**
  - [x] Setup tabel `scan_history` di Supabase PostgreSQL
  - [x] Konfigurasi Supabase Client di backend
  - [x] Implementasi CRUD API Riwayat Scan (`GET /api/history`, `DELETE /api/history/:id`, `DELETE /api/history`)
- [x] **Integrasi AI Layer (Google Gemini)**
  - [x] Integrasi `@google/generative-ai` SDK di backend
  - [x] Penyusunan System Prompt penganalisis hukum privasi berbasis JSON output
  - [x] Pembuatan fungsi dynamic fallback (Mock Mode) jika API Key mati/tidak ter-setting
- [x] **Antarmuka Pengguna (Frontend Components)**
  - [x] Header & Status Koneksi Backend Real-time
  - [x] Komponen `PolicyInput` (Teks area & Tombol sampel kebijakan instan)
  - [x] Komponen `ScanDashboard` (Skor risiko, Summary, Accordion klausul berisiko, Rekomendasi)
  - [x] Komponen `HistoryDrawer` (Panel samping daftar riwayat scan dari DB)
  - [x] Komponen `CustomModal` (Dialog konfirmasi hapus & alert)
- [x] **Styling & Interaktivitas**
  - [x] Implementasi skema Dark & Light Mode dengan transition warna smooth
  - [x] Efek visual premium: Glassmorphism (`glass-panel`), hover glow, custom scrollbar
  - [x] Animasi progress bar step-by-step saat pemindaian (Loading Simulation)
- [x] **Ekspor Laporan**
  - [x] Salin laporan teks ke clipboard
  - [x] Unduh laporan sebagai berkas teks (`.txt`) dengan format terstruktur

---

## 📄 Penyusunan Laporan & Publikasi

- [x] Penyusunan Rencana Implementasi (`implementation_plan.md`)
- [x] Pengujian Fungsionalitas & Pengukuran Kinerja (`testing_report.md`)
- [x] Pembuatan Peta Jalan Kode & Alur Data (`walkthrough.md`)
- [x] Penulisan Laporan Akhir UAS Komprehensif (`LAPORAN.md`)

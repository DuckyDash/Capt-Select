# Panduan Teknis & Alur Kode (Walkthrough)

Dokumen ini menjelaskan alur data dan interkoneksi komponen dalam aplikasi **Privacy Policy Risk Scanner** untuk memudahkan pemeliharaan kode dan pengembangan selanjutnya.

---

## 1. Pemetaan File & Alur Kerja Utama

Aplikasi ini memisahkan arsitektur backend Express dengan frontend React. Berikut visualisasi sederhana dari interaksi antar-file:

```
[Klien Browser] 
      │ (Pilih Sampel / Paste Teks Kebijakan)
      ▼
┌────────────────────────────────────────┐
│ frontend/src/components/PolicyInput    │
└──────────────────┬─────────────────────┘
                   │ 
                   │ (HTTP POST /api/analyze { text })
                   ▼
┌────────────────────────────────────────┐
│ backend/routes/apiRoutes.js            │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│ backend/controllers/analyzeController  │
└──────┬──────────────────────────┬──────┘
       │                          │
       │ (Minta Analisis)         │ (Simpan Hasil)
       ▼                          ▼
┌────────────────────────┐  ┌────────────────────────┐
│ backend/services/      │  │ backend/services/      │
│ aiService.js           │  │ supabaseClient.js      │
└──────────┬─────────────┘  └────────────┬───────────┘
           │                             │
           ▼ (Gemini AI API)             ▼ (Supabase DB)
   [gemini-2.5-flash]             [Tabel scan_history]
```

---

## 2. Rincian Teknis File Kunci (Backend)

### A. Integrasi AI & Fallback Dinamis
*   **File**: [aiService.js](file:///e:/Campuss/SMT%206/Capt%20Select/Tubes%20Kapita%2006/backend/services/aiService.js)
*   **Fungsi**: `analyzePrivacyPolicy(text)`
*   **Deskripsi**: Fungsi ini memeriksa nilai environment variable `LLM_PROVIDER`.
    *   Jika bernilai `'gemini'`, SDK Google Generative AI dipanggil untuk memicu model `gemini-2.5-flash` dengan system prompt terstruktur untuk mengekstrak data hukum privasi dalam format JSON.
    *   Jika terjadi kegagalan jaringan atau key tidak terpasang, sistem secara otomatis mengalihkan panggilan ke `generateDynamicMockAnalysis(text)`.
*   **Fallback Logic**: Metode pencarian kata kunci cerdas (keyword string matching) mendeteksi istilah-istilah sensitif seperti "lokasi", "kamera", "pihak ketiga", dan "hapus data". Hasil deteksi kemudian diubah secara dinamis menjadi objek analisis yang sesuai dengan format keluaran AI (memiliki `risk_score`, `summary`, `flagged_clauses`, dan `recommendations`) agar frontend tetap berjalan normal tanpa error.

### B. Penyimpanan & Riwayat PostgreSQL
*   **File**: [supabaseClient.js](file:///e:/Campuss/SMT%206/Capt%20Select/Tubes%20Kapita%2006/backend/services/supabaseClient.js) dan [historyController.js](file:///e:/Campuss/SMT%206/Capt%20Select/Tubes%20Kapita%2006/backend/controllers/historyController.js)
*   **Deskripsi**: Backend menggunakan `@supabase/supabase-js` untuk melakukan query langsung ke Supabase.
    *   **Penyimpanan**: Setiap kali scan berhasil diselesaikan oleh AI atau mock system, `analyzeController.js` memanggil klien Supabase untuk menyisipkan data ke dalam tabel `scan_history`.
    *   **Retrieval**: `GET /api/history` melakukan pemanggilan `.from('scan_history').select('*').order('created_at', { ascending: false }).limit(10)` untuk mengembalikan 10 riwayat pindaian terbaru ke UI drawer samping.

---

## 3. Rincian Teknis File Kunci (Frontend)

### A. Orkestrasi State Utama
*   **File**: [App.jsx](file:///e:/Campuss/SMT%206/Capt%20Select/Tubes%20Kapita%2006/frontend/src/App.jsx)
*   **Deskripsi**: Merupakan file pusat (single source of truth) untuk state aplikasi. Mengelola:
    *   `inputText`: Menyimpan isi teks kebijakan privasi yang sedang ditulis atau ditempel.
    *   `loading` & `loadingStep`: Mengontrol tampilan animasi pemindaian progresif.
    *   `analysisResult`: Menyimpan data hasil scan yang sedang aktif ditampilkan di dashboard.
    *   `history`: Menyimpan array data riwayat pindaian ter-update yang disinkronkan dari server database.
    *   `theme`: Mengelola mode gelap dan terang secara global dengan memanipulasi kelas `.dark` pada document root HTML.

### B. Dashboard Hasil Scan Risiko
*   **File**: [ScanDashboard.jsx](file:///e:/Campuss/SMT%206/Capt%20Select/Tubes%20Kapita%2006/frontend/src/components/ScanDashboard.jsx)
*   **Deskripsi**: Komponen visual interaktif yang bertugas merender output JSON:
    *   **Card Skor**: Menggunakan fungsi pembantu `helpers.jsx` untuk mewarnai badge perisai secara dinamis berdasarkan nilai risiko.
    *   **Filter Risiko**: Tombol pintas untuk menyaring baris akordeon klausul berdasarkan tingkat bahayanya (Tampilkan Semua, Sangat Berbahaya / Danger, Bahaya / High, Sedang-Rendah).
    *   **Accordion List**: Menampilkan klausul berisiko. Ketika salah satu judul diklik, accordion akan bergeser terbuka secara smooth untuk memperlihatkan alasan hukum di balik risiko tersebut.

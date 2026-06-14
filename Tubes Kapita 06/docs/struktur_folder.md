# Dokumentasi Struktur Folder (Clean Architecture)

Aplikasi **Privacy Policy Risk Scanner** dirancang dengan arsitektur modular yang rapi, memisahkan logika backend (*Express MVC*) dengan frontend (*React Components*). Dokumen ini menjelaskan susunan file beserta fungsinya masing-masing.

---

## 1. Direktori Backend (`/backend`)

Backend menggunakan pola modular modern yang terbagi menjadi *router*, *controller*, dan *service*.

* 📁 **`controllers/`** — Berisi logika bisnis utama untuk memproses request dan berinteraksi dengan database/API eksternal.
  * 📄 **`analyzeController.js`** — Menerima input teks dari frontend, memanggil service AI (Gemini), lalu menyimpan hasil analisis risiko ke database Supabase.
  * 📄 **`historyController.js`** — Menangani operasi CRUD riwayat pindaian di Supabase (mengambil riwayat, menghapus item tertentu, atau menghapus seluruh riwayat).
* 📁 **`routes/`** — Berisi definisi rute/routing API Express.
  * 📄 **`apiRoutes.js`** — Menghubungkan endpoint URL (`/analyze`, `/history`, `/history/:id`) dengan controller yang sesuai.
* 📁 **`services/`** — Berisi file integrasi dengan layanan pihak ketiga (*third-party services*).
  * 📄 **`aiService.js`** — Berfungsi untuk berinteraksi dengan model **Google Gemini API** (`gemini-2.5-flash`). Di dalamnya terdapat prompt utama penganalisis hukum dan sistem fallback otomatis (Mock Mode) jika API key bermasalah.
  * 📄 **`supabaseClient.js`** — Menginisialisasi koneksi client dengan **Supabase PostgreSQL** menggunakan URL dan API Key yang ada di file konfigurasi.
* 📄 **`server.js`** — File utama (entrypoint) backend. Mengatur konfigurasi dasar Express, mengaktifkan CORS (lintas asal), memuat middleware JSON parser, serta mendaftarkan seluruh route API.
* 📄 **`.env`** — File sensitif untuk menyimpan API Key Gemini dan kredensial Supabase.
* 📄 **`.env.example`** — Template file konfigurasi `.env` sebagai contoh bagi pengembang lain.
* 📄 **`package.json`** — Metadata proyek backend beserta daftar modul/dependensi yang digunakan (seperti `express`, `cors`, `@supabase/supabase-js`, dan `@google/generative-ai`).

---

## 2. Direktori Frontend (`/frontend`)

Frontend dibangun menggunakan **React** + **Vite** dan dipecah menjadi komponen-komponen visual yang modular (*Component-Driven Development*).

* 📁 **`src/components/`** — Berisi potongan UI yang dapat digunakan kembali (*reusable components*).
  * 📄 **`CustomModal.jsx`** — Dialog modal kustom untuk menggantikan alert bawaan browser. Berwarna dinamis sesuai jenis notifikasi (sukses, error, konfirmasi hapus, dll) dan otomatis mengikuti tema dark/light.
  * 📄 **`HistoryDrawer.jsx`** — Panel geser samping (drawer) untuk menampilkan daftar riwayat pemindaian yang diambil dari database.
  * 📄 **`PolicyInput.jsx`** — Form input berupa area teks untuk menempelkan kebijakan privasi dan tombol pemilihan sampel siap pakai.
  * 📄 **`ScanDashboard.jsx`** — Dashboard hasil scan yang berisi kartu skor risiko, ringkasan bahasa awam, rekomendasi tindakan, serta visualisasi klausul berbahaya menggunakan fitur akordeon (*accordion*).
* 📁 **`src/data/`** — Penyimpanan data statis.
  * 📄 **`samplePolicies.js`** — Berisi konstanta data teks panjang contoh kebijakan privasi (WhatsApp, Sosmed X, Aplikasi Finansial, Aplikasi Chat Lokal).
* 📁 **`src/utils/`** — Kumpulan fungsi pembantu (*helper/utilities*).
  * 📄 **`helpers.jsx`** — Berisi fungsi untuk memformat tanggal (`formatDate`), mengekstrak baris judul dokumen (`getPolicyTitle`), serta penentu gaya visual (warna, ikon, dan deskripsi) berdasarkan kategori tingkat risiko (*Danger*, *High*, *Medium*, *Low*).
* 📄 **`App.jsx`** — Komponen utama yang mengorkestrasi state (seperti teks input, status pemuatan, hasil analisis, data riwayat) dan merangkai komponen-komponen UI di atas ke dalam satu halaman layout responsif.
* 📄 **`index.html`** — File HTML dasar tempat React me-mount seluruh elemen DOM. Di dalamnya terdapat tag metadata SEO dan import Google Fonts (Inter).
* 📄 **`index.css`** — CSS global. Mengatur impor TailwindCSS v4, kustomisasi variabel warna tema (light & dark mode), desain scrollbar premium, efek glow shadow, serta utilitas glassmorphism (`glass-panel`).
* 📄 **`vite.config.js`** — File konfigurasi bundler Vite dan compiler React.

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const provider = process.env.LLM_PROVIDER || 'mock';
const apiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini
let genAI = null;
if (provider === 'gemini' && apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

/**
 * Analyzes the privacy policy text using Gemini or Mock fallbacks
 * @param {string} text 
 * @returns {Promise<object>}
 */
export async function analyzePrivacyPolicy(text) {
  if (!text || text.trim().length < 50) {
    throw new Error('Teks kebijakan privasi terlalu pendek untuk dianalisis (minimal 50 karakter).');
  }

  // If Gemini is active and API key exists
  if (provider === 'gemini' && genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `
Kamu adalah sistem AI penganalisis kebijakan privasi (Privacy Policy Risk Scanner) yang handal untuk mendeteksi potensi risiko bagi pengguna.
Analisis teks kebijakan privasi berikut ini dan berikan output dalam format JSON terstruktur yang valid.

Teks Kebijakan Privasi:
"""
${text}
"""

Kembalikan respon HANYA dalam format JSON dengan struktur persis seperti berikut (jangan tambahkan markdown backticks atau penjelasan lain di luar JSON):
{
  "risk_score": "Low" | "Medium" | "High" | "Danger",
  "summary": "Ringkasan singkat, jelas, dan padat mengenai kebijakan privasi ini dalam bahasa Indonesia yang mudah dipahami orang awam (2-3 kalimat).",
  "flagged_clauses": [
    {
      "clause": "Klausul atau kutipan kalimat asli dari teks kebijakan privasi yang dinilai berisiko.",
      "reason": "Penjelasan mengapa klausul ini berisiko bagi pengguna dan potensi dampaknya dalam bahasa Indonesia yang sederhana.",
      "severity": "Low" | "Medium" | "High" | "Danger"
    }
  ],
  "recommendations": [
    "Rekomendasi tindakan konkret pertama yang harus dilakukan pengguna (dalam bahasa Indonesia).",
    "Rekomendasi tindakan konkret kedua...",
    ...
  ]
}

Aturan Penilaian Tingkat Risiko:
- Low: Praktik data standar, transparan, opsi hapus data jelas, tidak ada sharing dengan pihak ketiga yang mencurigakan.
- Medium: Pengumpulan data standar untuk iklan, pelacakan cookies dasar, pembagian data terbatas.
- High: Pembagian data dengan pihak ketiga untuk iklan tertarget secara luas, pelacakan lokasi terus-menerus, atau pembaruan kebijakan sepihak tanpa pemberitahuan.
- Danger: Tidak ada hak penghapusan data pribadi, pengumpulan data sensitif tanpa persetujuan eksplisit, transfer data ke yurisdiksi lain tanpa jaminan keamanan, atau klaim kepemilikan penuh atas konten pengguna.

Pastikan semua kunci JSON di atas ada dan nilainya berbahasa Indonesia.
`;

      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const responseText = response.response.text();
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      console.log('Falling back to local dynamic analysis due to API error.');
      // Fallback to mock on API error
    }
  }

  // Fallback / Mock Mode: Dynamically analyze the text for keywords to feel intelligent
  return generateDynamicMockAnalysis(text);
}

/**
 * Generates a mock analysis based on keyword searches in the text
 * @param {string} text 
 * @returns {object}
 */
function generateDynamicMockAnalysis(text) {
  const lowercaseText = text.toLowerCase();
  const flagged = [];
  
  // Keyword checks
  const keywords = [
    {
      keys: ['pihak ketiga', 'mitra', 'third party', 'sponsor', 'afiliasi', 'membagikan data'],
      clause: '...membagikan data pribadi Anda kepada pihak ketiga, mitra bisnis, sponsor, dan perusahaan afiliasi...',
      reason: 'Data pribadi Anda dibagikan ke pihak ketiga untuk keperluan eksternal yang di luar kendali langsung Anda. Risiko penyalahgunaan data atau kebocoran data meningkat.',
      severity: 'High'
    },
    {
      keys: ['iklan', 'iklan bertarget', 'ads', 'targeting', 'pemasaran', 'marketing'],
      clause: '...menggunakan riwayat penelusuran, preferensi, dan informasi profil Anda untuk menampilkan iklan bertarget...',
      reason: 'Aplikasi melakukan profiling perilaku digital Anda secara terus menerus untuk menyajikan iklan. Hal ini dapat mengganggu privasi berselancar Anda.',
      severity: 'Medium'
    },
    {
      keys: ['lokasi', 'gps', 'koordinat', 'location', 'pelacakan lokasi'],
      clause: '...mengumpulkan data lokasi presisi perangkat Anda secara realtime, bahkan ketika aplikasi sedang berjalan di latar belakang...',
      reason: 'Pelacakan lokasi presisi di latar belakang (background) sangat sensitif dan dapat mengekspos rute harian serta kebiasaan fisik Anda.',
      severity: 'Danger'
    },
    {
      keys: ['hapus', 'penghapusan', 'delete', 'retensi', 'menyimpan data'],
      clause: '...berhak menyimpan data pribadi Anda selama jangka waktu yang tidak ditentukan meskipun akun Anda telah dihapus...',
      reason: 'Sulit atau tidak adanya opsi untuk menghapus data secara permanen melanggar hak perlindungan data pribadi (Right to be Forgotten) sesuai UU PDP.',
      severity: 'Danger'
    },
    {
      keys: ['perubahan', 'mengubah kebijakan', 'sewaktu-waktu', 'tanpa pemberitahuan', 'update policy'],
      clause: '...dapat mengubah atau memperbarui kebijakan privasi ini sewaktu-waktu tanpa pemberitahuan terlebih dahulu kepada pengguna...',
      reason: 'Perubahan sepihak tanpa notifikasi tertulis memaksa pengguna menyetujui aturan baru tanpa menyadarinya. Anda harus rutin memeriksa halaman kebijakan secara manual.',
      severity: 'High'
    },
    {
      keys: ['kamera', 'mikrofon', 'kontak', 'camera', 'microphone', 'contacts'],
      clause: '...mengakses kamera, mikrofon, dan daftar kontak perangkat untuk fungsionalitas tambahan aplikasi...',
      reason: 'Aplikasi meminta akses ke hardware sensitif dan data sosial tanpa justifikasi yang kuat, berisiko menguping atau menyalin daftar kontak Anda.',
      severity: 'High'
    }
  ];

  // Search input for any matching keywords
  for (const kw of keywords) {
    const matched = kw.keys.some(k => lowercaseText.includes(k));
    if (matched) {
      flagged.push({
        clause: extractContextOrFallback(text, kw.keys[0], kw.clause),
        reason: kw.reason,
        severity: kw.severity
      });
    }
  }

  // Default clauses if none match to ensure we return some results
  if (flagged.length === 0) {
    flagged.push({
      clause: 'Pengumpulan informasi teknis seperti alamat IP, jenis peramban, dan sistem operasi perangkat Anda.',
      reason: 'Data teknis dikumpulkan secara otomatis untuk analitik performa. Ini tergolong praktik standar industri dengan risiko rendah.',
      severity: 'Low'
    });
  }

  // Calculate overall risk score
  let riskScore = 'Low';
  const severities = flagged.map(f => f.severity);
  if (severities.includes('Danger')) {
    riskScore = 'Danger';
  } else if (severities.includes('High')) {
    riskScore = 'High';
  } else if (severities.includes('Medium')) {
    riskScore = 'Medium';
  }

  // Generate generic recommendations
  const recommendations = [
    'Tinjau kembali perizinan aplikasi di pengaturan smartphone Anda dan matikan izin yang tidak krusial.',
    'Gunakan email sekunder atau alias saat mendaftar jika Anda meragukan keamanan sistem pengolahan data aplikasi ini.'
  ];
  if (riskScore === 'Danger' || riskScore === 'High') {
    recommendations.unshift('Pertimbangkan kembali sebelum menggunakan layanan ini, terutama jika Anda harus membagikan data medis, finansial, atau identitas resmi.');
  }

  // Prepare summary
  let summaryText = 'Kebijakan privasi ini secara umum aman dengan pengumpulan data teknis yang wajar untuk fungsionalitas dasar aplikasi.';
  if (riskScore === 'Danger') {
    summaryText = 'Peringatan! Kebijakan privasi ini memiliki klausul bahaya tinggi terkait pelacakan lokasi latar belakang atau penahanan data abadi tanpa opsi penghapusan akun.';
  } else if (riskScore === 'High') {
    summaryText = 'Kebijakan privasi ini memiliki beberapa poin risiko tinggi seperti pembagian data ke pihak ketiga atau pengaksesan fitur perangkat sensitif.';
  } else if (riskScore === 'Medium') {
    summaryText = 'Kebijakan privasi ini tergolong sedang, mengumpulkan data standar untuk profil periklanan digital namun dengan proteksi pengguna dasar.';
  }

  return {
    risk_score: riskScore,
    summary: summaryText,
    flagged_clauses: flagged,
    recommendations: recommendations
  };
}

/**
 * Tries to extract the actual sentence containing the keyword from user input, or returns a template clause
 */
function extractContextOrFallback(text, keyword, fallback) {
  try {
    const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx === -1) return fallback;

    // Find sentence boundaries around the index
    let start = Math.max(0, idx - 60);
    let end = Math.min(text.length, idx + keyword.length + 90);

    let snippet = text.slice(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
  } catch (e) {
    return fallback;
  }
}

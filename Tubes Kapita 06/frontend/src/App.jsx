import { useState, useEffect } from 'react';
import { Shield, History, Sun, Moon } from 'lucide-react';

// Data and Helpers
import { SAMPLE_POLICIES } from './data/samplePolicies';
import { formatDate, getPolicyTitle } from './utils/helpers';

// Components
import PolicyInput from './components/PolicyInput';
import ScanDashboard from './components/ScanDashboard';
import HistoryDrawer from './components/HistoryDrawer';
import CustomModal from './components/CustomModal';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, Danger, High_Medium, Low
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking', provider: 'unknown' });
  const [openAccordionIdx, setOpenAccordionIdx] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info' | 'success' | 'warning' | 'error' | 'confirm'
    onConfirm: null,
    onCancel: null
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Loading screen steps
  const loadingSteps = [
    "Menerima dokumen kebijakan privasi...",
    "Membaca isi teks dan mendeteksi bahasa...",
    "Memindai kata kunci sensitif hukum...",
    "Mengekstrak klausul berisiko menggunakan AI...",
    "Menyusun analisis risiko dan rekomendasi...",
    "Membuat ringkasan bahasa awam..."
  ];

  // Fetch API Health & Config, and Scan History from DB on Mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/health');
        if (res.ok) {
          setBackendHealth({ status: 'connected', provider: 'Gemini/Mock Server' });
        } else {
          setBackendHealth({ status: 'disconnected', provider: 'offline' });
        }
      } catch {
        setBackendHealth({ status: 'disconnected', provider: 'offline' });
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/history');
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error('Gagal mengambil riwayat:', err);
      }
    };

    checkHealth();
    fetchHistory();
  }, []);

  // Set up loading simulation interval
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [loading, loadingSteps.length]);

  const showAlert = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      onCancel: null
    });
  };

  const showConfirm = (title, message, onConfirm, type = 'confirm') => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        if (onConfirm) onConfirm();
      },
      onCancel: () => setModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleSelectSample = (sample) => {
    setInputText(sample.text);
    const textarea = document.getElementById('policy-input');
    if (textarea) {
      textarea.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputText || inputText.trim().length < 50) {
      showAlert('Input Terlalu Pendek', 'Teks kebijakan privasi terlalu pendek! Minimal masukkan 50 karakter.', 'warning');
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setAnalysisResult(null);
    setOpenAccordionIdx(null);
    setActiveFilter('ALL');

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server gagal merespon.');
      }

      const data = await response.json();
      setAnalysisResult(data.result);

      const newHistoryItem = {
        id: data.id,
        timestamp: data.created_at,
        title: data.title,
        text: data.text,
        result: data.result
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(updatedHistory);

    } catch (err) {
      console.error(err);
      showAlert('Gagal Menganalisis', `${err.message}. Pastikan server backend sudah berjalan di port 5000.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!analysisResult) return;
    
    let reportText = `LAPORAN PRIVASI: ${getPolicyTitle(inputText)}\n`;
    reportText += `Tanggal Pindai: ${formatDate(new Date())}\n`;
    reportText += `Skor Risiko: ${analysisResult.risk_score.toUpperCase()}\n\n`;
    reportText += `RINGKASAN:\n${analysisResult.summary}\n\n`;
    reportText += `KLAUSUL BERISIKO YANG DIIDENTIFIKASI:\n`;
    
    analysisResult.flagged_clauses.forEach((item, index) => {
      reportText += `${index + 1}. [${item.severity.toUpperCase()}] Klausul: "${item.clause}"\n`;
      reportText += `   Alasan: ${item.reason}\n\n`;
    });
    
    reportText += `REKOMENDASI:\n`;
    analysisResult.recommendations.forEach((rec) => {
      reportText += `- ${rec}\n`;
    });

    navigator.clipboard.writeText(reportText);
    showAlert('Berhasil Disalin', 'Laporan berhasil disalin ke clipboard!', 'success');
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    let reportText = `=== LAPORAN SCAN PRIVASI POLICY ===\n`;
    reportText += `Sumber: ${getPolicyTitle(inputText)}\n`;
    reportText += `Waktu Pindai: ${formatDate(new Date())}\n`;
    reportText += `Skor Risiko Keseluruhan: ${analysisResult.risk_score.toUpperCase()}\n`;
    reportText += `===================================\n\n`;
    reportText += `[RINGKASAN EKSEKUTIF]\n`;
    reportText += `${analysisResult.summary}\n\n`;
    reportText += `[DAFTAR KLAUSUL BERISIKO]\n`;
    
    analysisResult.flagged_clauses.forEach((item, index) => {
      reportText += `${index + 1}. [Tingkat: ${item.severity}] \n`;
      reportText += `   Kutipan Asli: "${item.clause}"\n`;
      reportText += `   Penjelasan Risiko: ${item.reason}\n\n`;
    });
    
    reportText += `[REKOMENDASI TINDAKAN]\n`;
    analysisResult.recommendations.forEach((rec, index) => {
      reportText += `${index + 1}. ${rec}\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Laporan_Privasi_${getPolicyTitle(inputText).substring(0, 15).replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadHistoryItem = (item) => {
    setInputText(item.text);
    setAnalysisResult(item.result);
    setShowHistory(false);
  };

  const clearHistory = () => {
    showConfirm(
      'Hapus Riwayat',
      'Apakah Anda yakin ingin menghapus seluruh riwayat pindaian?',
      async () => {
        try {
          const res = await fetch('http://localhost:5000/api/history', {
            method: 'DELETE'
          });
          if (res.ok) {
            setHistory([]);
          } else {
            showAlert('Gagal Menghapus', 'Gagal menghapus riwayat dari database.', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Gagal Menghapus', 'Terjadi kesalahan saat menghubungi server.', 'error');
        }
      },
      'warning'
    );
  };

  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    showConfirm(
      'Hapus Item Riwayat',
      'Apakah Anda yakin ingin menghapus item riwayat ini?',
      async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/history/${id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            const updatedHistory = history.filter(item => item.id !== id);
            setHistory(updatedHistory);
          } else {
            showAlert('Gagal Menghapus', 'Gagal menghapus item riwayat dari database.', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Gagal Menghapus', 'Terjadi kesalahan saat menghubungi server.', 'error');
        }
      },
      'warning'
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col justify-between transition-colors duration-300">
      {/* Top Banner / Navbar */}
      <header className="glass-panel sticky top-0 z-50 border-b border-brand-panel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-slate-950 to-slate-800 dark:from-slate-50 dark:to-slate-200 p-2 rounded-xl text-white dark:text-slate-950 shadow-md shadow-brand-accent/10">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent pb-1">
                PRIVACY SCANNER
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Server Status Indicators */}
            <div className="flex items-center space-x-2 bg-brand-panel px-3 py-1.5 rounded-full border border-brand-border text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${backendHealth.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-brand-muted font-medium">
                {backendHealth.status === 'connected' ? 'Server Aktif' : 'Server Off / Demo'}
              </span>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 sm:p-2 bg-brand-panel hover:bg-brand-accent-light text-brand-text border border-brand-border rounded-lg transition-colors duration-200 flex items-center justify-center cursor-pointer"
              title={theme === 'dark' ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-800" />}
            </button>

            {/* View History Button */}
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1.5 bg-brand-accent-light hover:bg-brand-accent/10 text-brand-text border border-brand-accent-border hover:border-brand-accent px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200"
            >
              <History className="w-4 h-4 text-brand-text" />
              <span className="hidden sm:inline">Riwayat ({history.length})</span>
              <span className="inline sm:hidden">({history.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Intro Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-slate-100 dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent pb-2 mb-2">
            Privacy Policy Risk Analyzer
          </h1>
          <p className="text-brand-muted text-base sm:text-lg">
            Temukan klausul berbahaya yang tersembunyi dalam dokumen hukum secara instan.
            Paste kebijakan privasi di bawah ini untuk mendapatkan laporan risiko transparan dalam Bahasa Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Input Form and Samples */}
          <section className="lg:col-span-5">
            <PolicyInput
              inputText={inputText}
              setInputText={setInputText}
              loading={loading}
              onScan={handleScan}
              onClearInput={() => setInputText('')}
              samplePolicies={SAMPLE_POLICIES}
              onSelectSample={handleSelectSample}
            />
          </section>

          {/* RIGHT PANEL: Scanner Output Dashboard */}
          <section className="lg:col-span-7">
            <ScanDashboard
              loading={loading}
              loadingSteps={loadingSteps}
              loadingStep={loadingStep}
              analysisResult={analysisResult}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              openAccordionIdx={openAccordionIdx}
              setOpenAccordionIdx={setOpenAccordionIdx}
              onCopyReport={handleCopyReport}
              onDownloadReport={handleDownloadReport}
            />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-brand-panel-border py-6 text-center text-xs text-brand-muted glass-panel mt-12">
        <p>© 2026 - Kapita Selekta RPL Kelompok 6 (Privacy Policy Risk Scanner)</p>
      </footer>

      {/* SIDE DRAWER: HISTORY LIST */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        onLoadHistoryItem={loadHistoryItem}
        onDeleteHistoryItem={deleteHistoryItem}
        onClearHistory={clearHistory}
      />

      {/* CUSTOM MODAL */}
      <CustomModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </div>
  );
}

import { 
  Shield, 
  Check, 
  Loader2, 
  Info, 
  CheckCircle, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Download 
} from 'lucide-react';
import { 
  getRiskColorClass, 
  getRiskBadgeColor, 
  getRiskIcon, 
  getRiskDescription 
} from '../utils/helpers';

export default function ScanDashboard({
  loading,
  loadingSteps,
  loadingStep,
  analysisResult,
  activeFilter,
  setActiveFilter,
  openAccordionIdx,
  setOpenAccordionIdx,
  onCopyReport,
  onDownloadReport
}) {
  // 1. INITIAL EMPTY STATE
  if (!loading && !analysisResult) {
    return (
      <div className="glass-panel border-dashed border-brand-border rounded-3xl p-12 text-center h-[520px] flex flex-col items-center justify-center space-y-4">
        <div className="bg-brand-bg p-4 rounded-2xl border border-brand-border text-brand-text">
          <Shield className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-brand-text">
          Siap Melakukan Pemindaian
        </h3>
        <p className="text-brand-muted text-sm max-w-md mx-auto">
          Tempelkan teks kebijakan privasi di panel kiri atau pilih salah satu contoh cepat untuk melihat analisis risiko instan.
        </p>
        <div className="flex items-center space-x-2 text-xs text-brand-muted pt-4">
          <Check className="w-4 h-4 text-brand-text" />
          <span>Deteksi otomatis klausul berbahaya</span>
          <span className="text-brand-muted/40">•</span>
          <Check className="w-4 h-4 text-brand-text" />
          <span>Ringkasan bahasa awam</span>
        </div>
      </div>
    );
  }

  // 2. SCANNING ACTIVE LOADING SCREEN
  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center h-[520px] flex flex-col items-center justify-center space-y-8 animate-pulse">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-brand-accent-light blur-xl animate-ping"></div>
          <div className="relative bg-brand-bg border border-brand-border p-6 rounded-full text-brand-text">
            <Loader2 className="w-12 h-12 animate-spin" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-brand-text">
            Memproses Analisis AI...
          </h3>
          <div className="h-2 w-48 bg-brand-border rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-slate-950 to-slate-700 dark:from-slate-100 dark:to-slate-300 rounded-full transition-all duration-500"
              style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-brand-text text-sm font-medium tracking-wide animate-bounce">
            {loadingSteps[loadingStep]}
          </p>
        </div>
      </div>
    );
  }

  // 3. SCANNING COMPLETED: DISPLAY DASHBOARD
  const filteredClauses = analysisResult.flagged_clauses.filter(item => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'Danger') return item.severity === 'Danger';
    if (activeFilter === 'High_Medium') return item.severity === 'High' || item.severity === 'Medium';
    if (activeFilter === 'Low') return item.severity === 'Low';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-305">
      {/* Score Overview Card */}
      <div className={`glass-panel border-t-4 p-6 rounded-2xl flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 transition duration-300 ${getRiskColorClass(analysisResult.risk_score)}`}>
        <div className="flex-shrink-0 bg-brand-bg p-4 rounded-xl border border-brand-border">
          {getRiskIcon(analysisResult.risk_score)}
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3">
            <h3 className="text-lg font-semibold text-brand-text">
              Skor Risiko Kebijakan:
            </h3>
            <span className={`px-4 py-1 text-xs font-bold uppercase rounded-full tracking-wider ${getRiskBadgeColor(analysisResult.risk_score)}`}>
              {analysisResult.risk_score}
            </span>
          </div>
          <p className="text-sm text-brand-text leading-relaxed opacity-90">
            {getRiskDescription(analysisResult.risk_score)}
          </p>
        </div>
      </div>

      {/* Executive Summary Panel */}
      <div className="glass-panel p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-semibold text-brand-text tracking-wider uppercase flex items-center space-x-2">
          <Info className="w-4 h-4 text-brand-text" />
          <span>Ringkasan Eksekutif (Bahasa Awam)</span>
        </h3>
        <p className="text-brand-text text-sm leading-relaxed font-medium">
          {analysisResult.summary}
        </p>
      </div>

      {/* Action Recommendations */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-brand-text tracking-wider uppercase flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-brand-text" />
          <span>Rekomendasi Tindakan</span>
        </h3>
        <ul className="grid grid-cols-1 gap-2.5">
          {analysisResult.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start space-x-3 text-brand-text text-sm bg-brand-bg border border-brand-border p-3 rounded-xl">
              <span className="flex-shrink-0 bg-brand-accent-light text-brand-text w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs">
                {index + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Filterable List of Flagged Clauses */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 border-b border-brand-border pb-4">
          <h3 className="text-sm font-semibold text-brand-text tracking-wider uppercase">
            Klausul Berisiko Terdeteksi ({analysisResult.flagged_clauses.length})
          </h3>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Semua', filter: 'ALL' },
              { label: 'Danger', filter: 'Danger' },
              { label: 'High/Med', filter: 'High_Medium' },
              { label: 'Low', filter: 'Low' },
            ].map((item) => (
              <button
                key={item.filter}
                onClick={() => {
                  setActiveFilter(item.filter);
                  setOpenAccordionIdx(null);
                }}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition duration-200 cursor-pointer ${
                  activeFilter === item.filter
                    ? 'bg-brand-accent text-brand-bg border-brand-accent'
                    : 'bg-brand-bg text-brand-muted border-brand-border hover:text-brand-text hover:border-brand-accent-border'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Accordion List */}
        {filteredClauses.length === 0 ? (
          <div className="py-8 text-center text-brand-muted text-sm border border-dashed border-brand-border rounded-xl">
            Tidak ada klausul dengan filter ini.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClauses.map((item, idx) => {
              const isOpen = openAccordionIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-brand-bg border border-brand-border rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Header */}
                  <button
                    onClick={() => setOpenAccordionIdx(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between hover:bg-brand-accent-light transition duration-150 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 pr-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider ${getRiskBadgeColor(item.severity)}`}>
                        {item.severity}
                      </span>
                      <p className="text-xs font-semibold text-brand-text line-clamp-1 leading-relaxed">
                        {item.clause}
                      </p>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-brand-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-brand-muted flex-shrink-0" />}
                  </button>

                  {/* Content */}
                  {isOpen && (
                    <div className="p-4 bg-brand-panel border-t border-brand-border space-y-3">
                      <div>
                        <h4 className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
                          Kutipan Asli Dokumen:
                        </h4>
                        <p className="text-xs text-brand-text italic bg-brand-bg border-l-2 border-brand-accent/50 p-2.5 rounded-r-lg leading-relaxed">
                          "{item.clause}"
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold text-brand-muted uppercase tracking-wider mb-1">
                          Penjelasan Risiko (Bahasa Awam):
                        </h4>
                        <p className="text-xs text-brand-text leading-relaxed font-medium">
                          {item.reason}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions / Export Panel */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onCopyReport}
          className="flex-1 bg-brand-panel border border-brand-border hover:border-brand-accent text-brand-text font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          <Copy className="w-4 h-4 text-brand-text" />
          <span>Salin Laporan</span>
        </button>
        <button
          onClick={onDownloadReport}
          className="flex-1 bg-brand-panel border border-brand-border hover:border-brand-accent text-brand-text font-medium py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center space-x-2 text-sm cursor-pointer"
        >
          <Download className="w-4 h-4 text-brand-text" />
          <span>Unduh Laporan (.TXT)</span>
        </button>
      </div>
    </div>
  );
}

import { Shield, Loader2, RotateCcw, ArrowRight } from 'lucide-react';

export default function PolicyInput({
  inputText,
  setInputText,
  loading,
  onScan,
  onClearInput,
  samplePolicies,
  onSelectSample
}) {
  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="glass-panel p-6 rounded-2xl glow-indigo">
        <h2 className="text-lg font-semibold mb-4 text-brand-text flex items-center space-x-2">
          <span>Input Kebijakan Privasi</span>
        </h2>

        <form onSubmit={onScan} className="space-y-4">
          <div className="relative">
            <textarea
              id="policy-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tempelkan (paste) teks dokumen kebijakan privasi aplikasi/website di sini..."
              rows={12}
              className="w-full bg-brand-bg border border-brand-border focus:border-brand-accent rounded-xl p-4 text-sm text-brand-text placeholder-brand-muted/60 focus:ring-1 focus:ring-brand-accent outline-none transition duration-200 resize-y"
            />
            <div className="absolute bottom-3 right-3 text-xs text-brand-muted">
              {inputText.length} karakter
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading || inputText.trim().length < 50}
              className="flex-grow bg-gradient-to-r from-slate-950 to-slate-800 dark:from-slate-50 dark:to-slate-200 hover:from-slate-800 hover:to-slate-700 dark:hover:from-white dark:hover:to-slate-100 text-white dark:text-slate-950 font-medium py-3 px-4 rounded-xl shadow-lg shadow-brand-accent/10 hover:shadow-brand-accent/20 transition duration-200 disabled:from-brand-border disabled:to-brand-border disabled:text-brand-muted disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Menganalisis Dokumen...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Scan Risiko Privacy</span>
                </>
              )}
            </button>

            {inputText && (
              <button
                type="button"
                onClick={onClearInput}
                className="bg-brand-panel border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-text p-3 rounded-xl transition duration-200 cursor-pointer"
                title="Bersihkan Input"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Quick Sample Selector */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-panel-border">
        <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">
          Pilih Contoh Kebijakan (Coba Instan)
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {samplePolicies.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSample(sample)}
              className="text-left bg-brand-bg hover:bg-brand-accent-light border border-brand-border hover:border-brand-accent-border p-3.5 rounded-xl transition duration-200 group flex items-start justify-between cursor-pointer"
            >
              <div className="space-y-1 pr-4">
                <p className="text-xs font-semibold text-brand-text group-hover:text-brand-accent">
                  {sample.name}
                </p>
                <p className="text-[11px] text-brand-muted line-clamp-1">
                  {sample.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-text group-hover:translate-x-1 transition duration-200 flex-shrink-0 mt-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

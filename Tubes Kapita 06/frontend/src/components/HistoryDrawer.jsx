import { History, Trash2 } from 'lucide-react';
import { formatDate, getRiskBadgeColor } from '../utils/helpers';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onLoadHistoryItem,
  onDeleteHistoryItem,
  onClearHistory
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-filter backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-md bg-brand-panel border-l border-brand-border p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="space-y-6 flex-grow overflow-y-auto">
          <div className="flex items-center justify-between border-b border-brand-border pb-4">
            <h3 className="font-bold text-lg text-brand-text flex items-center space-x-2">
              <History className="w-5 h-5 text-brand-text" />
              <span>Riwayat Pindaian</span>
            </h3>
            <button 
              onClick={onClose}
              className="text-brand-muted hover:text-brand-text text-sm font-semibold cursor-pointer"
            >
              Tutup
            </button>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-brand-muted text-sm">
              Belum ada riwayat pemindaian.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div 
                  key={item.id}
                  className="bg-brand-bg border border-brand-border hover:border-brand-accent p-4 rounded-xl transition duration-150 flex flex-col space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-brand-text line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-brand-muted mt-0.5">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider ${getRiskBadgeColor(item.result.risk_score)}`}>
                      {item.result.risk_score}
                    </span>
                  </div>
                  <div className="flex space-x-2 pt-1 border-t border-brand-border/40">
                    <button
                      onClick={() => onLoadHistoryItem(item)}
                      className="flex-grow bg-brand-accent-light hover:bg-brand-accent/10 text-brand-text text-[11px] font-medium py-1.5 rounded-lg border border-brand-accent-border hover:border-brand-accent transition duration-150 cursor-pointer"
                    >
                      Muat Hasil
                    </button>
                    <button
                      onClick={(e) => onDeleteHistoryItem(item.id, e)}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:border-rose-500/40 p-1.5 rounded-lg transition duration-150 cursor-pointer"
                      title="Hapus Riwayat Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="border-t border-brand-border pt-4 mt-6">
            <button
              onClick={onClearHistory}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition duration-200 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Semua Riwayat</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

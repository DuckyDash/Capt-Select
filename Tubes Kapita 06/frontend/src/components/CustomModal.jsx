import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function CustomModal({ isOpen, title, message, type, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl scale-in duration-200 border border-brand-panel-border text-brand-text">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 p-2.5 rounded-xl bg-brand-bg border border-brand-border">
            {type === 'success' && <CheckCircle className="w-6 h-6 text-emerald-500" />}
            {type === 'error' && <AlertCircle className="w-6 h-6 text-rose-500" />}
            {type === 'warning' && <AlertTriangle className="w-6 h-6 text-amber-500" />}
            {(type === 'info' || type === 'confirm') && <Info className="w-6 h-6 text-brand-text" />}
          </div>
          <div className="flex-grow space-y-1.5">
            <h3 className="font-bold text-lg text-brand-text leading-tight">
              {title}
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="bg-brand-bg hover:bg-brand-accent-light border border-brand-border text-brand-text font-medium py-2 px-4 rounded-xl text-xs transition duration-150 cursor-pointer"
            >
              Batal
            </button>
          )}
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-slate-950 to-slate-800 dark:from-slate-50 dark:to-slate-200 hover:from-slate-900 hover:to-slate-700 dark:hover:from-white dark:hover:to-slate-100 text-white dark:text-slate-950 font-medium py-2 px-5 rounded-xl text-xs transition duration-150 shadow-md shadow-brand-accent/5 cursor-pointer"
          >
            {onCancel ? 'Ya, Lanjutkan' : 'Mengerti'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Info 
} from 'lucide-react';

// Helper to format date
export const formatDate = (isoString) => {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper to generate unique ID
export const generateUniqueId = () => Date.now().toString();

// Helper to get policy title
export const getPolicyTitle = (text) => {
  if (!text) return '';
  const firstLine = text.split('\n')[0].trim().replace(/[#:*_]/g, '');
  if (firstLine && firstLine.length > 5 && firstLine.length < 50) {
    return firstLine;
  }
  return `Kebijakan Privasi (${formatDate(new Date())})`;
};

// Helper to get risk color classes
export const getRiskColorClass = (score) => {
  switch (score) {
    case 'Danger': return 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/35';
    case 'High': return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/35';
    case 'Medium': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/35';
    case 'Low': return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/35';
    default: return 'bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/35';
  }
};

// Helper to get risk badge color
export const getRiskBadgeColor = (score) => {
  switch (score) {
    case 'Danger': return 'bg-rose-600 text-white';
    case 'High': return 'bg-amber-600 text-slate-900 font-semibold';
    case 'Medium': return 'bg-yellow-500 text-slate-900 font-semibold';
    case 'Low': return 'bg-emerald-600 text-white';
    default: return 'bg-slate-600 text-white';
  }
};

// Helper to get risk icon (contains JSX)
export const getRiskIcon = (score) => {
  switch (score) {
    case 'Danger': return <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />;
    case 'High': return <AlertCircle className="w-8 h-8 text-amber-500" />;
    case 'Medium': return <Info className="w-8 h-8 text-yellow-500" />;
    case 'Low': return <CheckCircle className="w-8 h-8 text-emerald-500" />;
    default: return <Shield className="w-8 h-8 text-slate-400" />;
  }
};

// Helper to get risk description
export const getRiskDescription = (score) => {
  switch (score) {
    case 'Danger': return 'Sangat Berbahaya. Kebijakan ini memiliki klausul kritis yang merugikan hak privasi Anda secara signifikan. Disarankan untuk tidak menggunakan layanan ini.';
    case 'High': return 'Risiko Tinggi. Terdapat beberapa praktik pengumpulan data agresif dan pembagian data ke pihak ketiga secara bebas. Baca klausul dengan saksama.';
    case 'Medium': return 'Risiko Sedang. Kebijakan standar untuk profiling iklan digital dan cookies. Masih aman digunakan dengan pembatasan izin yang ketat.';
    case 'Low': return 'Risiko Rendah / Aman. Kebijakan privasi transparan dan melindungi hak-hak pengguna dengan baik sesuai standar UU PDP.';
    default: return '';
  }
};

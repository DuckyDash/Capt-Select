import { analyzePrivacyPolicy } from '../services/aiService.js';
import { supabase } from '../services/supabaseClient.js';

// Utility to generate policy title
function getPolicyTitle(text) {
  const firstLine = text.split('\n')[0].trim().replace(/[#:*_]/g, '');
  if (firstLine && firstLine.length > 5 && firstLine.length < 50) {
    return firstLine;
  }
  const date = new Date().toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `Kebijakan Privasi (${date})`;
}

export const analyzePolicy = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Parameter "text" tidak boleh kosong.' });
  }

  try {
    console.log(`[API] Menerima request analisis privacy policy (${text.length} karakter)...`);
    const startTime = Date.now();
    const result = await analyzePrivacyPolicy(text);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`[API] Analisis selesai dalam ${duration} detik. Menyimpan ke database...`);
    
    const title = getPolicyTitle(text);
    
    // Insert into Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('scan_history')
      .insert([
        {
          title,
          input_text: text,
          risk_score: result.risk_score,
          summary: result.summary,
          flagged_clauses: result.flagged_clauses,
          recommendations: result.recommendations
        }
      ])
      .select();

    if (dbError) {
      console.error('[Supabase Save Error]', dbError.message);
    } else {
      console.log('[Supabase] Berhasil menyimpan riwayat scan.');
    }

    const savedRecord = dbData && dbData[0] ? dbData[0] : null;

    // Return the response structured as frontend expects
    res.json({
      id: savedRecord ? savedRecord.id : Date.now().toString(),
      created_at: savedRecord ? savedRecord.created_at : new Date().toISOString(),
      title: savedRecord ? savedRecord.title : title,
      text: text,
      result: {
        risk_score: result.risk_score,
        summary: result.summary,
        flagged_clauses: result.flagged_clauses,
        recommendations: result.recommendations
      }
    });

  } catch (error) {
    console.error('[API Error]', error.message);
    res.status(500).json({ error: error.message || 'Terjadi kesalahan internal pada server.' });
  }
};

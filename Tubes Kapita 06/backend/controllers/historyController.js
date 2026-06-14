import { supabase } from '../services/supabaseClient.js';

// Get Scan History from Supabase
export const getHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10); // Matches frontend's limit of 10 items

    if (error) throw error;

    // Map database columns to the format the frontend expects
    const formattedHistory = data.map(item => ({
      id: item.id,
      timestamp: item.created_at,
      title: item.title,
      text: item.input_text,
      result: {
        risk_score: item.risk_score,
        summary: item.summary,
        flagged_clauses: item.flagged_clauses,
        recommendations: item.recommendations
      }
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('[Supabase Fetch Error]', error.message);
    res.status(500).json({ error: 'Gagal mengambil riwayat dari database.' });
  }
};

// Delete specific Scan History item
export const deleteHistoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('scan_history')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Riwayat pindaian berhasil dihapus.' });
  } catch (error) {
    console.error('[Supabase Delete Item Error]', error.message);
    res.status(500).json({ error: 'Gagal menghapus item riwayat.' });
  }
};

// Clear all Scan History
export const clearHistory = async (req, res) => {
  try {
    const { error } = await supabase
      .from('scan_history')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows

    if (error) throw error;
    res.json({ success: true, message: 'Seluruh riwayat pindaian berhasil dihapus.' });
  } catch (error) {
    console.error('[Supabase Delete All Error]', error.message);
    res.status(500).json({ error: 'Gagal menghapus seluruh riwayat.' });
  }
};

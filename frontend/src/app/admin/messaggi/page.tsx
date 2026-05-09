'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api.client';
import { Mail, Check, Archive } from 'lucide-react';
import { motion } from 'framer-motion';

interface Messaggio {
  id: string;
  nome: string;
  email: string;
  oggetto: string | null;
  messaggio: string;
  stato: string;
  createdAt: string;
}

const statoColors: Record<string, string> = {
  nuovo: '#F5A623',
  letto: '#F9F9F9',
  risposto: '#22c55e',
  archiviato: '#3A3A3A',
};

export default function AdminMessaggiPage() {
  const [messaggi, setMessaggi] = useState<Messaggio[]>([]);
  const [selected, setSelected] = useState<Messaggio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/messaggi')
      .then(({ data }) => setMessaggi(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStato = async (id: string, stato: string) => {
    await apiClient.patch(`/admin/messaggi/${id}`, { stato });
    setMessaggi((prev) => prev.map((m) => m.id === id ? { ...m, stato } : m));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, stato } : null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-hornets-white uppercase">Messaggi</h1>
        <p className="text-white/40 text-sm mt-1">
          {messaggi.filter((m) => m.stato === 'nuovo').length} messaggi non letti
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
        {/* List */}
        <div className="lg:col-span-1 bg-hornets-black-card border border-white/5 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-hornets-yellow border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messaggi.length === 0 ? (
            <div className="text-center py-12 text-white/30">Nessun messaggio</div>
          ) : (
            messaggi.map((msg) => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); updateStato(msg.id, 'letto'); }}
                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/3 transition-colors ${
                  selected?.id === msg.id ? 'bg-hornets-yellow/5 border-l-2 border-l-hornets-yellow' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-hornets-white text-sm font-medium truncate">{msg.nome}</span>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 ml-2"
                    style={{ backgroundColor: statoColors[msg.stato] || '#3A3A3A' }}
                  />
                </div>
                <p className="text-white/40 text-xs truncate mb-1">{msg.oggetto || msg.email}</p>
                <p className="text-white/25 text-xs">
                  {new Date(msg.createdAt).toLocaleDateString('it-IT')}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 bg-hornets-black-card border border-white/5 p-6">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-hornets-white font-semibold text-lg">{selected.nome}</h2>
                  <a href={`mailto:${selected.email}`} className="text-hornets-yellow text-sm hover:underline">
                    {selected.email}
                  </a>
                  {selected.oggetto && (
                    <p className="text-white/40 text-sm mt-1">{selected.oggetto}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStato(selected.id, 'risposto')}
                    className="flex items-center gap-1.5 text-xs border border-white/10 hover:border-hornets-yellow/30 text-white/40 hover:text-hornets-yellow px-3 py-2 transition-colors"
                  >
                    <Check size={13} /> Risposto
                  </button>
                  <button
                    onClick={() => updateStato(selected.id, 'archiviato')}
                    className="flex items-center gap-1.5 text-xs border border-white/10 hover:border-white/20 text-white/40 px-3 py-2 transition-colors"
                  >
                    <Archive size={13} /> Archivia
                  </button>
                </div>
              </div>

              <div className="bg-hornets-black border border-white/5 p-5 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                {selected.messaggio}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a
                  href={`mailto:${selected.email}`}
                  className="btn-outline text-xs px-5 py-2.5 flex items-center gap-2"
                >
                  <Mail size={13} /> Rispondi via email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20 py-24">
              <Mail size={40} className="mb-3" />
              <p className="text-sm">Seleziona un messaggio per visualizzarlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

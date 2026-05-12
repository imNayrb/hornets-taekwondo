'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api.client';
import { Mail, Check, Archive, Inbox } from 'lucide-react';
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

const statoMeta: Record<string, { label: string; color: string }> = {
  nuovo: { label: 'Nuovo', color: '#F5A623' },
  letto: { label: 'Letto', color: '#60a5fa' },
  risposto: { label: 'Risposto', color: '#34d399' },
  archiviato: { label: 'Archiviato', color: '#4b5563' },
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

  const nuoviCount = messaggi.filter((m) => m.stato === 'nuovo').length;

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-white text-2xl">Messaggi</h1>
          {nuoviCount > 0 && (
            <span className="bg-hornets-yellow/10 text-hornets-yellow text-xs font-bold px-2.5 py-1 rounded-full">
              {nuoviCount} nuovi
            </span>
          )}
        </div>
        <p className="text-white/30 text-sm mt-1">Richieste di contatto e prenotazioni prova</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: '600px' }}>
        {/* Lista */}
        <div className="lg:col-span-2 bg-hornets-black-card border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <p className="admin-section-label">Tutti i messaggi</p>
          </div>
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-hornets-yellow border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messaggi.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-white/20">
                <Inbox size={32} className="mb-3" />
                <p className="text-sm">Nessun messaggio</p>
              </div>
            ) : (
              messaggi.map((msg) => {
                const meta = statoMeta[msg.stato] || statoMeta.letto;
                return (
                  <button
                    key={msg.id}
                    onClick={() => { setSelected(msg); if (msg.stato === 'nuovo') updateStato(msg.id, 'letto'); }}
                    className={`w-full text-left px-4 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                      selected?.id === msg.id ? 'bg-hornets-yellow/[0.06] border-l-2 border-l-hornets-yellow' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-semibold truncate">{msg.nome}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                        style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-white/40 text-xs truncate mb-0.5">{msg.oggetto || msg.email}</p>
                    <p className="text-white/20 text-[10px]">
                      {new Date(msg.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Dettaglio */}
        <div className="lg:col-span-3 bg-hornets-black-card border border-white/[0.06] rounded-2xl p-6">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg">{selected.nome}</h2>
                  <a href={`mailto:${selected.email}`} className="text-hornets-yellow text-sm hover:underline">
                    {selected.email}
                  </a>
                  {selected.oggetto && (
                    <p className="text-white/40 text-sm mt-1">{selected.oggetto}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => updateStato(selected.id, 'risposto')}
                    className="flex items-center gap-1.5 text-xs border border-white/[0.08] hover:border-green-400/30 text-white/40 hover:text-green-400 px-3 py-2 rounded-xl transition-all"
                  >
                    <Check size={12} /> Risposto
                  </button>
                  <button
                    onClick={() => updateStato(selected.id, 'archiviato')}
                    className="flex items-center gap-1.5 text-xs border border-white/[0.08] hover:border-white/20 text-white/40 px-3 py-2 rounded-xl transition-all"
                  >
                    <Archive size={12} /> Archivia
                  </button>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 text-white/70 text-sm leading-relaxed whitespace-pre-wrap min-h-[200px]">
                {selected.messaggio}
              </div>

              <div className="mt-5">
                <a
                  href={`mailto:${selected.email}`}
                  className="inline-flex items-center gap-2 border border-white/[0.08] hover:border-hornets-yellow/30 text-white/50 hover:text-hornets-yellow text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  <Mail size={14} /> Rispondi via email
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/15 py-24">
              <Mail size={40} className="mb-3" />
              <p className="text-sm">Seleziona un messaggio per leggerlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

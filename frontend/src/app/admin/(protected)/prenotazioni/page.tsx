'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api.client';
import { Calendar, Loader2, Phone, Mail } from 'lucide-react';

interface Prenotazione {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string | null;
  messaggio: string | null;
  stato: string;
  createdAt: string;
  corso: { nome: string } | null;
}

const statoMeta: Record<string, { label: string; color: string }> = {
  nuova: { label: 'Nuova', color: '#F5A623' },
  confermata: { label: 'Confermata', color: '#34d399' },
  completata: { label: 'Completata', color: '#60a5fa' },
  annullata: { label: 'Annullata', color: '#f87171' },
};

export default function AdminPrenotazioniPage() {
  const [prenotazioni, setPrenotazioni] = useState<Prenotazione[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/prenotazioni')
      .then(({ data }) => setPrenotazioni(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const nuoveCount = prenotazioni.filter((p) => p.stato === 'nuova').length;

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-white text-2xl">Prenotazioni</h1>
          {nuoveCount > 0 && (
            <span className="bg-hornets-yellow/10 text-hornets-yellow text-xs font-bold px-2.5 py-1 rounded-full">
              {nuoveCount} nuove
            </span>
          )}
        </div>
        <p className="text-white/30 text-sm mt-1">Richieste di prova gratuita</p>
      </div>

      <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
          <Calendar size={14} className="text-hornets-yellow" />
          <p className="admin-section-label">Tutte le prenotazioni</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="text-hornets-yellow animate-spin" />
          </div>
        ) : prenotazioni.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/15">
            <Calendar size={36} className="mb-3" />
            <p className="text-sm">Nessuna prenotazione</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {prenotazioni.map((p) => {
              const meta = statoMeta[p.stato] || { label: p.stato, color: '#6b7280' };
              return (
                <div key={p.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-hornets-yellow/10 rounded-xl flex items-center justify-center text-hornets-yellow text-xs font-bold shrink-0 mt-0.5">
                        {p.nome[0]}{p.cognome[0]}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{p.nome} {p.cognome}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <a href={`mailto:${p.email}`} className="flex items-center gap-1 text-white/35 text-xs hover:text-hornets-yellow transition-colors">
                            <Mail size={10} /> {p.email}
                          </a>
                          {p.telefono && (
                            <a href={`tel:${p.telefono}`} className="flex items-center gap-1 text-white/35 text-xs hover:text-hornets-yellow transition-colors">
                              <Phone size={10} /> {p.telefono}
                            </a>
                          )}
                        </div>
                        {p.messaggio && (
                          <p className="text-white/25 text-xs mt-1.5 line-clamp-2 max-w-xl">{p.messaggio}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="text-white/20 text-[10px]">
                        {new Date(p.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      {p.corso && (
                        <span className="text-white/25 text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-md">{p.corso.nome}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

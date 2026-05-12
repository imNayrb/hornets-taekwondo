'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api.client';
import {
  BookOpen, Loader2, Plus, Pencil, Trash2, X,
  ToggleLeft, ToggleRight, Clock, Euro,
} from 'lucide-react';

interface Corso {
  id: string;
  nome: string;
  livello: string;
  descrizione: string | null;
  descrizionBreve: string | null;
  etaMin: number | null;
  etaMax: number | null;
  prezzoMensile: number | null;
  prezzoTrimestrale: number | null;
  prezzoAnnuale: number | null;
  ordine: number;
  isActive: boolean;
  createdAt: string;
}

interface CorsoForm {
  nome: string;
  livello: string;
  descrizione: string;
  descrizionBreve: string;
  etaMin: string;
  etaMax: string;
  prezzoMensile: string;
  prezzoTrimestrale: string;
  prezzoAnnuale: string;
  ordine: string;
}

const LIVELLI = ['bambini', 'ragazzi', 'adulti', 'agonisti', 'master'];

const livelloColor: Record<string, string> = {
  bambini: '#34d399',
  ragazzi: '#60a5fa',
  adulti: '#F5A623',
  agonisti: '#f87171',
  master: '#a78bfa',
};

function CorsoModal({
  corso,
  onClose,
  onSave,
}: {
  corso: Corso | null;
  onClose: () => void;
  onSave: (data: Partial<Corso>) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CorsoForm>({
    defaultValues: {
      nome: corso?.nome ?? '',
      livello: corso?.livello ?? 'bambini',
      descrizione: corso?.descrizione ?? '',
      descrizionBreve: corso?.descrizionBreve ?? '',
      etaMin: corso?.etaMin?.toString() ?? '',
      etaMax: corso?.etaMax?.toString() ?? '',
      prezzoMensile: corso?.prezzoMensile?.toString() ?? '',
      prezzoTrimestrale: corso?.prezzoTrimestrale?.toString() ?? '',
      prezzoAnnuale: corso?.prezzoAnnuale?.toString() ?? '',
      ordine: corso?.ordine?.toString() ?? '0',
    },
  });

  const onSubmit = (data: CorsoForm) => {
    onSave({
      nome: data.nome,
      livello: data.livello,
      descrizione: data.descrizione || null,
      descrizionBreve: data.descrizionBreve || null,
      etaMin: data.etaMin ? parseInt(data.etaMin) : null,
      etaMax: data.etaMax ? parseInt(data.etaMax) : null,
      prezzoMensile: data.prezzoMensile ? parseFloat(data.prezzoMensile) : null,
      prezzoTrimestrale: data.prezzoTrimestrale ? parseFloat(data.prezzoTrimestrale) : null,
      prezzoAnnuale: data.prezzoAnnuale ? parseFloat(data.prezzoAnnuale) : null,
      ordine: parseInt(data.ordine) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-hornets-black-card border border-white/[0.08] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-bold text-lg">
            {corso ? 'Modifica corso' : 'Nuovo corso'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Nome corso *
            </label>
            <input
              {...register('nome', { required: true })}
              className="input-dark"
              placeholder="es. Taekwondo Bambini"
            />
            {errors.nome && <p className="text-red-400 text-xs mt-1">Campo obbligatorio</p>}
          </div>

          {/* Livello */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Livello *
            </label>
            <select
              {...register('livello', { required: true })}
              className="input-dark"
            >
              {LIVELLI.map((l) => (
                <option key={l} value={l} className="bg-hornets-black capitalize">{l}</option>
              ))}
            </select>
          </div>

          {/* Descrizione breve */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Descrizione breve
            </label>
            <input
              {...register('descrizionBreve')}
              className="input-dark"
              placeholder="Frase breve mostrata nella card"
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Descrizione completa
            </label>
            <textarea
              {...register('descrizione')}
              rows={3}
              className="input-dark resize-y"
              placeholder="Descrizione dettagliata del corso"
            />
          </div>

          {/* Età */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Età minima
              </label>
              <input
                {...register('etaMin')}
                type="number"
                min="0"
                max="100"
                className="input-dark"
                placeholder="es. 5"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Età massima
              </label>
              <input
                {...register('etaMax')}
                type="number"
                min="0"
                max="100"
                className="input-dark"
                placeholder="es. 12"
              />
            </div>
          </div>

          {/* Prezzi */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Prezzi (€)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  {...register('prezzoMensile')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-dark"
                  placeholder="Mensile"
                />
                <p className="text-white/20 text-[10px] mt-1 text-center">Mensile</p>
              </div>
              <div>
                <input
                  {...register('prezzoTrimestrale')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-dark"
                  placeholder="Trimestrale"
                />
                <p className="text-white/20 text-[10px] mt-1 text-center">Trimestrale</p>
              </div>
              <div>
                <input
                  {...register('prezzoAnnuale')}
                  type="number"
                  step="0.01"
                  min="0"
                  className="input-dark"
                  placeholder="Annuale"
                />
                <p className="text-white/20 text-[10px] mt-1 text-center">Annuale</p>
              </div>
            </div>
          </div>

          {/* Ordine */}
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
              Ordine visualizzazione
            </label>
            <input
              {...register('ordine')}
              type="number"
              min="0"
              className="input-dark"
              placeholder="0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/[0.08] text-white/50 font-semibold py-3 rounded-xl hover:border-white/20 transition-all text-sm"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 bg-hornets-yellow text-hornets-ink font-bold py-3 rounded-xl hover:bg-hornets-yellow-dark transition-all text-sm"
            >
              {corso ? 'Salva modifiche' : 'Crea corso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminCorsiPage() {
  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalCorso, setModalCorso] = useState<Corso | null | 'new'>('new' as unknown as null);
  const [showModal, setShowModal] = useState(false);

  const fetchCorsi = () => {
    setLoading(true);
    apiClient.get('/admin/corsi')
      .then(({ data }) => setCorsi(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCorsi(); }, []);

  const openNew = () => { setModalCorso(null); setShowModal(true); };
  const openEdit = (c: Corso) => { setModalCorso(c); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSave = async (data: Partial<Corso>) => {
    setSaving(true);
    try {
      if (modalCorso && (modalCorso as Corso).id) {
        await apiClient.put(`/admin/corsi/${(modalCorso as Corso).id}`, data);
      } else {
        await apiClient.post('/admin/corsi', data);
      }
      closeModal();
      fetchCorsi();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (corso: Corso) => {
    try {
      const { data } = await apiClient.patch(`/admin/corsi/${corso.id}/toggle`);
      setCorsi((prev) => prev.map((c) => c.id === corso.id ? { ...c, isActive: data.isActive } : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare definitivamente questo corso? L\'operazione è irreversibile.')) return;
    try {
      await apiClient.delete(`/admin/corsi/${id}`);
      setCorsi((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const attivi = corsi.filter((c) => c.isActive).length;

  return (
    <div className="max-w-5xl">
      {showModal && (
        <CorsoModal
          corso={modalCorso as Corso | null}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Corsi</h1>
          <p className="text-white/30 text-sm mt-1">
            {attivi} attivi · {corsi.length - attivi} inattivi
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-hornets-yellow-dark transition-all"
        >
          <Plus size={16} /> Nuovo corso
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="text-hornets-yellow animate-spin" />
        </div>
      ) : corsi.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-white/15 bg-hornets-black-card border border-white/[0.06] rounded-2xl">
          <BookOpen size={36} className="mb-3" />
          <p className="text-sm mb-4">Nessun corso creato</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-xs px-4 py-2 rounded-xl hover:bg-hornets-yellow-dark transition-all"
          >
            <Plus size={14} /> Aggiungi il primo corso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corsi.map((corso) => {
            const color = livelloColor[corso.livello] || '#6b7280';
            return (
              <div
                key={corso.id}
                className={`bg-hornets-black-card border rounded-2xl p-5 transition-all ${
                  corso.isActive ? 'border-white/[0.06]' : 'border-white/[0.03] opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}18` }}
                    >
                      <BookOpen size={16} style={{ color }} />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: `${color}18`, color }}
                      >
                        {corso.livello}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(corso)}
                      title={corso.isActive ? 'Disattiva' : 'Attiva'}
                      className="p-1.5 rounded-lg transition-all hover:bg-white/5 text-white/30 hover:text-white/70"
                    >
                      {corso.isActive
                        ? <ToggleRight size={18} className="text-green-400" />
                        : <ToggleLeft size={18} />
                      }
                    </button>
                    <button
                      onClick={() => openEdit(corso)}
                      className="p-1.5 rounded-lg transition-all hover:bg-white/5 text-white/30 hover:text-hornets-yellow"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(corso.id)}
                      className="p-1.5 rounded-lg transition-all hover:bg-red-500/5 text-white/20 hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="text-white font-bold text-base mb-1">{corso.nome}</h3>
                {corso.descrizionBreve && (
                  <p className="text-white/35 text-xs leading-relaxed mb-3">{corso.descrizionBreve}</p>
                )}

                <div className="flex items-center flex-wrap gap-3 mt-3 pt-3 border-t border-white/[0.04]">
                  {(corso.etaMin || corso.etaMax) && (
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Clock size={11} />
                      {corso.etaMin && corso.etaMax
                        ? `${corso.etaMin}–${corso.etaMax} anni`
                        : corso.etaMin
                        ? `${corso.etaMin}+ anni`
                        : `fino a ${corso.etaMax} anni`}
                    </div>
                  )}
                  {corso.prezzoMensile && (
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Euro size={11} />
                      {Number(corso.prezzoMensile).toFixed(0)} €/mese
                    </div>
                  )}
                  <span
                    className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      corso.isActive
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-white/[0.06] text-white/30'
                    }`}
                  >
                    {corso.isActive ? 'Attivo' : 'Inattivo'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {saving && (
        <div className="fixed bottom-6 right-6 bg-hornets-black-card border border-white/[0.08] rounded-2xl px-4 py-3 flex items-center gap-2 text-white/70 text-sm">
          <Loader2 size={14} className="animate-spin text-hornets-yellow" />
          Salvataggio in corso...
        </div>
      )}
    </div>
  );
}

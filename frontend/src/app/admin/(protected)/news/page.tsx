'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api.client';
import {
  Newspaper, Loader2, Eye, EyeOff, Trash2,
  Plus, X, ArrowLeft, Save, CheckCircle,
} from 'lucide-react';

interface NewsItem {
  id: string;
  titolo: string;
  slug: string;
  contenuto: string;
  estratto: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  autore?: { nome: string; cognome: string };
}

interface NewsForm {
  titolo: string;
  estratto: string;
  contenuto: string;
  tagsRaw: string;
  isPublished: boolean;
}

// ── Editor panel ─────────────────────────────────────────────────────────────
function NewsEditor({
  item,
  onClose,
  onSaved,
}: {
  item: NewsItem | null;
  onClose: () => void;
  onSaved: (saved: NewsItem) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<NewsForm>({
    defaultValues: {
      titolo: item?.titolo ?? '',
      estratto: item?.estratto ?? '',
      contenuto: item?.contenuto ?? '',
      tagsRaw: item?.tags?.join(', ') ?? '',
      isPublished: item?.isPublished ?? false,
    },
  });

  const onSubmit = async (data: NewsForm) => {
    setSaving(true);
    try {
      const payload = {
        titolo: data.titolo,
        estratto: data.estratto || null,
        contenuto: data.contenuto,
        tags: data.tagsRaw
          ? data.tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        isPublished: data.isPublished,
      };

      const res = item
        ? await apiClient.put(`/admin/news/${item.id}`, payload)
        : await apiClient.post('/admin/news', payload);

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Back header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Torna alla lista
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-hornets-yellow-dark transition-all disabled:opacity-60"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" /> Salvo...</>
              : saved
              ? <><CheckCircle size={14} /> Salvato!</>
              : <><Save size={14} /> Salva</>
            }
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Titolo */}
        <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl p-5">
          <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
            Titolo *
          </label>
          <input
            {...register('titolo', { required: true })}
            className="input-dark text-base"
            placeholder="Titolo dell'articolo"
          />
          {errors.titolo && <p className="text-red-400 text-xs mt-1">Titolo obbligatorio</p>}
        </div>

        {/* Estratto */}
        <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl p-5">
          <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
            Estratto / Anteprima
          </label>
          <textarea
            {...register('estratto')}
            rows={2}
            className="input-dark resize-none"
            placeholder="Breve descrizione mostrata nella lista news (max 200 caratteri)"
          />
        </div>

        {/* Contenuto */}
        <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl p-5">
          <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
            Contenuto *
          </label>
          <textarea
            {...register('contenuto', { required: true })}
            rows={14}
            className="input-dark resize-y font-mono text-xs leading-relaxed"
            placeholder="Testo completo dell'articolo..."
          />
          {errors.contenuto && <p className="text-red-400 text-xs mt-1">Contenuto obbligatorio</p>}
          <p className="text-white/15 text-[10px] mt-2">Puoi usare HTML di base: &lt;b&gt;, &lt;i&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;p&gt;, &lt;br&gt;</p>
        </div>

        {/* Tags e pubblicazione */}
        <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Tag (separati da virgola)
              </label>
              <input
                {...register('tagsRaw')}
                className="input-dark"
                placeholder="es. campionato, risultati, under 14"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">
                Stato
              </label>
              <label className="flex items-center gap-3 cursor-pointer mt-1">
                <input
                  {...register('isPublished')}
                  type="checkbox"
                  className="w-4 h-4 accent-hornets-yellow rounded"
                />
                <span className="text-white/60 text-sm">Pubblica subito</span>
              </label>
              <p className="text-white/20 text-[10px] mt-1">Se non spuntato, viene salvato come bozza</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Lista news ───────────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<NewsItem | null | 'new'>('none' as unknown as null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchNews = () => {
    setLoading(true);
    apiClient.get('/admin/news?limit=50')
      .then(({ data }) => setNews(data.news ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNews(); }, []);

  const openNew = () => { setEditing(null); setShowEditor(true); };
  const openEdit = (item: NewsItem) => { setEditing(item); setShowEditor(true); };
  const closeEditor = () => setShowEditor(false);

  const handleSaved = (saved: NewsItem) => {
    setNews((prev) => {
      const idx = prev.findIndex((n) => n.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    closeEditor();
  };

  const togglePublish = async (id: string, current: boolean) => {
    try {
      await apiClient.patch(`/admin/news/${id}`, { isPublished: !current });
      setNews((prev) => prev.map((n) => n.id === id ? { ...n, isPublished: !current } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo articolo definitivamente?')) return;
    try {
      await apiClient.delete(`/admin/news/${id}`);
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (showEditor) {
    return (
      <NewsEditor
        item={editing as NewsItem | null}
        onClose={closeEditor}
        onSaved={handleSaved}
      />
    );
  }

  const pubblicati = news.filter((n) => n.isPublished).length;

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">News</h1>
          <p className="text-white/30 text-sm mt-1">
            {pubblicati} pubblicati · {news.length - pubblicati} bozze
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-hornets-yellow-dark transition-all"
        >
          <Plus size={16} /> Nuovo articolo
        </button>
      </div>

      <div className="bg-hornets-black-card border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center gap-2">
          <Newspaper size={14} className="text-hornets-yellow" />
          <p className="admin-section-label">Tutti gli articoli</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="text-hornets-yellow animate-spin" />
          </div>
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/15">
            <Newspaper size={36} className="mb-3" />
            <p className="text-sm mb-4">Nessun articolo</p>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-hornets-yellow text-hornets-ink font-bold text-xs px-4 py-2 rounded-xl hover:bg-hornets-yellow-dark transition-all"
            >
              <Plus size={14} /> Scrivi il primo articolo
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {news.map((item) => (
              <div
                key={item.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => openEdit(item)}
                  >
                    {item.tags?.length > 0 && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-hornets-yellow/10 text-hornets-yellow px-2 py-0.5 rounded-full mb-2">
                        {item.tags[0]}
                      </span>
                    )}
                    <h3 className="text-white font-semibold text-sm hover:text-hornets-yellow transition-colors">
                      {item.titolo}
                    </h3>
                    {item.estratto && (
                      <p className="text-white/30 text-xs mt-1 line-clamp-1">{item.estratto}</p>
                    )}
                    <p className="text-white/20 text-[10px] mt-2">
                      {new Date(item.updatedAt).toLocaleDateString('it-IT', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                      {item.autore && ` · di ${item.autore.nome} ${item.autore.cognome}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        item.isPublished
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-white/[0.06] text-white/30'
                      }`}
                    >
                      {item.isPublished ? 'Pubblicato' : 'Bozza'}
                    </span>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-xl border border-white/[0.06] hover:border-hornets-yellow/30 text-white/30 hover:text-hornets-yellow transition-all"
                      title="Modifica"
                    >
                      <span className="text-[11px] font-bold">Edit</span>
                    </button>
                    <button
                      onClick={() => togglePublish(item.id, item.isPublished)}
                      className="p-2 rounded-xl border border-white/[0.06] hover:border-white/[0.14] text-white/30 hover:text-white/70 transition-all"
                      title={item.isPublished ? 'Nascondi' : 'Pubblica'}
                    >
                      {item.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl border border-white/[0.06] hover:border-red-400/30 text-white/20 hover:text-red-400 transition-all"
                      title="Elimina"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

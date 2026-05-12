'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiClient } from '@/lib/api.client';
import { Save, Loader2, CheckCircle } from 'lucide-react';

interface SiteConfig {
  hero_titolo: string;
  hero_sottotitolo: string;
  hero_cta_text: string;
  chi_siamo_testo: string;
  indirizzo: string;
  telefono: string;
  email_contatti: string;
  instagram_url: string;
  facebook_url: string;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-hornets-black-card border border-white/[0.06] rounded-2xl p-6">
      <p className="admin-section-label mb-6">{title}</p>
      {children}
    </section>
  );
}

export default function AdminImpostazioniPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const { register, handleSubmit, reset } = useForm<SiteConfig>();

  useEffect(() => {
    apiClient.get('/admin/config')
      .then(({ data }) => { reset(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: SiteConfig) => {
    setSaving(true);
    try {
      await apiClient.put('/admin/config', data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="text-hornets-yellow animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Impostazioni</h1>
          <p className="text-white/30 text-sm mt-1">Modifica i contenuti del sito</p>
        </div>
        <button
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Section title="Hero Section">
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Titolo principale</label>
              <input {...register('hero_titolo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Sottotitolo</label>
              <input {...register('hero_sottotitolo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Testo bottone CTA</label>
              <input {...register('hero_cta_text')} className="input-dark" />
            </div>
          </div>
        </Section>

        <Section title="Chi Siamo">
          <div>
            <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Testo sezione</label>
            <textarea {...register('chi_siamo_testo')} rows={5} className="input-dark resize-y" />
          </div>
        </Section>

        <Section title="Informazioni di Contatto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Indirizzo</label>
              <input {...register('indirizzo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Telefono</label>
              <input {...register('telefono')} className="input-dark" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Email</label>
              <input {...register('email_contatti')} type="email" className="input-dark" />
            </div>
          </div>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">URL Instagram</label>
              <input {...register('instagram_url')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">URL Facebook</label>
              <input {...register('facebook_url')} className="input-dark" />
            </div>
          </div>
        </Section>
      </form>
    </div>
  );
}

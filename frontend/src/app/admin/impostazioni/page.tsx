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
        <Loader2 size={32} className="text-hornets-yellow animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-hornets-white uppercase">Impostazioni Sito</h1>
          <p className="text-white/40 text-sm mt-1">Modifica i contenuti del sito in tempo reale</p>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving}
          className="btn-primary text-xs px-6 py-3 flex items-center gap-2"
        >
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Salvataggio...</>
            : saved
            ? <><CheckCircle size={14} /> Salvato!</>
            : <><Save size={14} /> Salva modifiche</>
          }
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero */}
        <section className="bg-hornets-black-card border border-white/5 p-6">
          <h2 className="text-hornets-yellow text-xs uppercase tracking-[0.3em] font-bold mb-6">
            Hero Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Titolo principale</label>
              <input {...register('hero_titolo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Sottotitolo</label>
              <input {...register('hero_sottotitolo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Testo bottone CTA</label>
              <input {...register('hero_cta_text')} className="input-dark" />
            </div>
          </div>
        </section>

        {/* Chi siamo */}
        <section className="bg-hornets-black-card border border-white/5 p-6">
          <h2 className="text-hornets-yellow text-xs uppercase tracking-[0.3em] font-bold mb-6">
            Chi Siamo
          </h2>
          <div>
            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Testo sezione</label>
            <textarea {...register('chi_siamo_testo')} rows={5} className="input-dark resize-y" />
          </div>
        </section>

        {/* Contatti */}
        <section className="bg-hornets-black-card border border-white/5 p-6">
          <h2 className="text-hornets-yellow text-xs uppercase tracking-[0.3em] font-bold mb-6">
            Informazioni di Contatto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Indirizzo</label>
              <input {...register('indirizzo')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Telefono</label>
              <input {...register('telefono')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Email contatti</label>
              <input {...register('email_contatti')} type="email" className="input-dark" />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="bg-hornets-black-card border border-white/5 p-6">
          <h2 className="text-hornets-yellow text-xs uppercase tracking-[0.3em] font-bold mb-6">
            Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">URL Instagram</label>
              <input {...register('instagram_url')} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">URL Facebook</label>
              <input {...register('facebook_url')} className="input-dark" />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

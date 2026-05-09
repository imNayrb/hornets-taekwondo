'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const schema = z.object({
  nome: z.string().min(2).max(100),
  email: z.string().email('Email non valida'),
  telefono: z.string().optional(),
  corsoInteresse: z.string().optional(),
  messaggio: z.string().min(10, 'Messaggio troppo corto').max(2000),
  privacy: z.boolean().refine((v) => v === true, 'Accetta la privacy policy'),
});
type FormData = z.infer<typeof schema>;

const orari = [
  { giorni: 'Lun / Mer', orario: '17:00 - 22:00' },
  { giorni: 'Mar / Gio', orario: '17:00 - 22:00' },
  { giorni: 'Sabato', orario: '10:00 - 13:00' },
  { giorni: 'Domenica', orario: 'Chiuso' },
];

const contattiInfo = [
  { icon: MapPin, label: 'Indirizzo', value: 'Via Roma 1, 88100 Catanzaro CZ', href: '' },
  { icon: Phone, label: 'Telefono', value: '+39 0961 000000', href: 'tel:+390961000000' },
  { icon: Mail, label: 'Email', value: 'info@hornets-taekwondo.it', href: 'mailto:info@hornets-taekwondo.it' },
];

export function ContattiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const parts = data.nome.split(' ');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prenota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: parts[0], cognome: parts.slice(1).join(' ') || '-', email: data.email, telefono: data.telefono, messaggio: data.messaggio }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contatti" className="py-24 lg:py-32 bg-white">
      <div className="section-container">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="flex mb-5">
              <span className="section-label">Vieni a trovarci</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title mb-4">
              Inizia il tuo<br /><span className="text-gradient">viaggio oggi</span>
            </motion.h2>
            <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ delay: 0.2 }} className="divider mb-8 origin-left" />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }} className="space-y-4 mb-8">
              {contattiInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-hornets-yellow-pale rounded-2xl flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-hornets-yellow-dark" />
                  </div>
                  <div>
                    <p className="text-xs text-hornets-ink-muted font-medium uppercase tracking-widest mb-0.5">{label}</p>
                    {href ? <a href={href} className="text-hornets-ink font-medium hover:text-hornets-yellow transition-colors">{value}</a> : <p className="text-hornets-ink font-medium">{value}</p>}
                  </div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }} className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} className="text-hornets-yellow" />
                <p className="text-hornets-ink font-semibold text-sm">Orari palestra</p>
              </div>
              <div className="space-y-2.5">
                {orari.map(({ giorni, orario }) => (
                  <div key={giorni} className="flex justify-between text-sm">
                    <span className="text-hornets-ink-muted">{giorni}</span>
                    <span className={orario === 'Chiuso' ? 'text-hornets-ink-muted/50' : 'text-hornets-ink font-semibold'}>{orario}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
            <div className="card p-8 lg:p-10">
              <h3 className="font-display font-bold text-hornets-ink text-2xl mb-1">Prova Gratuita</h3>
              <p className="text-hornets-ink-muted text-sm mb-8">Compila il form e ti richiamiamo entro 24 ore. Zero impegno.</p>
              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12 gap-4">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h4 className="font-display font-bold text-hornets-ink text-xl">Richiesta inviata!</h4>
                  <p className="text-hornets-ink-muted text-sm max-w-xs">Ti contatteremo a breve per confermare la tua prova gratuita.</p>
                  <button onClick={() => setStatus('idle')} className="btn-outline mt-2 text-sm">Invia un altro messaggio</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs font-semibold text-hornets-ink-muted uppercase tracking-widest mb-2">Nome e Cognome *</label>
                    <input {...register('nome')} className="input" placeholder="Mario Rossi" />
                    {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-hornets-ink-muted uppercase tracking-widest mb-2">Email *</label>
                      <input {...register('email')} type="email" className="input" placeholder="mario@email.it" />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-hornets-ink-muted uppercase tracking-widest mb-2">Telefono</label>
                      <input {...register('telefono')} type="tel" className="input" placeholder="+39 333..." />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-hornets-ink-muted uppercase tracking-widest mb-2">Corso di interesse</label>
                    <select {...register('corsoInteresse')} className="input">
                      <option value="">-- Seleziona --</option>
                      <option value="bambini">Bambini (4-11 anni)</option>
                      <option value="ragazzi">Ragazzi (12-17 anni)</option>
                      <option value="adulti">Adulti (18+ anni)</option>
                      <option value="agonisti">Agonismo e Competizione</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-hornets-ink-muted uppercase tracking-widest mb-2">Messaggio *</label>
                    <textarea {...register('messaggio')} rows={4} className="input resize-none" placeholder="Ciao! Sono interessato al corso..." />
                    {errors.messaggio && <p className="text-red-500 text-xs mt-1">{errors.messaggio.message}</p>}
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input {...register('privacy')} type="checkbox" className="mt-0.5 w-4 h-4 accent-hornets-yellow rounded" />
                    <span className="text-hornets-ink-muted text-xs leading-relaxed">
                      Accetto la <a href="/privacy" className="text-hornets-yellow font-medium hover:underline">Privacy Policy</a>.
                    </span>
                  </label>
                  {errors.privacy && <p className="text-red-500 text-xs">{errors.privacy.message}</p>}
                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-2xl p-3">
                      <AlertCircle size={16} /> Errore invio. Riprova o chiamaci.
                    </div>
                  )}
                  <button type="submit" disabled={status === 'loading'} className="btn-yellow w-full justify-center disabled:opacity-50">
                    {status === 'loading' ? 'Invio in corso...' : 'Invia Richiesta'}
                    {status !== 'loading' && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

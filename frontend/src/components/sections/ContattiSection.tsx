'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  nome: z.string().min(2, 'Nome troppo corto').max(100),
  email: z.string().email('Email non valida'),
  telefono: z.string().optional(),
  corsoInteresse: z.string().optional(),
  messaggio: z.string().min(10, 'Messaggio troppo corto (min. 10 caratteri)').max(2000),
  privacy: z.boolean().refine((v) => v === true, 'Accetta la privacy policy per proseguire'),
});

type FormData = z.infer<typeof formSchema>;

const orari = [
  { giorni: 'Lunedì / Mercoledì', orario: '17:00 – 22:00' },
  { giorni: 'Martedì / Giovedì', orario: '17:00 – 22:00' },
  { giorni: 'Sabato', orario: '10:00 – 13:00' },
  { giorni: 'Domenica', orario: 'Chiuso' },
];

export function ContattiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prenota`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome.split(' ')[0],
          cognome: data.nome.split(' ').slice(1).join(' ') || data.nome,
          email: data.email,
          telefono: data.telefono,
          messaggio: data.messaggio,
        }),
      });

      if (!res.ok) throw new Error('Errore invio');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contatti" className="py-24 lg:py-32 bg-hornets-black">
      <div className="section-container">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="section-label mb-4"
            >
              Vieni a trovarci
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title mb-6"
            >
              Inizia il tuo
              <br />
              <span className="text-gradient">viaggio oggi</span>
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="divider-yellow mb-8 origin-left"
            />

            {/* Contatti */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: MapPin, label: 'Indirizzo', value: 'Via Roma 1, 88100 Catanzaro CZ', href: null },
                { icon: Phone, label: 'Telefono', value: '+39 0961 000000', href: 'tel:+390961000000' },
                { icon: Mail, label: 'Email', value: 'info@hornets-taekwondo.it', href: 'mailto:info@hornets-taekwondo.it' },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-hornets-yellow/30 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-hornets-yellow" />
                  </div>
                  <div>
                    <p className="text-white/30 text-xs uppercase tracking-widest mb-0.5">{label}</p>
                    {href
                      ? <a href={href} className="text-white/80 hover:text-hornets-yellow transition-colors">{value}</a>
                      : <p className="text-white/80">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Orari */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock size={16} className="text-hornets-yellow" />
                <p className="text-hornets-yellow text-xs uppercase tracking-widest font-bold">Orari palestra</p>
              </div>
              <div className="space-y-2">
                {orari.map(({ giorni, orario }) => (
                  <div key={giorni} className="flex justify-between text-sm">
                    <span className="text-white/50">{giorni}</span>
                    <span className={orario === 'Chiuso' ? 'text-white/20' : 'text-hornets-yellow font-medium'}>
                      {orario}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mappa */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-6 h-48 bg-hornets-gray border border-white/5 overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3108.!2d16.58!3d38.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x!2sCatanzaro!5e0!3m2!1sit!2sit!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa Hornets Taekwondo Catanzaro"
              />
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-hornets-black-card border border-white/5 p-8 lg:p-10">
              <h3 className="font-display text-2xl text-hornets-white uppercase mb-2">
                Prenota la Prova Gratuita
              </h3>
              <p className="text-white/40 text-sm mb-8">
                Compila il form e ti ricontatteremo entro 24 ore. Nessun impegno, solo sport!
              </p>

              {status === 'success' ? (
                <div className="flex flex-col items-center text-center py-12 gap-4">
                  <CheckCircle size={48} className="text-hornets-yellow" />
                  <h4 className="text-hornets-white font-semibold text-lg">Richiesta inviata!</h4>
                  <p className="text-white/50 text-sm">
                    Ottimo! Ti contatteremo a breve per confermare la tua prova gratuita.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-outline mt-4 text-xs px-6 py-3">
                    Invia un altro messaggio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                      Nome e Cognome *
                    </label>
                    <input {...register('nome')} className="input-dark" placeholder="Mario Rossi" />
                    {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                        Email *
                      </label>
                      <input {...register('email')} type="email" className="input-dark" placeholder="mario@email.it" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                        Telefono
                      </label>
                      <input {...register('telefono')} type="tel" className="input-dark" placeholder="+39 333 1234567" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                      Corso di interesse
                    </label>
                    <select {...register('corsoInteresse')} className="input-dark">
                      <option value="">-- Seleziona --</option>
                      <option value="bambini">Taekwondo Bambini (4-11 anni)</option>
                      <option value="ragazzi">Taekwondo Ragazzi (12-17 anni)</option>
                      <option value="adulti">Taekwondo Adulti (18+ anni)</option>
                      <option value="agonisti">Agonismo & Competizione</option>
                      <option value="non-so">Non so ancora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                      Messaggio *
                    </label>
                    <textarea
                      {...register('messaggio')}
                      rows={4}
                      className="input-dark resize-none"
                      placeholder="Ciao! Sono interessato/a al corso..."
                    />
                    {errors.messaggio && <p className="text-red-400 text-xs mt-1">{errors.messaggio.message}</p>}
                  </div>

                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        {...register('privacy')}
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 border border-white/20 bg-transparent accent-hornets-yellow"
                      />
                      <span className="text-white/40 text-xs leading-relaxed">
                        Ho letto e accetto la{' '}
                        <a href="/privacy" className="text-hornets-yellow hover:underline">Privacy Policy</a>.
                        I tuoi dati saranno trattati per rispondere alla tua richiesta.
                      </span>
                    </label>
                    {errors.privacy && <p className="text-red-400 text-xs mt-1">{errors.privacy.message}</p>}
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      Errore nell&apos;invio. Riprova o contattaci direttamente.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Invio in corso...' : 'Invia Richiesta'}
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

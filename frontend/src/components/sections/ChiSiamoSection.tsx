'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Target, Heart, CheckCircle } from 'lucide-react';

const punti = [
  'Maestri certificati FITA con esperienza internazionale',
  'Programmi personalizzati per ogni livello e fascia d\'età',
  'Ambiente familiare, inclusivo e motivante',
  'Partecipazione a gare regionali, nazionali e internazionali',
];

const valori = [
  { icon: Target, titolo: 'Disciplina', color: '#F5A623', bg: '#FFF8EC' },
  { icon: Heart, titolo: 'Passione', color: '#0F0F1A', bg: '#F0F2F5' },
  { icon: Award, titolo: 'Eccellenza', color: '#F5A623', bg: '#FFF8EC' },
];

export function ChiSiamoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="chi-siamo" className="py-24 lg:py-32 bg-hornets-bg overflow-hidden">
      <div className="section-container">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex justify-start mb-5">
              <span className="section-label">Chi Siamo</span>
            </div>
            <h2 className="section-title mb-6">
              Una famiglia unita<br />
              <span className="text-gradient">dalla cintura nera</span>
            </h2>
            <div className="divider mb-7" />
            <div className="space-y-4 text-hornets-ink-muted text-base leading-relaxed mb-8">
              <p>
                Gli <strong className="text-hornets-ink font-semibold">Hornets Taekwondo</strong> nascono a Catanzaro nel 2009
                con un sogno: portare l'arte marziale coreana nel cuore della Calabria, forgiando campioni
                non solo nello sport, ma nella vita.
              </p>
              <p>
                Sotto la guida del <strong className="text-hornets-ink font-semibold">Maestro Antonio Rossi, IV Dan WTF</strong>,
                la nostra squadra ha conquistato decine di medaglie a livello regionale e nazionale.
              </p>
            </div>
            <ul className="space-y-3 mb-10">
              {punti.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-hornets-ink-soft">
                  <CheckCircle size={17} className="text-hornets-yellow shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-3">
              {valori.map(({ icon: Icon, titolo, color, bg }) => (
                <div key={titolo} className="card p-4 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: bg }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="text-hornets-ink font-semibold text-sm">{titolo}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — visual card stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Main card */}
            <div className="relative w-full max-w-sm">
              <div className="card p-8 bg-hornets-dark-card text-white shadow-large">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-hornets-yellow rounded-2xl flex items-center justify-center font-display font-black text-2xl text-hornets-ink">
                    H
                  </div>
                  <div>
                    <p className="font-display font-bold text-white text-lg">Hornets TKD</p>
                    <p className="text-white/50 text-sm">Catanzaro, dal 2009</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Categoria', value: 'ASD Taekwondo WTF' },
                    { label: 'Sede', value: 'Catanzaro, Calabria' },
                    { label: 'Federazione', value: 'FITA — Certificata' },
                    { label: 'Atleti', value: '200+ iscritti attivi' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-white/10 pb-3">
                      <span className="text-white/40">{label}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-hornets-yellow rounded-2xl px-4 py-3 shadow-yellow"
              >
                <p className="font-display font-black text-hornets-ink text-2xl leading-none">2009</p>
                <p className="text-hornets-ink/70 text-[10px] font-bold uppercase tracking-wider">Fondazione</p>
              </motion.div>

              {/* Bottom decoration */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 card p-4 shadow-medium bg-white"
              >
                <p className="text-2xl mb-1">🥋</p>
                <p className="font-semibold text-hornets-ink text-sm">IV Dan WTF</p>
                <p className="text-hornets-ink-muted text-xs">Maestro Rossi</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, ArrowRight } from 'lucide-react';

const corsi = [
  {
    id: 1, nome: 'Bambini', eta: '4 – 11 anni', orari: 'Lun / Mer  17:00 – 18:00',
    desc: 'Coordinazione, disciplina e divertimento. Il primo passo nel mondo del Taekwondo in totale sicurezza.',
    prezzo: 45, emoji: '🌟', bg: '#FFF8EC', accent: '#F5A623', badge: 'Più richiesto',
  },
  {
    id: 2, nome: 'Ragazzi', eta: '12 – 17 anni', orari: 'Mar / Gio  17:30 – 19:00',
    desc: 'Tecnica avanzata e mentalità agonistica per chi vuole fare sul serio.',
    prezzo: 50, emoji: '⚡', bg: '#F0F2F5', accent: '#0F0F1A', badge: null,
  },
  {
    id: 3, nome: 'Adulti', eta: '18+ anni', orari: 'Mar / Gio  19:00 – 20:30',
    desc: 'Fitness, autodifesa e crescita personale. Non è mai troppo tardi per iniziare.',
    prezzo: 55, emoji: '💪', bg: '#F7F8FA', accent: '#0F0F1A', badge: null,
  },
  {
    id: 4, nome: 'Agonisti', eta: '14 – 35 anni', orari: 'Lun / Mer  20:30 + Sab 10:00',
    desc: 'Preparazione élite per atleti che vogliono conquistare podi regionali e nazionali.',
    prezzo: 70, emoji: '🏆', bg: '#FFF8EC', accent: '#F5A623', badge: 'Alta intensità',
  },
];

export function CorsiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="corsi" className="py-24 lg:py-32 bg-white">
      <div className="section-container">
        <div ref={ref} className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="flex justify-center mb-4">
            <span className="section-label">I Nostri Corsi</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="section-title mb-4"
          >
            Un percorso per{' '}
            <span className="text-gradient">ogni atleta</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-hornets-ink-muted text-lg max-w-xl mx-auto"
          >
            Ogni corso è progettato dai nostri maestri per garantire progressione, sicurezza e passione.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {corsi.map((corso, i) => (
            <motion.div
              key={corso.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group card p-7 flex flex-col"
            >
              {corso.badge && (
                <span className="self-start mb-4 bg-hornets-yellow text-hornets-ink text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  {corso.badge}
                </span>
              )}

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: corso.bg }}>
                {corso.emoji}
              </div>

              <h3 className="font-display font-bold text-2xl text-hornets-ink mb-1">{corso.nome}</h3>
              <p className="text-xs font-medium text-hornets-ink-muted uppercase tracking-widest mb-3" style={{ color: corso.accent }}>
                Taekwondo {corso.nome}
              </p>
              <p className="text-hornets-ink-muted text-sm leading-relaxed mb-5 flex-1">{corso.desc}</p>

              <div className="space-y-2 mb-6 pb-5 border-b border-hornets-border">
                <div className="flex items-center gap-2 text-xs text-hornets-ink-muted">
                  <Users size={13} style={{ color: corso.accent }} />
                  <span>{corso.eta}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-hornets-ink-muted">
                  <Clock size={13} style={{ color: corso.accent }} />
                  <span>{corso.orari}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-hornets-ink-muted">Da </span>
                  <span className="font-display font-bold text-xl text-hornets-ink">€{corso.prezzo}</span>
                  <span className="text-xs text-hornets-ink-muted">/mese</span>
                </div>
                <Link
                  href="/#contatti"
                  className="flex items-center gap-1 text-xs font-semibold transition-all duration-200 hover:gap-2"
                  style={{ color: corso.accent }}
                >
                  Info <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-hornets-ink-muted text-sm mb-4">Non sai quale corso fa per te?</p>
          <Link href="/#contatti" className="btn-yellow">
            Prenota una prova gratuita <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

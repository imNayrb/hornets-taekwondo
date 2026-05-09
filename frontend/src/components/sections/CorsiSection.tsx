'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Clock, Users, ChevronRight, Star, Shield, Trophy, Medal } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  star: Star,
  shield: Shield,
  trophy: Trophy,
  medal: Medal,
};

const corsi = [
  {
    id: 1,
    nome: 'Taekwondo Bambini',
    livello: 'bambini',
    etaRange: '4 - 11 anni',
    orari: 'Lun / Mer 17:00 - 18:00',
    descrizione: 'Coordinazione, disciplina e divertimento attraverso il Taekwondo. Il percorso ideale per avvicinarsi alle arti marziali con il sorriso.',
    prezzoMensile: 45,
    icona: 'star',
    coloreTema: '#F5A623',
    badge: 'Più richiesto',
  },
  {
    id: 2,
    nome: 'Taekwondo Ragazzi',
    livello: 'ragazzi',
    etaRange: '12 - 17 anni',
    orari: 'Mar / Gio 17:30 - 19:00',
    descrizione: 'Tecnica avanzata e mentalità agonistica. I ragazzi affinano le basi e si preparano a competere.',
    prezzoMensile: 50,
    icona: 'shield',
    coloreTema: '#D0021B',
    badge: null,
  },
  {
    id: 3,
    nome: 'Taekwondo Adulti',
    livello: 'adulti',
    etaRange: '18+ anni',
    orari: 'Mar / Gio 19:00 - 20:30',
    descrizione: 'Fitness, autodifesa e crescita personale. Non è mai troppo tardi per iniziare: il Taekwondo è per tutti.',
    prezzoMensile: 55,
    icona: 'trophy',
    coloreTema: '#F9F9F9',
    badge: null,
  },
  {
    id: 4,
    nome: 'Agonismo & Competizione',
    livello: 'agonisti',
    etaRange: '14 - 35 anni',
    orari: 'Lun / Mer 20:30 + Sab 10:00',
    descrizione: 'Preparazione atletica d\'élite per chi vuole conquistare i podi regionali e nazionali. Allenamenti intensivi e programmazione avanzata.',
    prezzoMensile: 70,
    icona: 'medal',
    coloreTema: '#F5A623',
    badge: 'Alta intensità',
  },
];

function CorsoCard({ corso, index }: { corso: typeof corsi[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const Icon = iconMap[corso.icona] || Star;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="group card-dark relative overflow-hidden"
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
        style={{ backgroundColor: corso.coloreTema }}
      />

      {/* Badge */}
      {corso.badge && (
        <div
          className="absolute top-4 right-4 text-hornets-black text-xs font-bold uppercase tracking-widest px-3 py-1"
          style={{ backgroundColor: corso.coloreTema }}
        >
          {corso.badge}
        </div>
      )}

      <div className="p-8 pt-10">
        {/* Icon */}
        <div
          className="w-12 h-12 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
          style={{ color: corso.coloreTema }}
        >
          <Icon size={28} />
        </div>

        {/* Level label */}
        <p className="text-xs uppercase tracking-[0.3em] font-bold mb-3" style={{ color: corso.coloreTema }}>
          {corso.livello}
        </p>

        <h3 className="font-display text-2xl text-hornets-white uppercase mb-4 leading-tight">
          {corso.nome}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed mb-6">
          {corso.descrizione}
        </p>

        {/* Meta info */}
        <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Users size={14} className="shrink-0" style={{ color: corso.coloreTema }} />
            <span>Età: {corso.etaRange}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Clock size={14} className="shrink-0" style={{ color: corso.coloreTema }} />
            <span>{corso.orari}</span>
          </div>
        </div>

        {/* Prezzo + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white/30 text-xs uppercase tracking-widest block">A partire da</span>
            <span className="font-display text-2xl" style={{ color: corso.coloreTema }}>
              €{corso.prezzoMensile}
              <span className="text-sm text-white/40 font-sans normal-case tracking-normal">/mese</span>
            </span>
          </div>
          <Link
            href="/#contatti"
            className="flex items-center gap-1 text-sm font-medium uppercase tracking-widest transition-all duration-200"
            style={{ color: corso.coloreTema }}
          >
            Info
            <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function CorsiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="corsi" className="py-24 lg:py-32 bg-hornets-black">
      <div className="section-container">
        {/* Header */}
        <div ref={ref} className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="section-label mb-4"
          >
            I Nostri Corsi
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-title mb-6"
          >
            Un percorso per
            <br />
            <span className="text-gradient">ogni atleta</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="divider-yellow mb-6 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/50 text-lg"
          >
            Dai bambini ai professionisti: ogni corso è progettato con cura dai nostri maestri per
            garantire progressione, sicurezza e passione.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {corsi.map((corso, i) => (
            <CorsoCard key={corso.id} corso={corso} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-16"
        >
          <p className="text-white/40 text-sm mb-4">
            Non sai quale corso fa per te? Prova gratuitamente!
          </p>
          <Link href="/#contatti" className="btn-primary">
            Prenota la tua Prova Gratuita
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { end: 15, suffix: '+', label: 'Anni di attività', description: 'Dal 2009 al servizio dello sport calabrese' },
  { end: 200, suffix: '+', label: 'Atleti attivi', description: 'Dai 4 anni fino agli agonisti senior' },
  { end: 50, suffix: '+', label: 'Medaglie vinte', description: 'A livello regionale e nazionale' },
  { end: 4, suffix: '', label: 'Maestri qualificati', description: 'Istruttori certificati FITA' },
];

function StatCard({ end, suffix, label, description, index }: {
  end: number; suffix: string; label: string; description: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(inView ? end : 0, 2000);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center lg:text-left border-l border-white/5 pl-8 first:border-0 first:pl-0"
    >
      <p className="font-display text-5xl lg:text-6xl text-hornets-yellow uppercase mb-2">
        {count}{suffix}
      </p>
      <p className="text-hornets-white font-semibold text-sm uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className="text-white/40 text-sm">{description}</p>
    </motion.div>
  );
}

export function NumeriSection() {
  return (
    <section className="bg-hornets-black-soft py-20 border-y border-white/5">
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

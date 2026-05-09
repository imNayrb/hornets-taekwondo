'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { end: 15, suffix: '+', label: 'Anni di attività', color: '#F5A623', bg: '#FFF8EC' },
  { end: 200, suffix: '+', label: 'Atleti attivi', color: '#0F0F1A', bg: '#F0F2F5' },
  { end: 50, suffix: '+', label: 'Medaglie vinte', color: '#F5A623', bg: '#FFF8EC' },
  { end: 4, suffix: '', label: 'Maestri certificati', color: '#0F0F1A', bg: '#F0F2F5' },
];

function StatCard({ end, suffix, label, color, bg, index }: {
  end: number; suffix: string; label: string; color: string; bg: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCountUp(inView ? end : 0, 1800);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="card p-8 text-center"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: bg }}>
        <span className="font-display font-black text-2xl" style={{ color }}>{count}{suffix}</span>
      </div>
      <p className="text-hornets-ink font-semibold text-base">{label}</p>
    </motion.div>
  );
}

export function NumeriSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-hornets-bg">
      <div className="section-container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="section-label">I numeri degli Hornets</span>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

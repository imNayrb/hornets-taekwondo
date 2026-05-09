'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const news = [
  { id: 1, titolo: 'Campionati Regionali 2024: Hornets sul Podio!', estratto: 'I nostri atleti portano a casa 3 ori, 2 argenti e 1 bronzo. Un risultato straordinario che premia mesi di duro lavoro.', data: '2024-03-15', cat: 'Risultati', emoji: '🏆', bg: '#FFF8EC' },
  { id: 2, titolo: 'Nuovi Orari Corsi Primavera 2024', estratto: 'A partire da aprile nuovi orari aggiornati per venire incontro alle esigenze di tutte le famiglie catanzaresi.', data: '2024-03-01', cat: 'News', emoji: '📅', bg: '#F0F2F5' },
  { id: 3, titolo: 'Stage Internazionale con il Maestro Park Jin', estratto: 'Un\'occasione unica: il 20 aprile gli Hornets ospiteranno il Maestro coreano per uno stage tecnico aperto a tutti.', data: '2024-02-20', cat: 'Eventi', emoji: '🌍', bg: '#FFF8EC' },
];

export function NewsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="news" className="py-24 lg:py-32 bg-hornets-bg">
      <div className="section-container">
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="flex mb-4">
              <span className="section-label">News & Aggiornamenti</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
              Sempre <span className="text-gradient">aggiornati</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}>
            <Link href="/news" className="btn-outline text-sm">Tutte le news</Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {news.map((n, i) => (
            <motion.article
              key={n.id}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="card overflow-hidden group"
            >
              {/* Image placeholder */}
              <div className="h-44 flex items-center justify-center text-6xl relative" style={{ backgroundColor: n.bg }}>
                {n.emoji}
                <span className="absolute top-4 left-4 tag">{n.cat}</span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-hornets-ink-muted text-xs mb-3">
                  <Calendar size={12} />
                  <time dateTime={n.data}>
                    {new Date(n.data).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                </div>
                <h3 className="font-display font-bold text-hornets-ink text-lg leading-snug mb-3 group-hover:text-hornets-yellow transition-colors">
                  {n.titolo}
                </h3>
                <p className="text-hornets-ink-muted text-sm leading-relaxed mb-5 line-clamp-3">{n.estratto}</p>
                <Link href={`/news/${n.id}`} className="flex items-center gap-1.5 text-sm font-semibold text-hornets-ink hover:gap-3 transition-all duration-200">
                  Leggi tutto <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

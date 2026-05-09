'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

const newsPlaceholder = [
  {
    id: 1,
    titolo: 'Campionati Regionali Calabria 2024: Hornets sul Podio!',
    estratto: 'I nostri atleti portano a casa 3 ori, 2 argenti e 1 bronzo ai campionati regionali. Un risultato straordinario che premia mesi di duro lavoro.',
    foto: '/images/news/news-1.jpg',
    data: '2024-03-15',
    categoria: 'Risultati',
  },
  {
    id: 2,
    titolo: 'Nuovi Orari Corsi Primavera 2024',
    estratto: 'A partire da aprile, i corsi per bambini e adulti hanno nuovi orari aggiornati per venire incontro alle esigenze di tutte le famiglie.',
    foto: '/images/news/news-2.jpg',
    data: '2024-03-01',
    categoria: 'News',
  },
  {
    id: 3,
    titolo: 'Stage Internazionale con il Maestro Park Jin',
    estratto: 'Un\'occasione unica: il 20 aprile gli Hornets ospiteranno il Maestro coreano Park Jin per uno stage tecnico aperto a tutti i livelli.',
    foto: '/images/news/news-3.jpg',
    data: '2024-02-20',
    categoria: 'Eventi',
  },
];

export function NewsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="news" className="py-24 lg:py-32 bg-hornets-black-soft">
      <div className="section-container">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="section-label mb-4"
            >
              News & Aggiornamenti
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Sempre <span className="text-gradient">aggiornati</span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link href="/news" className="btn-outline text-xs px-6 py-3">
              Tutte le news
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newsPlaceholder.map((news, i) => (
            <motion.article
              key={news.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="card-dark group overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-hornets-gray">
                <Image
                  src={news.foto}
                  alt={news.titolo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-hornets-yellow text-hornets-black text-xs font-bold uppercase tracking-widest px-2 py-1">
                    {news.categoria}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 text-white/30 text-xs mb-3">
                  <Calendar size={12} />
                  <time dateTime={news.data}>
                    {new Date(news.data).toLocaleDateString('it-IT', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </time>
                </div>

                <h3 className="text-hornets-white font-semibold text-base leading-snug mb-3 group-hover:text-hornets-yellow transition-colors">
                  {news.titolo}
                </h3>

                <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-3">
                  {news.estratto}
                </p>

                <Link
                  href={`/news/${news.id}`}
                  className="flex items-center gap-2 text-hornets-yellow text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Leggi tutto
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

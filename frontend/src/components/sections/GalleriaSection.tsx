'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ZoomIn, Play } from 'lucide-react';

// Placeholder gallery items (in produzione vengono dall'API)
const galleriaItems = [
  { id: 1, src: '/images/gallery/gallery-1.jpg', tipo: 'foto', categoria: 'allenamenti', alt: 'Allenamento Hornets' },
  { id: 2, src: '/images/gallery/gallery-2.jpg', tipo: 'foto', categoria: 'gare', alt: 'Gara regionale' },
  { id: 3, src: '/images/gallery/gallery-3.jpg', tipo: 'foto', categoria: 'allenamenti', alt: 'Tecnica di calcio' },
  { id: 4, src: '/images/gallery/gallery-4.jpg', tipo: 'foto', categoria: 'eventi', alt: 'Cerimonia cintura' },
  { id: 5, src: '/images/gallery/gallery-5.jpg', tipo: 'foto', categoria: 'gare', alt: 'Podio campionati' },
  { id: 6, src: '/images/gallery/gallery-6.jpg', tipo: 'foto', categoria: 'allenamenti', alt: 'Bambini in palestra' },
  { id: 7, src: '/images/gallery/gallery-7.jpg', tipo: 'foto', categoria: 'eventi', alt: 'Evento palestra' },
  { id: 8, src: '/images/gallery/gallery-8.jpg', tipo: 'foto', categoria: 'gare', alt: 'Competizione nazionale' },
];

const categorie = ['tutti', 'allenamenti', 'gare', 'eventi'];

export function GalleriaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategoria, setActiveCategoria] = useState('tutti');
  const [lightboxItem, setLightboxItem] = useState<typeof galleriaItems[0] | null>(null);

  const filtered = activeCategoria === 'tutti'
    ? galleriaItems
    : galleriaItems.filter((item) => item.categoria === activeCategoria);

  return (
    <section id="galleria" className="py-24 lg:py-32 bg-hornets-black">
      <div className="section-container">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              className="section-label mb-4"
            >
              Galleria
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              I nostri <span className="text-gradient">momenti</span>
            </motion.h2>
          </div>

          {/* Filtri */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2"
          >
            {categorie.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoria(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
                  activeCategoria === cat
                    ? 'bg-hornets-yellow text-hornets-black'
                    : 'border border-white/10 text-white/50 hover:border-hornets-yellow/50 hover:text-hornets-yellow'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Asymmetric grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[200px]"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                // Pattern asimmetrico: ogni 7 item, i=0 occupa 2 colonne e 2 righe
                className={`relative overflow-hidden group cursor-pointer bg-hornets-gray ${
                  i % 7 === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                onClick={() => setLightboxItem(item)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-hornets-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  {item.tipo === 'video'
                    ? <Play size={28} className="text-hornets-yellow" />
                    : <ZoomIn size={24} className="text-hornets-yellow" />
                  }
                </div>
                {/* Categoria badge */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-hornets-yellow text-hornets-black text-xs font-bold uppercase tracking-widest px-2 py-1">
                    {item.categoria}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-hornets-yellow transition-colors"
              onClick={() => setLightboxItem(null)}
              aria-label="Chiudi"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full max-h-[80vh] aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxItem.src}
                alt={lightboxItem.alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

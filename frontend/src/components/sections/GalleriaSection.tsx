'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const items = [
  { id: 1, cat: 'allenamenti', emoji: '🥋', label: 'Allenamento Tecnica', color: '#FFF8EC' },
  { id: 2, cat: 'gare', emoji: '🏆', label: 'Campionato Regionale', color: '#F0F2F5' },
  { id: 3, cat: 'allenamenti', emoji: '⚡', label: 'Sparring Session', color: '#FFF8EC' },
  { id: 4, cat: 'eventi', emoji: '🎖️', label: 'Cerimonia Cinture', color: '#F0F2F5' },
  { id: 5, cat: 'gare', emoji: '🥇', label: 'Podio Nazionale', color: '#FFF8EC' },
  { id: 6, cat: 'allenamenti', emoji: '👦', label: 'Corso Bambini', color: '#F0F2F5' },
  { id: 7, cat: 'eventi', emoji: '🎉', label: 'Evento Palestra', color: '#FFF8EC' },
  { id: 8, cat: 'gare', emoji: '🌍', label: 'Gara Internazionale', color: '#F0F2F5' },
];

const cats = ['tutti', 'allenamenti', 'gare', 'eventi'];

export function GalleriaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [cat, setCat] = useState('tutti');
  const [selected, setSelected] = useState<typeof items[0] | null>(null);

  const filtered = cat === 'tutti' ? items : items.filter((i) => i.cat === cat);

  return (
    <section id="galleria" className="py-24 lg:py-32 bg-white">
      <div className="section-container">
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="flex mb-4">
              <span className="section-label">Galleria</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} className="section-title">
              I nostri <span className="text-gradient">momenti</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                  cat === c
                    ? 'bg-hornets-ink text-white shadow-soft'
                    : 'bg-hornets-surface-2 text-hornets-ink-soft hover:bg-hornets-border'
                }`}
              >
                {c}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className={`group cursor-pointer rounded-3xl flex flex-col items-center justify-center gap-3 overflow-hidden relative transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${
                  i % 7 === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={{ backgroundColor: item.color }}
              >
                <span className={i % 7 === 0 ? 'text-6xl' : 'text-4xl'}>{item.emoji}</span>
                <p className="text-hornets-ink font-semibold text-sm text-center px-4">{item.label}</p>
                <div className="absolute inset-0 bg-hornets-ink/0 group-hover:bg-hornets-ink/5 transition-colors duration-300 rounded-3xl flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-soft">
                    <ZoomIn size={14} className="text-hornets-ink" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass p-12 max-w-sm w-full text-center shadow-large"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-hornets-surface-2 rounded-xl flex items-center justify-center text-hornets-ink-muted hover:text-hornets-ink">
                <X size={16} />
              </button>
              <span className="text-8xl block mb-4">{selected.emoji}</span>
              <p className="font-display font-bold text-hornets-ink text-xl">{selected.label}</p>
              <p className="text-hornets-ink-muted text-sm mt-1 capitalize">{selected.cat}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

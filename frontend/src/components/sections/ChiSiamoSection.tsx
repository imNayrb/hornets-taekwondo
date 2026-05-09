'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Award, Target, Heart } from 'lucide-react';

const valori = [
  {
    icon: Target,
    titolo: 'Disciplina',
    testo: 'La disciplina è il fondamento di ogni grande atleta e persona. Insegniamo rispetto, perseveranza e dedizione.',
  },
  {
    icon: Heart,
    titolo: 'Passione',
    testo: 'Il Taekwondo è passione prima di tutto. Ogni allenamento è un\'opportunità per crescere e migliorarsi.',
  },
  {
    icon: Award,
    titolo: 'Eccellenza',
    testo: 'Puntiamo sempre al massimo, sia in palestra che nelle competizioni. Gli Hornets non si accontentano.',
  },
];

export function ChiSiamoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="chi-siamo" className="py-24 lg:py-32 bg-hornets-black-soft overflow-hidden">
      <div className="section-container">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image block */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] bg-hornets-gray overflow-hidden">
              <Image
                src="/images/chi-siamo.jpg"
                alt="Maestri Hornets Taekwondo Catanzaro"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hornets-black/60 to-transparent" />
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-hornets-yellow p-6 w-40"
            >
              <p className="font-display text-4xl text-hornets-black leading-none">2009</p>
              <p className="text-hornets-black/70 text-xs uppercase tracking-widest mt-1">
                Anno di fondazione
              </p>
            </motion.div>

            {/* Decorative vertical text */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden lg:block">
              <p className="font-display text-hornets-yellow/20 text-6xl uppercase vertical-text tracking-[0.3em]"
                 style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                HORNETS
              </p>
            </div>
          </motion.div>

          {/* Right: Text content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="section-label mb-4">Chi Siamo</p>
            <h2 className="section-title mb-6">
              Una famiglia
              <br />
              <span className="text-gradient">unita dalla cintura</span>
            </h2>
            <div className="divider-yellow mb-8" />

            <div className="space-y-5 text-white/60 text-base leading-relaxed">
              <p>
                Gli <strong className="text-hornets-yellow">Hornets Taekwondo</strong> nascono a Catanzaro nel 2009
                con un sogno: portare l'arte marziale coreana nel cuore della Calabria, forgiando campioni
                non solo nello sport, ma nella vita.
              </p>
              <p>
                Sotto la guida del <strong className="text-white">Maestro Antonio Rossi, IV Dan WTF</strong>,
                la nostra squadra ha conquistato decine di medaglie a livello regionale e nazionale,
                formando atleti che oggi rappresentano l'Italia nei tornei internazionali.
              </p>
              <p>
                Ma il nostro obiettivo più grande rimane lo stesso di sempre: accogliere ogni persona,
                di ogni età, e accompagnarla in un percorso di crescita autentica attraverso la
                disciplina del Taekwondo.
              </p>
            </div>

            {/* Valori */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {valori.map(({ icon: Icon, titolo, testo }, i) => (
                <motion.div
                  key={titolo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-10 h-10 border border-hornets-yellow/30 flex items-center justify-center mx-auto mb-3">
                    <Icon size={18} className="text-hornets-yellow" />
                  </div>
                  <p className="text-hornets-white font-semibold text-sm uppercase tracking-widest mb-2">
                    {titolo}
                  </p>
                  <p className="text-white/40 text-xs leading-relaxed">{testo}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

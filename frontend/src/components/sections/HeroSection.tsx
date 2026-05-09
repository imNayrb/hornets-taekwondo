'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
});

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">

      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-hornets-yellow/10 blur-[120px] translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-hornets-yellow/8 blur-[100px] -translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full bg-hornets-yellow/5 blur-[80px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#0D0D0D 1px, transparent 1px), linear-gradient(90deg, #0D0D0D 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 section-container pt-28 pb-20">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div variants={fadeUp(0.1)} initial="hidden" animate="visible" className="flex justify-center mb-8">
            <span className="section-label">ASD Hornets Taekwondo · Catanzaro</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp(0.25)}
            initial="hidden"
            animate="visible"
            className="font-display font-black text-display-xl text-hornets-ink tracking-tight text-balance mb-6"
          >
            Il Taekwondo che{' '}
            <span className="relative inline-block">
              <span className="text-gradient">trasforma</span>
              <motion.svg
                viewBox="0 0 300 12"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.path
                  d="M 0 6 Q 75 0 150 6 Q 225 12 300 6"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </motion.svg>
            </span>
            {' '}la tua vita
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp(0.4)}
            initial="hidden"
            animate="visible"
            className="text-hornets-ink-muted text-lg lg:text-xl max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
          >
            Corsi per bambini, adulti e agonisti. Più di 15 anni di storia,
            oltre 200 atleti e 50 medaglie. Scopri la disciplina degli Hornets.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp(0.55)}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link href="/#contatti" className="btn-yellow gap-2 text-base px-8 py-4">
              Prenota Prova Gratuita
              <ArrowRight size={18} />
            </Link>
            <Link href="/#corsi" className="btn-outline text-base px-8 py-4">
              Scopri i corsi
            </Link>
          </motion.div>

          {/* Stats pills */}
          <motion.div
            variants={fadeUp(0.7)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { value: '15+', label: 'anni di storia' },
              { value: '200+', label: 'atleti attivi' },
              { value: '50+', label: 'medaglie vinte' },
              { value: '4', label: 'maestri certificati' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2.5 bg-white border border-hornets-border rounded-full px-5 py-2.5 shadow-soft">
                <span className="font-display font-bold text-hornets-yellow text-lg leading-none">{value}</span>
                <span className="text-hornets-ink-muted text-sm">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating cards decorativi */}
        <motion.div
          initial={{ opacity: 0, x: 60, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 3 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="hidden xl:block absolute right-12 top-1/2 -translate-y-1/2 w-52 card p-5 shadow-medium"
        >
          <div className="w-10 h-10 bg-hornets-yellow-pale rounded-2xl flex items-center justify-center mb-3">
            <span className="text-2xl">🥋</span>
          </div>
          <p className="font-display font-bold text-hornets-ink text-sm mb-1">Prossima lezione</p>
          <p className="text-hornets-ink-muted text-xs">Oggi ore 17:00</p>
          <p className="text-hornets-ink-muted text-xs">Taekwondo Bambini</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -60, rotate: -2 }}
          animate={{ opacity: 1, x: 0, rotate: -2 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="hidden xl:block absolute left-12 top-1/2 translate-y-8 w-48 card p-5 shadow-medium"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {['#F5A623', '#0F0F1A', '#E08C00'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-xs text-hornets-ink-muted font-medium">+197</span>
          </div>
          <p className="font-semibold text-hornets-ink text-sm">Atleti attivi</p>
          <p className="text-hornets-yellow text-xs font-medium mt-0.5">↑ 12% questo mese</p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown size={20} className="text-hornets-ink-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}

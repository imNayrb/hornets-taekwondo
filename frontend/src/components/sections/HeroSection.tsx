'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, Play } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.addEventListener('canplay', () => setVideoLoaded(true));
    video.play().catch(() => {});
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.webm" type="video/webm" />
        </video>

        {/* Fallback gradient when video not loaded */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gradient-diagonal from-hornets-black-soft via-hornets-black to-hornets-black" />
        )}

        {/* Overlay */}
        <div className="video-overlay absolute inset-0" />

        {/* Decorative yellow line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute left-8 lg:left-16 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-hornets-yellow to-transparent origin-top"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center lg:text-left pt-24">
        <div className="max-w-4xl">
          {/* Label */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="section-label mb-6"
          >
            ASD Hornets Taekwondo · Catanzaro
          </motion.p>

          {/* Main Title */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="font-display text-display-xl text-hornets-white uppercase mb-4 leading-none"
          >
            Disciplina.
            <br />
            <span className="text-gradient">Forza.</span>
            <br />
            Rispetto.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.65}
            className="text-white/60 text-lg lg:text-xl max-w-xl mb-10 text-balance"
          >
            Il Taekwondo non è solo uno sport. È uno stile di vita.
            Unisciti agli Hornets e scopri il tuo potenziale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.85}
            className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
          >
            <Link href="/#contatti" className="btn-primary animate-pulse-yellow">
              Prenota Prova Gratuita
            </Link>
            <Link href="/#corsi" className="btn-outline">
              Scopri i Corsi
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1.1}
            className="flex flex-wrap justify-center lg:justify-start gap-8 mt-16 pt-8 border-t border-white/10"
          >
            {[
              { value: '15+', label: 'Anni di attività' },
              { value: '200+', label: 'Atleti attivi' },
              { value: '50+', label: 'Medaglie vinte' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p className="font-display text-3xl text-hornets-yellow uppercase">{value}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Scorri</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={20} className="text-hornets-yellow" />
        </motion.div>
      </motion.div>
    </section>
  );
}

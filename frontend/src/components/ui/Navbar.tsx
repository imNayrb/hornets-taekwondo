'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Corsi', href: '/#corsi' },
  { label: 'Chi Siamo', href: '/#chi-siamo' },
  { label: 'Galleria', href: '/#galleria' },
  { label: 'News', href: '/#news' },
  { label: 'Contatti', href: '/#contatti' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'py-3 bg-white/90 backdrop-blur-xl shadow-soft border-b border-hornets-border'
        : 'py-5 bg-transparent'
    }`}>
      <nav className="section-container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-hornets-yellow rounded-xl flex items-center justify-center font-display font-black text-hornets-ink text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            H
          </div>
          <div className="hidden sm:block leading-none">
            <span className="block font-display font-bold text-hornets-ink text-base tracking-tight">Hornets</span>
            <span className="block text-hornets-ink-muted text-[10px] font-medium tracking-widest uppercase">Taekwondo · Catanzaro</span>
          </div>
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="px-4 py-2 rounded-full text-sm font-medium text-hornets-ink-soft hover:text-hornets-ink hover:bg-hornets-surface-2 transition-all duration-200">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/#contatti" className="btn-yellow text-xs">Prova Gratuita</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-hornets-surface-2 text-hornets-ink" aria-label="Menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-hornets-border mx-4 mt-2 rounded-2xl shadow-medium overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium text-hornets-ink-soft hover:text-hornets-ink hover:bg-hornets-surface-2 transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-1 border-t border-hornets-border">
                <Link href="/#contatti" onClick={() => setOpen(false)} className="btn-yellow w-full mt-2 justify-center">
                  Prenota Prova Gratuita
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Corsi', href: '/#corsi' },
  { label: 'Chi Siamo', href: '/#chi-siamo' },
  { label: 'Galleria', href: '/#galleria' },
  { label: 'News', href: '/#news' },
  { label: 'Contatti', href: '/#contatti' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-hornets-black/95 backdrop-blur-md border-b border-white/5 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <nav className="section-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-hornets-yellow flex items-center justify-center font-display text-hornets-black text-xl font-black transition-transform group-hover:scale-110">
            H
          </div>
          <div className="hidden sm:block">
            <span className="block font-display text-hornets-white text-lg uppercase tracking-wider leading-none">
              Hornets
            </span>
            <span className="block text-hornets-yellow text-xs uppercase tracking-[0.3em] leading-none mt-0.5">
              Taekwondo · Catanzaro
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white/70 hover:text-hornets-yellow text-sm uppercase tracking-widest font-medium
                           transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-hornets-yellow transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/#contatti" className="btn-primary text-xs px-6 py-3">
            Prova Gratuita
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden text-white/80 hover:text-hornets-yellow transition-colors p-2"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-hornets-black-soft border-t border-white/5 overflow-hidden"
          >
            <div className="section-container py-6 flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="block text-white/80 hover:text-hornets-yellow uppercase tracking-widest text-sm font-medium py-2 transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contatti"
                onClick={() => setIsMobileOpen(false)}
                className="btn-primary mt-2 w-full text-center"
              >
                Prenota Prova Gratuita
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

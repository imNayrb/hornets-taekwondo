'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Calendar, ArrowUpRight, ExternalLink } from 'lucide-react';
import { apiClient } from '@/lib/api.client';
import Link from 'next/link';

interface DashboardStats {
  totaleIscritti: number;
  iscrittiAttivi: number;
  totaleCorsi: number;
  messaggiNuovi: number;
  prenotazioniNuove: number;
}

const statCards = [
  { key: 'totaleCorsi', label: 'Corsi Attivi', icon: BookOpen, accent: '#60a5fa', href: '/admin/corsi' },
  { key: 'messaggiNuovi', label: 'Messaggi Nuovi', icon: MessageSquare, accent: '#f87171', href: '/admin/messaggi' },
  { key: 'prenotazioniNuove', label: 'Prenotazioni Nuove', icon: Calendar, accent: '#34d399', href: '/admin/prenotazioni' },
];

const quickActions = [
  { label: 'Gestisci corsi', href: '/admin/corsi', accent: '#60a5fa' },
  { label: 'Prenotazioni', href: '/admin/prenotazioni', accent: '#34d399' },
  { label: 'Leggi messaggi', href: '/admin/messaggi', accent: '#f87171' },
  { label: 'Carica media', href: '/admin/galleria', accent: '#a78bfa' },
  { label: 'Pubblica news', href: '/admin/news', accent: '#F5A623' },
  { label: 'Configura sito', href: '/admin/impostazioni', accent: '#f9a8d4' },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/dashboard')
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Pannello di controllo</p>
        <h1 className="font-display font-bold text-white text-3xl">Benvenuto nel backoffice</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ key, label, icon: Icon, accent, href }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={href}
              className="block bg-hornets-black-card border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.14] hover:bg-hornets-black-hover transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${accent}18` }}
                >
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <ArrowUpRight size={14} className="text-white/15 group-hover:text-white/40 transition-colors mt-0.5" />
              </div>
              <p className="font-display font-bold text-3xl text-white mb-1">
                {loading ? (
                  <span className="block w-10 h-7 bg-white/[0.05] animate-pulse rounded-lg" />
                ) : (
                  stats?.[key as keyof DashboardStats] ?? 0
                )}
              </p>
              <p className="text-white/35 text-xs font-medium">{label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-hornets-black-card border border-white/[0.06] rounded-2xl p-6">
          <p className="admin-section-label mb-5">Azioni rapide</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map(({ label, href, accent }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.07] transition-all duration-200 text-sm font-medium"
                style={{ color: accent }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Hornets card */}
        <div className="bg-hornets-yellow/[0.06] border border-hornets-yellow/20 rounded-2xl p-6 flex flex-col">
          <div className="w-10 h-10 bg-hornets-yellow rounded-xl flex items-center justify-center font-display text-hornets-ink text-xl font-black mb-4">
            H
          </div>
          <p className="text-hornets-yellow font-bold text-sm uppercase tracking-wider mb-2">
            Hornets Taekwondo
          </p>
          <p className="text-white/35 text-xs leading-relaxed flex-1">
            Gestisci iscritti, corsi, galleria, news e tutte le impostazioni del sito web.
          </p>
          <Link
            href="/"
            target="_blank"
            className="mt-5 flex items-center gap-1.5 text-hornets-yellow text-xs font-semibold hover:underline"
          >
            <ExternalLink size={12} /> Apri sito pubblico
          </Link>
        </div>
      </div>
    </div>
  );
}

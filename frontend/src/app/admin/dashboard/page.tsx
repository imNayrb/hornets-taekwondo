'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, MessageSquare, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { apiClient } from '@/lib/api.client';

interface DashboardStats {
  totaleIscritti: number;
  iscrittiAttivi: number;
  totaleCorsi: number;
  messaggiNuovi: number;
  prenotazioniNuove: number;
}

const statCards = [
  { key: 'iscrittiAttivi', label: 'Iscritti Attivi', icon: Users, color: '#F5A623', href: '/admin/iscritti' },
  { key: 'totaleCorsi', label: 'Corsi Attivi', icon: BookOpen, color: '#F9F9F9', href: '/admin/corsi' },
  { key: 'messaggiNuovi', label: 'Messaggi Nuovi', icon: MessageSquare, color: '#D0021B', href: '/admin/messaggi' },
  { key: 'prenotazioniNuove', label: 'Prenotazioni', icon: Calendar, color: '#F5A623', href: '/admin/prenotazioni' },
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
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl text-hornets-white uppercase">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">
          Benvenuto nel backoffice Hornets Taekwondo
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ key, label, icon: Icon, color, href }, i) => (
          <motion.a
            key={key}
            href={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-hornets-black-card border border-white/5 p-6 hover:border-white/10 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 border flex items-center justify-center"
                   style={{ borderColor: `${color}30`, color }}>
                <Icon size={18} />
              </div>
              <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <p className="font-display text-3xl text-hornets-white uppercase mb-1">
              {loading ? (
                <span className="block w-12 h-7 bg-white/5 animate-pulse rounded" />
              ) : (
                stats?.[key as keyof DashboardStats] ?? 0
              )}
            </p>
            <p className="text-white/30 text-xs uppercase tracking-widest">{label}</p>
          </motion.a>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-hornets-black-card border border-white/5 p-6">
          <h2 className="text-hornets-white font-semibold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
            <TrendingUp size={16} className="text-hornets-yellow" />
            Azioni Rapide
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Aggiungi iscritto', href: '/admin/iscritti/nuovo', color: '#F5A623' },
              { label: 'Carica foto/video', href: '/admin/galleria', color: '#F9F9F9' },
              { label: 'Pubblica news', href: '/admin/news/nuova', color: '#F5A623' },
              { label: 'Gestisci orari', href: '/admin/corsi', color: '#F9F9F9' },
              { label: 'Vedi messaggi', href: '/admin/messaggi', color: '#D0021B' },
              { label: 'Configura sito', href: '/admin/impostazioni', color: '#F9F9F9' },
            ].map(({ label, href, color }) => (
              <a
                key={label}
                href={href}
                className="border border-white/5 px-4 py-3 text-sm font-medium transition-all duration-200
                           hover:border-hornets-yellow/30 hover:bg-white/3 flex items-center gap-2"
                style={{ color }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-hornets-yellow/5 border border-hornets-yellow/20 p-6">
          <div className="w-10 h-10 bg-hornets-yellow flex items-center justify-center font-display text-hornets-black text-xl font-black mb-4">
            H
          </div>
          <h3 className="text-hornets-yellow font-semibold text-sm uppercase tracking-widest mb-2">
            Hornets Taekwondo
          </h3>
          <p className="text-white/40 text-xs leading-relaxed mb-4">
            Pannello di controllo per la gestione del sito web, degli iscritti, dei corsi e dei contenuti multimediali.
          </p>
          <a
            href="/"
            target="_blank"
            className="text-hornets-yellow text-xs uppercase tracking-widest flex items-center gap-1 hover:underline"
          >
            Apri il sito →
          </a>
        </div>
      </div>
    </div>
  );
}

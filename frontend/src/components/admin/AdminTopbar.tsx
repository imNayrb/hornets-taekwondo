'use client';

import { Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function AdminTopbar() {
  return (
    <header className="h-16 border-b border-white/5 bg-hornets-black-card flex items-center justify-between px-6">
      <div />

      <div className="flex items-center gap-3">
        {/* Link al sito */}
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-white/30 hover:text-hornets-yellow text-xs uppercase tracking-widest transition-colors"
        >
          <ExternalLink size={13} />
          Vedi sito
        </Link>

        {/* Notifiche */}
        <button className="relative p-2 text-white/30 hover:text-white/60 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hornets-yellow rounded-full" />
        </button>
      </div>
    </header>
  );
}

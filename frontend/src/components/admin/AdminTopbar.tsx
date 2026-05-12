'use client';

import { Bell, ExternalLink, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/iscritti': 'Iscritti',
  '/admin/corsi': 'Corsi',
  '/admin/prenotazioni': 'Prenotazioni',
  '/admin/messaggi': 'Messaggi',
  '/admin/galleria': 'Galleria',
  '/admin/news': 'News',
  '/admin/impostazioni': 'Impostazioni',
};

export function AdminTopbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? 'Admin';

  return (
    <header className="h-16 border-b border-white/[0.06] bg-hornets-black flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-2 text-white/40 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all">
          <Menu size={18} />
        </button>
        <h1 className="font-display font-bold text-white text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-white/30 hover:text-hornets-yellow text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-hornets-yellow/5 transition-all"
        >
          <ExternalLink size={13} />
          Vedi sito
        </Link>

        <button className="relative p-2 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5 transition-all">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-hornets-yellow rounded-full" />
        </button>
      </div>
    </header>
  );
}

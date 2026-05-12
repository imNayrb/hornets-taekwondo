'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Image, Newspaper,
  MessageSquare, Settings, LogOut, Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth.store';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Corsi', href: '/admin/corsi', icon: BookOpen },
  { label: 'Prenotazioni', href: '/admin/prenotazioni', icon: Calendar },
  { label: 'Messaggi', href: '/admin/messaggi', icon: MessageSquare },
  { label: 'Galleria', href: '/admin/galleria', icon: Image },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Impostazioni', href: '/admin/impostazioni', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-hornets-black min-h-screen border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-hornets-yellow rounded-xl flex items-center justify-center font-display text-hornets-ink text-lg font-black shrink-0">
            H
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Hornets TKD</p>
            <p className="text-white/30 text-[10px] leading-none mt-1 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Gestione</p>
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-hornets-yellow/10 text-hornets-yellow'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                  )}
                >
                  <Icon size={16} className={isActive ? 'text-hornets-yellow' : ''} />
                  {label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-hornets-yellow" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] mb-1">
          <div className="w-8 h-8 bg-hornets-yellow/15 rounded-lg flex items-center justify-center text-hornets-yellow text-xs font-bold uppercase shrink-0">
            {user?.nome?.[0]}{user?.cognome?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white/80 text-xs font-semibold truncate">
              {user?.nome} {user?.cognome}
            </p>
            <p className="text-white/30 text-[10px] capitalize">{user?.ruolo}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-white/30 hover:text-red-400 text-xs px-3 py-2.5 rounded-xl hover:bg-red-500/5 transition-all"
        >
          <LogOut size={14} />
          Disconnetti
        </button>
      </div>
    </aside>
  );
}

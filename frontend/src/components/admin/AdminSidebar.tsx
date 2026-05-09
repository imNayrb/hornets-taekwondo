'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Image, Newspaper,
  Users, MessageSquare, Settings, LogOut, Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth.store';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Corsi', href: '/admin/corsi', icon: BookOpen },
  { label: 'Galleria', href: '/admin/galleria', icon: Image },
  { label: 'News', href: '/admin/news', icon: Newspaper },
  { label: 'Iscritti', href: '/admin/iscritti', icon: Users },
  { label: 'Prenotazioni', href: '/admin/prenotazioni', icon: Calendar },
  { label: 'Messaggi', href: '/admin/messaggi', icon: MessageSquare },
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
    <aside className="hidden lg:flex flex-col w-64 bg-hornets-black-card border-r border-white/5 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-hornets-yellow flex items-center justify-center font-display text-hornets-black text-lg font-black">
            H
          </div>
          <div>
            <p className="text-hornets-white font-semibold text-sm leading-none">Hornets</p>
            <p className="text-white/30 text-xs leading-none mt-0.5">Backoffice</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <ul className="space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-hornets-yellow/10 text-hornets-yellow border-l-2 border-hornets-yellow pl-[10px]'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5 rounded-none border-l-2 border-transparent pl-[10px]'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-hornets-yellow/20 border border-hornets-yellow/30 flex items-center justify-center text-hornets-yellow text-xs font-bold uppercase">
            {user?.nome?.[0]}{user?.cognome?.[0]}
          </div>
          <div className="min-w-0">
            <p className="text-white/70 text-xs font-medium truncate">
              {user?.nome} {user?.cognome}
            </p>
            <p className="text-white/30 text-xs capitalize">{user?.ruolo}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-white/30 hover:text-red-400 text-xs px-3 py-2 transition-colors"
        >
          <LogOut size={14} />
          Disconnetti
        </button>
      </div>
    </aside>
  );
}

import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-hornets-dark text-white">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-hornets-yellow rounded-xl flex items-center justify-center font-display font-black text-hornets-ink text-lg">H</div>
              <div>
                <span className="block font-display font-bold text-white text-base">Hornets</span>
                <span className="block text-white/40 text-[10px] font-medium uppercase tracking-widest">Taekwondo · Catanzaro</span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">Palestra di Taekwondo a Catanzaro. Disciplina, forza e rispetto per atleti di ogni eta.</p>
            <div className="flex gap-2">
              {[{ icon: Instagram, href: '#', label: 'Instagram' }, { icon: Facebook, href: '#', label: 'Facebook' }, { icon: Youtube, href: '#', label: 'YouTube' }].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-9 h-9 bg-white/5 hover:bg-hornets-yellow/20 rounded-xl flex items-center justify-center text-white/40 hover:text-hornets-yellow transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white/30 uppercase tracking-widest text-xs font-bold mb-5">Navigazione</h3>
            <ul className="space-y-3">
              {['Home', 'Corsi', 'Chi Siamo', 'Galleria', 'News', 'Contatti'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white/30 uppercase tracking-widest text-xs font-bold mb-5">I Corsi</h3>
            <ul className="space-y-3">
              {['Taekwondo Bambini', 'Taekwondo Ragazzi', 'Taekwondo Adulti', 'Agonismo & Competizione'].map((corso) => (
                <li key={corso}>
                  <Link href="/#corsi" className="text-white/40 hover:text-white text-sm transition-colors duration-200">{corso}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white/30 uppercase tracking-widest text-xs font-bold mb-5">Contatti</h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, value: 'Via Roma 1, 88100 Catanzaro CZ', href: '' },
                { icon: Phone, value: '+39 0961 000000', href: 'tel:+390961000000' },
                { icon: Mail, value: 'info@hornets-taekwondo.it', href: 'mailto:info@hornets-taekwondo.it' },
              ].map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-hornets-yellow/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={13} className="text-hornets-yellow" />
                  </div>
                  {href
                    ? <a href={href} className="text-white/40 hover:text-white text-sm transition-colors">{value}</a>
                    : <span className="text-white/40 text-sm">{value}</span>
                  }
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Hornets Taekwondo ASD – Catanzaro. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-white/20 hover:text-white/50 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/cookie" className="text-white/20 hover:text-white/50 text-xs transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

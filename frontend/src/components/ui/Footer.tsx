import Link from 'next/link';
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-hornets-black border-t border-white/5">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-hornets-yellow flex items-center justify-center font-display text-hornets-black text-xl font-black">
                H
              </div>
              <div>
                <span className="block font-display text-hornets-white text-lg uppercase tracking-wider leading-none">
                  Hornets
                </span>
                <span className="block text-hornets-yellow text-xs uppercase tracking-[0.3em] leading-none mt-0.5">
                  Taekwondo
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Palestra di Taekwondo a Catanzaro. Disciplina, forza e rispetto per atleti di ogni età.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/hornets_taekwondo_cz', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/hornetstaekwondo', label: 'Facebook' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-white/40
                             hover:border-hornets-yellow hover:text-hornets-yellow transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigazione */}
          <div>
            <h3 className="text-hornets-yellow uppercase tracking-[0.2em] text-xs font-bold mb-6">
              Navigazione
            </h3>
            <ul className="space-y-3">
              {['Home', 'Corsi', 'Chi Siamo', 'Galleria', 'News', 'Contatti'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Home' ? '/' : `/#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-white/50 hover:text-hornets-yellow text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corsi */}
          <div>
            <h3 className="text-hornets-yellow uppercase tracking-[0.2em] text-xs font-bold mb-6">
              I Nostri Corsi
            </h3>
            <ul className="space-y-3">
              {['Taekwondo Bambini', 'Taekwondo Ragazzi', 'Taekwondo Adulti', 'Agonismo & Competizione'].map((corso) => (
                <li key={corso}>
                  <Link
                    href="/#corsi"
                    className="text-white/50 hover:text-hornets-yellow text-sm transition-colors duration-200"
                  >
                    {corso}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="text-hornets-yellow uppercase tracking-[0.2em] text-xs font-bold mb-6">
              Contatti
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/50">
                <MapPin size={16} className="text-hornets-yellow shrink-0 mt-0.5" />
                <span>Via Roma 1, 88100 Catanzaro CZ</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Phone size={16} className="text-hornets-yellow shrink-0" />
                <a href="tel:+390961000000" className="hover:text-hornets-yellow transition-colors">
                  +39 0961 000000
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <Mail size={16} className="text-hornets-yellow shrink-0" />
                <a href="mailto:info@hornets-taekwondo.it" className="hover:text-hornets-yellow transition-colors">
                  info@hornets-taekwondo.it
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Hornets Taekwondo ASD – Catanzaro. Tutti i diritti riservati.
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <Link href="/privacy" className="hover:text-hornets-yellow transition-colors">Privacy Policy</Link>
            <Link href="/cookie" className="hover:text-hornets-yellow transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

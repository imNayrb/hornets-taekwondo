import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hornets-taekwondo.it'),
  title: {
    default: 'Hornets Taekwondo Catanzaro',
    template: '%s | Hornets Taekwondo',
  },
  description:
    'La palestra di Taekwondo a Catanzaro. Corsi per bambini, adulti e agonisti. Disciplina, forza, rispetto. Prenota la tua prova gratuita!',
  keywords: ['taekwondo', 'catanzaro', 'palestra', 'arti marziali', 'bambini', 'adulti', 'agonisti'],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://hornets-taekwondo.it',
    siteName: 'Hornets Taekwondo Catanzaro',
    title: 'Hornets Taekwondo Catanzaro',
    description: 'Palestra di Taekwondo per bambini, adulti e agonisti a Catanzaro.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="bg-hornets-bg text-hornets-ink antialiased">
        {children}
      </body>
    </html>
  );
}

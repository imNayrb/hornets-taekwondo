import { HeroSection } from '@/components/sections/HeroSection';
import { CorsiSection } from '@/components/sections/CorsiSection';
import { ChiSiamoSection } from '@/components/sections/ChiSiamoSection';
import { NumeriSection } from '@/components/sections/NumeriSection';
import { GalleriaSection } from '@/components/sections/GalleriaSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { ContattiSection } from '@/components/sections/ContattiSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <NumeriSection />
      <CorsiSection />
      <ChiSiamoSection />
      <GalleriaSection />
      <NewsSection />
      <ContattiSection />
    </>
  );
}

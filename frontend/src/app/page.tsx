import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import ImageGallery from '@/components/sections/ImageGallery';
import FAQ from '@/components/sections/FAQ';
import Pricing from '@/components/sections/Pricing';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ImageGallery />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}

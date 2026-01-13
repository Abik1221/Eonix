import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import Features from '@/components/sections/Features';
import FAQ from '@/components/sections/FAQ';
import Pricing from '@/components/sections/Pricing';

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
        <Footer />
      </main>
    </>
  );
}


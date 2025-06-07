import React from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import DeliverySection from './components/DeliverySection';
import ContactSection from './components/ContactSection';

function App() {
  return (
    <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <DeliverySection />
        <ContactSection />
      </main>
    </div>
  );
}

export default App;

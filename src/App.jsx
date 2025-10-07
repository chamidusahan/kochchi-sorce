import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import DeliverySection from './components/DeliverySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoginSignup from "./pages/LoginSignup";


function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <AboutSection />
                <ProductsSection />
                <DeliverySection />
                <ContactSection />
                <Footer />                
              </>
            } />
						<Route path="/login" element={<LoginSignup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProductsSection from './components/ProductsSection';
import DeliverySection from './components/DeliverySection';
import RatingsSection from './components/RatingsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LoginSignup from "./pages/LoginSignup";
import OrderNow from "./pages/OrderNow";
import MyOrders from "./pages/MyOrders";
import AboutUs from "./pages/AboutUs";
import SingleProduct from "./pages/SingleProduct";
import ExpressCheckout from "./pages/ExpressCheckout";
import { useEffect } from "react";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <HeroSection />
              <AboutSection />
              <ProductsSection />
              <DeliverySection />
              <RatingsSection />
              <ContactSection />
              <Footer />                
            </>
          } />
          <Route path="/login" element={<><Navbar /><LoginSignup /></>} />
          <Route path="/order" element={<><Navbar /><OrderNow /></>} />
          <Route path="/checkout/:productId?" element={<><Navbar /><ExpressCheckout /><Footer /></>} />
          <Route path="/my-orders" element={<><Navbar /><MyOrders /></>} />
          <Route path="/about" element={<><Navbar /><AboutUs /><Footer /></>} />
          <Route path="/products/:productId" element={<><Navbar /><SingleProduct /><Footer /></>} />

          {/*admin routes*/} 
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
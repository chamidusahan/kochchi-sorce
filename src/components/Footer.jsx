import React from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";

const quickLinks = [
  { label: "Our Story", href: "#about" },
  { label: "Menu", href: "#products" },
  { label: "Order Now", href: "#order-now" },
  { label: "Contact", href: "#contact" },
];

const supportLinks = [
  { label: "FAQ", href: "#" },
  { label: "Shipping & Returns", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

const socials = [
  { icon: <Facebook size={18} />, href: "https://facebook.com", label: "Facebook" },
  { icon: <Instagram size={18} />, href: "https://instagram.com", label: "Instagram" },
  { icon: <Youtube size={18} />, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="relative bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.25),transparent_55%)]" aria-hidden />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid gap-12 lg:gap-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/images/logo.jpg"
                alt="Spice Up logo"
                className="h-20 w-20 rounded-full border border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.4)] object-cover"
              />
              <div>
                <p className="text-sm uppercase tracking-[0.6em] text-red-400 font-semibold">Feel The Heat</p>
                <h2 className="text-3xl font-extrabold tracking-wide">SPICE UP</h2>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base max-w-lg">
              Born from a love for bold flavours, Spice Up crafts fire-kissed sauces and street-food inspired bites that ignite every taste bud. We source local ingredients, slow simmer them with care, and deliver heat that hugs—not hurts.
            </p>

            <div className="mt-8 space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="text-red-400" size={18} />
                <a href="mailto:hello@spiceuphot.com" className="hover:text-red-400 transition-colors">
                  hello@spiceuphot.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-red-400" size={18} />
                <a href="tel:+94771234567" className="hover:text-red-400 transition-colors">
                  +94 77 123 4567
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-red-400 mt-0.5" size={18} />
                <span>212 Flame Avenue, Colombo 05, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-red-400" size={18} />
                <span>Daily 10.00 AM – 11.00 PM</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-red-400 hover:bg-red-500/20 hover:text-red-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid gap-12 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400 mb-5">Navigate</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-red-400"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400 mb-5">Support</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors hover:text-red-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sm:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400 mb-5">Stay Spiced</h3>
              <p className="text-gray-400 text-sm">
                Join the heat wave for weekly drops, flash deals, and behind-the-fire stories from the grill.
              </p>
              <form className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="newsletter"
                  placeholder="you@example.com"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-600"
                >
                  Ignite
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-400 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Spice Up Kitchens. Crafted with fire and flavour in Colombo.
          </p>
          <div className="flex gap-6 text-xs uppercase tracking-[0.25em]">
            <a href="#" className="hover:text-red-400">Sitemap</a>
            <a href="#" className="hover:text-red-400">Cookies</a>
            <a href="#" className="hover:text-red-400">Careers</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

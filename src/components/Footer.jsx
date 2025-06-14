import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  company: [
    { name: "About", href: "#" },
    { name: "Terms of Use", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "How it Works", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  getHelp: [
    { name: "Support Career", href: "#" },
    { name: "24h Service", href: "#" },
    { name: "Quick Chat", href: "#" },
  ],
  support: [
    { name: "FAQ", href: "#" },
    { name: "Policy", href: "#" },
    { name: "Business", href: "#" },
  ],
  contact: [
    { name: "WhatsApp", href: "#" },
    { name: "Support 24", href: "#" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black via-red-900 to-black text-white font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

          {/* Logo & About */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="public/images/icon.png"
                alt="Logo"
                className="w-20 h-20 object-contain rounded-xl border-2 border-red-600 shadow-lg"
              />
              <span className="text-3xl font-bold font-mono text-red-500 tracking-wide">
                SPICE UP
              </span>
            </div>
            <p className="text-gray-300 font-light italic leading-relaxed text-sm md:text-base">
              The copy warned the Little Blind Text, that where it came from it
              would have been rewritten a thousand times. Discover flavorful
              experiences with us.
            </p>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold tracking-wider text-white mb-4 uppercase">
                    {category}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-sm text-gray-400 font-medium hover:text-red-500 transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-xs text-gray-500 tracking-wide font-light">
            &copy; {new Date().getFullYear()} <span className="font-semibold">codetutorbd.com</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

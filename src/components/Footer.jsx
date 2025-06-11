import React from "react";

 const footerLinks = {
    company: [
      { name: 'About', href: '#' },
      { name: 'Terms of Use', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'How it Works', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    getHelp: [
      { name: 'Support Carrer', href: '#' },
      { name: '24h Service', href: '#' },
      { name: 'Quick Chat', href: '#' },
    ],
    support: [
      { name: 'FAQ', href: '#' },
      { name: 'Policy', href: '#' },
      { name: 'Business', href: '#' },
    ],
    contact: [
      { name: 'WhatsApp', href: '#' },
      { name: 'Support 24', href: '#' },
    ],
  }

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-red-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* brand column */}
          <div className="lg:col-span-4">
            <div className="flex gap-1 items-center mb-6">
            <div className="flex items-center gap-1 cursor-pointer">
             <img src="public\images\icon.png" className="w-24 h-24" alt="" />
            </div>

          

          </div>

          <p className="text-white-600 font-bold mb-6 md:w-3/4">The copy warned the Litte Blind Text, that where it came from it would have been rewritten a thousand times</p>

         

          </div>

{/* footer nav items */}
<div className="lg:col-span-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {Object.entries(footerLinks).map(([category, links], categoryIndex) =>(
            <div key={category}>
                <h3 className="text-lg text-red-800 font-medium mb-4 uppercase">{category}</h3>
                <ul className="space-y-3">
                    {links.map((link, index) => (
                        <li key={index}>
                            <a href="#" className="text-white-600 hover:text-gray-600">{link.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
</div>

        </div>

        {/* footer bottom */}

        <div className="border-t text-center border-gray-200 mt-12 pt-8">
            <div>
                <p>Copyright © {new Date().getFullYear()} codetutorbd.com</p>
            </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { List, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 font-hkgrotesk">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <List size={20} />
              </div>
              <h1 className="text-xl font-black text-white tracking-tighter">GALAXY DIGITAL</h1>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Your premium destination for electronics in Agadir. We provide the latest technology with local delivery and expert support.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links (Section 1.7) */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Galaxy Digital</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Brands</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Customer Service (Section 1.7) */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Delivery & Payment</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Warranty & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Get In Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <span>Sector 7, Agadir, Morocco</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>+212 600 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>contact@galaxydigital.ma</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
          <p>© 2026 GALAXY DIGITAL. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span>Powered by Digilion</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
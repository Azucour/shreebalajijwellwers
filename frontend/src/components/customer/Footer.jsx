import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Clock, Gem, MessageCircle } from 'lucide-react';
import { SHOP } from '../../utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Top gold line */}
      <div className="h-1 bg-gold-gradient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center">
                <Gem size={16} className="text-charcoal" />
              </div>
              <div>
                <div className="font-playfair font-bold text-lg leading-tight">{SHOP.name}</div>
                <div className="text-gold-400 text-xs tracking-widest uppercase font-cormorant">
                  {SHOP.tagline}
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Your trusted destination for exquisite gold, diamond and silver jewellery.
              Crafted with passion, delivered with love.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <a
                href={SHOP.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gold-600 flex items-center justify-center
                  text-gold-400 hover:bg-gold-500 hover:text-charcoal transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href={`https://wa.me/${SHOP.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gold-600 flex items-center justify-center
                  text-gold-400 hover:bg-gold-500 hover:text-charcoal transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href={SHOP.phoneTel}
                className="w-9 h-9 rounded-full border border-gold-600 flex items-center justify-center
                  text-gold-400 hover:bg-gold-500 hover:text-charcoal transition-all duration-300"
                aria-label="Call us"
              >
                <Phone size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair font-semibold text-base mb-5 text-gold-300 border-b border-gold-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Collections' },
                { to: '/products?category=Gold', label: 'Gold Jewellery' },
                { to: '/products?category=Diamond', label: 'Diamond Jewellery' },
                { to: '/products?category=Bridal Sets', label: 'Bridal Collection' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-gold-400 transition-colors text-sm
                      flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-gold-500">›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-playfair font-semibold text-base mb-5 text-gold-300 border-b border-gold-800 pb-2">
              Categories
            </h4>
            <ul className="space-y-2.5">
              {['Gold', 'Silver', 'Diamond', 'Rings', 'Necklaces', 'Bangles', 'Earrings', 'Bridal Sets'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="text-gray-400 hover:text-gold-400 transition-colors text-sm
                      flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-gold-500">›</span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-playfair font-semibold text-base mb-5 text-gold-300 border-b border-gold-800 pb-2">
              Visit Us
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span>{SHOP.address}</span>
              </li>
              <li>
                <a
                  href={SHOP.phoneTel}
                  className="flex gap-3 text-gray-400 hover:text-gold-400 transition-colors text-sm"
                >
                  <Phone size={16} className="text-gold-400 shrink-0" />
                  <span>{SHOP.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SHOP.email}`}
                  className="flex gap-3 text-gray-400 hover:text-gold-400 transition-colors text-sm"
                >
                  <Mail size={16} className="text-gold-400 shrink-0" />
                  <span>{SHOP.email}</span>
                </a>
              </li>
              <li className="flex gap-3 text-gray-400 text-sm">
                <Clock size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span>{SHOP.timing}</span>
              </li>
            </ul>

            {/* Instagram CTA */}
            <a
              href={SHOP.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center gap-2 border border-gold-600 text-gold-400
                hover:bg-gold-500 hover:text-charcoal transition-all duration-300
                rounded px-4 py-2.5 text-sm font-medium w-full justify-center"
            >
              <Instagram size={15} />
              Follow us on Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-4 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {year} {SHOP.name}. All rights reserved.</span>
          <span>Made with ♥ in India</span>
        </div>
      </div>
    </footer>
  );
}

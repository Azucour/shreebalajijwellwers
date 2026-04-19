import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Search, Gem } from 'lucide-react';
import { SHOP } from '../../utils/constants';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Collections' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const navBg = isHome
    ? scrolled ? 'bg-charcoal/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    : 'bg-charcoal shadow-md';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-9 h-9 md:w-11 md:h-11 bg-gold-gradient rounded-full flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Gem size={16} className="text-charcoal" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gold-400/30 animate-ping opacity-0 group-hover:opacity-100" />
              </div>
              <div>
                <div className="font-playfair font-bold text-white text-sm md:text-base leading-tight">
                  Shree Balaji
                </div>
                <div className="font-cormorant text-gold-400 text-xs tracking-widest uppercase">
                  Jewellers
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {links.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `font-poppins text-sm font-medium tracking-wide transition-colors duration-200 relative group
                    ${isActive ? 'text-gold-400' : 'text-white/80 hover:text-gold-300'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-gold-400 transition-all duration-300
                          ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <a
                href={SHOP.phoneTel}
                className="hidden md:flex items-center gap-2 text-gold-400 hover:text-gold-300
                  transition-colors duration-200 text-sm font-poppins"
              >
                <Phone size={15} />
                <span className="hidden lg:block">{SHOP.phone}</span>
              </a>

              <Link
                to="/products"
                className="hidden sm:flex items-center gap-1.5 btn-gold text-xs py-2 px-4"
              >
                <Search size={13} />
                Browse
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-white hover:text-gold-400 transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={menuOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-0.5 bg-gold-gradient opacity-60" />
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-72 bg-charcoal z-50 md:hidden shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-playfair text-gold-400 text-lg font-semibold">Menu</span>
                  <button onClick={() => setMenuOpen(false)} className="text-white hover:text-gold-400">
                    <X size={22} />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {links.map(({ to, label, end }, i) => (
                    <motion.div
                      key={to}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <NavLink
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                          `block py-3 px-4 rounded-lg font-poppins text-sm font-medium transition-all
                          ${isActive
                            ? 'bg-gold-gradient text-charcoal'
                            : 'text-white/80 hover:text-gold-400 hover:bg-white/5'
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                  <a
                    href={SHOP.phoneTel}
                    className="flex items-center gap-3 text-white/80 hover:text-gold-400 transition-colors text-sm"
                  >
                    <Phone size={16} className="text-gold-400" />
                    {SHOP.phone}
                  </a>
                  <a
                    href={`https://wa.me/${SHOP.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full btn-gold text-sm justify-center mt-4"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Star, ShieldCheck, Award, Truck, Phone } from 'lucide-react';
import { getProducts } from '../../utils/api';
import { SHOP } from '../../utils/constants';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/shared/Skeletons';

// ── Hero Slides ──────────────────────────────────────────────
const heroSlides = [
  {
    headline: 'Timeless Gold',
    subheadline: 'Jewellery that tells your story',
    cta: 'Explore Gold',
    ctaLink: '/products?category=Gold',
    bg: 'from-amber-900/80 via-charcoal/60 to-charcoal/80',
    accent: '#D4AF37',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=1400&q=80',
  },
  {
    headline: 'Bridal Elegance',
    subheadline: 'Make your special day unforgettable',
    cta: 'Bridal Collection',
    ctaLink: '/products?category=Bridal Sets',
    bg: 'from-rose-900/70 via-charcoal/60 to-charcoal/80',
    accent: '#F5C5D0',
    image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=1400&q=80',
  },
  {
    headline: 'Diamond Dreams',
    subheadline: 'A diamond as unique as you are',
    cta: 'View Diamonds',
    ctaLink: '/products?category=Diamond',
    bg: 'from-slate-900/80 via-charcoal/60 to-charcoal/80',
    accent: '#E0E7FF',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1400&q=80',
  },
];

// ── Category tiles ────────────────────────────────────────────
const categoryTiles = [
  { label: 'Gold', emoji: '✨', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80' },
  { label: 'Silver', emoji: '🔘', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
  { label: 'Diamond', emoji: '💎', image: 'https://images.unsplash.com/photo-1631897817977-a1005c199b36?w=800&q=80&auto=format&fit=crop' },
  { label: 'Rings', emoji: '💍', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&auto=format&fit=crop' },
  { label: 'Necklaces', emoji: '📿', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80' },
  { label: 'Bangles', emoji: '🌀', image: 'https://images.unsplash.com/photo-1611598935678-c88dca238fce?w=800&q=80&auto=format&fit=crop' },
  { label: 'Earrings', emoji: '🌸', image: 'https://images.unsplash.com/photo-1671644730555-916aa8d8157f?w=400&q=80' },
  { label: 'Bridal Sets', emoji: '👰', image: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=400&q=80' },
];

// ── Why choose us ─────────────────────────────────────────────
const features = [
  { icon: ShieldCheck, label: 'BIS Hallmarked', desc: 'Certified pure gold & silver' },
  { icon: Award, label: 'Premium Quality', desc: 'Crafted by master artisans' },
  { icon: Star, label: '1000+ Designs', desc: 'Exclusive curated collections' },
  { icon: Truck, label: 'Easy Exchange', desc: 'Hassle-free buy back policy' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    getProducts({ featured: true, limit: 8 })
      .then(({ data }) => setFeatured(data.products || []))
      .finally(() => setLoadingFeatured(false));

    getProducts({ trending: true, limit: 8 })
      .then(({ data }) => setTrending(data.products || []))
      .finally(() => setLoadingTrending(false));
  }, []);

  const currentSlide = heroSlides[slide];

  return (
    <>
      <Helmet>
        <title>Shree Balaji Jewellers – Premium Gold & Diamond Jewellery</title>
        <meta name="description" content="Explore premium gold, diamond and silver jewellery at Shree Balaji Jewellers. Rings, necklaces, bangles, bridal sets and more." />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[580px] max-h-[900px] overflow-hidden">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={s.image} alt={s.headline} className="w-full h-full object-cover" loading="lazy" />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.bg}`} />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-xl"
            >
              {/* Decorative line */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-gold-400" />
                <span className="text-gold-400 text-sm tracking-[0.2em] uppercase font-poppins font-medium">
                  {SHOP.name}
                </span>
              </div>

              <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
                {currentSlide.headline}
              </h1>
              <p className="font-cormorant text-xl md:text-2xl text-white/80 italic mb-8">
                {currentSlide.subheadline}
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to={currentSlide.ctaLink} className="btn-gold text-sm px-7 py-3.5 flex items-center gap-2">
                  {currentSlide.cta}
                  <ArrowRight size={16} />
                </Link>
                <a href={SHOP.phoneTel} className="btn-outline-gold bg-white/5 text-sm px-7 py-3.5 flex items-center gap-2">
                  <Phone size={15} />
                  Call Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`transition-all duration-300 rounded-full
                ${i === slide ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>
      </section>

      {/* ── WHY US STRIP ─────────────────────────────────────── */}
      <section className="bg-charcoal py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 shrink-0 bg-gold-gradient rounded-full flex items-center justify-center
                group-hover:scale-110 transition-transform duration-300">
                <Icon size={18} className="text-charcoal" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm font-poppins">{label}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="ornament-divider mb-3">
              <span className="font-cormorant italic text-gold-600 text-lg">Our Collections</span>
            </div>
            <h2 className="section-title centered">Shop by Category</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-5">
            {categoryTiles.map(({ label, image }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/products?category=${label}`}
                  className="group block relative rounded-lg overflow-hidden aspect-square shadow-sm
                    hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={image}
                    alt={label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3 pb-4">
                    <span className="font-playfair font-semibold text-white text-sm md:text-base group-hover:text-gold-300
                      transition-colors duration-300">
                      {label}
                    </span>
                    <div className="w-0 group-hover:w-8 h-0.5 bg-gold-400 transition-all duration-300 mt-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="ornament-divider mb-2 w-fit">
                <span className="font-cormorant italic text-gold-600">Handpicked for You</span>
              </div>
              <h2 className="section-title">Featured Jewellery</h2>
            </div>
            <Link to="/products?featured=true" className="btn-outline-gold text-sm py-2 px-5 flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 font-cormorant italic text-xl">
                Featured products coming soon…
              </p>
              <Link to="/products" className="btn-gold inline-flex mt-4 text-sm px-6 py-2.5">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── GOLD BANNER ──────────────────────────────────────── */}
      <section className="relative py-20 px-4 overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1400&q=60)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-cormorant italic text-gold-400 text-xl mb-3">Limited Time</p>
            <h2 className="font-playfair text-3xl md:text-5xl text-white font-bold mb-4 leading-tight">
              Bridal Collection <br />
              <span className="gold-shimmer-text">Now Available</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
              Make your wedding day unforgettable with our exclusive bridal sets.
              Visit our showroom or WhatsApp us to book a private appointment.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/products?category=Bridal Sets" className="btn-gold px-8 py-3.5 text-sm">
                Explore Bridal
              </Link>
              <a
                href={`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent('Hello! I am interested in your Bridal Collection. Please share details.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold bg-white/5 px-8 py-3.5 text-sm text-white border-white/40 hover:bg-white hover:text-charcoal"
              >
                Book Appointment
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRENDING ─────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="ornament-divider mb-2 w-fit">
                <span className="font-cormorant italic text-gold-600">What's Hot</span>
              </div>
              <h2 className="section-title">Trending Now</h2>
            </div>
            <Link to="/products?trending=true" className="btn-outline-gold text-sm py-2 px-5 flex items-center gap-1.5">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loadingTrending ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : trending.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {trending.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 font-cormorant italic text-xl">Trending products coming soon…</p>
              <Link to="/products" className="btn-gold inline-flex mt-4 text-sm px-6 py-2.5">Browse All</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT SECTION ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80"
                alt="Our Showroom"
                className="rounded-lg w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute -bottom-5 -right-5 bg-charcoal p-5 rounded-lg shadow-xl hidden sm:block">
                <div className="text-gold-400 font-playfair text-3xl font-bold">10+</div>
                <div className="text-white text-xs mt-1">Years of Excellence</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="ornament-divider mb-3 w-fit">
              <span className="font-cormorant italic text-gold-600">Our Story</span>
            </div>
            <h2 className="section-title mb-6">About Shree Balaji Jewellers</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Shree Balaji Jewellers has been a trusted name in fine jewellery for over a decade.
              Located in the heart of bangalore, we bring you an unmatched collection of
              handcrafted gold, silver, and diamond jewellery.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From everyday elegance to grand bridal sets, every piece we curate speaks of
              quality, tradition, and modern artistry. Our BIS-hallmarked jewellery guarantees
              purity you can trust.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                ['1000+', 'Unique Designs'],
                ['BIS', 'Hallmarked Gold'],
                ['100%', 'Genuine Quality'],
                ['10+', 'Years Experience'],
              ].map(([val, label]) => (
                <div key={label} className="text-center p-4 bg-cream rounded-lg border border-gold-100">
                  <div className="font-playfair text-2xl font-bold text-gold-600">{val}</div>
                  <div className="text-gray-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn-gold inline-flex items-center gap-2 text-sm px-7 py-3.5">
              Visit Our Showroom <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── INSTAGRAM SECTION ─────────────────────────────────── */}
      <section className="py-14 px-4 bg-charcoal text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-cormorant italic text-gold-400 text-xl mb-2">Stay Connected</p>
          <h2 className="font-playfair text-3xl text-white font-semibold mb-3">
            Follow Us on Instagram
          </h2>
          <p className="text-gray-500 text-sm mb-6">Get inspired — new collections, offers & behind-the-scenes</p>
          <a
            href={SHOP.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-flex items-center gap-2 text-sm px-7 py-3.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            @shreebalajijewellers
          </a>
        </motion.div>
      </section>
    </>
  );
}

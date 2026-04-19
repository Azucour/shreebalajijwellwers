import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Phone, ChevronLeft, ChevronRight,
  Tag, Weight, Gem, Share2, ArrowLeft, CheckCircle
} from 'lucide-react';
import { getProduct, getProducts } from '../../utils/api';
import { buildWhatsAppUrl, SHOP } from '../../utils/constants';
import { ProductDetailSkeleton, ProductCardSkeleton } from '../../components/shared/Skeletons';
import ProductCard from '../../components/customer/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImg(0);
    getProduct(id)
      .then(({ data }) => {
        setProduct(data.product);
        return getProducts({ category: data.product.category, limit: 4 });
      })
      .then(({ data }) => {
        setRelated((data.products || []).filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  if (loading) return (
    <div className="pt-20">
      <ProductDetailSkeleton />
    </div>
  );

  if (!product) return (
    <div className="pt-32 text-center">
      <h2 className="font-playfair text-2xl text-gray-500">Product not found</h2>
      <Link to="/products" className="btn-gold inline-flex mt-4 text-sm px-6 py-2.5">Browse Products</Link>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [];
  const whatsappUrl = buildWhatsAppUrl(product);

  return (
    <>
      <Helmet>
        <title>{product.name} – Shree Balaji Jewellers</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
        {images[0] && <meta property="og:image" content={images[0].url} />}
      </Helmet>

      <div className="pt-20 bg-cream min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-gold-500 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-gold-500 transition-colors">Collections</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-gold-500 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-charcoal truncate max-w-[150px]">{product.name}</span>
          </div>
        </div>

        {/* Main section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-600
              transition-colors mb-6 group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Collections
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
            {/* Image gallery */}
            <div>
              {/* Main image */}
              <div
                className="relative bg-white rounded-xl overflow-hidden aspect-square shadow-md cursor-zoom-in mb-3"
                onClick={() => setZoomed(!zoomed)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={images[activeImg]?.url}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: zoomed ? 1.5 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </AnimatePresence>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImg((a) => (a - 1 + images.length) % images.length); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full
                        flex items-center justify-center shadow hover:bg-gold-400 transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveImg((a) => (a + 1) % images.length); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full
                        flex items-center justify-center shadow hover:bg-gold-400 transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                <span className="absolute top-3 right-3 text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                  {zoomed ? 'Click to zoom out' : 'Click to zoom in'}
                </span>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setActiveImg(i); setZoomed(false); }}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                        ${i === activeImg ? 'border-gold-400 shadow-md' : 'border-transparent hover:border-gold-200'}`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Badges */}
              <div className="flex gap-2 mb-3 flex-wrap">
                {product.featured && (
                  <span className="bg-gold-gradient text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                    ✨ Featured
                  </span>
                )}
                {product.trending && (
                  <span className="bg-charcoal text-gold-400 text-xs font-bold px-3 py-1 rounded-full">
                    🔥 Trending
                  </span>
                )}
              </div>

              <h1 className="font-playfair text-2xl md:text-3xl font-semibold text-charcoal leading-snug mb-3">
                {product.name}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="flex items-center gap-1.5 text-sm text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                  <Tag size={13} /> {product.category}
                </span>
                {product.purity && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    <Gem size={13} /> {product.purity}
                  </span>
                )}
                {product.weight && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    <Weight size={13} /> {product.weight}
                  </span>
                )}
              </div>

              {/* Price */}
              {product.priceVisible && product.price ? (
                <div className="mb-5">
                  <span className="font-playfair text-3xl font-bold text-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">Inclusive of all taxes</span>
                </div>
              ) : (
                <div className="mb-5 p-3 bg-gold-50 border border-gold-200 rounded-lg">
                  <p className="text-gold-700 text-sm font-medium">💰 Price available on request</p>
                  <p className="text-gold-600 text-xs mt-0.5">WhatsApp or call us for the best price</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                {['BIS Hallmarked', 'Genuine Quality', 'Easy Exchange'].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <CheckCircle size={13} className="text-green-500" />
                    {t}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-sm
                    bg-[#25D366] text-white font-semibold text-sm hover:bg-[#1DAA55]
                    transition-colors duration-300 shadow-lg hover:shadow-xl active:scale-99"
                >
                  <MessageCircle size={20} />
                  Buy on WhatsApp
                </a>

                <a
                  href={SHOP.phoneTel}
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-sm
                    border-2 border-charcoal text-charcoal font-semibold text-sm
                    hover:bg-charcoal hover:text-white transition-all duration-300"
                >
                  <Phone size={18} />
                  Call to Inquire
                </a>

                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-sm
                    border border-gray-200 text-gray-600 text-sm hover:border-gold-300
                    hover:text-gold-600 transition-all duration-300"
                >
                  {shared ? <CheckCircle size={16} className="text-green-500" /> : <Share2 size={16} />}
                  {shared ? 'Link Copied!' : 'Share this Product'}
                </button>
              </div>

              {/* Shop info */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-100 text-xs text-gray-500 leading-relaxed">
                <strong className="text-charcoal text-sm block mb-1">{SHOP.name}</strong>
                {SHOP.address} · {SHOP.timing}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="bg-white py-14 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="section-title mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

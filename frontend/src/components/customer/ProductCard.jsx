import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Tag } from 'lucide-react';

export default function ProductCard({ product, index = 0 }) {
  const img = product.images?.[0]?.url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-lg overflow-hidden border border-gray-100
        hover:border-gold-200 hover:shadow-xl transition-all duration-400 card-hover"
    >
      {/* Image */}
      <div className="product-image-wrapper aspect-square relative overflow-hidden bg-gray-50">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gold-300 opacity-40">
              <svg viewBox="0 0 80 80" className="w-20 h-20" fill="currentColor">
                <path d="M40 10 L70 30 L60 70 L20 70 L10 30 Z" />
              </svg>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <span className="bg-gold-gradient text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Featured
            </span>
          )}
          {product.trending && (
            <span className="bg-charcoal text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Trending
            </span>
          )}
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all duration-300
          flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <Link
              to={`/products/${product._id}`}
              className="flex items-center gap-2 bg-white text-charcoal text-xs font-semibold
                px-4 py-2 rounded-sm shadow-lg hover:bg-gold-400 transition-colors"
            >
              <Eye size={13} />
              Quick View
            </Link>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-playfair font-semibold text-sm md:text-base text-charcoal
            line-clamp-2 leading-snug group-hover:text-gold-700 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <Tag size={11} className="text-gold-500" />
          <span className="text-gold-600 text-xs font-medium uppercase tracking-wider">
            {product.category}
          </span>
          {product.purity && (
            <span className="text-gray-400 text-xs">· {product.purity}</span>
          )}
        </div>

        {product.priceVisible && product.price ? (
          <div className="text-charcoal font-semibold text-sm mb-3">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        ) : (
          <div className="text-gray-400 text-xs mb-3 italic">Price on request</div>
        )}

        <Link
          to={`/products/${product._id}`}
          className="block text-center btn-gold text-xs py-2.5 w-full font-semibold tracking-wide"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

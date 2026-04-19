import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { getProducts } from '../../utils/api';
import { CATEGORIES } from '../../utils/constants';
import ProductCard from '../../components/customer/ProductCard';
import { ProductCardSkeleton } from '../../components/shared/Skeletons';

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || 'All';
  const featured = searchParams.get('featured') || '';
  const trending = searchParams.get('trending') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { page, limit: 16, sort };
    if (category !== 'All') params.category = category;
    if (featured) params.featured = true;
    if (trending) params.trending = true;
    if (search) params.search = search;

    getProducts(params)
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [category, featured, trending, search, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [category, featured, trending, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = category !== 'All' || featured || trending || search;

  const pageTitle = featured ? 'Featured Jewellery' :
    trending ? 'Trending Jewellery' :
    category !== 'All' ? `${category} Jewellery` : 'All Collections';

  return (
    <>
      <Helmet>
        <title>{pageTitle} – Shree Balaji Jewellers</title>
      </Helmet>

      {/* Page header */}
      <div className="bg-charcoal pt-24 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-cormorant italic text-lg mb-1">Our Collection</p>
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
            {pageTitle}
          </h1>
          {total > 0 && (
            <p className="text-gray-500 text-sm mt-2">{total} products found</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jewellery..."
              defaultValue={search}
              className="input-field pl-9 pr-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateParam('search', e.target.value);
              }}
              onChange={(e) => {
                if (!e.target.value) updateParam('search', '');
              }}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]"
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            className="sm:hidden flex items-center gap-2 input-field justify-center"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={15} />
            Filters
            {hasFilters && <span className="w-2 h-2 bg-gold-500 rounded-full" />}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden sm:block w-52 shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-playfair font-semibold text-charcoal">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-gold-600 hover:underline flex items-center gap-1">
                    <X size={11} /> Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <p className="label mb-2">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-all
                        ${(cat === 'All' && category === 'All') || cat === category
                          ? 'bg-gold-gradient text-charcoal font-semibold'
                          : 'text-gray-600 hover:bg-gold-50 hover:text-gold-700'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special filters */}
              <div>
                <p className="label mb-2">Show</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={!!featured}
                      onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                      className="accent-gold-500 w-4 h-4"
                    />
                    Featured only
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={!!trending}
                      onChange={(e) => updateParam('trending', e.target.checked ? 'true' : '')}
                      className="accent-gold-500 w-4 h-4"
                    />
                    Trending only
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                className="fixed inset-0 z-50 sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)} />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-playfair font-semibold text-lg">Filters</h3>
                    <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
                  </div>
                  <p className="label mb-2">Category</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { updateParam('category', cat === 'All' ? '' : cat); setFilterOpen(false); }}
                        className={`px-3 py-2 rounded text-sm transition-all border
                          ${(cat === 'All' && category === 'All') || cat === category
                            ? 'bg-gold-gradient text-charcoal font-semibold border-gold-400'
                            : 'text-gray-600 border-gray-200 hover:border-gold-300'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input type="checkbox" checked={!!featured}
                        onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')}
                        className="accent-gold-500 w-4 h-4" />
                      Featured only
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                      <input type="checkbox" checked={!!trending}
                        onChange={(e) => updateParam('trending', e.target.checked ? 'true' : '')}
                        className="accent-gold-500 w-4 h-4" />
                      Trending only
                    </label>
                  </div>
                  {hasFilters && (
                    <button onClick={() => { clearFilters(); setFilterOpen(false); }}
                      className="mt-5 w-full btn-outline-gold py-2.5 text-sm">
                      Clear All Filters
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(16).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gold-300 text-6xl mb-4">💎</div>
                <h3 className="font-playfair text-xl text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-400 text-sm mb-5">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-gold text-sm px-6 py-2.5">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold-400
                        disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 text-sm rounded transition-all
                          ${p === page ? 'bg-gold-gradient text-charcoal font-semibold' : 'border border-gray-200 hover:border-gold-400'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page === pages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold-400
                        disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

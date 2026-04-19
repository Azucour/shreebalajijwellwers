import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Eye, EyeOff, Star, TrendingUp } from 'lucide-react';
import { getAdminProducts, deleteProduct, updateProduct } from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getAdminProducts({ page, limit: 20 })
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const toggleField = async (product, field) => {
    try {
      await updateProduct(product._id, { [field]: !product[field] });
      setProducts((prev) => prev.map((p) => p._id === product._id ? { ...p, [field]: !p[field] } : p));
      toast.success(`${field === 'featured' ? 'Featured' : field === 'trending' ? 'Trending' : 'Visibility'} updated`);
    } catch {
      toast.error('Update failed');
    }
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-charcoal">All Products</h1>
          <p className="text-gray-400 text-sm mt-0.5">{total} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products by name or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array(10).fill(0).map((_, i) => <div key={i} className="skeleton h-14 rounded" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💎</div>
            <p className="text-gray-500 text-sm">No products found</p>
            <Link to="/admin/products/add" className="btn-gold text-sm py-2 px-5 inline-flex mt-4">
              Add First Product
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Product</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Category</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Price</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Featured</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Trending</th>
                    <th className="text-center px-4 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Active</th>
                    <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {p.images?.[0]?.url ? (
                              <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gold-300">💎</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-charcoal truncate max-w-[180px]">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.images?.length || 0} image(s)</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-gold-50 text-gold-700 text-xs px-2 py-1 rounded-full font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-charcoal font-medium">
                        {p.priceVisible && p.price ? `₹${p.price.toLocaleString('en-IN')}` : <span className="text-gray-400 text-xs">On request</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleField(p, 'featured')} title="Toggle featured">
                          <Star size={16} className={p.featured ? 'text-gold-500 fill-gold-400' : 'text-gray-300'} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleField(p, 'trending')} title="Toggle trending">
                          <TrendingUp size={16} className={p.trending ? 'text-purple-500' : 'text-gray-300'} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleField(p, 'isAvailable')} title="Toggle availability">
                          {p.isAvailable
                            ? <Eye size={16} className="text-green-500" />
                            : <EyeOff size={16} className="text-gray-300" />}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-500 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deleting === p._id}
                            className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((p) => (
                <div key={p._id} className="p-4 flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {p.images?.[0]?.url
                      ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center">💎</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gold-600 mt-0.5">{p.category}</p>
                    {p.price && <p className="text-xs font-semibold text-charcoal mt-0.5">₹{p.price.toLocaleString('en-IN')}</p>}
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Link to={`/admin/products/edit/${p._id}`}
                      className="text-blue-500 p-1 hover:bg-blue-50 rounded"><Edit2 size={14} /></Link>
                    <button onClick={() => handleDelete(p._id, p.name)}
                      className="text-red-400 p-1 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold-400 disabled:opacity-40">
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
          <button disabled={products.length < 20} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm border border-gray-200 rounded hover:border-gold-400 disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

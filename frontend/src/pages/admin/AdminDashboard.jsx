import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Star, TrendingUp, Eye, Plus, ArrowRight, BarChart3 } from 'lucide-react';
import { getAdminStats } from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Available', value: stats.availableProducts, icon: Eye, color: 'bg-green-50 text-green-600' },
    { label: 'Featured', value: stats.featuredProducts, icon: Star, color: 'bg-gold-50 text-gold-600' },
    { label: 'Trending', value: stats.trendingProducts, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-playfair text-2xl font-semibold text-charcoal">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Welcome back to your admin panel</p>
        </div>
        <Link to="/admin/products/add" className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 skeleton" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <div className="font-playfair text-2xl font-bold text-charcoal">{value}</div>
              <div className="text-gray-400 text-xs mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* By category */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={18} className="text-gold-500" />
            <h2 className="font-playfair font-semibold text-charcoal">Products by Category</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-8 rounded" />)}
            </div>
          ) : stats?.byCategory?.length > 0 ? (
            <div className="space-y-3">
              {stats.byCategory.slice(0, 8).map(({ _id, count }) => {
                const pct = Math.round((count / stats.totalProducts) * 100);
                return (
                  <div key={_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{_id}</span>
                      <span className="font-medium text-charcoal">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold-gradient rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No products yet</p>
          )}
        </div>

        {/* Latest products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-playfair font-semibold text-charcoal">Latest Products</h2>
            <Link to="/admin/products" className="text-gold-600 text-xs hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-12 rounded" />)}
            </div>
          ) : stats?.latestProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.latestProducts.map((p) => (
                <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    {p.images?.[0]?.url ? (
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold-300 text-lg">💎</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  {p.price && (
                    <span className="text-xs font-semibold text-gold-600">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-3">No products added yet</p>
              <Link to="/admin/products/add" className="btn-gold text-xs py-2 px-4">Add First Product</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Add New Product', desc: 'Upload images & details', to: '/admin/products/add', icon: Plus },
          { label: 'Manage Products', desc: 'Edit or delete products', to: '/admin/products', icon: Package },
          { label: 'View Storefront', desc: 'See customer website', to: '/', icon: Eye, external: true },
        ].map(({ label, desc, to, icon: Icon, external }) => (
          <Link
            key={label}
            to={to}
            target={external ? '_blank' : undefined}
            className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gold-200
              hover:shadow-md transition-all duration-200 group flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gold-50 rounded-lg flex items-center justify-center
              text-gold-600 group-hover:bg-gold-gradient group-hover:text-charcoal transition-all">
              <Icon size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-charcoal">{label}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

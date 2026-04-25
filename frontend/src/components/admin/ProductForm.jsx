import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Save, Loader } from 'lucide-react';
import { uploadImages, deleteImage } from '../../utils/api';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const DEFAULT_FORM = {
  name: '',
  description: '',
  category: '',
  price: '',
  priceVisible: true,
  weight: '',
  purity: '',
  stock: 1,
  featured: false,
  trending: false,
  isAvailable: true,
  tags: '',
  images: [],
};

export default function ProductForm({ initial = {}, onSubmit, title, submitLabel = 'Save Product' }) {
  const [form, setForm] = useState({ ...DEFAULT_FORM, ...initial, tags: initial.tags?.join(', ') || '' });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append('images', f));
    try {
      const { data } = await uploadImages(formData);
      set('images', [...form.images, ...data.images]);
      toast.success(`${data.images.length} image(s) uploaded`);
    } catch {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (img, idx) => {
    const updated = form.images.filter((_, i) => i !== idx);
    set('images', updated);
    if (img.public_id) {
      try { await deleteImage(img.public_id); } catch {}
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category || !form.description.trim()) {
      toast.error('Name, category and description are required');
      return;
    }
    if (form.images.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: form.price ? Number(form.price) : undefined,
        stock: Number(form.stock) || 1,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await onSubmit(payload);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-playfair text-2xl font-semibold text-charcoal mb-6">{title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — main info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-charcoal mb-4 text-sm uppercase tracking-wider">Product Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Product Name *</label>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. 22K Gold Bridal Necklace Set" className="input-field" required />
                </div>
                <div>
                  <label className="label">Description *</label>
                  <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                    rows={4} placeholder="Describe the product in detail…" className="input-field resize-none" required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Category *</label>
                    <select value={form.category} onChange={(e) => set('category', e.target.value)}
                      className="input-field" required>
                      <option value="">— Select Category —</option>
                      {PRODUCT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Tags (comma-separated)</label>
                    <input value={form.tags} onChange={(e) => set('tags', e.target.value)}
                      placeholder="e.g. wedding, bridal, heavy" className="input-field" />
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-charcoal mb-4 text-sm uppercase tracking-wider">Pricing & Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => set('price', e.target.value)}
                    placeholder="Leave blank for 'on request'" className="input-field" min={0} />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input type="checkbox" checked={form.priceVisible}
                      onChange={(e) => set('priceVisible', e.target.checked)}
                      className="accent-gold-500 w-4 h-4" />
                    Show price to customers
                  </label>
                </div>
                <div>
                  <label className="label">Weight (optional)</label>
                  <input value={form.weight} onChange={(e) => set('weight', e.target.value)}
                    placeholder="e.g. 25g" className="input-field" />
                </div>
                <div>
                  <label className="label">Purity (optional)</label>
                  <input value={form.purity} onChange={(e) => set('purity', e.target.value)}
                    placeholder="e.g. 22K, 18K, 925 Silver" className="input-field" />
                </div>
                <div>
                  <label className="label">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)}
                    className="input-field" min={0} />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-charcoal mb-4 text-sm uppercase tracking-wider">Product Images *</h2>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gold-200 rounded-lg p-8 text-center cursor-pointer
                  hover:border-gold-400 hover:bg-gold-50/30 transition-all duration-200 mb-4"
              >
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader size={24} className="text-gold-500 animate-spin" />
                    <p className="text-sm text-gray-500">Uploading to Cloudinary…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-gold-400" />
                    <p className="text-sm font-medium text-gray-600">Drop images here or click to upload</p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 10MB per image · Up to 10 images</p>
                  </div>
                )}
              </div>

              {/* Preview grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {form.images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square"
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover rounded-lg border border-gray-100" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] bg-gold-gradient text-charcoal px-1.5 py-0.5 rounded font-bold">
                          Main
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(img, idx)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full
                          flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — toggles + save */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-semibold text-charcoal mb-4 text-sm uppercase tracking-wider">Status & Visibility</h2>
              <div className="space-y-4">
              {[
                { key: 'isAvailable', label: 'Active / Available', desc: 'Show on storefront' },
                { key: 'featured', label: 'Featured', desc: 'Show in Featured section' },
                { key: 'trending', label: 'Trending', desc: 'Show in Trending section' },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => set(key, !form[key])}
                >
                  <div className="relative mt-0.5 shrink-0">
                    <div
                      className={`w-10 h-5 rounded-full transition-colors duration-200
                        ${form[key] ? 'bg-gold-500' : 'bg-gray-200'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 transition-transform duration-200
                        ${form[key] ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                    <p className="text-xs font-semibold mt-0.5 text-gold-600">
                      {form[key] ? '✅ ON' : '⭕ OFF'}
                    </p>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* Save */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <><Loader size={15} className="animate-spin" /> Saving…</>
                ) : (
                  <><Save size={15} /> {submitLabel}</>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="w-full py-3 text-sm border border-gray-200 rounded-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Image count indicator */}
            <div className="bg-gold-50 rounded-xl p-4 border border-gold-100">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon size={15} className="text-gold-600" />
                <span className="text-xs font-semibold text-gold-700 uppercase tracking-wider">Images</span>
              </div>
              <p className="text-2xl font-playfair font-bold text-gold-600">{form.images.length}</p>
              <p className="text-xs text-gold-600/70">uploaded · first is main</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

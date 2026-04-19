import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, updateProduct } from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';
import toast from 'react-hot-toast';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => { toast.error('Product not found'); navigate('/admin/products'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (payload) => {
    await updateProduct(id, payload);
    toast.success('Product updated successfully!');
    navigate('/admin/products');
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  return (
    <ProductForm
      title={`Edit: ${product.name}`}
      submitLabel="Update Product"
      initial={product}
      onSubmit={handleSubmit}
    />
  );
}

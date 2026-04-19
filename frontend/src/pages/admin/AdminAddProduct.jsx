import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../utils/api';
import ProductForm from '../../components/admin/ProductForm';
import toast from 'react-hot-toast';

export default function AdminAddProduct() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await createProduct(payload);
    toast.success('Product added successfully! 🎉');
    navigate('/admin/products');
  };

  return (
    <ProductForm
      title="Add New Product"
      submitLabel="Add Product"
      onSubmit={handleSubmit}
    />
  );
}

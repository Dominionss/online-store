import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import AdminProductForm from './AdminProductForm.jsx';
import AdminShell from './AdminShell.jsx';

function AdminAddProduct() {
  const navigate = useNavigate();

  const createProduct = async (payload) => {
    await productApi.createProduct(payload);
    navigate('/admin/products');
  };

  return (
    <AdminShell>
      <div className="admin-heading">
        <h1>Add product</h1>
        <p>Create a database-backed marketplace product.</p>
      </div>
      <AdminProductForm onSubmit={createProduct} submitLabel="Save product" />
    </AdminShell>
  );
}

export default AdminAddProduct;

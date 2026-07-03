import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import Loader from '../../components/Loader.jsx';
import AdminProductForm from './AdminProductForm.jsx';
import AdminShell from './AdminShell.jsx';

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productApi
      .getProduct(id)
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateProduct = async (payload) => {
    await productApi.updateProduct(id, payload);
    navigate('/admin/products');
  };

  return (
    <AdminShell>
      <div className="admin-heading">
        <h1>Edit product</h1>
        <p>Load product data from MongoDB and save changes through the API.</p>
      </div>
      {loading ? <Loader label="Loading product" /> : null}
      {error ? <div className="empty-state danger">{error}</div> : null}
      {product ? <AdminProductForm initialProduct={product} onSubmit={updateProduct} submitLabel="Save changes" /> : null}
    </AdminShell>
  );
}

export default AdminEditProduct;

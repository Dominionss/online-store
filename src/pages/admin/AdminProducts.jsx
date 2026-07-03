import { Edit, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi.js';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import AdminShell from './AdminShell.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getProducts({ q: search, limit: 48 });
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const remove = async (id) => {
    await productApi.deleteProduct(id);
    setProducts((current) => current.filter((product) => product._id !== id));
  };

  return (
    <AdminShell>
      <div className="admin-heading split-heading">
        <div>
          <h1>Products</h1>
          <p>Add, edit, delete, and search marketplace products.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/products/new">
          <PlusCircle size={18} />
          <span>Add product</span>
        </Link>
      </div>

      <form
        className="admin-search"
        onSubmit={(event) => {
          event.preventDefault();
          loadProducts();
        }}
      >
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        <Button type="submit" icon={Search}>
          Search
        </Button>
      </form>

      {loading ? <Loader label="Loading products" /> : null}
      {error ? <div className="empty-state danger">{error}</div> : null}
      <div className="data-table">
        {products.map((product) => (
          <div className="table-row admin-product-row" key={product._id}>
            <img src={product.images?.[0]} alt={product.title} />
            <div>
              <strong>{product.title}</strong>
              <span>{product.brand}</span>
            </div>
            <span>{formatPrice(product.discountPrice || product.price)}</span>
            <span>{product.stock} stock</span>
            <Link className="btn btn-secondary" to={`/admin/products/${product._id}/edit`}>
              <Edit size={18} />
              <span>Edit</span>
            </Link>
            <Button type="button" variant="ghost" icon={Trash2} onClick={() => remove(product._id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

export default AdminProducts;

import { ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { wishlistApi } from '../api/wishlistApi.js';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useCart } from '../hooks/useCart.js';

function Wishlist() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWishlist = () => {
    setLoading(true);
    wishlistApi
      .getWishlist()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const remove = async (productId) => {
    const data = await wishlistApi.removeFromWishlist(productId);
    setItems(data);
  };

  const moveToCart = async (productId) => {
    await addToCart(productId, 1);
    await remove(productId);
  };

  return (
    <Layout>
      <section className="table-page">
        <h1>Wishlist</h1>
        {loading ? <Loader label="Loading wishlist" /> : null}
        {error ? <div className="empty-state danger">{error}</div> : null}
        {!loading && !items.length ? <div className="empty-state">No saved products yet.</div> : null}
        <div className="wishlist-grid">
          {items.map((item) => (
            <div key={item._id} className="wishlist-item">
              <ProductCard product={item.productId} compact />
              <div className="wishlist-actions">
                <Button type="button" icon={ShoppingCart} onClick={() => moveToCart(item.productId._id)}>
                  Add to cart
                </Button>
                <Button type="button" variant="ghost" icon={Trash2} onClick={() => remove(item.productId._id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Wishlist;

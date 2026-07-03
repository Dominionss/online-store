import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import { useCart } from '../hooks/useCart.js';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function Cart() {
  const { items, loading, error, subtotal, shipping, total, updateCartItem, removeCartItem } = useCart();
  const discount = 0;

  return (
    <Layout>
      <section className="checkout-layout">
        <div className="cart-list-panel">
          <h1>Your cart</h1>
          {loading ? <Loader label="Loading cart" /> : null}
          {error ? <div className="empty-state danger">{error}</div> : null}
          {!loading && !items.length ? (
            <div className="empty-state">
              Your cart is empty. <Link to="/products">Browse products</Link>
            </div>
          ) : null}
          {items.map((item) => (
            <CartItem key={item._id} item={item} onUpdate={updateCartItem} onRemove={removeCartItem} />
          ))}
        </div>
        <aside className="summary-panel">
          <h2>Order summary</h2>
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{formatPrice(shipping)}</strong>
          </div>
          <div>
            <span>Discount</span>
            <strong>-{formatPrice(discount)}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatPrice(total - discount)}</strong>
          </div>
          <Link className={`btn btn-primary ${items.length ? '' : 'disabled'}`} to={items.length ? '/checkout' : '#'}>
            <ShoppingBag size={18} />
            <span>Proceed to checkout</span>
          </Link>
        </aside>
      </section>
    </Layout>
  );
}

export default Cart;

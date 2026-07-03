import { CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi.js';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import { useCart } from '../hooks/useCart.js';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    paymentMethod: 'card',
    couponCode: '',
  });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const placeOrder = async (event) => {
    event.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const order = await orderApi.createOrder({
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        couponCode: form.couponCode,
      });
      await clearCart();
      navigate(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Layout>
      <form className="checkout-layout" onSubmit={placeOrder}>
        <section className="form-panel">
          <h1>Checkout</h1>
          {error ? <div className="empty-state danger">{error}</div> : null}
          <div className="form-grid">
            <label>
              Full name
              <input required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} />
            </label>
            <label>
              Phone
              <input required value={form.phone} onChange={(event) => update('phone', event.target.value)} />
            </label>
            <label className="span-2">
              Street address
              <input required value={form.street} onChange={(event) => update('street', event.target.value)} />
            </label>
            <label>
              City
              <input required value={form.city} onChange={(event) => update('city', event.target.value)} />
            </label>
            <label>
              State
              <input value={form.state} onChange={(event) => update('state', event.target.value)} />
            </label>
            <label>
              Postal code
              <input required value={form.postalCode} onChange={(event) => update('postalCode', event.target.value)} />
            </label>
            <label>
              Country
              <input required value={form.country} onChange={(event) => update('country', event.target.value)} />
            </label>
          </div>

          <h2>Payment method</h2>
          <div className="payment-options">
            {[
              ['card', 'Card'],
              ['paypal', 'PayPal'],
              ['cash_on_delivery', 'Cash on delivery'],
            ].map(([value, label]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={form.paymentMethod === value}
                  onChange={() => update('paymentMethod', value)}
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <aside className="summary-panel">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={item._id}>
              <span>{item.productId?.title} x {item.quantity}</span>
              <strong>{formatPrice((item.productId?.discountPrice || item.productId?.price || 0) * item.quantity)}</strong>
            </div>
          ))}
          <label>
            Coupon code
            <input value={form.couponCode} onChange={(event) => update('couponCode', event.target.value)} />
          </label>
          <div>
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{formatPrice(shipping)}</strong>
          </div>
          <div className="summary-total">
            <span>Estimated total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <Button type="submit" icon={CreditCard} disabled={placing || !items.length}>
            {placing ? 'Placing order' : 'Place order'}
          </Button>
        </aside>
      </form>
    </Layout>
  );
}

export default Checkout;

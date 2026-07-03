import { PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { orderApi } from '../api/orderApi.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getOrder(id)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Layout>
      <section className="order-detail-page">
        {loading ? <Loader label="Loading order" /> : null}
        {error ? <div className="empty-state danger">{error}</div> : null}
        {order ? (
          <>
            <div className="seller-banner compact-banner">
              <PackageCheck size={34} />
              <div>
                <span className="eyebrow">Order #{order._id.slice(-8)}</span>
                <h1>{order.status}</h1>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="detail-columns">
              <section>
                <h2>Products</h2>
                {order.orderItems.map((item) => (
                  <article className="order-item" key={item.product}>
                    <img src={item.image} alt={item.title} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>
                        {item.quantity} x {formatPrice(item.price)}
                      </span>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </section>
              <aside className="summary-panel">
                <h2>Summary</h2>
                <div>
                  <span>Subtotal</span>
                  <strong>{formatPrice(order.subtotal)}</strong>
                </div>
                <div>
                  <span>Shipping</span>
                  <strong>{formatPrice(order.shippingPrice)}</strong>
                </div>
                <div>
                  <span>Discount</span>
                  <strong>-{formatPrice(order.discount)}</strong>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <strong>{formatPrice(order.totalPrice)}</strong>
                </div>
                <h3>Shipping address</h3>
                <p>
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                  <br />
                  {order.shippingAddress.country} {order.shippingAddress.postalCode}
                </p>
                <h3>Payment</h3>
                <p>{order.paymentMethod}</p>
              </aside>
            </div>
          </>
        ) : null}
      </section>
    </Layout>
  );
}

export default OrderDetails;

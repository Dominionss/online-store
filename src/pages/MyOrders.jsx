import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi.js';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="table-page">
        <h1>My orders</h1>
        {loading ? <Loader label="Loading orders" /> : null}
        {error ? <div className="empty-state danger">{error}</div> : null}
        <div className="data-table">
          {orders.map((order) => (
            <div className="table-row" key={order._id}>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <strong>{order.status}</strong>
              <span>{formatPrice(order.totalPrice)}</span>
              <Link className="btn btn-secondary" to={`/orders/${order._id}`}>
                <Eye size={18} />
                <span>View details</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default MyOrders;

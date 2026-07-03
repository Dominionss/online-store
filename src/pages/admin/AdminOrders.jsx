import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { orderApi } from '../../api/orderApi.js';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import AdminShell from './AdminShell.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAllOrders(status);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (id, nextStatus) => {
    const updated = await orderApi.updateOrderStatus(id, nextStatus);
    setOrders((current) => current.map((order) => (order._id === id ? updated : order)));
  };

  return (
    <AdminShell>
      <div className="admin-heading split-heading">
        <div>
          <h1>Orders</h1>
          <p>View orders, filter by status, and update fulfillment.</p>
        </div>
        <label>
          Filter status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? <Loader label="Loading orders" /> : null}
      {error ? <div className="empty-state danger">{error}</div> : null}
      <div className="data-table">
        {orders.map((order) => (
          <div className="table-row admin-order-row" key={order._id}>
            <div>
              <strong>#{order._id.slice(-8)}</strong>
              <span>{order.userId?.email}</span>
            </div>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            <strong>{formatPrice(order.totalPrice)}</strong>
            <select value={order.status} onChange={(event) => updateStatus(order._id, event.target.value)}>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <Button type="button" variant="secondary" icon={RefreshCw} onClick={loadOrders}>
        Refresh
      </Button>
    </AdminShell>
  );
}

export default AdminOrders;

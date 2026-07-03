import { DollarSign, Package, ReceiptText, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/orderApi.js';
import Loader from '../../components/Loader.jsx';
import AdminShell from './AdminShell.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    ['Total users', stats?.totalUsers || 0, Users],
    ['Total products', stats?.totalProducts || 0, Package],
    ['Total orders', stats?.totalOrders || 0, ReceiptText],
    ['Total sales', formatPrice(stats?.totalSales), DollarSign],
  ];

  return (
    <AdminShell>
      <div className="admin-heading">
        <h1>Dashboard statistics</h1>
        <p>High-level marketplace performance.</p>
      </div>
      {loading ? <Loader label="Loading dashboard" /> : null}
      {error ? <div className="empty-state danger">{error}</div> : null}
      <div className="stats-grid">
        {cards.map(([label, value, Icon]) => (
          <article key={label} className="stat-card">
            <Icon size={24} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

export default AdminDashboard;

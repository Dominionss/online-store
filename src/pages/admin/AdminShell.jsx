import { Boxes, LayoutDashboard, PlusCircle, ReceiptText, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Layout from '../../components/Layout.jsx';

function AdminShell({ children }) {
  const links = [
    ['/admin', 'Dashboard', LayoutDashboard],
    ['/admin/products', 'Products', Boxes],
    ['/admin/products/new', 'Add product', PlusCircle],
    ['/admin/orders', 'Orders', ReceiptText],
    ['/admin/users', 'Users', Users],
  ];

  return (
    <Layout>
      <section className="admin-layout">
        <aside className="admin-sidebar">
          <h2>Admin</h2>
          {links.map(([href, label, Icon]) => (
            <NavLink key={href} to={href} end={href === '/admin'}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </aside>
        <div className="admin-content">{children}</div>
      </section>
    </Layout>
  );
}

export default AdminShell;

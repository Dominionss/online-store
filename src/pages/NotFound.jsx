import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

function NotFound() {
  return (
    <Layout>
      <section className="not-found">
        <span>404</span>
        <h1>Page not found</h1>
        <p>The page may have moved, or the marketplace aisle you opened does not exist.</p>
        <Link className="btn btn-primary" to="/">
          <ArrowLeft size={18} />
          <span>Back to homepage</span>
        </Link>
      </section>
    </Layout>
  );
}

export default NotFound;

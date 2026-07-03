import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Rating from '../components/Rating.jsx';
import { useProducts } from '../hooks/useProducts.js';

function Seller() {
  const { sellerId } = useParams();
  const params = useMemo(() => ({ seller: sellerId, limit: 24 }), [sellerId]);
  const { products, loading, error } = useProducts(params);
  const seller = products[0]?.seller;

  return (
    <Layout>
      <section className="seller-banner">
        <div>
          <span className="eyebrow">Marketplace seller</span>
          <h1>{seller?.name || 'Seller store'}</h1>
          <p>{seller?.email || 'Verified marketplace partner'}</p>
        </div>
        <Rating value={4.7} count={products.length * 3} />
      </section>
      <section className="page-section">
        <div className="section-heading">
          <h2>Seller products</h2>
          <span>{products.length} items</span>
        </div>
        <ProductGrid products={products} loading={loading} error={error} />
      </section>
    </Layout>
  );
}

export default Seller;

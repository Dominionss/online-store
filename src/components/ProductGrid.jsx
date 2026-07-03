import Loader from './Loader.jsx';
import ProductCard from './ProductCard.jsx';

function ProductGrid({ products = [], loading, error }) {
  if (loading) return <Loader label="Loading products" />;

  if (error) {
    return <div className="empty-state danger">{error}</div>;
  }

  if (!products.length) {
    return <div className="empty-state">No products found.</div>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;

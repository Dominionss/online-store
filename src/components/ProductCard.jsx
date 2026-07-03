import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { wishlistApi } from '../api/wishlistApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
import Button from './Button.jsx';
import Rating from './Rating.jsx';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const image = product.images?.[0] || product.category?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80';
  const price = product.discountPrice || product.price;

  const handleAdd = async () => {
    if (!isAuthenticated) return;
    await addToCart(product._id, 1);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return;
    await wishlistApi.addToWishlist(product._id);
  };

  return (
    <article className={`product-card ${compact ? 'compact' : ''}`}>
      <Link className="product-image" to={`/products/${product._id}`}>
        <img src={image} alt={product.title} loading="lazy" />
        {product.discountPrice && product.discountPrice < product.price ? (
          <span className="deal-badge">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off
          </span>
        ) : null}
      </Link>
      <div className="product-card-body">
        <Link to={`/products/${product._id}`} className="product-title">
          {product.title}
        </Link>
        <p>{product.brand}</p>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="price-row">
          <strong>{formatPrice(price)}</strong>
          {product.discountPrice && product.discountPrice < product.price ? <s>{formatPrice(product.price)}</s> : null}
        </div>
      </div>
      <div className="product-actions">
        <Button type="button" icon={ShoppingCart} onClick={handleAdd} disabled={!isAuthenticated || product.stock < 1}>
          Add
        </Button>
        <Button type="button" variant="ghost" icon={Heart} onClick={handleWishlist} disabled={!isAuthenticated}>
          Save
        </Button>
      </div>
    </article>
  );
}

export default ProductCard;

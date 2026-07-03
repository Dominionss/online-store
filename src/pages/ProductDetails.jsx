import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../api/productApi.js';
import { wishlistApi } from '../api/wishlistApi.js';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import Loader from '../components/Loader.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import Rating from '../components/Rating.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const [productData, reviewData] = await Promise.all([
          productApi.getProduct(id),
          productApi.getReviews(id),
        ]);
        setProduct(productData);
        setReviews(reviewData);
        setActiveImage(productData.images?.[0] || productData.category?.image || '');

        const relatedData = await productApi.getProducts({
          category: productData.category?._id,
          limit: 4,
          sort: 'popularity',
        });
        setRelated((relatedData.products || []).filter((item) => item._id !== productData._id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const price = useMemo(() => product?.discountPrice || product?.price || 0, [product]);

  const addProductToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(product._id, quantity);
    setMessage('Product added to cart.');
  };

  const buyNow = async () => {
    await addProductToCart();
    navigate('/checkout');
  };

  const saveToWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await wishlistApi.addToWishlist(product._id);
    setMessage('Product saved to wishlist.');
  };

  const submitReview = async (event) => {
    event.preventDefault();
    if (!reviewForm.comment.trim()) return;
    const created = await productApi.createReview(product._id, reviewForm);
    setReviews([created, ...reviews]);
    setReviewForm({ rating: 5, comment: '' });
  };

  if (loading) {
    return (
      <Layout>
        <Loader label="Loading product" />
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="empty-state danger">{error || 'Product not found.'}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="product-detail">
        <div className="gallery">
          <img src={activeImage} alt={product.title} className="gallery-main" />
          <div className="gallery-thumbs">
            {(product.images || []).map((image) => (
              <button
                type="button"
                key={image}
                className={activeImage === image ? 'active' : ''}
                onClick={() => setActiveImage(image)}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-summary">
          <Link to={`/seller/${product.seller?._id}`} className="seller-link">
            Sold by {product.seller?.name || 'Marketplace seller'}
          </Link>
          <h1>{product.title}</h1>
          <Rating value={product.rating} count={product.numReviews} />
          <div className="detail-price">
            <strong>{formatPrice(price)}</strong>
            {product.discountPrice && product.discountPrice < product.price ? <s>{formatPrice(product.price)}</s> : null}
          </div>
          <p>{product.description}</p>
          <p className={product.stock > 0 ? 'stock in-stock' : 'stock out-stock'}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </p>
          <div className="quantity-line">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(Number(event.target.value), 1))}
            />
          </div>
          <div className="detail-actions">
            <Button type="button" icon={ShoppingCart} onClick={addProductToCart} disabled={product.stock < 1}>
              Add to cart
            </Button>
            <Button type="button" variant="secondary" icon={ShoppingBag} onClick={buyNow} disabled={product.stock < 1}>
              Buy now
            </Button>
            <Button type="button" variant="ghost" icon={Heart} onClick={saveToWishlist}>
              Wishlist
            </Button>
          </div>
          {message ? <div className="success-message">{message}</div> : null}
        </div>
      </section>

      <section className="page-section detail-columns">
        <div>
          <h2>Specifications</h2>
          <dl className="spec-list">
            {(product.specifications || []).map((spec) => (
              <div key={spec.name}>
                <dt>{spec.name}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2>Customer reviews</h2>
          {isAuthenticated ? (
            <form className="review-form" onSubmit={submitReview}>
              <label>
                Rating
                <select
                  value={reviewForm.rating}
                  onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}
                >
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </label>
              <label>
                Comment
                <textarea
                  value={reviewForm.comment}
                  onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
                  required
                />
              </label>
              <Button type="submit">Post review</Button>
            </form>
          ) : (
            <p>
              <Link to="/login">Sign in</Link> to write a review.
            </p>
          )}

          <div className="review-list">
            {reviews.map((review) => (
              <article key={review._id}>
                <Rating value={review.rating} />
                <strong>{review.userId?.name || 'Customer'}</strong>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Related products</h2>
          <Link to={`/category/${product.category?._id}`}>More in {product.category?.name}</Link>
        </div>
        <ProductGrid products={related} />
      </section>
    </Layout>
  );
}

export default ProductDetails;

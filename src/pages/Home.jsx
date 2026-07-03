import { ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryApi, productApi } from '../api/productApi.js';
import CategoryMenu from '../components/CategoryMenu.jsx';
import Layout from '../components/Layout.jsx';
import ProductGrid from '../components/ProductGrid.jsx';

function Home() {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState({ deals: [], best: [], recommended: [], arrivals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHome = async () => {
      setLoading(true);
      try {
        const [categoryData, deals, best, recommended, arrivals] = await Promise.all([
          categoryApi.getCategories(),
          productApi.getProducts({ sort: 'discount', limit: 8 }),
          productApi.getProducts({ sort: 'popularity', limit: 8 }),
          productApi.getProducts({ rating: 4, limit: 8 }),
          productApi.getProducts({ sort: 'newest', limit: 8 }),
        ]);

        setCategories(categoryData);
        setSections({
          deals: deals.products,
          best: best.products,
          recommended: recommended.products,
          arrivals: arrivals.products,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  return (
    <Layout>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Global deals, local confidence</span>
          <h1>Shop everything from daily basics to cross-border finds.</h1>
          <p>
            Browse flash deals, trusted sellers, verified reviews, and fast checkout in one full-stack marketplace.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/products">
              <Zap size={18} />
              <span>Shop deals</span>
            </Link>
            <Link className="text-link" to="/category/Electronics">
              Explore electronics <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="hero-promos" aria-label="Promotions">
          <span>Up to 45% off tech</span>
          <span>Home upgrades under $35</span>
          <span>New seller coupons</span>
        </div>
      </section>

      <section className="trust-row">
        <div>
          <Truck size={22} />
          <span>Free shipping over $75</span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <span>Protected checkout</span>
        </div>
        <div>
          <Zap size={22} />
          <span>Daily flash deals</span>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Shop by category</h2>
          <Link to="/products">View all</Link>
        </div>
        <CategoryMenu categories={categories} />
      </section>

      {error ? <div className="empty-state danger">{error}</div> : null}

      <section className="page-section">
        <div className="section-heading">
          <h2>Flash deals</h2>
          <Link to="/products?sort=discount">More deals</Link>
        </div>
        <ProductGrid products={sections.deals} loading={loading} />
      </section>

      <section className="page-section soft-band">
        <div className="section-heading">
          <h2>Best sellers</h2>
          <Link to="/products?sort=popularity">See ranking</Link>
        </div>
        <ProductGrid products={sections.best} loading={loading} />
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Recommended for you</h2>
          <Link to="/products?rating=4">Top rated</Link>
        </div>
        <ProductGrid products={sections.recommended} loading={loading} />
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>New arrivals</h2>
          <Link to="/products?sort=newest">Fresh picks</Link>
        </div>
        <ProductGrid products={sections.arrivals} loading={loading} />
      </section>
    </Layout>
  );
}

export default Home;

import { SlidersHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import { useProducts } from '../hooks/useProducts.js';

function Products({ title = 'All products', mode = 'products', categoryId = '' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useMemo(
    () => ({
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || '',
      brand: searchParams.get('brand') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      rating: searchParams.get('rating') || '',
      sort: searchParams.get('sort') || 'newest',
      page: searchParams.get('page') || 1,
      limit: 12,
    }),
    [searchParams],
  );
  const { products, meta, loading, error } = useProducts(params, mode, categoryId);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const nextPage = (direction) => {
    const page = Math.min(Math.max(Number(params.page) + direction, 1), meta.totalPages);
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    setSearchParams(next);
  };

  return (
    <Layout>
      <section className="catalog-layout">
        <aside className="filters-panel">
          <h2>
            <SlidersHorizontal size={20} />
            Filters
          </h2>
          <label>
            Category
            <input value={params.category} onChange={(event) => setParam('category', event.target.value)} />
          </label>
          <label>
            Brand
            <input value={params.brand} onChange={(event) => setParam('brand', event.target.value)} />
          </label>
          <div className="split-inputs">
            <label>
              Min price
              <input
                type="number"
                min="0"
                value={params.minPrice}
                onChange={(event) => setParam('minPrice', event.target.value)}
              />
            </label>
            <label>
              Max price
              <input
                type="number"
                min="0"
                value={params.maxPrice}
                onChange={(event) => setParam('maxPrice', event.target.value)}
              />
            </label>
          </div>
          <label>
            Rating
            <select value={params.rating} onChange={(event) => setParam('rating', event.target.value)}>
              <option value="">Any rating</option>
              <option value="4">4 stars & up</option>
              <option value="3">3 stars & up</option>
              <option value="2">2 stars & up</option>
            </select>
          </label>
          <Button type="button" variant="secondary" onClick={() => setSearchParams({})}>
            Clear filters
          </Button>
        </aside>

        <section className="catalog-results">
          <div className="catalog-header">
            <div>
              <h1>{title}</h1>
              <p>{meta.total || 0} products found</p>
            </div>
            <label>
              Sort
              <select value={params.sort} onChange={(event) => setParam('sort', event.target.value)}>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="popularity">Popularity</option>
                <option value="discount">Discount</option>
              </select>
            </label>
          </div>

          <ProductGrid products={products} loading={loading} error={error} />

          <div className="pagination">
            <Button type="button" variant="secondary" onClick={() => nextPage(-1)} disabled={Number(params.page) <= 1}>
              Previous
            </Button>
            <span>
              Page {meta.page || 1} of {meta.totalPages || 1}
            </span>
            <Button
              type="button"
              variant="secondary"
              onClick={() => nextPage(1)}
              disabled={Number(params.page) >= meta.totalPages}
            >
              Next
            </Button>
          </div>
        </section>
      </section>
    </Layout>
  );
}

export default Products;

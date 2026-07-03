import { useCallback, useEffect, useState } from 'react';
import { productApi } from '../api/productApi.js';

export const useProducts = (params = {}, mode = 'products', categoryId = '') => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data =
        mode === 'category'
          ? await productApi.getProductsByCategory(categoryId, params)
          : mode === 'search'
            ? await productApi.searchProducts(params)
            : await productApi.getProducts(params);

      setProducts(data.products || []);
      setMeta({ page: data.page, totalPages: data.totalPages, total: data.total });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoryId, mode, params]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return { products, meta, loading, error, reload: loadProducts };
};

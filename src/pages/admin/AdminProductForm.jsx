import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../../components/Button.jsx';
import { categoryApi } from '../../api/productApi.js';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: '',
  stock: '',
  images: '',
  specifications: 'Warranty: 12 months\nShips From: United States',
};

function AdminProductForm({ initialProduct, onSubmit, submitLabel }) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryApi.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!initialProduct) return;
    setForm({
      title: initialProduct.title || '',
      description: initialProduct.description || '',
      price: initialProduct.price || '',
      discountPrice: initialProduct.discountPrice || '',
      category: initialProduct.category?._id || initialProduct.category || '',
      brand: initialProduct.brand || '',
      stock: initialProduct.stock || '',
      images: (initialProduct.images || []).join(', '),
      specifications: (initialProduct.specifications || [])
        .map((spec) => `${spec.name}: ${spec.value}`)
        .join('\n'),
    });
  }, [initialProduct]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title || !form.category || Number(form.price) <= 0) {
      setError('Title, category, and valid price are required.');
      return;
    }

    const specifications = form.specifications
      .split('\n')
      .map((row) => row.split(':'))
      .filter(([name, value]) => name?.trim() && value?.trim())
      .map(([name, ...value]) => ({ name: name.trim(), value: value.join(':').trim() }));

    await onSubmit({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice || form.price),
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      images: form.images.split(',').map((image) => image.trim()).filter(Boolean),
      specifications,
    });
  };

  return (
    <form className="form-panel admin-product-form" onSubmit={submit}>
      {error ? <div className="empty-state danger">{error}</div> : null}
      <div className="form-grid">
        <label className="span-2">
          Product title
          <input value={form.title} onChange={(event) => update('title', event.target.value)} required />
        </label>
        <label className="span-2">
          Description
          <textarea value={form.description} onChange={(event) => update('description', event.target.value)} required />
        </label>
        <label>
          Price
          <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => update('price', event.target.value)} required />
        </label>
        <label>
          Discount price
          <input type="number" min="0" step="0.01" value={form.discountPrice} onChange={(event) => update('discountPrice', event.target.value)} />
        </label>
        <label>
          Category
          <select value={form.category} onChange={(event) => update('category', event.target.value)} required>
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Brand
          <input value={form.brand} onChange={(event) => update('brand', event.target.value)} required />
        </label>
        <label>
          Stock
          <input type="number" min="0" value={form.stock} onChange={(event) => update('stock', event.target.value)} required />
        </label>
        <label className="span-2">
          Product image URLs
          <textarea value={form.images} onChange={(event) => update('images', event.target.value)} placeholder="https://image-one.jpg, https://image-two.jpg" />
        </label>
        <label className="span-2">
          Specifications
          <textarea value={form.specifications} onChange={(event) => update('specifications', event.target.value)} />
        </label>
      </div>
      <Button type="submit" icon={Save}>
        {submitLabel}
      </Button>
    </form>
  );
}

export default AdminProductForm;

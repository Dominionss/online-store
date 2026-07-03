import { Save } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../hooks/useAuth.js';

function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    addresses: user?.addresses?.length
      ? user.addresses
      : [
          {
            fullName: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'United States',
            isDefault: true,
          },
        ],
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateAddress = (field, value) => {
    setForm((current) => ({
      ...current,
      addresses: [{ ...current.addresses[0], [field]: value }],
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        addresses: form.addresses.filter((address) => address.fullName && address.street && address.city),
      };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.message);
    }
  };

  const address = form.addresses[0] || {};

  return (
    <Layout>
      <section className="form-panel profile-panel">
        <h1>User profile</h1>
        {message ? <div className="success-message">{message}</div> : null}
        {error ? <div className="empty-state danger">{error}</div> : null}
        <form onSubmit={submit}>
          <div className="form-grid">
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label className="span-2">
              New password
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>
          </div>

          <h2>Saved address</h2>
          <div className="form-grid">
            {[
              ['fullName', 'Full name'],
              ['phone', 'Phone'],
              ['street', 'Street'],
              ['city', 'City'],
              ['state', 'State'],
              ['postalCode', 'Postal code'],
              ['country', 'Country'],
            ].map(([field, label]) => (
              <label key={field} className={field === 'street' ? 'span-2' : ''}>
                {label}
                <input value={address[field] || ''} onChange={(event) => updateAddress(field, event.target.value)} />
              </label>
            ))}
          </div>

          <Button type="submit" icon={Save} disabled={loading}>
            Save profile
          </Button>
        </form>
      </section>
    </Layout>
  );
}

export default Profile;

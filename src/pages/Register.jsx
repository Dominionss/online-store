import { UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../hooks/useAuth.js';

function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [validation, setValidation] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (form.password.length < 6) {
      setValidation('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setValidation('Passwords do not match.');
      return;
    }
    await register({ name: form.name, email: form.email, password: form.password });
    navigate('/');
  };

  return (
    <Layout>
      <section className="auth-panel">
        <h1>Create account</h1>
        <p>Register once, then use cart, orders, reviews, and wishlist across devices.</p>
        <form onSubmit={submit}>
          {(validation || error) ? <div className="empty-state danger">{validation || error}</div> : null}
          <label>
            Name
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            />
          </label>
          <Button type="submit" icon={UserPlus} disabled={loading}>
            {loading ? 'Creating account' : 'Register'}
          </Button>
        </form>
        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </section>
    </Layout>
  );
}

export default Register;

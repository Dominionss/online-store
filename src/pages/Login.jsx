import { LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../hooks/useAuth.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [validation, setValidation] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email.includes('@') || form.password.length < 6) {
      setValidation('Enter a valid email and at least 6 password characters.');
      return;
    }
    await login(form);
    navigate(location.state?.from?.pathname || '/');
  };

  return (
    <Layout>
      <section className="auth-panel">
        <h1>Welcome back</h1>
        <p>Sign in to view orders, checkout, and manage your wishlist.</p>
        <form onSubmit={submit}>
          {(validation || error) ? <div className="empty-state danger">{validation || error}</div> : null}
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
          <Button type="submit" icon={LogIn} disabled={loading}>
            {loading ? 'Signing in' : 'Login'}
          </Button>
        </form>
        <p>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </Layout>
  );
}

export default Login;

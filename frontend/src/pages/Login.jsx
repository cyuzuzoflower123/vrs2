import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Notice from '../components/Notice.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate(user.role === 'admin' ? '/admin' : '/reservations', { replace: true });
    }
  }, [authLoading, user, navigate]);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/reservations');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Login" subtitle="Use your account to continue.">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <Notice type="error" message={error} />
        <div>
          <label className="label" htmlFor="username">
            Username
          </label>
          <input className="field" id="username" name="username" value={form.username} onChange={updateField} />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="field"
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
          />
        </div>
        <button className="btn w-full" disabled={loading}>
          <LogIn size={16} />
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-neutral-600">
        New customer?{' '}
        <Link className="font-semibold text-black underline" to="/signup">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}

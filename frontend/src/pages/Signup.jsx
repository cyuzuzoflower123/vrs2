import { UserPlus } from 'lucide-react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import Notice from '../components/Notice.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  username: '',
  password: '',
  gender: 'male',
  full_name: '',
  national_ID: '',
  phone: '',
  email: '',
  address: ''
};

export default function Signup() {
  const { user, loading: authLoading, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
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
    setMessage('');
    setLoading(true);

    try {
      await signup(form);
      setMessage('Account created. You can login now.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Customer signup" subtitle="Create a customer account before reserving.">
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <Notice message={message} />
          <Notice type="error" message={error} />
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="field" name="full_name" value={form.full_name} onChange={updateField} />
        </div>
        <div>
          <label className="label">National ID</label>
          <input className="field" name="national_ID" value={form.national_ID} onChange={updateField} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="field" name="phone" value={form.phone} onChange={updateField} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="field" name="email" type="email" value={form.email} onChange={updateField} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Address</label>
          <input className="field" name="address" value={form.address} onChange={updateField} />
        </div>
        <div>
          <label className="label">Username</label>
          <input className="field" name="username" value={form.username} onChange={updateField} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="field" name="password" type="password" value={form.password} onChange={updateField} />
        </div>
        <div>
          <label className="label">Gender</label>
          <select className="field" name="gender" value={form.gender} onChange={updateField}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="btn w-full" disabled={loading}>
            <UserPlus size={16} />
            {loading ? 'Creating...' : 'Signup'}
          </button>
        </div>
      </form>
      <p className="mt-5 text-center text-sm text-neutral-600">
        Already registered?{' '}
        <Link className="font-semibold text-black underline" to="/login">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

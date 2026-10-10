import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, login } from '../store/authSlice';
import { ErrorBox } from '../components/ui';
import { STORE_NAME } from '../utils/config';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { user, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';

  useEffect(() => () => dispatch(clearError()), [dispatch]);
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (login.fulfilled.match(res)) navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <p className="mb-6 text-center font-serif text-3xl">{STORE_NAME}<span className="text-gold-500">.</span></p>
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <h1 className="font-serif text-2xl">Sign in</h1>
        <ErrorBox message={error} />
        <label className="block">
          <span className="label">Email</span>
          <input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
        </label>
        <label className="block">
          <span className="label">Password</span>
          <input type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
        </label>
        <button disabled={loading} className="btn-gold w-full">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-500">
        New here? <Link to="/register" state={{ from }} className="font-semibold text-sky-800 hover:underline">Create an account</Link>
      </p>
    </div>
  );
}

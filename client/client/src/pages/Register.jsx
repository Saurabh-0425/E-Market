import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, register } from '../store/authSlice';
import { ErrorBox } from '../components/ui';
import { STORE_NAME } from '../utils/config';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { user, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';

  useEffect(() => () => dispatch(clearError()), [dispatch]);
  if (user) return <Navigate to={from} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (register.fulfilled.match(res)) navigate(from, { replace: true });
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <p className="mb-6 text-center font-serif text-3xl">{STORE_NAME}<span className="text-gold-500">.</span></p>
      <form onSubmit={submit} className="panel space-y-4 p-6">
        <h1 className="font-serif text-2xl">Create account</h1>
        <ErrorBox message={error} />
        <label className="block"><span className="label">Name</span><input required autoComplete="name" value={form.name} onChange={set('name')} className="input" /></label>
        <label className="block"><span className="label">Email</span><input type="email" required autoComplete="email" value={form.email} onChange={set('email')} className="input" /></label>
        <label className="block">
          <span className="label">Password</span>
          <input type="password" required minLength={6} autoComplete="new-password" value={form.password} onChange={set('password')} className="input" />
          <span className="mt-1 block text-xs text-ink-500">At least 6 characters.</span>
        </label>
        <button disabled={loading} className="btn-gold w-full">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
      <p className="mt-5 text-center text-sm text-ink-500">
        Already have an account? <Link to="/login" state={{ from }} className="font-semibold text-sky-800 hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

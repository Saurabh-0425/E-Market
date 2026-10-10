import { Link } from 'react-router-dom';

export const Spinner = () => (
  <div className="flex justify-center py-20" role="status" aria-label="Loading">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-ink-900/10 border-t-ink-900" />
  </div>
);

export const ErrorBox = ({ message }) =>
  message ? (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      {message}
    </div>
  ) : null;

export const Empty = ({ title, text, to, cta }) => (
  <div className="panel mx-auto max-w-lg p-10 text-center">
    <h2 className="font-serif text-2xl">{title}</h2>
    {text && <p className="mt-2 text-ink-500">{text}</p>}
    {to && <Link to={to} className="btn-gold mt-5">{cta}</Link>}
  </div>
);

const colors = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-sky-100 text-sky-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};
export const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[status] || ''}`}>{status}</span>
);

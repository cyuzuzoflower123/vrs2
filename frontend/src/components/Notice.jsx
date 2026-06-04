export default function Notice({ type = 'info', message }) {
  if (!message) {
    return null;
  }

  const classes =
    type === 'error'
      ? 'border-neutral-900 bg-neutral-100 text-neutral-900'
      : 'border-neutral-200 bg-neutral-50 text-neutral-700';

  return <div className={`mb-4 rounded-md border px-4 py-3 text-sm ${classes}`}>{message}</div>;
}


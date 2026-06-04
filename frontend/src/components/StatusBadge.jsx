export default function StatusBadge({ children }) {
  return (
    <span className="inline-flex rounded-full border border-neutral-300 px-2 py-1 text-xs font-semibold capitalize text-neutral-700">
      {children}
    </span>
  );
}


export default function EmptyState({ title, text }) {
  return (
    <div className="panel px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-black">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{text}</p>
    </div>
  );
}


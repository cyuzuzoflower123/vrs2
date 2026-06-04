export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Swift Wheels</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-black">Vehicle reservations made simple.</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-neutral-600">
            A clean rental workflow for customers and administrators, built for XAMPP MySQL.
          </p>
        </div>
        <div className="panel p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-black">{title}</h2>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}


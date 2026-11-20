
export default function AdminDashboardPage() {
  return (
    <main>
      <section className="mb-8">
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#B39A7D]">
          Administration
        </p>

        <h1 className="font-serif text-3xl text-[#46322D] sm:text-4xl">
          Overview
        </h1>

        <p className="mt-2 text-sm text-[#7A7470]">
          Manage your salon and keep everything running beautifully.
        </p>
      </section>

      <section className="border border-[#E6E1DD] bg-white p-8 sm:p-10">
        <h2 className="font-serif text-2xl text-[#46322D]">
          Welcome to Blush & Bloom
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-[#7A7470]">
          Your administration dashboard is ready. Here you will be able to
          manage salon services, customer appointments, registered users,
          and payment transactions.
        </p>
      </section>
    </main>
  );
}

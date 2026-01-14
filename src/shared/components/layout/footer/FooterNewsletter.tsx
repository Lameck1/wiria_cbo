export function FooterNewsletter() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:max-w-md lg:p-8">
      <h4 className="mb-2 text-lg font-bold">Stay Updated</h4>
      <p className="mb-4 text-sm text-gray-300">
        Subscribe to our newsletter for updates on our programs and community impact.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="Enter your email"
          required
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-wiria-yellow"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-lg bg-wiria-green-light px-6 py-3 text-sm font-bold text-wiria-blue-dark transition-all hover:bg-green-400"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}


const stats = [
  {
    title: "Total Services",
    value: "—",
    description: "All your listed services",
  },
  {
    title: "Active Services",
    value: "—",
    description: "Currently available services",
  },
  {
    title: "Pending Requests",
    value: "—",
    description: "Waiting for your response",
  },
  {
    title: "Accepted Bookings",
    value: "—",
    description: "Confirmed booking requests",
  },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-8">
      <section>
        <p className="mb-2 text-sm font-medium tracking-widest text-[#94765F]">
          WELCOME TO EVERVOW
        </p>

        <h2 className="text-2xl font-bold text-[#292321] md:text-3xl">
          Your Business at a Glance
        </h2>

        <p className="mt-2 text-sm text-[#625B56]">
          Manage your services, track bookings, and grow your wedding business.
        </p>
      </section>

      {/* Statistics Cards */}
      <section>
        <h3 className="mb-4 text-lg font-semibold text-[#292321]">
          Overview
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-[#E8DDD0] bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-[#94765F]">
                {stat.title}
              </p>

              <h4 className="my-3 text-3xl font-bold text-[#76243A]">
                {stat.value}
              </h4>

              <p className="text-xs text-[#625B56]">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Card */}
      <section className="rounded-xl bg-[#76243A] p-6 text-white md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#F1D8D8]">
            CURRENT SUBSCRIPTION
          </p>

          <h3 className="mt-2 text-2xl font-bold">Free Plan</h3>

          <p className="mt-2 text-sm text-[#F1D8D8]">
            List up to 3 active services with your current plan.
          </p>
        </div>

        <a
          href="/vendor-dashboard/subscription"
          className="mt-5 inline-block rounded-lg bg-[#F1E8DC] px-5 py-3 text-sm font-semibold text-[#76243A] hover:bg-white md:mt-0"
        >
          Explore Premium
        </a>
      </section>

      {/* Getting Started */}
      <section className="rounded-xl border border-[#E8DDD0] bg-white p-6">
        <h3 className="text-lg font-semibold text-[#292321]">
          Ready to grow your business?
        </h3>

        <p className="mt-2 text-sm text-[#625B56]">
          Add your wedding service and let customers discover what you offer.
        </p>

        <a
          href="/vendor-dashboard/add-service"
          className="mt-5 inline-block rounded-lg bg-[#76243A] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#581525]"
        >
            <div>
                <i className="fa-solid fa-plus pr-2"></i>
          Add Your First Service
            </div>
        </a>
      </section>
    </div>
  );
}

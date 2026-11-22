"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, ArrowUpDown } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "All Categories",
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function BrowseServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Services fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services
    .filter((service) => {
      const serviceName = service.serviceName || service.name || "";

      const matchesSearch = serviceName
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" ||
        service.category === category;

      const matchesLocation =
        !location ||
        (service.location || "")
          .toLowerCase()
          .includes(location.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    })
    .sort((a, b) => {
      if (sort === "low-high") {
        return Number(a.price) - Number(b.price);
      }

      if (sort === "high-low") {
        return Number(b.price) - Number(a.price);
      }

      return 0;
    });

  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      {/* Header */}
      <section className="bg-[#76243A] px-4 py-16 text-center text-white sm:py-20">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#E8DDD0]">
          Make Your Dream Wedding
        </p>

        <h1 className="text-3xl font-bold sm:text-5xl">
          Explore Wedding Services
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm text-[#E8DDD0] sm:text-base">
          Discover trusted wedding professionals and find the
          perfect services for your special day.
        </p>
      </section>

      {/* Search and Filters */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765F]" />

            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#E8DDD0] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#76243A]"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-[#E8DDD0] px-4 py-3 text-sm outline-none focus:border-[#76243A]"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765F]" />

            <input
              type="text"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-[#E8DDD0] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#76243A]"
            />
          </div>

          {/* Sorting */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94765F]" />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full rounded-lg border border-[#E8DDD0] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#76243A]"
            >
              <option value="">Sort by Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#76243A]">
            Available Services
          </h2>

          {!loading && (
            <p className="text-sm text-[#625B56]">
              {filteredServices.length} services found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E8DDD0] border-t-[#76243A]" />
          </div>
        )}

        {/* Service Cards */}
        {!loading && filteredServices.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => {
              const image =
                service.images?.[0] ||
                service.image ||
                service.serviceImage;

              return (
                <div
                  key={service._id}
                  className="overflow-hidden rounded-2xl border border-[#E8DDD0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="h-56 overflow-hidden bg-[#E8DDD0]">
                    {image ? (
                      <img
                        src={image}
                        alt={service.serviceName}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#94765F]">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-[#76243A]">
                        {service.serviceName || service.name}
                      </h3>

                      <span className="shrink-0 rounded-full bg-[#F8F5F0] px-3 py-1 text-xs text-[#94765F]">
                        {service.category}
                      </span>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-[#625B56]">
                      <MapPin size={16} />
                      {service.location || "Location not specified"}
                    </p>

                    <p className="line-clamp-2 text-sm text-[#625B56]">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-[#E8DDD0] pt-4">
                      <p className="text-lg font-bold text-[#76243A]">
                        ৳{Number(service.price).toLocaleString()}
                      </p>

                      <Link
                        href={`/services/${service._id}`}
                        className="rounded-lg bg-[#76243A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#5C1B2C]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#E8DDD0] bg-white px-6 text-center">
            <Search size={40} className="mb-4 text-[#94765F]" />

            <h3 className="text-xl font-semibold text-[#76243A]">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-[#625B56]">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All Categories");
                setLocation("");
                setSort("");
              }}
              className="mt-5 rounded-lg bg-[#76243A] px-5 py-2 text-sm text-white hover:bg-[#5C1B2C]"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const FeaturedServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services`);

        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const data = await response.json();

        const serviceList = Array.isArray(data)
          ? data
          : data.services || [];

        // Show all approved and active services
        const featuredServices = serviceList.filter(
          (service) =>
            service.status === "approved" &&
            service.isActive === true
        );

        setServices(featuredServices);
      } catch (error) {
        console.error("Services fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-[#F8F3EB] py-16 md:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[#94765F] text-xs md:text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Discover Something Special
          </p>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#76243A] mb-4">
            Featured Wedding Services
          </h2>

          <p className="text-[#625B56] text-sm sm:text-base leading-7">
            From dreamy venues to beautiful decorations, find the perfect
            professionals to make your wedding day unforgettable.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-[#F1E8DC] rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-56 sm:h-60 bg-[#E5D8C9]"></div>

                <div className="p-5 space-y-4">
                  <div className="h-4 w-24 bg-[#E5D8C9] rounded"></div>
                  <div className="h-6 w-3/4 bg-[#E5D8C9] rounded"></div>
                  <div className="h-4 w-1/2 bg-[#E5D8C9] rounded"></div>
                  <div className="h-10 w-full bg-[#E5D8C9] rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Cards */}
        {!loading && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const image =
                service.images?.[0] ||
                service.image ||
                "https://placehold.co/600x400?text=Wedding+Service";

              const vendorName =
                service.vendorName ||
                service.vendor?.name ||
                "Wedding Professional";

              return (
                <div
                  key={service._id}
                  className="group bg-[#F1E8DC] rounded-2xl overflow-hidden border border-[#E5D8C9] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Service Image */}
                  <div className="relative h-56 sm:h-60 overflow-hidden bg-[#E5D8C9]">
                    <img
                      src={image}
                      alt={service.serviceName || "Wedding service"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-[#76243A] text-[#F8F3EB] text-xs font-medium px-4 py-2 rounded-full shadow-md">
                      {service.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-serif font-bold text-[#76243A] mb-3 line-clamp-1">
                      {service.serviceName}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-[#625B56] mb-3">
                      <i className="fa-solid fa-location-dot text-[#94765F]"></i>
                      <span className="line-clamp-1">
                        {service.location}
                      </span>
                    </div>

                    {/* Vendor Information */}
                    <div className="flex items-center gap-2 text-sm text-[#625B56] mb-5">
                      <i className="fa-solid fa-user text-[#94765F]"></i>
                      <span className="line-clamp-1">
                        {vendorName}
                      </span>
                    </div>

                    {/* Price & Details Button */}
                    <div className="flex items-center justify-between gap-3 border-t border-[#DCCDBD] pt-4">
                      <div>
                        <p className="text-xs text-[#94765F] mb-1">
                          Starting from
                        </p>

                        <p className="text-xl font-bold text-[#76243A]">
                          ৳{Number(service.price || 0).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <Link
                        href={`/services/${service._id}`}
                        className="shrink-0 bg-[#76243A] text-[#F8F3EB] px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#581525] transition-colors duration-300"
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
        {!loading && services.length === 0 && (
          <div className="bg-[#F1E8DC] border border-[#E5D8C9] rounded-2xl text-center py-16 px-4">
            <i className="fa-solid fa-heart text-4xl text-[#94765F] mb-5"></i>

            <h3 className="text-2xl font-serif font-bold text-[#76243A] mb-3">
              No Services Available Yet
            </h3>

            <p className="text-[#625B56] text-sm sm:text-base">
              Our wedding professionals are getting ready. Please check back
              soon!
            </p>
          </div>
        )}

        {/* Browse All Services Button */}
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-3 bg-[#76243A] text-[#F8F3EB] px-7 py-3.5 rounded-full font-medium text-sm sm:text-base hover:bg-[#581525] hover:shadow-lg transition-all duration-300"
          >
            Explore All Services
            <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedServices;

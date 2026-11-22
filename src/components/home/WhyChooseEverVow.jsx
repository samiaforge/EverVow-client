"use client";

import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Wallet,
  Clock,
  Users,
} from "lucide-react";

const benefits = [
  {
    icon: HeartHandshake,
    title: "Everything in One Place",
    description:
      "Discover photographers, venues, makeup artists, decorators, and more without jumping between different platforms.",
    number: "01",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Wedding Vendors",
    description:
      "Explore verified and approved wedding professionals to make your special day stress-free.",
    number: "02",
  },
  {
    icon: Wallet,
    title: "Planning Within Your Budget",
    description:
      "Compare services and prices to find the perfect vendors that match your wedding budget.",
    number: "03",
  },
  {
    icon: Clock,
    title: "Save Time & Effort",
    description:
      "Browse services, request bookings, and manage your wedding plans from one convenient platform.",
    number: "04",
  },
];

export default function WhyChooseWedPlan() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] px-5 py-20 md:px-10 lg:py-28">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#76243A]/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#76243A]/10 px-4 py-2 text-sm font-medium text-[#76243A]">
            <Sparkles size={16} />
            The EverVow Difference
          </span>

          <h2 className="mt-5 text-3xl font-bold text-[#292321] md:text-5xl">
            Your Wedding Journey,
            <span className="text-[#76243A]"> Made Beautiful</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#625B56] md:text-base">
            Planning your dream wedding should be exciting, not overwhelming.
            WedPlan brings everything you need together to make every moment
            easier and more memorable.
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="benefit-card group relative rounded-2xl border border-[#E8DDD0] bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-[#76243A]/30 hover:shadow-xl"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Number */}
                <span className="absolute right-6 top-6 text-4xl font-bold text-[#76243A]/5 transition-colors duration-300 group-hover:text-[#76243A]/10">
                  {benefit.number}
                </span>

                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#76243A]/10 text-[#76243A] transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-[#76243A] group-hover:text-white">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-[#292321]">
                  {benefit.title}
                </h3>

                <p className="text-sm leading-7 text-[#625B56]">
                  {benefit.description}
                </p>

                {/* Bottom decorative line */}
                <div className="mt-6 h-1 w-10 rounded-full bg-[#76243A]/20 transition-all duration-500 group-hover:w-full group-hover:bg-[#76243A]" />
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">
          <HeartHandshake
            size={28}
            className="text-[#76243A]"
          />

          <p className="text-lg font-medium text-[#76243A]">
            Your dream wedding deserves the perfect beginning.
          </p>
        </div>
      </div>
    </section>
  );
}
"use client";

import {
  Search,
  Heart,
  CalendarCheck,
  PartyPopper,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Your Dream Services",
    description:
      "Explore a curated collection of wedding venues, photographers, makeup artists, decorators, and more.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Choose Your Favorites",
    description:
      "Compare services, browse portfolios, and find the vendors that perfectly match your vision.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Request Your Booking",
    description:
      "Submit your event details and booking request directly to your chosen wedding professional.",
  },
  {
    number: "04",
    icon: PartyPopper,
    title: "Celebrate Your Big Day",
    description:
      "Manage your bookings, connect with vendors, and get ready for the wedding you've always dreamed of.",
  },
];

export default function HowWedPlanWorks() {
  return (
    <section className="overflow-hidden bg-white px-5 py-20 md:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#76243A]/10 px-4 py-2 text-sm font-medium text-[#76243A]">
            <Sparkles size={16} />
            Your Journey Starts Here
          </span>

          <h2 className="mt-5 text-3xl font-bold text-[#292321] md:text-5xl">
            How <span className="text-[#76243A]">EverVow</span> Works
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#625B56] md:text-base">
            Four simple steps to turn your wedding vision into a beautiful reality.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-10 md:grid-cols-4 md:gap-6">

          {/* Timeline Line - Desktop */}
          <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-[2px] bg-[#76243A]/10 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="how-step group relative"
                style={{
                  animationDelay: `${index * 200}ms`,
                }}
              >
                {/* Icon Circle */}
                <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#76243A]/10 bg-[#FAF7F2] transition-all duration-500 group-hover:scale-110 group-hover:border-[#76243A] group-hover:bg-[#76243A] group-hover:shadow-[0_0_0_10px_rgba(118,36,58,0.05)]">
                  <Icon
                    size={34}
                    strokeWidth={1.7}
                    className="text-[#76243A] transition-colors duration-500 group-hover:text-white"
                  />

                  {/* Step Number */}
                  <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#76243A] text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-7 text-center">
                  <h3 className="text-lg font-semibold text-[#292321] transition-colors group-hover:text-[#76243A]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#625B56]">
                    {step.description}
                  </p>
                </div>

                {/* Arrow */}
                {index !== steps.length - 1 && (
                  <div className="mt-6 hidden justify-center md:flex">
                    <ArrowRight
                      size={20}
                      className="text-[#76243A]/30 transition-all duration-300 group-hover:translate-x-2 group-hover:text-[#76243A]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[#76243A] px-6 py-10 text-center text-white md:px-12">
          <h3 className="text-2xl font-bold md:text-3xl">
            Ready to Plan Your Dream Wedding?
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#F1D8D8]">
            Your perfect wedding team is just a few clicks away.
            Start exploring and make your dream day unforgettable.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F1E8DC] px-7 py-3 font-semibold text-[#76243A] transition-all duration-300 hover:scale-105 hover:bg-white"
          >
            Explore Wedding Services
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
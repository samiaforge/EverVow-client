"use client";

import Link from "next/link";
import { Heart, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";


const Footer = () => {
  const exploreLinks = [
    { name: "Home", href: "/" },
    { name: "Wedding Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Sign In", href: "/login" },
  ];

  const serviceLinks = [
    "Wedding Photography",
    "Wedding Venues",
    "Makeup & Styling",
    "Wedding Decoration",
  ];





  return (
    <footer className="bg-[#292321] text-[#F8F3EB]">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-12">
        {/* Footer Main Content */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <h2 className="font-serif text-3xl font-bold italic text-[#F8F3EB]">
                WedPlan
                <span className="text-[#D8A6A6]">.</span>
              </h2>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#F8F3EB]/70">
              Your journey to the perfect wedding begins here. Discover trusted
              vendors, explore beautiful services, and plan your special day
              with ease.
            </p>

            <div className="flex items-center gap-2 text-sm text-[#D8A6A6]">
              <Heart size={16} fill="currentColor" />
              <span>Made for your happily ever after.</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-[#F8F3EB]">
              Explore
            </h3>

            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-[#F8F3EB]/70 transition-colors hover:text-[#D8A6A6]"
                  >
                    {link.name}

                    <ArrowUpRight
                      size={14}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Wedding Services */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-[#F8F3EB]">
              Wedding Services
            </h3>

            <ul className="space-y-3">
              {serviceLinks.map((service) => (
                <li key={service}>
                  <Link
                    href="/services"
                    className="text-sm text-[#F8F3EB]/70 transition-colors hover:text-[#D8A6A6]"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-[#F8F3EB]">
              Contact Us
            </h3>

            <div className="space-y-4">
              {/* Email */}
              <a
                href="mailto:hello@wedplan.com"
                className="flex items-start gap-3 text-sm text-[#F8F3EB]/70 transition-colors hover:text-[#D8A6A6]"
              >
                <Mail size={18} className="mt-0.5 shrink-0" />
                <span>hello@everbow.com</span>
              </a>

              {/* Phone */}
              <a
                href="tel:+8801000000000"
                className="flex items-start gap-3 text-sm text-[#F8F3EB]/70 transition-colors hover:text-[#D8A6A6]"
              >
                <Phone size={18} className="mt-0.5 shrink-0" />
                <span>+880 1000-000000</span>
              </a>

              {/* Location */}
              <div className="flex items-start gap-3 text-sm text-[#F8F3EB]/70">
                <MapPin size={18} className="mt-0.5 shrink-0" />
                <span>Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-10 border-t border-[#F8F3EB]/10 pt-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#F8F3EB]">
                Follow Our Journey
              </h3>

              <p className="mt-2 text-sm text-[#F8F3EB]/60">
                Inspiration, ideas, and beautiful wedding moments.
              </p>
            </div>

            <div className="flex gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8F3EB]/15 text-[#F8F3EB]/70 transition-all duration-300 hover:border-[#D8A6A6] hover:bg-[#76243A] hover:text-white"
              >
                <i className="fa-brands fa-facebook-f text-lg"></i>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8F3EB]/15 text-[#F8F3EB]/70 transition-all duration-300 hover:border-[#D8A6A6] hover:bg-[#76243A] hover:text-white"
              >
                <i className="fa-brands fa-instagram text-lg"></i>
              </a>

              {/* Pinterest */}
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F8F3EB]/15 text-[#F8F3EB]/70 transition-all duration-300 hover:border-[#D8A6A6] hover:bg-[#76243A] hover:text-white"
              >
                <i className="fa-brands fa-pinterest-p text-lg"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-[#F8F3EB]/15" />

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-[#F8F3EB]/60 sm:flex-row sm:text-left">
          <p><i className="fa-regular fa-copyright"></i>
             2026 EverVow. All rights reserved.</p>

          <p className="flex items-center gap-1">
            Made with
            <Heart size={14} className="text-[#D8A6A6]" fill="currentColor" />
            for your special day.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

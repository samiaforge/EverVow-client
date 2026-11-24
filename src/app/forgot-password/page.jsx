
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    toast.info(
      "Password reset functionality is not available yet. Please contact support."
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Back to Login */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-[#76243A] hover:underline mb-8"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>

        <div className="bg-white rounded-2xl border border-[#E5DDD4] shadow-sm p-7 sm:p-9">

          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-[#76243A]/10 flex items-center justify-center mb-6">
            <KeyRound size={26} className="text-[#76243A]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2422]">
            Forgot Password?
          </h1>

          <p className="text-sm text-[#786C66] mt-3 leading-6">
            No worries! Enter the email address associated with your account.
            We will help you get back into your account.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#3D3330] mb-2"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8C85]"
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border border-[#E5DDD4] bg-white text-[#2D2422] outline-none focus:border-[#76243A] focus:ring-2 focus:ring-[#76243A]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#76243A] text-white font-semibold hover:bg-[#5F1C2F] transition-colors"
            >
              Reset Password
            </button>

          </form>

          <p className="text-center text-sm text-[#786C66] mt-7">
            Remember your password?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#76243A] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-[#9A8C85] mt-6">
          © 2026 WedPlan. All rights reserved.
        </p>

      </div>
    </main>
  );
}

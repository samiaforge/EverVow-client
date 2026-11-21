
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const API_URL = "http://localhost:5000";

export default function PaymentSuccessPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          router.push("/sign-in");
          return;
        }

        // Wait for Stripe webhook to update the database
        for (let i = 0; i < 10; i++) {
          const response = await fetch(
            `${API_URL}/subscription-status`,
            {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            }
          );

          const result = await response.json();

          if (response.ok && result.premium === true) {
            setPremium(true);
            return;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, 2000)
          );
        }
      } catch (error) {
        console.error("Payment verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F3EB] px-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-sm border border-[#E8DDD0]">

        {loading ? (
          <>
            <i className="fa-solid fa-spinner fa-spin text-4xl text-[#76243A] mb-5"></i>
            <h1 className="text-2xl font-bold text-[#292321]">
              Verifying Your Payment
            </h1>
            <p className="text-[#94765F] mt-3">
              Please wait while we confirm your subscription.
            </p>
          </>
        ) : premium ? (
          <>
            <i className="fa-solid fa-circle-check text-5xl text-green-600 mb-5"></i>
            <h1 className="text-2xl font-bold text-[#292321]">
              Payment Successful!
            </h1>
            <p className="text-[#94765F] mt-3">
              Welcome to EverVow Premium. Your subscription is now active.
            </p>
            <Link
              href="/vendor-dashboard/subscription"
              className="inline-block mt-6 rounded-lg bg-[#76243A] px-6 py-3 text-white"
            >
              Go to Subscription
            </Link>
          </>
        ) : (
          <>
            <i className="fa-solid fa-clock text-5xl text-amber-500 mb-5"></i>
            <h1 className="text-2xl font-bold text-[#292321]">
              Payment Confirmation Pending
            </h1>
            <p className="text-[#94765F] mt-3">
              We have not received confirmation yet. Please check your subscription page again shortly.
            </p>
            <Link
              href="/vendor-dashboard/subscription"
              className="inline-block mt-6 rounded-lg bg-[#76243A] px-6 py-3 text-white"
            >
              Check Subscription
            </Link>
          </>
        )}

      </div>
    </main>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SubscriptionPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [subscription, setSubscription] = useState(null);

  // Fetch subscription details
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          router.push("/sign-in");
          return;
        }

        const response = await fetch(
          `${API_URL}/subscription-status`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            `Backend returned an invalid response. Status: ${response.status}. Check whether the API route exists.`
          );
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load subscription"
          );
        }

        setSubscription(result);
      } catch (error) {
        console.error("Subscription error:", error);
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [router]);

  // Start Stripe Checkout
  const handleUpgrade = async () => {
    try {
      setUpgrading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        toast.error("Please sign in first");
        router.push("/sign-in");
        return;
      }

      const response = await fetch(
        `${API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          `Invalid backend response. Status: ${response.status}`
        );
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to create checkout session"
        );
      }

      if (!result.url) {
        throw new Error("Stripe checkout URL not found");
      }

      window.location.href = result.url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Payment failed to start");
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#94765F]">
          Loading subscription...
        </p>
      </div>
    );
  }

  const isPremium =
  subscription?.premium === true &&
  ["active", "trialing"].includes(
    (subscription?.subscriptionStatus || "").toLowerCase()
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-[#94765F]">
          ACCOUNT SETTINGS
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#292321]">
          Subscription Plans
        </h1>

        <p className="mt-2 text-sm text-[#94765F]">
          Choose the right plan to grow your wedding business.
        </p>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-[#E8DDD0] bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-[#94765F]">
              YOUR CURRENT PLAN
            </p>

            <h2 className="mt-2 text-2xl font-bold capitalize text-[#292321]">
              {subscription?.subscriptionPlan || "Free"} Plan
            </h2>

            <p className="mt-1 text-sm text-[#94765F]">
              {isPremium
                ? "You have access to all Premium features."
                : "You are currently using the Free plan."}
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
              isPremium
                ? "bg-green-100 text-green-700"
                : "bg-[#F8F3EB] text-[#76243A]"
            }`}
          >
            {isPremium ? "Premium Active" : "Free Plan"}
          </span>
        </div>

        {isPremium && subscription?.subscriptionExpiresAt && (
  <p className="mt-4 text-sm text-[#94765F]">
    Subscription expires:{" "}
    {new Date(
      subscription.subscriptionExpiresAt
    ).toLocaleDateString()}
  </p>
)}
        
      </div>

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2">

        {/* Free Plan */}
        <div className="rounded-2xl border border-[#E8DDD0] bg-white p-7">
          <h2 className="text-xl font-bold text-[#292321]">
            Free Plan
          </h2>

          <div className="mt-5 flex items-end gap-1">
            <span className="text-4xl font-bold text-[#292321]">
              <i className="fa-solid fa-bangladeshi-taka-sign"></i> 0
            </span>

            <span className="pb-1 text-sm text-[#94765F]">
              / month
            </span>
          </div>

          <p className="mt-3 text-sm text-[#94765F]">
            Perfect for vendors who are just getting started.
          </p>

          <div className="my-6 border-t border-[#E8DDD0]" />

          <ul className="space-y-4 text-sm text-[#51443D]">
            <li>✓ Maximum 3 Active Services</li>
            <li>✓ Basic Vendor Dashboard</li>
            <li>✓ Booking Request Management</li>
          </ul>

          <div className="mt-12">
            <button
              disabled
              className="mt-14 w-full cursor-not-allowed rounded-xl border border-[#E8DDD0] py-3 font-semibold text-[#94765F]"
            >
              {!isPremium ? "Current Plan" : "Free Plan"}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative rounded-2xl border-2 border-[#76243A] bg-white p-7 shadow-lg">
          <span className="absolute -top-3 right-6 rounded-full bg-[#76243A] px-4 py-1 text-xs font-semibold text-white">
            RECOMMENDED
          </span>

          <h2 className="text-xl font-bold text-[#292321]">
            Premium Plan
          </h2>

          <div className="mt-5 flex items-end gap-1">
            <span className="text-4xl font-bold text-[#76243A]">
              <i className="fa-solid fa-bangladeshi-taka-sign"></i> 999
            </span>

            <span className="pb-1 text-sm text-[#94765F]">
              / month
            </span>
          </div>

          <p className="mt-3 text-sm text-[#94765F]">
            Grow your business with more visibility and unlimited services.
          </p>

          <div className="my-6 border-t border-[#E8DDD0]" />

          <ul className="space-y-4 text-sm text-[#51443D]">
            <li>✓ Unlimited Active Services</li>
            <li>✓ Premium Vendor Badge</li>
            <li>✓ Basic Vendor Dashboard</li>
            <li>✓ Booking Request Management</li>
            <li>✓ All Free Plan Features</li>
          </ul>

          <div className="mt-8">
            {isPremium ? (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-green-100 py-3 font-semibold text-green-700"
              >
                Premium Activated
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="w-full rounded-xl bg-[#76243A] py-3 font-semibold text-white transition hover:bg-[#5D1C2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {upgrading
                  ? "Redirecting to Stripe..."
                  : "Upgrade to Premium"}
              </button>
            )}
          </div>

          <p className="mt-3 text-center text-xs text-[#94765F]">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>

      {/* Information */}
      <div className="rounded-xl border border-[#E8DDD0] bg-[#F8F3EB] p-5">
        <h3 className="font-semibold text-[#292321]">
          Subscription Information
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#94765F]">
          Premium subscriptions are billed monthly. Your Premium
          access will only be activated after successful payment
          verification through Stripe. Payment cancellation or
          expiration will be handled automatically.
        </p>
      </div>
    </div>
  );
}

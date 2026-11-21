
"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F3EB] px-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-sm border border-[#E8DDD0]">

        <i className="fa-solid fa-circle-xmark text-5xl text-red-500 mb-5"></i>

        <h1 className="text-2xl font-bold text-[#292321]">
          Payment Cancelled
        </h1>

        <p className="text-[#94765F] mt-3">
          Your payment was not completed. No subscription has been activated.
          You can try again whenever you are ready.
        </p>

        <Link
          href="/vendor-dashboard/subscription"
          className="inline-block mt-6 rounded-lg bg-[#76243A] px-6 py-3 text-white"
        >
          Back to Subscription
        </Link>

      </div>
    </main>
  );
}

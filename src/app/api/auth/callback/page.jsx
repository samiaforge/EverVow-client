
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/sign-in");
      return;
    }

    const user = session.user;

    if (user.isBlocked === true) {
      toast.error("Your account has been blocked.");
      authClient.signOut().then(() => {
        router.replace("/sign-in");
      });
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin-dashboard");
    } else if (user.role === "vendor") {
      router.replace("/vendor-dashboard");
    } else if (user.role === "customer") {
      router.replace("/");
    } else {
      authClient.signOut().then(() => {
        router.replace("/sign-in");
      });
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg font-medium">
        Verifying your account...
      </p>
    </div>
  );
}

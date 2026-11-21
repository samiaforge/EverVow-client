"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const SignInPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Credential Login
  const handleSignIn = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back!");

      // Get user role
      const user = data?.user;

      if (user?.role === "admin") {
        router.push("/admin-dashboard");
      } else if (user?.role === "vendor") {
        router.push("/vendor-dashboard");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      toast.error(error.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Google login failed.");
      }
    } catch (error) {
      toast.error("Unable to sign in with Google.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F3EB] px-4 py-10">

      <Card className="w-full max-w-md border-[#EDE3D8] bg-white shadow-xl shadow-[#76243A]/5">

        <CardHeader className="space-y-4 text-center">

  {/* Centered Logo */}
  <Link href="/" className="flex justify-center items-center">
    <Image
      src="/images/logo.png"
      alt="Evervow"
      width={140}
      height={50}
      priority
      className="h-12 w-auto object-contain"
    />
  </Link>

  <CardTitle className="text-2xl font-semibold text-[#292321]">
    Welcome Back
  </CardTitle>

  <CardDescription className="text-[#756A63]">
    Sign in to continue planning your perfect wedding.
  </CardDescription>

</CardHeader>

       <CardContent className="px-7 pb-8 pt-2 sm:px-8">

          <form onSubmit={handleSignIn} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-[#E5DDD4] focus-visible:ring-[#76243A]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#76243A] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-[#E5DDD4] focus-visible:ring-[#76243A]"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#76243A] text-white hover:bg-[#581525]"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#E5DDD4]" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-[#756A63]">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full border-[#E5DDD4] text-[#292321] hover:bg-[#F8F3EB]"
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.85 0-5.27-1.92-6.13-4.5H2.18v2.84C3.99 20.03 7.7 23 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.87 14.13a6.99 6.99 0 0 1 0-4.26V7.03H2.18a11 11 0 0 0 0 9.94l3.69-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.97 2.18 7.03l3.69 2.84C6.73 7.29 9.15 4.5 12 4.5Z"
              />
            </svg>

            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-[#756A63]">
            Do not have an account?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-[#76243A] hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
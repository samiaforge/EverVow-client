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

const SignUpPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Password validation
  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    return null;
  };

  // Upload profile image to ImgBB
  const uploadImage = async () => {
    if (!profileImage) return undefined;

    const imageData = new FormData();

    imageData.append("image", profileImage);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: imageData,
      }
    );

    const result = await response.json();

    if (!result.success) {
      throw new Error("Profile image upload failed.");
    }

    return result.data.url;
  };

  // Email & Password Registration
  const handleSignUp = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      const { data, error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: imageUrl,
        role: formData.role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      if (formData.role === "vendor") {
        router.push("/vendor-dashboard");
      } else {
        router.push("/dashboard");
      }

      router.refresh();
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Google Authentication
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (error) {
        toast.error(error.message || "Google sign up failed.");
      }
    } catch (error) {
      toast.error("Unable to sign in with Google.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F3EB] px-4 py-10">

      <Card className="w-full max-w-lg border-[#EDE3D8] bg-white shadow-xl shadow-[#76243A]/5">

        <CardHeader className="space-y-3 text-center">

          <Link
            href="/"
            className="font-serif text-3xl font-bold italic text-[#76243A]"
          >
            EverVow
          </Link>

          <CardTitle className="text-2xl font-semibold text-[#292321]">
            Create Your Account
          </CardTitle>

          <CardDescription className="text-[#756A63]">
            Begin planning your perfect wedding with EverVow.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSignUp} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border-[#E5DDD4] focus-visible:ring-[#76243A]"
              />
            </div>

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
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border-[#E5DDD4] focus-visible:ring-[#76243A]"
              />

              <p className="text-xs text-[#756A63]">
                At least 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            {/* Profile Image */}
            <div className="space-y-2">
              <Label htmlFor="profileImage">
                Profile Image (Optional)
              </Label>

              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                className="cursor-pointer border-[#E5DDD4] file:text-[#76243A]"
              />
            </div>

            {/* Account Role */}
            <div className="space-y-2">
              <Label>Account Type</Label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "customer",
                    }))
                  }
                  className={`rounded-lg border p-4 text-left transition ${
                    formData.role === "customer"
                      ? "border-[#76243A] bg-[#F8F3EB] text-[#76243A]"
                      : "border-[#E5DDD4] hover:bg-[#F8F3EB]"
                  }`}
                >
                  <p className="font-semibold">Customer</p>
                  <p className="mt-1 text-xs opacity-70">
                    Discover wedding services
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "vendor",
                    }))
                  }
                  className={`rounded-lg border p-4 text-left transition ${
                    formData.role === "vendor"
                      ? "border-[#76243A] bg-[#F8F3EB] text-[#76243A]"
                      : "border-[#E5DDD4] hover:bg-[#F8F3EB]"
                  }`}
                >
                  <p className="font-semibold">Vendor</p>
                  <p className="mt-1 text-xs opacity-70">
                    Offer wedding services
                  </p>
                </button>

              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#76243A] text-white hover:bg-[#581525]"
            >
              {loading ? "Creating Account..." : "Create Account"}
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
            onClick={handleGoogleSignUp}
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

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-[#756A63]">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#76243A] hover:underline"
            >
              Sign In
            </Link>
          </p>

        </CardContent>
      </Card>
    </main>
  );
};

export default SignUpPage;
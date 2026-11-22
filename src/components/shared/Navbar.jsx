"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Menu, X } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;


  const userRole = user?.role?.toLowerCase();

const dashboardPath =
  user?.role?.toLowerCase() === "admin"
    ? "/admin-dashboard"
    : user?.role?.toLowerCase() === "vendor"
      ? "/vendor-dashboard"
      : "/customer-dashboard";

const profilePath =
  userRole === "customer"
    ? "/customer-dashboard/profile"
    : userRole === "vendor"
    ? "/vendor-dashboard/profile"
    : "/admin-dashboard/profile";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = pathname === "/";

 const navLinks = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "services",
    label: "Browse Services",
    href: "/services",
  },
];



  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMobileMenuOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <nav
      className={`relative z-50 w-full transition-colors duration-300 ${
  isHomePage ? "bg-transparent" : "bg-[#F8F3EB] shadow-sm"
}`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Evervow"
            width={150}
            height={50}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
    <Link
      key={link.id}
      href={link.href}
      className="text-[19px] text-[#862841] font-semibold hover:text-[#471220] transition-colors"
    >
      {link.label}
    </Link>
  ))}
        </div>

        {/* Authentication */}
        <div className="hidden items-center gap-4 md:flex">
          {isPending ? (
            <div className="h-8 w-20 animate-pulse rounded-full bg-[#76243A]/10" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-[#76243A]/20 bg-white/50 px-3 py-1.5 transition hover:bg-white">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#76243A] text-sm font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-28 truncate text-sm font-medium text-[#76243A]">
                  {user.name}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">

  <DropdownMenuGroup>
    <DropdownMenuLabel>
      <div className="flex flex-col">
        <span>{user.name}</span>
        <span className="text-xs font-normal text-muted-foreground">
          {user.email}
        </span>
      </div>
    </DropdownMenuLabel>
  </DropdownMenuGroup>

  <DropdownMenuSeparator />

  <DropdownMenuItem
  onClick={() => router.push(dashboardPath)}
  className="cursor-pointer"
>
  Dashboard
</DropdownMenuItem>

  <DropdownMenuItem
  onClick={() => router.push(profilePath)}
  className="cursor-pointer"
>
  Profile Settings
</DropdownMenuItem>

  <DropdownMenuSeparator />

  <DropdownMenuItem
    onClick={handleLogout}
    className="cursor-pointer text-red-600 focus:text-red-600"
  >
    Logout
  </DropdownMenuItem>

</DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[18px] font-medium text-[#76243A] transition hover:text-[#581525]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#76243A] px-5 py-2.5 text-[18px] font-medium text-white shadow-sm transition hover:bg-[#581525]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#76243A]/10 text-[#76243A] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
  <X size={24} />
) : (
  <Menu size={24} />
)}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full mx-4 rounded-2xl border border-[#76243A]/10 bg-[#F8F3EB] p-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
  <Link
    key={link.id}
    href={link.href}
    onClick={() => setMobileMenuOpen(false)}
    className="font-medium text-[#76243A]"
  >
    {link.label}
  </Link>
))}

            <div className="border-t border-[#76243A]/10 pt-4">
              {isPending ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : user ? (
                <>
                  <p className="mb-3 text-sm font-medium text-[#76243A]">
                    {user.name}
                  </p>

                  <Link
  href={dashboardPath}
  onClick={() => setMobileMenuOpen(false)}
  className="block py-2 text-sm text-[#76243A]"
>
  Browse Services
</Link>

                  <Link
  href={profilePath}
  onClick={() => setMobileMenuOpen(false)}
  className="block py-2 text-sm text-[#76243A]"
>
  Profile Settings
</Link>

                  <button
                    onClick={handleLogout}
                    className="mt-2 text-sm font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-medium text-[#76243A]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full bg-[#76243A] px-5 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

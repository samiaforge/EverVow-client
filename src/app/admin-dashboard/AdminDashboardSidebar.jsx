"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CreditCard,
  Home,
  ShieldCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const adminLinks = [
  {
    title: "Overview",
    url: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Users",
    url: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Manage Services",
    url: "/admin-dashboard/services",
    icon: BriefcaseBusiness,
  },
  {
    title: "Transactions",
    url: "/admin-dashboard/transactions",
    icon: CreditCard,
  },
];

export default function AdminDashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-[#E8DDD0] bg-[#F8F5F0]">
      <SidebarHeader className="border-b border-[#E8DDD0] px-5 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#76243A] text-white">
            <ShieldCheck size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#76243A]">
              WedPlan
            </h2>
            <p className="text-xs text-[#94765F]">
              Admin Panel
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#F8F5F0]">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#94765F]">
            Administration
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-3">
              {adminLinks.map((link) => {
                const Icon = link.icon;

                const isActive =
                  pathname === link.url ||
                  (link.url !== "/admin-dashboard" &&
                    pathname.startsWith(link.url));

                return (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      render={<Link href={link.url} />}
                      isActive={isActive}
                      className={`h-11 rounded-xl px-4 transition-all ${
                        isActive
                          ? "bg-[#76243A] text-white hover:bg-[#76243A] hover:text-white"
                          : "text-[#625B56] hover:bg-[#E8DDD0] hover:text-[#76243A]"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">
                        {link.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-[#E8DDD0] bg-[#F8F5F0] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              className="h-11 rounded-xl px-4 text-[#625B56] hover:bg-[#E8DDD0] hover:text-[#76243A]"
            >
              <Home size={18} />
              <span>Back to Website</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-3 rounded-xl bg-[#E8DDD0]/60 p-3">
          <p className="text-xs font-medium text-[#76243A]">
            WedPlan Administration
          </p>
          <p className="mt-1 text-xs text-[#94765F]">
            Manage your platform efficiently.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
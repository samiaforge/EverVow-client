
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  SidebarRail,
} from "@/components/ui/sidebar";

const dashboardLinks = [
  {
    title: "Overview",
    url: "/customer-dashboard",
    icon: "fa-solid fa-house",
  },
  {
    title: "My Bookings",
    url: "/customer-dashboard/my-bookings",
    icon: "fa-solid fa-calendar-check",
  },
  {
    title: "Profile Settings",
    url: "/customer-dashboard/profile",
    icon: "fa-solid fa-user",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">

      {/* Logo */}
      <SidebarHeader className="border-b border-[#E8DDD0] p-4">
        <Link
          href="/"
          className="flex items-center gap-3 overflow-hidden"
        >
          <i className="fa-solid fa-heart shrink-0 text-xl text-[#76243A]" />

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="text-2xl font-bold text-[#76243A]">
              EverVow<span className="text-[#94765F]">.</span>
            </h2>

            <p className="whitespace-nowrap text-[10px] tracking-widest text-[#94765F]">
              CUSTOMER DASHBOARD
            </p>
          </div>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#94765F] group-data-[collapsible=icon]:hidden">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardLinks.map((link) => {
                const isActive =
                  link.url === "/customer-dashboard"
                    ? pathname === link.url
                    : pathname.startsWith(link.url);

                return (
                  <SidebarMenuItem key={link.url}>
                    <SidebarMenuButton
                      render={<Link href={link.url} />}
                      isActive={isActive}
                      tooltip={link.title}
                      className="h-11 gap-3 px-3 text-sm font-medium text-[#625B56] hover:bg-[#E8DDD0] hover:text-[#76243A] data-[active=true]:bg-[#76243A] data-[active=true]:text-white"
                    >
                      <i className={`${link.icon} fa-fw shrink-0 text-base`} />

                      <span className="truncate">
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

      {/* Footer */}
      <SidebarFooter className="border-t border-[#E8DDD0] p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/" />}
              tooltip="Back to Website"
              className="h-11 gap-3 px-3 text-[#625B56] hover:bg-[#E8DDD0] hover:text-[#76243A]"
            >
              <i className="fa-solid fa-arrow-left fa-fw shrink-0 text-base" />

              <span className="truncate">
                Back to Website
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

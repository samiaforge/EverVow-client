import { requireRole } from "@/lib/require-role";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const instant = false;

export default async function AdminDashboardLayout({ children }) {
  await requireRole("admin");

  return (
    <SidebarProvider>
      <AdminDashboardSidebar />

      <SidebarInset className="min-h-screen bg-[#F8F5F0]">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-[#E8DDD0] bg-[#F8F5F0]/95 px-5 backdrop-blur-sm md:px-8">
          <SidebarTrigger className="text-[#76243A]" />

          <div>
            <h1 className="text-lg font-semibold text-[#76243A]">
              Admin Dashboard
            </h1>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
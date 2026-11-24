
import { requireRole } from "@/lib/require-role";
import DashboardSidebar from "./DashboardSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


export const instant = false;

export default async function DashboardLayout({ children }) {
 await requireRole("vendor");

  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-w-0 bg-[#F8F3EB]">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-[#E8DDD0] px-5 md:px-8">
          <SidebarTrigger className="text-[#76243A]" />

          <div>
            <h1 className="font-semibold text-[#292321]">
              Vendor Workspace
            </h1>

            <p className="text-xs text-[#94765F]">
              Manage your wedding services
            </p>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

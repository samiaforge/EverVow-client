
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";

// const dashboardRoutes = {
//   admin: "/admin-dashboard",
//   vendor: "/vendor-dashboard",
//   customer: "/dashboard",
// };

// export const requireRole = async (requiredRole) => {
//   // Get the current authenticated session
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   // Not logged in
//   if (!session?.user) {
//     redirect("/sign-in");
//   }

//   const user = session.user;

//   // Block blocked users
//   if (user.isBlocked === true) {
//     redirect("/sign-in?blocked=true");
//   }

//   // Verify user role
//   if (user.role !== requiredRole) {
//     const correctDashboard = dashboardRoutes[user.role];

//     if (correctDashboard) {
//       redirect(correctDashboard);
//     }

//     redirect("/sign-in");
//   }

//   return user;
// };

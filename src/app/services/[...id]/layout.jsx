import { Suspense } from "react";

export default function ServiceDetailsLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading service details...</div>}>
      {children}
    </Suspense>
  );
}
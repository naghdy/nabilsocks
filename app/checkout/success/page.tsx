import type { Metadata } from "next";
import { Suspense } from "react";
import { SuccessPanel } from "@/components/SuccessPanel";

export const metadata: Metadata = {
  title: "Order staged",
  description: "Demo order confirmation for Nabil Socks.",
};

export default function SuccessPage() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <Suspense fallback={<p className="text-center text-sm text-muted">Resolving order…</p>}>
        <SuccessPanel />
      </Suspense>
    </div>
  );
}

"use client";
export const dynamic = "force-dynamic";

import ClientOnly from "@/components/ClientOnly";
import VerifyCodeContent from "./VerifyCodeContent";

export default function VerifyCodePage() {
  return (
    <ClientOnly>
      <VerifyCodeContent />
    </ClientOnly>
  );
}

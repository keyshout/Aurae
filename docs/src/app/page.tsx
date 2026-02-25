"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/components");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-8 h-8 relative">
        <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { XRayCard } from "@aurae/components/cards/x-ray-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { XRayCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <XRayCard className="w-full" frontContent={<CardContent title="X-Ray" desc="Pointer-revealed layer" />} backContent={<CardContent title="Hidden" desc="Secret content!" />} />
  );
}`;

export default function XRayCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="XRayCard"
        description="A stunning XRayCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <XRayCard className="w-full max-w-sm mx-auto" frontContent={<CardContent title="X-Ray" desc="Pointer-revealed layer" />} backContent={<CardContent title="Hidden" desc="Secret content!" />} />
          </div>
        }
      />
    </div>
  );
}

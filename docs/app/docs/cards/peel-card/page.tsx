"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PeelCard } from "@aurae/components/cards/peel-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { PeelCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PeelCard className="w-full" front={<CardContent title="Peel" desc="Corner peel" />} back={<CardContent title="Back" desc="Behind the peel" />} />
  );
}`;

export default function PeelCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PeelCard"
        description="A stunning PeelCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <PeelCard className="w-full max-w-sm mx-auto" front={<CardContent title="Peel" desc="Corner peel" />} back={<CardContent title="Back" desc="Behind the peel" />} />
          </div>
        }
      />
    </div>
  );
}

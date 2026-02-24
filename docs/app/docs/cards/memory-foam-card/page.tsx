"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MemoryFoamCard } from "@aurae/components/cards/memory-foam-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { MemoryFoamCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MemoryFoamCard className="w-full"><CardContent title="Memory Foam" desc="Press & spring back" /></MemoryFoamCard>
  );
}`;

export default function MemoryFoamCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MemoryFoamCard"
        description="A stunning MemoryFoamCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MemoryFoamCard className="w-full"><CardContent title="Memory Foam" desc="Press & spring back" /></MemoryFoamCard>
          </div>
        }
      />
    </div>
  );
}

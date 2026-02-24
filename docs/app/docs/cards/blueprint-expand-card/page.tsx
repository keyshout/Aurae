"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BlueprintExpandCard } from "@aurae/components/cards/blueprint-expand-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { BlueprintExpandCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <BlueprintExpandCard className="w-full"><CardContent title="Blueprint" desc="Dimension lines" /></BlueprintExpandCard>
  );
}`;

export default function BlueprintExpandCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BlueprintExpandCard"
        description="A stunning BlueprintExpandCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <BlueprintExpandCard className="w-full"><CardContent title="Blueprint" desc="Dimension lines" /></BlueprintExpandCard>
          </div>
        }
      />
    </div>
  );
}

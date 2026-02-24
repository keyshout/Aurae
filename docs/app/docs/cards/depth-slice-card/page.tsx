"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { DepthSliceCard } from "@aurae/components/cards/depth-slice-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { DepthSliceCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <DepthSliceCard className="w-full max-w-sm h-64"><CardContent title="Depth" desc="Parallax layers" /></DepthSliceCard>
  );
}`;

export default function DepthSliceCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="DepthSliceCard"
        description="A stunning DepthSliceCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <DepthSliceCard className="w-full max-w-sm h-64"><CardContent title="Depth" desc="Parallax layers" /></DepthSliceCard>
          </div>
        }
      />
    </div>
  );
}

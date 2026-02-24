"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SeismicCard } from "@aurae/components/cards/seismic-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { SeismicCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SeismicCard className="w-full"><CardContent title="Seismic" desc="Shake on hover" /></SeismicCard>
  );
}`;

export default function SeismicCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SeismicCard"
        description="A stunning SeismicCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SeismicCard className="w-full"><CardContent title="Seismic" desc="Shake on hover" /></SeismicCard>
          </div>
        }
      />
    </div>
  );
}

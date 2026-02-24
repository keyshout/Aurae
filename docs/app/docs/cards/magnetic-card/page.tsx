"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MagneticCard } from "@aurae/components/cards/magnetic-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { MagneticCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MagneticCard tiltIntensity={10} className="w-full"><CardContent title="Hover me" desc="3D tilt + glow" /></MagneticCard>
  );
}`;

export default function MagneticCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MagneticCard"
        description="A stunning MagneticCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MagneticCard tiltIntensity={10} className="w-full"><CardContent title="Hover me" desc="3D tilt + glow" /></MagneticCard>
          </div>
        }
      />
    </div>
  );
}

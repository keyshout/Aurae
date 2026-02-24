"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ThermalMapCard } from "@aurae/components/cards/thermal-map-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { ThermalMapCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ThermalMapCard className="w-full"><CardContent title="Thermal" desc="Hue shift" /></ThermalMapCard>
  );
}`;

export default function ThermalMapCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ThermalMapCard"
        description="A stunning ThermalMapCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ThermalMapCard className="w-full"><CardContent title="Thermal" desc="Hue shift" /></ThermalMapCard>
          </div>
        }
      />
    </div>
  );
}

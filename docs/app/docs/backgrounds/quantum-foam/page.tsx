"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { QuantumFoam } from "@aurae/components/backgrounds/quantum-foam";



const codeContent = `import { QuantumFoam } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <QuantumFoam className="w-full h-full" />
  );
}`;

export default function QuantumFoamPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="QuantumFoam"
        description="A stunning QuantumFoam component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <QuantumFoam className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

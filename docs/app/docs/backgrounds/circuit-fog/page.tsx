"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { CircuitFog } from "@aurae/components/backgrounds/circuit-fog";



const codeContent = `import { CircuitFog } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <CircuitFog className="w-full h-full" />
  );
}`;

export default function CircuitFogPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="CircuitFog"
        description="A stunning CircuitFog component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <CircuitFog className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

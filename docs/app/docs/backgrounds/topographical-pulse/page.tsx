"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { TopographicalPulse } from "@aurae/components/backgrounds/topographical-pulse";



const codeContent = `import { TopographicalPulse } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <TopographicalPulse className="w-full h-full" />
  );
}`;

export default function TopographicalPulsePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="TopographicalPulse"
        description="A stunning TopographicalPulse component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <TopographicalPulse className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

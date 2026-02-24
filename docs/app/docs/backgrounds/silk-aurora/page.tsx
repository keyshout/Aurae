"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SilkAurora } from "@aurae/components/backgrounds/silk-aurora";



const codeContent = `import { SilkAurora } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SilkAurora opacity={0.3} speed={0.5} className="w-full h-full" />
  );
}`;

export default function SilkAuroraPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SilkAurora"
        description="A stunning SilkAurora component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <SilkAurora opacity={0.3} speed={0.5} className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

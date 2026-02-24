"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { FrostCrystal } from "@aurae/components/backgrounds/frost-crystal";



const codeContent = `import { FrostCrystal } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <FrostCrystal className="w-full h-full" />
  );
}`;

export default function FrostCrystalPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="FrostCrystal"
        description="A stunning FrostCrystal component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <FrostCrystal className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ErosionField } from "@aurae/components/backgrounds/erosion-field";



const codeContent = `import { ErosionField } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ErosionField className="w-full h-full" />
  );
}`;

export default function ErosionFieldPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ErosionField"
        description="A stunning ErosionField component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <ErosionField className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

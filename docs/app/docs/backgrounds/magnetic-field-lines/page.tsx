"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MagneticFieldLines } from "@aurae/components/backgrounds/magnetic-field-lines";



const codeContent = `import { MagneticFieldLines } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MagneticFieldLines className="w-full h-full" />
  );
}`;

export default function MagneticFieldLinesPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MagneticFieldLines"
        description="A stunning MagneticFieldLines component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <MagneticFieldLines className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

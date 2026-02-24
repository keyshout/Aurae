"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { CausticLight } from "@aurae/components/backgrounds/caustic-light";



const codeContent = `import { CausticLight } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <CausticLight className="w-full h-full" />
  );
}`;

export default function CausticLightPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="CausticLight"
        description="A stunning CausticLight component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <CausticLight className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

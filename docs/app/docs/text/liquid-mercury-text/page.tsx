"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { LiquidMercuryText } from "@aurae/components/text/liquid-mercury-text";



const codeContent = `import { LiquidMercuryText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <LiquidMercuryText text="Mercury" className="text-6xl sm:text-7xl md:text-8xl font-black text-white" blurStrength={4} />
  );
}`;

export default function LiquidMercuryTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="LiquidMercuryText"
        description="A stunning LiquidMercuryText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-20 px-4">
            <LiquidMercuryText text="Mercury" className="text-6xl sm:text-7xl md:text-8xl font-black text-white" blurStrength={4} />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BreathingGlowHalo } from "@aurae/components/decorative/breathing-glow-halo";



const codeContent = `import { BreathingGlowHalo } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <BreathingGlowHalo color="#8b5cf6"><div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl">✦</div></BreathingGlowHalo>
  );
}`;

export default function BreathingGlowHaloPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BreathingGlowHalo"
        description="A stunning BreathingGlowHalo component from the decorative collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <BreathingGlowHalo color="#8b5cf6"><div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl">✦</div></BreathingGlowHalo>
          </div>
        }
      />
    </div>
  );
}

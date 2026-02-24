"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BioluminescentWeb } from "@aurae/components/backgrounds/bioluminescent-web";



const codeContent = `import { BioluminescentWeb } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <BioluminescentWeb className="w-full h-full" />
  );
}`;

export default function BioluminescentWebPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BioluminescentWeb"
        description="A stunning BioluminescentWeb component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <BioluminescentWeb className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

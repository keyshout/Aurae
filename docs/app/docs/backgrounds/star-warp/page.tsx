"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { StarWarp } from "@aurae/components/backgrounds/star-warp";



const codeContent = `import { StarWarp } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <StarWarp className="w-full h-full" />
  );
}`;

export default function StarWarpPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="StarWarp"
        description="A stunning StarWarp component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <StarWarp className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

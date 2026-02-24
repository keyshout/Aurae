"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { NeonFlickerText } from "@aurae/components/text/neon-flicker-text";



const codeContent = `import { NeonFlickerText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <NeonFlickerText text="Neon" color="#06b6d4" className="text-2xl sm:text-3xl font-black" />
  );
}`;

export default function NeonFlickerTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="NeonFlickerText"
        description="A stunning NeonFlickerText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <NeonFlickerText text="Neon" color="#06b6d4" className="text-2xl sm:text-3xl font-black" />
          </div>
        }
      />
    </div>
  );
}

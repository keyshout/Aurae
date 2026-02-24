"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PressureWaveText } from "@aurae/components/text/pressure-wave-text";



const codeContent = `import { PressureWaveText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PressureWaveText text="Click me" className="text-xl sm:text-2xl font-bold text-white" />
  );
}`;

export default function PressureWaveTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PressureWaveText"
        description="A stunning PressureWaveText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <PressureWaveText text="Click me" className="text-xl sm:text-2xl font-bold text-white" />
          </div>
        }
      />
    </div>
  );
}

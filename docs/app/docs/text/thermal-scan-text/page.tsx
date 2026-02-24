"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ThermalScanText } from "@aurae/components/text/thermal-scan-text";



const codeContent = `import { ThermalScanText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ThermalScanText text="Thermal" className="text-2xl font-black text-white" />
  );
}`;

export default function ThermalScanTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ThermalScanText"
        description="A stunning ThermalScanText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ThermalScanText text="Thermal" className="text-2xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

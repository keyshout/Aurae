"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PressureInkButton } from "@aurae/components/buttons/pressure-ink-button";



const codeContent = `import { PressureInkButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PressureInkButton>Ink Press</PressureInkButton>
  );
}`;

export default function PressureInkButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PressureInkButton"
        description="A stunning PressureInkButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <PressureInkButton>Ink Press</PressureInkButton>
          </div>
        }
      />
    </div>
  );
}

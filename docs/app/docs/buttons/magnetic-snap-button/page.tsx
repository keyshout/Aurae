"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MagneticSnapButton } from "@aurae/components/buttons/magnetic-snap-button";



const codeContent = `import { MagneticSnapButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MagneticSnapButton>Magnetic</MagneticSnapButton>
  );
}`;

export default function MagneticSnapButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MagneticSnapButton"
        description="A stunning MagneticSnapButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MagneticSnapButton>Magnetic</MagneticSnapButton>
          </div>
        }
      />
    </div>
  );
}

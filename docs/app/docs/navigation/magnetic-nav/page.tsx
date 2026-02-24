"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MagneticNav } from "@aurae/components/navigation/magnetic-nav";



const codeContent = `import { MagneticNav } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MagneticNav links={[{ label: "Home", href: "#home" }, { label: "Docs", href: "#docs" }, { label: "API", href: "#api" }]} />
  );
}`;

export default function MagneticNavPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MagneticNav"
        description="A stunning MagneticNav component from the navigation collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-20 px-8">
            <MagneticNav links={[{ label: "Home", href: "#home" }, { label: "Docs", href: "#docs" }, { label: "API", href: "#api" }]} />
          </div>
        }
      />
    </div>
  );
}

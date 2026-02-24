"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { TypewriterBlueprintLoader } from "@aurae/components/loaders/typewriter-blueprint-loader";



const codeContent = `import { TypewriterBlueprintLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <TypewriterBlueprintLoader className="w-full" />
  );
}`;

export default function TypewriterBlueprintLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="TypewriterBlueprintLoader"
        description="A stunning TypewriterBlueprintLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <TypewriterBlueprintLoader className="w-full" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BlueprintLoader } from "@aurae/components/loaders/blueprint-loader";



const codeContent = `import { BlueprintLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <BlueprintLoader className="w-full h-[100px]" />
  );
}`;

export default function BlueprintLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BlueprintLoader"
        description="A stunning BlueprintLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <BlueprintLoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

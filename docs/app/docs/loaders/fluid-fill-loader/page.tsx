"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { FluidFillLoader } from "@aurae/components/loaders/fluid-fill-loader";



const codeContent = `import { FluidFillLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <FluidFillLoader progress={65} className="w-28 sm:w-32 mx-auto" />
  );
}`;

export default function FluidFillLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="FluidFillLoader"
        description="A stunning FluidFillLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <FluidFillLoader progress={65} className="w-28 sm:w-32 mx-auto" />
          </div>
        }
      />
    </div>
  );
}

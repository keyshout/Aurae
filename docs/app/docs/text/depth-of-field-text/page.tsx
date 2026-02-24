"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { DepthOfFieldText } from "@aurae/components/text/depth-of-field-text";



const codeContent = `import { DepthOfFieldText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <DepthOfFieldText text="Focus here" className="text-xl sm:text-2xl font-bold text-white" />
  );
}`;

export default function DepthOfFieldTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="DepthOfFieldText"
        description="A stunning DepthOfFieldText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <DepthOfFieldText text="Focus here" className="text-xl sm:text-2xl font-bold text-white" />
          </div>
        }
      />
    </div>
  );
}

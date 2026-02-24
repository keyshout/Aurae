"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ClayMorphSkeleton } from "@aurae/components/loaders/clay-morph-skeleton";



const codeContent = `import { ClayMorphSkeleton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ClayMorphSkeleton className="w-full h-[100px]" />
  );
}`;

export default function ClayMorphSkeletonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ClayMorphSkeleton"
        description="A stunning ClayMorphSkeleton component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ClayMorphSkeleton className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

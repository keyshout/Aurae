"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SonarSkeleton } from "@aurae/components/loaders/sonar-skeleton";



const codeContent = `import { SonarSkeleton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SonarSkeleton className="w-full h-[100px]" />
  );
}`;

export default function SonarSkeletonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SonarSkeleton"
        description="A stunning SonarSkeleton component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SonarSkeleton className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

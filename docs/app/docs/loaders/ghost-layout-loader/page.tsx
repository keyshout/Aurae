"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { GhostLayoutLoader } from "@aurae/components/loaders/ghost-layout-loader";



const codeContent = `import { GhostLayoutLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <GhostLayoutLoader className="w-full h-[100px]" />
  );
}`;

export default function GhostLayoutLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="GhostLayoutLoader"
        description="A stunning GhostLayoutLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <GhostLayoutLoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

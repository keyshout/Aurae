"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { DNALoader } from "@aurae/components/loaders/dna-loader";



const codeContent = `import { DNALoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <DNALoader className="w-full h-[100px]" />
  );
}`;

export default function DNALoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="DNALoader"
        description="A stunning DNALoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <DNALoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

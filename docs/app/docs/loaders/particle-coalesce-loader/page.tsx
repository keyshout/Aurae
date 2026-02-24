"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ParticleCoalesceLoader } from "@aurae/components/loaders/particle-coalesce-loader";



const codeContent = `import { ParticleCoalesceLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ParticleCoalesceLoader className="w-full h-[100px]" />
  );
}`;

export default function ParticleCoalesceLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ParticleCoalesceLoader"
        description="A stunning ParticleCoalesceLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ParticleCoalesceLoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

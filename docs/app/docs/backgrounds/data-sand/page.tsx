"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { DataSand } from "@aurae/components/backgrounds/data-sand";



const codeContent = `import { DataSand } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <DataSand className="w-full h-full" />
  );
}`;

export default function DataSandPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="DataSand"
        description="A stunning DataSand component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <DataSand className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

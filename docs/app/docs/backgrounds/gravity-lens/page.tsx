"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { GravityLens } from "@aurae/components/backgrounds/gravity-lens";



const codeContent = `import { GravityLens } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <GravityLens className="w-full h-full" />
  );
}`;

export default function GravityLensPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="GravityLens"
        description="A stunning GravityLens component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <GravityLens className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

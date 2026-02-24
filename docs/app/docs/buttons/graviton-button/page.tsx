"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { GravitonButton } from "@aurae/components/buttons/graviton-button";



const codeContent = `import { GravitonButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <GravitonButton particleColor="#8b5cf6" particleCount={12}>Launch</GravitonButton>
  );
}`;

export default function GravitonButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="GravitonButton"
        description="A stunning GravitonButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <GravitonButton particleColor="#8b5cf6" particleCount={12}>Launch</GravitonButton>
          </div>
        }
      />
    </div>
  );
}

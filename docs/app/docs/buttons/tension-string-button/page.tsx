"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { TensionStringButton } from "@aurae/components/buttons/tension-string-button";



const codeContent = `import { TensionStringButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <TensionStringButton>Pull me</TensionStringButton>
  );
}`;

export default function TensionStringButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="TensionStringButton"
        description="A stunning TensionStringButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <TensionStringButton>Pull me</TensionStringButton>
          </div>
        }
      />
    </div>
  );
}

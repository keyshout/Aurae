"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { LiquidFillButton } from "@aurae/components/buttons/liquid-fill-button";



const codeContent = `import { LiquidFillButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <LiquidFillButton>Fill me</LiquidFillButton>
  );
}`;

export default function LiquidFillButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="LiquidFillButton"
        description="A stunning LiquidFillButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <LiquidFillButton>Fill me</LiquidFillButton>
          </div>
        }
      />
    </div>
  );
}

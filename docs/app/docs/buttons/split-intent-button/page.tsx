"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SplitIntentButton } from "@aurae/components/buttons/split-intent-button";



const codeContent = `import { SplitIntentButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SplitIntentButton>Split</SplitIntentButton>
  );
}`;

export default function SplitIntentButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SplitIntentButton"
        description="A stunning SplitIntentButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SplitIntentButton>Split</SplitIntentButton>
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { GlitchConfirmButton } from "@aurae/components/buttons/glitch-confirm-button";



const codeContent = `import { GlitchConfirmButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <GlitchConfirmButton label="Confirm" />
  );
}`;

export default function GlitchConfirmButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="GlitchConfirmButton"
        description="A stunning GlitchConfirmButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <GlitchConfirmButton label="Confirm" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MorphLabelButton } from "@aurae/components/buttons/morph-label-button";



const codeContent = `import { MorphLabelButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MorphLabelButton label="Submit" hoverLabel="Send →" />
  );
}`;

export default function MorphLabelButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MorphLabelButton"
        description="A stunning MorphLabelButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MorphLabelButton label="Submit" hoverLabel="Send →" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PhaseChip } from "@aurae/components/decorative/phase-chip";



const codeContent = `import { PhaseChip } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PhaseChip label="Beta" variant="info" />
  );
}`;

export default function PhaseChipPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PhaseChip"
        description="A stunning PhaseChip component from the decorative collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <PhaseChip label="Beta" variant="info" />
          </div>
        }
      />
    </div>
  );
}

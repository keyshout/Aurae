"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MagneticInkText } from "@aurae/components/text/magnetic-ink-text";



const codeContent = `import { MagneticInkText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MagneticInkText text="Move pointer" className="text-xl sm:text-2xl font-bold text-white" />
  );
}`;

export default function MagneticInkTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MagneticInkText"
        description="A stunning MagneticInkText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MagneticInkText text="Move pointer" className="text-xl sm:text-2xl font-bold text-white" />
          </div>
        }
      />
    </div>
  );
}

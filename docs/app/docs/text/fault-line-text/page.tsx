"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { FaultLineText } from "@aurae/components/text/fault-line-text";



const codeContent = `import { FaultLineText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <FaultLineText text="Fault" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function FaultLineTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="FaultLineText"
        description="A stunning FaultLineText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <FaultLineText text="Fault" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

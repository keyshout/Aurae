"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SemanticDriftText } from "@aurae/components/text/semantic-drift-text";



const codeContent = `import { SemanticDriftText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SemanticDriftText text="Drifting words here" className="text-xl font-bold text-white" />
  );
}`;

export default function SemanticDriftTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SemanticDriftText"
        description="A stunning SemanticDriftText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SemanticDriftText text="Drifting words here" className="text-xl font-bold text-white" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { VaporTrailText } from "@aurae/components/text/vapor-trail-text";



const codeContent = `import { VaporTrailText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <VaporTrailText text="Vapor" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function VaporTrailTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="VaporTrailText"
        description="A stunning VaporTrailText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <VaporTrailText text="Vapor" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

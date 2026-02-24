"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { OrigamiUnfoldText } from "@aurae/components/text/origami-unfold-text";



const codeContent = `import { OrigamiUnfoldText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <OrigamiUnfoldText text="Unfold" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function OrigamiUnfoldTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="OrigamiUnfoldText"
        description="A stunning OrigamiUnfoldText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <OrigamiUnfoldText text="Unfold" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

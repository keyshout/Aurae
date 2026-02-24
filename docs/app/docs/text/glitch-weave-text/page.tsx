"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { GlitchWeaveText } from "@aurae/components/text/glitch-weave-text";



const codeContent = `import { GlitchWeaveText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <GlitchWeaveText text="Glitch" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function GlitchWeaveTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="GlitchWeaveText"
        description="A stunning GlitchWeaveText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <GlitchWeaveText text="Glitch" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

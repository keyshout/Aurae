"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { RefractionText } from "@aurae/components/text/refraction-text";



const codeContent = `import { RefractionText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <RefractionText text="Prism" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function RefractionTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="RefractionText"
        description="A stunning RefractionText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <RefractionText text="Prism" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

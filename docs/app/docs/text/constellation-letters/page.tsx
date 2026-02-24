"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ConstellationLetters } from "@aurae/components/text/constellation-letters";



const codeContent = `import { ConstellationLetters } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ConstellationLetters text="Stars" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function ConstellationLettersPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ConstellationLetters"
        description="A stunning ConstellationLetters component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ConstellationLetters text="Stars" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ShatterText } from "@aurae/components/text/shatter-text";



const codeContent = `import { ShatterText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ShatterText text="Click me" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function ShatterTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ShatterText"
        description="A stunning ShatterText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ShatterText text="Click me" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PrismaticUnderline } from "@aurae/components/decorative/prismatic-underline";



const codeContent = `import { PrismaticUnderline } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PrismaticUnderline className="w-full"><span className="text-lg font-bold text-white">Underlined</span></PrismaticUnderline>
  );
}`;

export default function PrismaticUnderlinePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PrismaticUnderline"
        description="A stunning PrismaticUnderline component from the decorative collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <PrismaticUnderline className="w-full"><span className="text-lg font-bold text-white">Underlined</span></PrismaticUnderline>
          </div>
        }
      />
    </div>
  );
}

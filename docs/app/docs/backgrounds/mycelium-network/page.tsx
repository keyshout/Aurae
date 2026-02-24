"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MyceliumNetwork } from "@aurae/components/backgrounds/mycelium-network";



const codeContent = `import { MyceliumNetwork } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MyceliumNetwork className="w-full h-full" />
  );
}`;

export default function MyceliumNetworkPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MyceliumNetwork"
        description="A stunning MyceliumNetwork component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <MyceliumNetwork className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

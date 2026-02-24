"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { LivingDivider } from "@aurae/components/decorative/living-divider";



const codeContent = `import { LivingDivider } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <LivingDivider className="w-full" />
  );
}`;

export default function LivingDividerPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="LivingDivider"
        description="A stunning LivingDivider component from the decorative collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <LivingDivider className="w-full" />
          </div>
        }
      />
    </div>
  );
}

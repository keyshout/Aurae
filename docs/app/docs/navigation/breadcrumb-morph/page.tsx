"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BreadcrumbMorph } from "@aurae/components/navigation/breadcrumb-morph";



const codeContent = `import { BreadcrumbMorph } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <BreadcrumbMorph items={[{ label: "Home" }, { label: "Components" }, { label: "Cards" }]} />
  );
}`;

export default function BreadcrumbMorphPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BreadcrumbMorph"
        description="A stunning BreadcrumbMorph component from the navigation collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <BreadcrumbMorph items={[{ label: "Home" }, { label: "Components" }, { label: "Cards" }]} />
          </div>
        }
      />
    </div>
  );
}

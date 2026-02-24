"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ElasticBorderButton } from "@aurae/components/buttons/elastic-border-button";



const codeContent = `import { ElasticBorderButton } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ElasticBorderButton>Elastic</ElasticBorderButton>
  );
}`;

export default function ElasticBorderButtonPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ElasticBorderButton"
        description="A stunning ElasticBorderButton component from the buttons collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ElasticBorderButton>Elastic</ElasticBorderButton>
          </div>
        }
      />
    </div>
  );
}

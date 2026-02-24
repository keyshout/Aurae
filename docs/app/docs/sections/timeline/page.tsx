"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { Timeline } from "@aurae/components/sections/timeline";



const codeContent = `import { Timeline } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <Timeline items={[
                { title: "Batch 1", description: "45 components", date: "v0.1" },
                { title: "Batch 2", description: "30 components", date: "v0.1" },
                { title: "Batch 3", description: "20 AI/SaaS blocks", date: "v0.1" },
              ]} className="!py-8" />
  );
}`;

export default function TimelinePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="Timeline"
        description="A stunning Timeline component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <Timeline items={[
                { title: "Batch 1", description: "45 components", date: "v0.1" },
                { title: "Batch 2", description: "30 components", date: "v0.1" },
                { title: "Batch 3", description: "20 AI/SaaS blocks", date: "v0.1" },
              ]} className="!py-8" />
          </div>
        }
      />
    </div>
  );
}

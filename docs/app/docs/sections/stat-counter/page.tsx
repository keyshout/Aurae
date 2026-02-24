"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { StatCounter } from "@aurae/components/sections/stat-counter";



const codeContent = `import { StatCounter } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <StatCounter stats={[
              { value: 95, label: "Components", suffix: "+" },
              { value: 5, label: "Hooks" },
              { value: 100, label: "MIT Free", suffix: "%" },
            ]} />
  );
}`;

export default function StatCounterPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="StatCounter"
        description="A stunning StatCounter component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <StatCounter stats={[
              { value: 95, label: "Components", suffix: "+" },
              { value: 5, label: "Hooks" },
              { value: 100, label: "MIT Free", suffix: "%" },
            ]} />
          </div>
        }
      />
    </div>
  );
}

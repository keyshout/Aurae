"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ComparisonMatrix } from "@aurae/components/sections/comparison-matrix";



const codeContent = `import { ComparisonMatrix } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ComparisonMatrix
              plans={["Aurae", "Others"]}
              features={[
                { name: "Original designs", values: [true, false] },
                { name: "MIT licensed", values: [true, true] },
                { name: "Physics docs", values: [true, false] },
                { name: "95+ components", values: [true, false] },
              ]}
              className="!py-8"
            />
  );
}`;

export default function ComparisonMatrixPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ComparisonMatrix"
        description="A stunning ComparisonMatrix component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ComparisonMatrix
              plans={["Aurae", "Others"]}
              features={[
                { name: "Original designs", values: [true, false] },
                { name: "MIT licensed", values: [true, true] },
                { name: "Physics docs", values: [true, false] },
                { name: "95+ components", values: [true, false] },
              ]}
              className="!py-8"
            />
          </div>
        }
      />
    </div>
  );
}

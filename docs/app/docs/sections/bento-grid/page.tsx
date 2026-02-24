"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { BentoGrid } from "@aurae/components/sections/bento-grid";

const mockItems = [
  {
    title: "Analytics Dashboard",
    description: "Real-time metrics and historical data analysis with interactive charts.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
    className: "md:col-span-2",
  },
  {
    title: "AI Integration",
    description: "Connect with our powerful language models seamlessly.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
    className: "md:col-span-1",
  },
  {
    title: "Global CDN",
    description: "Lightning fast edge delivery optimized across 250+ points of presence.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
    className: "md:col-span-1",
  },
  {
    title: "Secure by Default",
    description: "Enterprise-grade encryption and compliance adherence out of the box.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800" />,
    className: "md:col-span-2",
  }
];

const codeContent = `import { BentoGrid } from "@keyshout/aurae";

const items = [
  {
    title: "Feature A",
    description: "Description A",
    header: <div className="h-24 bg-neutral-800 rounded-xl" />,
    className: "md:col-span-2",
  },
  {
    title: "Feature B",
    description: "Description B",
    header: <div className="h-24 bg-neutral-800 rounded-xl" />,
    className: "md:col-span-1",
  }
];

export default function MyComponent() {
  return (
    <BentoGrid items={items} />
  );
}`;

export default function BentoGridPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="BentoGrid"
        description="A stunning BentoGrid component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <BentoGrid items={mockItems} />
          </div>
        }
      />
    </div>
  );
}

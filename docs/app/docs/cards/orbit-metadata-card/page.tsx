"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { OrbitMetadataCard } from "@aurae/components/cards/orbit-metadata-card";

const CardContent = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-4 sm:p-5">
    <h3 className="text-sm sm:text-base font-bold text-white">{title}</h3>
    <p className="text-xs sm:text-sm text-gray-400 mt-1">{desc}</p>
  </div>
);

const codeContent = `import { OrbitMetadataCard } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <OrbitMetadataCard className="w-full" metadata={[{ label: "v1.0" }, { label: "MIT" }, { label: "TS" }]}><CardContent title="Orbit" desc="Hovering elements" /></OrbitMetadataCard>
  );
}`;

export default function OrbitMetadataCardPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="OrbitMetadataCard"
        description="A stunning OrbitMetadataCard component from the cards collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <OrbitMetadataCard className="w-full" metadata={[{ label: "v1.0" }, { label: "MIT" }, { label: "TS" }]}><CardContent title="Orbit" desc="Hovering elements" /></OrbitMetadataCard>
          </div>
        }
      />
    </div>
  );
}

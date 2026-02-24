"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { FeatureSpotlight } from "@aurae/components/sections/feature-spotlight";



const codeContent = `import { FeatureSpotlight } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <FeatureSpotlight features={[
                { title: "Physics-Based", description: "Every animation uses real principles", icon: "⚡" },
                { title: "Tree-Shakeable", description: "Import only what you need", icon: "🌳" },
                { title: "Accessible", description: "prefers-reduced-motion support", icon: "♿" },
              ]} className="!py-6" />
  );
}`;

export default function FeatureSpotlightPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="FeatureSpotlight"
        description="A stunning FeatureSpotlight component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <FeatureSpotlight features={[
                { title: "Physics-Based", description: "Every animation uses real principles", icon: "⚡" },
                { title: "Tree-Shakeable", description: "Import only what you need", icon: "🌳" },
                { title: "Accessible", description: "prefers-reduced-motion support", icon: "♿" },
              ]} className="!py-6" />
          </div>
        }
      />
    </div>
  );
}

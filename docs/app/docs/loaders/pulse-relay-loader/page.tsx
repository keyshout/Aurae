"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { PulseRelayLoader } from "@aurae/components/loaders/pulse-relay-loader";



const codeContent = `import { PulseRelayLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <PulseRelayLoader className="w-full" />
  );
}`;

export default function PulseRelayLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="PulseRelayLoader"
        description="A stunning PulseRelayLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <PulseRelayLoader className="w-full" />
          </div>
        }
      />
    </div>
  );
}

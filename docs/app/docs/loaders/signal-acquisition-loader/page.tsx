"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SignalAcquisitionLoader } from "@aurae/components/loaders/signal-acquisition-loader";



const codeContent = `import { SignalAcquisitionLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SignalAcquisitionLoader className="w-full h-[100px]" />
  );
}`;

export default function SignalAcquisitionLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SignalAcquisitionLoader"
        description="A stunning SignalAcquisitionLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SignalAcquisitionLoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

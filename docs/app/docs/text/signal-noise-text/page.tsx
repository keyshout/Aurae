"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SignalNoiseText } from "@aurae/components/text/signal-noise-text";



const codeContent = `import { SignalNoiseText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SignalNoiseText text="Signal" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function SignalNoiseTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SignalNoiseText"
        description="A stunning SignalNoiseText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SignalNoiseText text="Signal" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { EchoTrailHeadline } from "@aurae/components/text/echo-trail-headline";



const codeContent = `import { EchoTrailHeadline } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <EchoTrailHeadline text="Echo" className="text-2xl sm:text-3xl font-black text-white" />
  );
}`;

export default function EchoTrailHeadlinePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="EchoTrailHeadline"
        description="A stunning EchoTrailHeadline component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <EchoTrailHeadline text="Echo" className="text-2xl sm:text-3xl font-black text-white" />
          </div>
        }
      />
    </div>
  );
}

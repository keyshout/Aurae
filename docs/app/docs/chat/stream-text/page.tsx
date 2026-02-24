"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { StreamText } from "@aurae/components/chat/stream-text";



const codeContent = `import { StreamText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <StreamText text="Components feel alive with physics-based motion and spring dynamics." speed={90} className="text-xs sm:text-sm text-gray-300 max-w-[240px]" />
  );
}`;

export default function StreamTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="StreamText"
        description="A stunning StreamText component from the chat collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <StreamText text="Components feel alive with physics-based motion and spring dynamics." speed={90} className="text-xs sm:text-sm text-gray-300 max-w-[240px]" />
          </div>
        }
      />
    </div>
  );
}

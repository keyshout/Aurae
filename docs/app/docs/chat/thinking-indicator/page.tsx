"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ThinkingIndicator } from "@aurae/components/chat/thinking-indicator";



const codeContent = `import { ThinkingIndicator } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ThinkingIndicator color="#8b5cf6" />
  );
}`;

export default function ThinkingIndicatorPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ThinkingIndicator"
        description="A stunning ThinkingIndicator component from the chat collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ThinkingIndicator color="#8b5cf6" />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ThreadConnector } from "@aurae/components/decorative/thread-connector";



const codeContent = `import { ThreadConnector } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ThreadConnector from={{ x: 20, y: 40 }} to={{ x: 220, y: 40 }} className="w-full h-full" />
  );
}`;

export default function ThreadConnectorPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ThreadConnector"
        description="A stunning ThreadConnector component from the decorative collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ThreadConnector from={{ x: 20, y: 40 }} to={{ x: 220, y: 40 }} className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

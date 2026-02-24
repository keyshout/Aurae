"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ThreadWeaveLoader } from "@aurae/components/loaders/thread-weave-loader";



const codeContent = `import { ThreadWeaveLoader } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ThreadWeaveLoader className="w-full h-[100px]" />
  );
}`;

export default function ThreadWeaveLoaderPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ThreadWeaveLoader"
        description="A stunning ThreadWeaveLoader component from the loaders collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ThreadWeaveLoader className="w-full h-[100px]" />
          </div>
        }
      />
    </div>
  );
}

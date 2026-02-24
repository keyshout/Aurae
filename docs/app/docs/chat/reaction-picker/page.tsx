"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ReactionPicker } from "@aurae/components/chat/reaction-picker";



const codeContent = `import { ReactionPicker } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ReactionPicker />
  );
}`;

export default function ReactionPickerPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="ReactionPicker"
        description="A stunning ReactionPicker component from the chat collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <ReactionPicker />
          </div>
        }
      />
    </div>
  );
}

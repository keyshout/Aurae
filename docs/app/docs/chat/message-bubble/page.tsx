"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { MessageBubble } from "@aurae/components/chat/message-bubble";



const codeContent = `import { MessageBubble } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <MessageBubble role="user" text="How does it work?" />
  );
}`;

export default function MessageBubblePage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="MessageBubble"
        description="A stunning MessageBubble component from the chat collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <MessageBubble role="user" text="How does it work?" />
          </div>
        }
      />
    </div>
  );
}

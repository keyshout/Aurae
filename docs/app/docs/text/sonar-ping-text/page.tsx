"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { SonarPingText } from "@aurae/components/text/sonar-ping-text";



const codeContent = `import { SonarPingText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <SonarPingText text="Ping Pulse" className="text-xl sm:text-2xl font-bold text-white" />
  );
}`;

export default function SonarPingTextPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="SonarPingText"
        description="A stunning SonarPingText component from the text collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <SonarPingText text="Ping Pulse" className="text-xl sm:text-2xl font-bold text-white" />
          </div>
        }
      />
    </div>
  );
}

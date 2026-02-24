"use client";

import React, { useState } from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { ScrambleText } from "@aurae/components/text/scramble-text";

const codeContent = `import { ScrambleText } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <ScrambleText
      text="Aurae Components"
      charset="!@#$%"
      speed={50}
      scrambleCycles={5}
      triggerOn="hover"
      className="text-4xl font-black text-white"
    />
  );
}`;

export default function ScrambleTextPage() {
    return (
        <div className="flex flex-col gap-16 pb-20">
            <ComponentShowcase
                name="Scramble Text"
                description="A text animation that scrambles characters before revealing the target text. Perfect for cyberpunk or terminal themes."
                code={codeContent}
                installCommand="npm install @keyshout/aurae"
                preview={
                    <ScrambleText
                        text="Aurae Components"
                        charset="!@#$%^&*"
                        speed={50}
                        triggerOn="hover"
                        className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center tracking-tight"
                    />
                }
            />
        </div>
    );
}

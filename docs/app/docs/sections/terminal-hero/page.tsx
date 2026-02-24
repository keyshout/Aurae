"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { TerminalHero } from "@aurae/components/sections/terminal-hero";



const codeContent = `import { TerminalHero } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <TerminalHero title="Ship faster." subtitle="95 physics-based components." commands={[
                { input: "npm install @keyshout/aurae", output: "✓ 95 components ready" },
                { input: 'import { MagneticCard } from "aurae"', output: "✓ tree-shaken: 4.2kB" },
              ]} />
  );
}`;

export default function TerminalHeroPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="TerminalHero"
        description="A stunning TerminalHero component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center">
            <TerminalHero title="Ship faster." subtitle="95 physics-based components." commands={[
                { input: "npm install @keyshout/aurae", output: "✓ 95 components ready" },
                { input: 'import { MagneticCard } from "aurae"', output: "✓ tree-shaken: 4.2kB" },
              ]} />
          </div>
        }
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { CommandPalette } from "@aurae/components/navigation/command-palette";

const codeContent = `import React, { useState } from "react";
import { CommandPalette } from "@keyshout/aurae";

export default function MyComponent() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setCmdOpen(true)}
        className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm font-medium hover:bg-neutral-700 transition"
      >
        Open Command Palette
      </button>

      <CommandPalette
        isOpen={cmdOpen}
        onOpenChange={setCmdOpen}
        commands={[
          { id: "github", label: "Open GitHub", icon: "📦", action: () => window.open("https://github.com/keyshout/Aurae") },
          { id: "npm", label: "View on npm", icon: "📋", action: () => window.open("https://npmjs.com/package/@keyshout/aurae") },
        ]}
      />
    </>
  );
}`;

export default function CommandPalettePage() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="CommandPalette"
        description="A stunning CommandPalette component from the navigation collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <button
              onClick={() => setCmdOpen(true)}
              className="px-4 py-2 bg-neutral-800 text-white rounded-md text-sm font-medium border border-neutral-700 hover:bg-neutral-700 transition"
            >
              Open Command Palette (⌘K)
            </button>

            <CommandPalette
              isOpen={cmdOpen}
              onOpenChange={setCmdOpen}
              commands={[
                { id: "github", label: "Open GitHub", icon: "📦", action: () => window.open("https://github.com/keyshout/Aurae") },
                { id: "npm", label: "View on npm", icon: "📋", action: () => window.open("https://npmjs.com/package/@keyshout/aurae") },
              ]}
            />
          </div>
        }
      />
    </div>
  );
}

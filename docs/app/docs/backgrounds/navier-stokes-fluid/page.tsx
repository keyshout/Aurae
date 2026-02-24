"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { NavierStokesFluid } from "@aurae/components/backgrounds/navier-stokes-fluid";



const codeContent = `import { NavierStokesFluid } from "@keyshout/aurae";

export default function MyComponent() {
  return (
    <NavierStokesFluid className="w-full h-full" />
  );
}`;

export default function NavierStokesFluidPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="NavierStokesFluid"
        description="A stunning NavierStokesFluid component from the backgrounds collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-xl border border-white/10">
            <NavierStokesFluid className="w-full h-full" />
          </div>
        }
      />
    </div>
  );
}

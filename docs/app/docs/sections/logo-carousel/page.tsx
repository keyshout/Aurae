"use client";

import React from "react";
import { ComponentShowcase } from "@/components/ui/component-showcase";
import { LogoCarousel } from "@aurae/components/sections/logo-carousel";

const mockLogos = [
  { name: "React", url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
  { name: "Next.js", url: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" },
  { name: "Vercel", url: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
  { name: "Tailwind", url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" }
];

const codeContent = `import { LogoCarousel } from "@keyshout/aurae";

const logos = [
  { name: "React", url: "https://react.dev/logo.svg" },
  { name: "Next.js", url: "https://nextjs.org/logo.svg" }
];

export default function MyComponent() {
  return (
    <LogoCarousel logos={logos} direction="left" speed="slow" />
  );
}`;

export default function LogoCarouselPage() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      <ComponentShowcase
        name="LogoCarousel"
        description="A stunning LogoCarousel component from the sections collection."
        code={codeContent}
        installCommand="npm install @keyshout/aurae"
        preview={
          <div className="w-full flex justify-center items-center py-10 px-4">
            <LogoCarousel logos={mockLogos} speed={20} />
          </div>
        }
      />
    </div>
  );
}

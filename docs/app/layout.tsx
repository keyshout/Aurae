import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aurae — 95 Original React Components",
  description:
    "A motion language toolkit for React. Physics-based animations, MIT licensed, free forever.",
  openGraph: {
    title: "Aurae — 95 Original React Components",
    description: "Physics-based motion components for React. Free & MIT.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}

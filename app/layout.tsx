import OrientationWarning from "@/components/OrientationWarning";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VCAT - Visual Cognitive Assessment Test",
  description: "Visual cognitive assessment tool for elderly deaf patients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OrientationWarning />
        {children}
      </body>
    </html>
  );
}

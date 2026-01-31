import OrientationWarning from "@/components/OrientationWarning";
import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

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
    <html lang="th">
      <body className={sarabun.className}>
        <OrientationWarning />
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GrainGuardian V3",
  description:
    "AI-Powered Post-Harvest Decision Intelligence Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

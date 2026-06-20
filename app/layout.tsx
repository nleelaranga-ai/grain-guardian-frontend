import './globals.css';
import React from 'react';

export const metadata = {
  title: 'GrainGuardian V3 - Premium AgTech Decision Suite',
  description: 'IEEE-Compliant Multi-Crop Post-Harvest Loss Analytics Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-slate-950 font-sans">{children}</body>
    </html>
  );
}
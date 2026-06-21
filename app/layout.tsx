import './globals.css';
import React from 'react';

export const metadata = {
  title: 'GrainGuardian - High Density Storage Analytics Matrix',
  description: 'AI Studio Post-Harvest Decision Support System and Multi-Crop Telemetry Analytics Suite',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Load high-yield premium topography architectures */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Outfit:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

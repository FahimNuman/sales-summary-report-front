/* eslint-disable @next/next/no-sync-scripts */
import './globals.css';

export const metadata = {
  title: 'Sales Summary Tool',
  description: 'A tool to manage and export sales summary data',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
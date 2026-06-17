import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gunawan Madia Pratama | Portfolio",
  description:
    "Fresh graduate student portfolio from Indonesia, with projects, certificates, and the learning path behind them.",
  openGraph: {
    title: "Gunawan Madia Pratama | Portfolio",
    description:
      "Projects, certificates, and learning notes from Gunawan Madia Pratama.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

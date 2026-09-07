import type { Metadata } from "next";
import "./globals.css";
import CursorFollower from "@/components/CursorFollower";
import Footer from "@/components/Footer";
import IntroLoader from "@/components/IntroLoader";
import Navbar from "@/components/Navbar";

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
      <body>
        {/*
          IntroLoader, CursorFollower, Navbar, and Footer live here — outside
          the per-route `template.tsx` transition — for two reasons:
          1. They shouldn't re-play their own animation on every navigation,
             only the page content should transition.
          2. template.tsx animates transform/filter on its wrapper, which
             creates a new containing block for any position:fixed
             descendant. Putting fixed-position chrome inside that wrapper
             would silently break it — it would start tracking the wrapper
             instead of the viewport once the animation applies its values.
        */}
        <IntroLoader />
        <div className="site-shell">
          <CursorFollower />
          <Navbar />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

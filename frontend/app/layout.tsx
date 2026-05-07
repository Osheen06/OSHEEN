import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "Osheen | Your mirror, reimagined",
    template: "%s | Osheen"
  },
  description:
    "AI-enabled virtual trial room and emotional styling platform for safer, smarter fashion shopping.",
  keywords: ["Osheen", "virtual try-on", "fashion tech", "AI styling", "boutique catalogue"],
  openGraph: {
    title: "Osheen | Your mirror, reimagined",
    description: "Stop guessing your style. See yourself before you buy.",
    images: ["/assets/osheen-hero.png"]
  }
};

export const viewport: Viewport = {
  themeColor: "#fff8f4",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

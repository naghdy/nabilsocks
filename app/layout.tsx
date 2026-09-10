import type { Metadata } from "next";
import { Geist_Mono, Outfit, Syne } from "next/font/google";
import { Atmosphere } from "@/components/Atmosphere";
import { CartHydration } from "@/components/CartHydration";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nabilsocks.com"),
  title: {
    default: "Nabil Socks — Agentic sock store",
    template: "%s · Nabil Socks",
  },
  description:
    "A next-generation agentic sock store for nabilsocks.com. Talk to Nabil, configure a pair, and run a demo checkout — no real payments.",
  keywords: ["Nabil Socks", "agentic shopping", "socks", "nabilsocks.com"],
  openGraph: {
    title: "Nabil Socks — The store that shops with you",
    description:
      "Futuristic demo storefront. An AI shopping agent helps you find socks, configure pairs, and check out.",
    url: "https://nabilsocks.com",
    siteName: "Nabil Socks",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${syne.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-cyan focus:px-4 focus:py-2 focus:text-black"
        >
          Skip to content
        </a>
        <Atmosphere />
        <CartHydration />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

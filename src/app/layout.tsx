import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app'),
  title: {
    default: 'Blog Fusion',
    template: '%s',
  },
  description: 'Welcome to Blog Fusion — technology, programming, online earning, jobs, and entertainment blogs.',
  verification: {
    google: 'googled854f7a7aedcc96b',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
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
        {/* Google Analytics (Handled via Script tags in body) */}
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-8612225GGD" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8612225GGD');
          `}
        </Script>
        <AnalyticsTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

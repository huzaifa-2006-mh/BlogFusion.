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
  title: "Blog Fusion | Best Platform for Tech, Online Earning, Jobs & Entertainment Blogs",
  description: "Welcome to Blog Fusion, a complete multi-niche blog where you can explore the latest updates in technology, programming tutorials, online earning methods, job opportunities, anime r[...]",
  keywords: "fusion blog, blog fusion, blog, online earning in Pakistan, latest tech blogs, programming tutorials for beginners, online jobs 2026, how to earn money online, anime reviews, drama re[...]",
  openGraph: {
    title: "Blog Fusion - Multi-Niche Blog",
    description: "Explore tech, earning, and entertainment.",
    url: "https://blog-fusion-beta.vercel.app",
    siteName: "Blog Fusion",
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "googled854f7a7aedcc96b",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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

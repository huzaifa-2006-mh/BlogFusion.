import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import Script from "next/script";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script 
          strategy="beforeInteractive" 
          src="https://cdn.consentmanager.net/delivery/autoblocking/28235e7bd2553.js" 
          data-cmp-ab="1" 
          data-cmp-host="d.delivery.consentmanager.net" 
          data-cmp-cdn="cdn.consentmanager.net" 
          data-cmp-codesrc="16" 
        />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        {/* Google Analytics (Handled via Script tags in body) */}
      </head>
      <body>
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

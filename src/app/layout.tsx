import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteJsonLd from "@/components/SiteJsonLd";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';

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
  metadataBase: new URL(siteUrl),
  applicationName: 'Blog Fusion',
  title: {
    default: 'Blog Fusion',
    template: '%s',
  },
  description: 'Welcome to Blog Fusion — technology, programming, online earning, jobs, and entertainment blogs.',
  authors: [{ name: 'Blog Fusion' }],
  creator: 'Blog Fusion',
  publisher: 'Blog Fusion',
  manifest: '/site.webmanifest',
  verification: {
    google: 'googled854f7a7aedcc96b',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Blog Fusion',
    title: 'Blog Fusion',
    description: 'Tech guides, programming tutorials, online earning, jobs and entertainment blogs.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Blog Fusion logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Fusion',
    description: 'Tech guides, programming tutorials, online earning, jobs and entertainment blogs.',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'apple-mobile-web-app-title': 'Blog Fusion',
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
        <meta name="application-name" content="Blog Fusion" />
        <meta name="apple-mobile-web-app-title" content="Blog Fusion" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <SiteJsonLd />
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

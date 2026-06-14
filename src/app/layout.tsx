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
    images: [{ url: '/favicon-48x48.png', width: 48, height: 48, alt: 'Blog Fusion logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Fusion',
    description: 'Tech guides, programming tutorials, online earning, jobs and entertainment blogs.',
    images: ['/favicon-48x48.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  other: {
    'apple-mobile-web-app-title': 'Blog Fusion',
    'msapplication-TileImage': '/favicon-48x48.png',
    'msapplication-TileColor': '#0a192f',
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
        <script src="https://5gvci.com/act/files/tag.min.js?z=11145911" data-cfasync="false" async></script>
        <script>(function(s){s.dataset.zone='11145909',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>
        <AnalyticsTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

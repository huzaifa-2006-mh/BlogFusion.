import type { Metadata } from "next";
import Script from "next/script";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteJsonLd from "@/components/SiteJsonLd";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-opensans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog-fusion-beta.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Blog Fusion',
  title: {
    default: 'Blog Fusion | Ideas, Insights, and Knowledge for a Better Future',
    template: '%s | Blog Fusion',
  },
  description: 'Welcome to Blog Fusion — practical information, useful ideas, and insights across AI & Technology, Finance, Education, Careers, Health, and Fitness.',
  authors: [{ name: 'Muhammad Huzaifa (Founder)' }, { name: 'Marium Waseem (CEO)' }],
  creator: 'Muhammad Huzaifa',
  publisher: 'Blog Fusion',
  manifest: '/site.webmanifest',
  verification: {
    google: 'googled854f7a7aedcc96b',
    other: {
      'p:domain_verify': ['c47206c820961b368aed70ec645b27a6'],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Blog Fusion',
    title: 'Blog Fusion',
    description: 'Ideas, Insights, and Knowledge for a Better Future.',
    images: [{ url: '/favicon-48x48.png', width: 48, height: 48, alt: 'Blog Fusion logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Fusion',
    description: 'Ideas, Insights, and Knowledge for a Better Future.',
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
    'msapplication-TileColor': '#3E2618',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${poppins.variable}`}>
      <head>
        <meta name="application-name" content="Blog Fusion" />
        <meta name="apple-mobile-web-app-title" content="Blog Fusion" />
      </head>
      <body>
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

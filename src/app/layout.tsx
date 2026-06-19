import type { Metadata } from "next";
import Script from "next/script"; 
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SiteJsonLd from "@/components/SiteJsonLd";

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
        

<Script id="monetag-smart-tag" strategy="afterInteractive">
  {`
    (function(s){
      s.dataset.zone='11145909';
      s.src='https://nap5k.com/tag.min.js';
      var target = [document.documentElement, document.body].filter(Boolean).pop();
      if (target) {
        target.appendChild(s);
      }
    })(document.createElement('script'));
  `}
</Script>
       <Script id="monetag-vignette" strategy="afterInteractive">
  {`
    (function(){
      var s = document.createElement('script');
      s.dataset.zone = '11156399';
      s.src = 'https://n6wxm.com/vignette.min.js';
      var target = [document.documentElement, document.body].filter(Boolean).pop();
      if (target) {
        target.appendChild(s);
      }
    })();
  `}
</Script>
        <script>
  atOptions = {
    'key' : '2a32449f0366cc57d7aa759f77df868f',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/2a32449f0366cc57d7aa759f77df868f/invoke.js"></script>
        <script async="async" data-cfasync="false" src="https://pl29699171.effectivecpmnetwork.com/646dfe8819eb11a7954692a21b4c9ada/invoke.js"></script>
<div id="container-646dfe8819eb11a7954692a21b4c9ada"></div>
<script src="https://pl29699172.effectivecpmnetwork.com/10/f4/fb/10f4fb60e1a7547158745009f4cbeb84.js"></script>
<script>
  atOptions = {
    'key' : '545cdb473b7f2a05d8f1486337299168',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/545cdb473b7f2a05d8f1486337299168/invoke.js"></script>
<script>
  atOptions = {
    'key' : 'f39f63f3c9406103dbb6c88ba9ac0717',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script><script>
  atOptions = {
    'key' : '8319ba78a1a7f355cf49e22e003c7d9b',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/8319ba78a1a7f355cf49e22e003c7d9b/invoke.js"></script>

<script src="https://www.highperformanceformat.com/f39f63f3c9406103dbb6c88ba9ac0717/invoke.js"></script>
<script>
  atOptions = {
    'key' : '4beacb9d36597821c806aa046b9662fa',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/4beacb9d36597821c806aa046b9662fa/invoke.js"></script>


        <AnalyticsTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

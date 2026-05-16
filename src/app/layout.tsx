import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "BlogFusion | Best Platform for Tech, Online Earning, Jobs & Entertainment Blogs",
  description: "Welcome to BlogFusion, a complete multi-niche blog where you can explore the latest updates in technology, programming tutorials, online earning methods, job opportunities, anime reviews, and entertainment content.",
  keywords: "fusion blog, blog fusion, blog, online earning in Pakistan, latest tech blogs, programming tutorials for beginners, online jobs 2026, how to earn money online, anime reviews, drama reviews, freelancing tips, blogging tips",
  openGraph: {
    title: "BlogFusion - Multi-Niche Blog",
    description: "Explore tech, earning, and entertainment.",
    url: "https://blog-fusion-beta.vercel.app",
    siteName: "BlogFusion",
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
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <AnalyticsTracker />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

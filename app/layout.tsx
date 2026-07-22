import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/layout/Analytics";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getPageMetadata } from "@/lib/cms";
import { getDbCompanyInfo } from "@/lib/db";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const homeMeta = getPageMetadata("home");

export const metadata: Metadata = {
  title: homeMeta.title,
  description: homeMeta.description,
  keywords: homeMeta.keywords.join(", "),
  authors: [{ name: "CA Joyce J Charuvila" }],
  creator: "Joyce J Charuvila & Associates",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://joyce-ca.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: homeMeta.title,
    description: homeMeta.description,
    siteName: "Joyce J Charuvila & Associates",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Joyce J Charuvila & Associates — Chartered Accountants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeMeta.title,
    description: homeMeta.description,
    images: ["/opengraph-image"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { getLocalBusinessSchema } from "@/lib/seo";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const companyInfo = await getDbCompanyInfo();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} ${ibmPlexSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
          <Analytics />
        </head>
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-primary">
        {/* Global LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getLocalBusinessSchema()),
          }}
        />
        <SmoothScroll>
          <Navbar companyInfo={companyInfo} />
          <div className="flex-1 flex flex-col pt-[90px]">
            {children}
          </div>
          <Footer companyInfo={companyInfo} />
        </SmoothScroll>
      </body>
    </html>
  );
}

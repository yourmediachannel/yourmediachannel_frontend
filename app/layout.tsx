import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Analytics from "@/components/Analytics";

const arimo = Arimo({
  variable: "--font-arimo",
  weight: ['400', '500', '600', '700'],
  subsets: ["greek"],
})


export const metadata: Metadata = {
  title: "YourMedia – Instagram Growth & Marketing Agency",
  description: "Grow your Instagram with YourMedia. We offer tailored strategies, organic growth, and paid campaigns to boost your brand's presence and engagement.",
  openGraph: {
    title: "YourMedia – Instagram Growth & Marketing Agency",
    description: "Grow your Instagram with YourMedia. We offer tailored strategies, organic growth, and paid campaigns to boost your brand's presence and engagement.",
    images: [
      {
        url: "/images/logo.png", // Place your OG image at public/images/og-image.png
        width: 1200,
        height: 630,
        alt: "YourMedia Instagram Growth",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "YourMedia",
  },
  twitter: {
    card: "summary_large_image",
    title: "YourMedia – Instagram Growth & Marketing Agency",
    description: "Grow your Instagram with YourMedia. We offer tailored strategies, organic growth, and paid campaigns to boost your brand's presence and engagement.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
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
        <Analytics/>
      </head>
      <body
        className={`${arimo.variable} antialiased font-arimo` }
      >
          <Toaster/>
          {children}
      </body>
    </html>
  );
}

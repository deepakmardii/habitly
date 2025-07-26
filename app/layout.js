import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Habitly – Modern Habit Tracker & Analytics",
  description: "Track your habits, visualize your progress with heatmaps and analytics, and build lasting routines. Free and Pro plans. Secure, fast, and beautifully designed.",
  openGraph: {
    title: "Habitly – Modern Habit Tracker & Analytics",
    description: "Track your habits, visualize your progress with heatmaps and analytics, and build lasting routines. Free and Pro plans. Secure, fast, and beautifully designed.",
    url: "https://habitly-tau.vercel.app/",
    siteName: "Habitly",
    images: [
      {
        url: "/logo-512.png",
        width: 512,
        height: 512,
        alt: "Habitly Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habitly – Modern Habit Tracker & Analytics",
    description: "Track your habits, visualize your progress with heatmaps and analytics, and build lasting routines. Free and Pro plans. Secure, fast, and beautifully designed.",
    site: "@yourtwitterhandle",
    images: [
      "/logo-512.png"
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo-512.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366F1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

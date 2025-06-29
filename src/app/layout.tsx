import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400", // Press Start 2P only has 400 weight
});

export const metadata: Metadata = {
  title: "Succinct Quotes",
  description: "Explore Succinct Technologies' cutting-edge blockchain solutions through an interactive showcase featuring SP1, Explorer, Hypercube, vApps, and 2FA systems.",
  icons: {
    icon: '/images/succinct-icon.svg',
    shortcut: '/images/succinct-icon.svg',
    apple: '/images/succinct-icon.svg',
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
        <link rel="icon" href="/images/succinct-icon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/images/succinct-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/images/succinct-icon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pressStart2P.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

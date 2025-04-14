import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundEffect from "./components/BackgroundEffect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2025 Hackathon",
  description: "今年のハッカソンを彩るのは参加したメンバー全員です。",
  openGraph: {
    images: [
      {
        url: "./images/logo.png",
        width: 1200,
        height: 630,
        alt: "2025 Hackathon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <BackgroundEffect />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

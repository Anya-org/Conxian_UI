import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conxian UI",
  description: "UI for interacting with Conxian contracts on Stacks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-neutral-dark text-neutral-light`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ThemeManager from "@/components/ThemeManager";

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
    <html lang="en" className="dark h-full bg-gray-900">
      <head>
        <link rel="icon" href="/logo.jpg" />
      </head>
      <body
        className={`${inter.variable} font-sans h-full antialiased text-gray-300`}
      >
        <ThemeManager />
        <div>
          <Sidebar />
          <div className="lg:pl-64">
            <Header />
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

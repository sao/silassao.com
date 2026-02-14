import type { Metadata } from "next";
import { geistPixel, geistMono } from "@/lib/fonts";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "silas sao",
    template: "%s — silas sao",
  },
  description:
    "Software engineer turned product designer, working on AI.",
  icons: {
    icon: "/favicon.svg",
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
        className={`${geistPixel.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

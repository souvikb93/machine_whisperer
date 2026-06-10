import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ShiftAssist — Fix faster. Know more. Stop less.",
  description:
    "Factory floor AI troubleshooting assistant. Bosch Plant Berlin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">
        <LanguageProvider>
          <PhoneFrame>{children}</PhoneFrame>
        </LanguageProvider>
      </body>
    </html>
  );
}

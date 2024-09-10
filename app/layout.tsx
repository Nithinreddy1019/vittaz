import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {Toaster} from "sonner"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 400",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 400",
});

export const metadata: Metadata = {
  title: "Vittaz",
  description: "track and manage your expenses",
  icons: {
    icon: [
      {
        url: "./vittaz-logo.svg",
        href: "/vittaz-logo.svg"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <Toaster />
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";

import "./globals.css";
import {Toaster} from "sonner"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";

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
const poppipns = Poppins({subsets:["latin"], weight: ["500"]})


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
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppipns.className}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <QueryProvider>
              <SheetProvider />
              <Toaster richColors/>
              {children}
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

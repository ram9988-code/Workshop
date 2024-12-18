import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import QueryProviders from "@/components/query-provider";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Workshop",
  description: "A website that provides task management facilities",
  icons: [
    {
      url: "/logo.svg",
      href: "/logo.svg",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <QueryProviders>
          <Toaster />
          {children}
        </QueryProviders>
      </body>
    </html>
  );
}

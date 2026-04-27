import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: {
    default: "Revalsys Store",
    template: "%s · Revalsys Store",
  },
  description: "A mini product showcase built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased js-focus-visible"
      data-js-focus-visible=""
      suppressHydrationWarning
    >
      <body className="min-h-full" suppressHydrationWarning>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

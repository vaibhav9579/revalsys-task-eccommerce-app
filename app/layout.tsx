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
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}

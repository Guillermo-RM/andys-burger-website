import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { SiteLayout } from "@/components/site-layout";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Andy's Burger",
  title: {
    default: "Andy's Burger",
    template: "%s | Andy's Burger",
  },
  description:
    "Sitio oficial de Andy's Burger, hamburguesas al grill en San Ramón, Alajuela.",
  creator: "Andy's Burger",
  publisher: "Andy's Burger",
  category: "Restaurante",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CR">
      <body className={nunito.variable}>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
